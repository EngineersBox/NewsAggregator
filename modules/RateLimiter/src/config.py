CONNECTION = {
    "host_address": "127.0.0.1", # Redis DB IPv4 address
    "port": 6379,  # Redis DB port
    "db": 0 # Redis DB ID
}
LIMITING = {
    "key_prefix": "ratelimit:", # Prefix for rate limiter keys
    "max_reqs": 2, # Maximum number of requests in the expiry period
    "expiry": 1000, # Expiry period for an IP address in milliseconds (E.g. 30000ms = 30s)
    "window": 1000 # Length of window in milliseconds (E.g. 30000ms = 30s)
}
