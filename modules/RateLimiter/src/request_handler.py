import functools
from redis import Redis, ConnectionPool
from .config import LIMITING, CONNECTION
from .exceptions import HTTP_429_TooManyRequests, HTTP_400_BadRequest
from flask import request, jsonify

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

    def __init__(self, client_addr: str = "", max_reqs: int = LIMITING["max_reqs"], expiry: int = LIMITING["expiry"]):
        '''
        Creates a rate limiter handler for a given client address (request IP) with
        given arguments

        # Arguments:
        - client_addr <str> :: IP address of the request (E.g "104.25.94.32")
        - max_regs <int> :: Maximum amount of requests for duration
        - expiry <int> :: The duration in seconds for TTL
        '''

        self.client_addr = client_addr
        self.redis_key = keyFormat(client_addr)
        self.max_reqs = max_reqs
        self.expiry = expiry
        self.redis = Redis(connection_pool=REDIS_CONNECTION_CONFIG)

    def __call__(self, func):
        '''
        Allows calling as a decorator on a method

        # Arguments:
        - func <function> :: The endpoint method the decorator is applied to
        '''

        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            self.client_addr = request.remote_addr
            try:
                with self:
                    return func(*args, **kwargs)
            except HTTP_429_TooManyRequests:
                response = {
                    'status_code': 429,
                    'status': 'You have exceeded the rate limit of {0} requests per {1} seconds'.format(LIMITING["max_reqs"], LIMITING["expiry"])
                }
                return jsonify(response), 429
            except HTTP_400_BadRequest:
                response = {
                    'status_code': 400,
                    'status': 'Request not formatted correctly'
                }
                return jsonify(response), 400
            except:
                response = {
                    'status_code': 500,
                    'status': 'An unknown internal error occurred'
                }
                return jsonify(response), 500
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
        # check the existence of key
        # if exist, then we need to check whether the request number reach maximum
        if self.redis.exists(self.redis_key):
            num_requests = int(self.redis.get(self.redis_key)) + 1
            if num_requests > self.max_reqs:
                raise HTTP_429_TooManyRequests()
            else:
                self.redis.incr(self.redis_key)
                return num_requests
        # if not exist, then we should call incr and then set time limit
        else:
            self.redis.incr(self.redis_key)
            self.redis.expire(self.redis_key, self.expiry)
            return 1

    def getExpiryTime(self) -> int:
        '''
        Get an approximation of the duration left for a given IP address
        '''
        return self.redis.ttl(self.redis_key)
