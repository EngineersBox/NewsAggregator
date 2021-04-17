FROM redis
COPY config/redis.conf /usr/local/etc/redis/
COPY target/release/libkeyed_rate_limiter.so /modules/
CMD [ "redis-server", "/usr/local/etc/redis/redis.conf" ]
