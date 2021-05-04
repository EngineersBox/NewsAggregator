FROM redis:latest

COPY redis.conf /usr/local/etc/redis/redis.conf
COPY libredis-cuckoofilter.so /libredis-cuckoofilter.so

RUN chmod a+x /libredis-cuckoofilter.so

EXPOSE 6379
