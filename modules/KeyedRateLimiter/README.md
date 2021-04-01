# Redis GCRA Rate Limiter

GCRA is a variation of leaky bucket.

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