import functools, socket
from redis import Redis, ConnectionPool
from .lua_script_result import LuaScriptResult
from .invoker import Invoker, InvocationSchema
from .config import LIMITING, CONNECTION, LUA_INCR_TTL
from .exceptions import HTTP_429_TooManyRequests, HTTP_400_BadRequest
from flask import request, jsonify

REDIS_CONNECTION_CONFIG = ConnectionPool(
    host=CONNECTION["host_address"],
    port=CONNECTION["port"],
    db=CONNECTION["db"]
)

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
        self.script = RateLimiter.getLuaScript()
        # Create a schema for the LuaScriptResult constructor arguments:
        # LuaScriptResult.__init__(reqcount: int, timeleft: int)
        self.script_result_schema = [
            InvocationSchema("reqcount", int),
            InvocationSchema("timeleft", int)
        ]

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
    
    @staticmethod
    def getLuaScript() -> str:
        with open(LUA_INCR_TTL["location"], "r") as lua_script:
            # Return the entire Lua script as a string
            return lua_script.read()

    def handleRedisResult(self, result: LuaScriptResult):
        # Check if the request has exceeded the maximum in this time frame
        if (result.reqcount > self.max_reqs):
            # If the request count has exceeded the max, return an HTTP 429 with the time left
            raise HTTP_429_TooManyRequests(result.timeleft)
        return 200

    def incrementRate(self) -> int:
        '''
        If the current request count is greater than the max requests then raise
        a HTTP_429_TooManyRequests exception. Otherwise do nothing and return the
        current request count
        '''
        # Execute the Lua script with key, max_reqs and expiry arguments
        result = self.redis.eval(
            self.script,
            1, # Number of keys before arguments
            self.keyFormat(self.client_addr), # KEYS[1]
            self.max_reqs, # ARGS[1]
            self.expiry # ARGS[2]
        )
        # Create an invoker instance to handle generic argument passing to a LuaScriptResult instance
        invoker = Invoker(LuaScriptResult, self.script_result_schema)
        # Invoke an instance of LuaScriptResult with the results from the script (list)
        lua_result =  invoker.reflectInvoke(result)
        print(lua_result)
        # Handle the results accordingly
        return self.handleRedisResult(lua_result)
