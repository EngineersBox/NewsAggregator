import functools, socket
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
            except HTTP_429_TooManyRequests as e:
                response = {
                    'status_code': 429,
                    'status': 'You have exceeded the rate limit of {0} requests per {1} milliseconds. Try again in {2} ms'.format(LIMITING["max_reqs"], LIMITING["expiry"], e.expiry)
                }
                return jsonify(response), 429
            except HTTP_400_BadRequest as e:
                response = {
                    'status_code': 400,
                    'status': e.message
                }
                return jsonify(response), 400
            except Exception as e:
                response = {
                    'status_code': 500,
                    'status': 'An unknown internal error occurred: ' + str(e)
                }
                return jsonify(response), 500
        return wrapper

    def __enter__(self):
        return self.incrementRate()

    def __exit__(self, a, b, c):
        return

    @staticmethod
    def keyFormat(ip_addr: str) -> str:
        '''
        Formats a redis key with the prefix from config

        # Arguments:
        - ip_addr <str> :: IP address of the request (E.g. "104.25.94.32")

        # Throws
        - HTTP_440_BadRequest <Exception> :: If the client address is not valid a 400 is returned

        # Returns
        - <str> :: A formatted key in the format "<PREFIX>:<IP ADDRESS>"
        '''
        try:
            # Check if the address is valid under relevant RFC standards
            socket.inet_aton(ip_addr)
        except socket.error:
            # If the address is invalid return an HTTP 400 with the address in the message
            raise HTTP_400_BadRequest("Invalid client address: {0}".format(ip_addr))
        # Format the DB key as  "<PREFIX>:<IP ADDRESS>"
        return LIMITING["key_prefix"] + ip_addr

    def handleRedisResult(self, reqcount: int, timeleft: int):
        # Check if the request has exceeded the maximum in this time frame
        if (reqcount > self.max_reqs):
            # If the request count has exceeded the max, return an HTTP 429 with the time left
            raise HTTP_429_TooManyRequests(timeleft)
        return 0

    def incrementKey(self) -> int:
        '''
        Increment the request count for the request IP address
        '''
        return self.redis.incr(self.keyFormat(self.client_addr))

    def setKeyExpiry(self) -> int:
        '''
        Set the expiry time in milliseconds for the IP address
        '''
        return self.redis.pexpire(
            self.keyFormat(self.client_addr),
            self.expiry
        )

    def getKeyExpiryDuration(self):
        '''
        Retrieve the time left until requests can be made again in milliseconds
        '''
        return self.redis.pttl(self.keyFormat(self.client_addr))

    def incrementRate(self) -> int:
        '''
        If the current request count is greater than the max requests then raise
        a HTTP_429_TooManyRequests exception. Otherwise do nothing and return the
        current request count
        '''
        # Increment the request count
        keyCount = self.incrementKey()
        timeleft = 0
        # Check if we have exceed the request threshold
        if (keyCount <= self.max_reqs):
            # If we are still within the threshold, then set the expiry for the key
            timeleft = self.setKeyExpiry()
        else:
            # Otherwise find how much longer till the fixed window expires
            timeleft = self.getKeyExpiryDuration()
        # Handle the results of the request theshold
        return self.handleRedisResult(keyCount, timeleft)
