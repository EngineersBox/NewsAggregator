# Testing outcomes

1. Documents can be correctly stored into the ELS backend
2. Verify that these can be accessed from ELS
3. Ensure that entries from searches to ELS are cached to redis
4. Check that we can access cached entries from the Redis DB
5. Verify the rate limiting module correctly moderates the incoming and established connections

## Rate limiting

Limiting bucket design

* Active request count: `30`
* Buffer size: `150`

Example of NGINX for rate limiting config:

```conf
limit_req_zone <ADDR> zone=ip:10m rate=5r/s

server {
    listen <PORT>;
    location <URL> {
        limit_req zone=ip burst=<BURST> delay=<DELAY>
        proxy_pass <UPSTREAM>
    }
}
```

| key     | value |
|---------|-------|
| `LIMIT` | `30`  |
| `BURST` | `12`  |
| `PORT`  | `90`  |
