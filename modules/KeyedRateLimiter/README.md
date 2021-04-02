# Redis GCRA Rate Limiter

## Leaky Bucket

GCRA is a variation of leaky bucket designed for Asynchronous Transfer Mode (ATM) networks.
Leaky bucket is essentially just a container that has a capacity, where the input is larger
than the output. This takes bursty rates and evens it out to a regular rate defined by the
output size/rate.

![Leaky Bucket](https://brandur.org/assets/images/rate-limiting/leaky-bucket.svg)

## Generic Cell Rate Algorithm (GCRA)

GCRA works by tracking remaining limit through a time called the “theoretical arrival time” (TAT),
which is seeded on the first request by adding a duration representing its cost to the current time.
The cost is calculated as a multiplier of our “emission interval” (T), which is derived from the rate
at which we want the bucket to refill. When any subsequent request comes in, we take the existing TAT,
subtract a fixed buffer representing the limit’s total burst capacity from it (τ + T), and compare the
result to the current time. This result represents the next time to allow a request. If it’s in the
past, we allow the incoming request, and if it’s in the future, we don’t. After a successful request,
a new TAT is calculated by adding T.

#### Allowed Request

![GCRA Allowed Request](https://brandur.org/assets/images/rate-limiting/allowed-request.svg)

#### Blocked Request

![GCRA Blocked Request](https://brandur.org/assets/images/rate-limiting/denied-request.svg)

### Algorithm Flow Chart

![GCRA Flow Chart](https://upload.wikimedia.org/wikipedia/en/thumb/4/4e/Dual_LBC.JPG/443px-Dual_LBC.JPG)

## Python Example Code to reference

```python
def _call_lua(
    self,
    *,
    keys: typing.List[str],
    cost: int,
    burst: int,
    rate: float,
    period: float,
) -> typing.Tuple[int, int, str, str]:
    if cost == 0:
        return self.check_ratelimit(keys=keys, args=[burst, rate, period])
    else:
        return self.apply_ratelimit(
            keys=keys, args=[burst, rate, period, cost]
        )

def rate_limit(
    self, key: str, quantity: int, rate: quota.Quota
) -> result.RateLimitResult:
    """Apply the rate-limit to a quantity of requests."""
    period = rate.period.total_seconds()
    limited, remaining, retry_after_s, reset_after_s = self._call_lua(
        keys=[key],
        cost=quantity,
        burst=rate.limit,
        rate=rate.count / period,
        period=period,
    )
    retry_after = datetime.timedelta(seconds=float(retry_after_s))
    reset_after = datetime.timedelta(seconds=float(reset_after_s))

    return result.RateLimitResult(
        limit=rate.limit,
        limited=limited == 1,
        remaining=remaining,
        retry_after=retry_after,
        reset_after=reset_after,
    )

def reset(self, key: str, rate: quota.Quota) -> result.RateLimitResult:
    """Reset the rate-limit for a given key."""
    self.client.delete(key)
    return result.RateLimitResult(
        limit=rate.limit,
        limited=False,
        remaining=rate.count,
        reset_after=datetime.timedelta(seconds=-1),
        retry_after=datetime.timedelta(seconds=-1),
    )
```