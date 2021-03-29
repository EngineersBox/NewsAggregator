from request_handler import RateLimiter
from exceptions import *
import time
limiter =  RateLimiter(client_addr = "0.0.0.0",max_reqs = 5, expiry = 10)
for i in range(7):
	try:
		print(limiter.incrementRate())
		print(limiter.getExpiryTime())
		time.sleep(4)
	except HTTP_429_TooManyRequests:
		print("too many request")