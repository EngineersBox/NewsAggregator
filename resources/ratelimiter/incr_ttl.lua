local val = redis.call('incr', KEYS[1])
if val <= tonumber(ARGV[1]) then
    return { val, redis.call('pexpire', KEYS[1], tonumber(ARGV[2])) }
end
return { val, redis.call('pttl', KEYS[1]) }