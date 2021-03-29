# CONNECTION = {
#     "host_address": "127.0.0.1", # Redis DB IPv4 address
#     "port": 1234, # Redis DB port
#     "db": 0 # Redis DB ID
# }

# test
CONNECTION = {
    "host_address": "127.0.0.1", # Redis DB IPv4 address
    "port": 6379, # Redis DB port
    "db": 0 # Redis DB ID
}

LIMITING = {
    "key_prefix": "ratelimit:", # Prefix for rate limiter keys
    # TODO: Find an acceptable value for the max_reqs based on use cases
    "max_reqs": 30, # Maximum number of requests in the expiry period
    "expiry": 1 # Expiry period for an IP address in seconds
}
