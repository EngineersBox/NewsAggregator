import functools
from redis import Redis, ConnectionPool
from config import CONNECTION, LIMITING

REDIS_CONNECTION_CONFIG = ConnectionPool(
    host=CONNECTION["host_address"],
    port=CONNECTION["port"],
    db=CONNECTION["db"]
)

def keyFormat(ip_addr: str) -> str:
    '''
    Formats a redis key with the prefix from config

    # Arguments:
    - ip_addr <str> :: IP address of the request (E.g. "104.25.94.32")
    '''
    return LIMITING["key_prefix"] + "{0}".format(ip_addr)

class RateLimiter:

    def __init__(self, client_addr: str, max_reqs: int = LIMITING["max_reqs"], expiry: int = LIMITING["expiry"]):
        '''
        Creates a rate limiter handler for a given client address (request IP) with
        given arguments

        # Arguments:
        - client_addr <str> :: IP address of the request (E.g "104.25.94.32")
        - max_regs <int> :: Maximum amount of requests for duration
        - expiry <int> :: The duration in seconds for TTL
        '''

        self.client_addr = client_addr
        self.max_reqs = max_reqs
        self.expiry = expiry
        self.redis = Redis(connection_pool=REDIS_CONNECTION_CONFIG)

    def __call__(self, func: function) -> function:
        '''
        Allows calling as a decorator on a method

        # Arguments:
        - func <function> :: The endpoint method the decorator is applied to
        '''

        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            with self:
                return func(*args, **kwargs)
        return wrapper

    def __enter__(self):
        return self.incrementRate()

    def __exit__(self):
        return

    def incrementRate(self) -> int:
        '''
        If the current request count is greater than the max requests then raise
        a HTTP_429_TooManyRequests exception. Otherwise do nothing and return the
        current request count
        '''
        # TODO: To be completed as part of REDIS-30
        pass

    def getExpiryTime(self) -> int:
        '''
        Get an approximation of the duration left for a given IP address
        '''
        expire = self.redis.pttl(self._rate_limit_key)
        expire = expire / 1000.0 if expire > 0 else float(self.expiry)
        return expire if self.has_been_reached() else expire / (self._max_requests - self.get_usage())
