// use redis::{Commands,RedisResult as OtherRedisResult};
use redis_module::{RedisError, RedisResult, RedisValue, Context};
// helper functions
use schema::arg_type::ArgType;
use schema::argument::Argument;
use schema::schema::Schema;
use resolver::resolver::Resolver;
use command::error_handler::redis_command_error_handler;
// macros
use crate::{command_entry_debug_log, handled_templated_error, push_all, validate_schema};
// hash
use std::collections::hash_map::DefaultHasher;
use std::hash::{Hash, Hasher};

/* DELETE command has 2 argument: hash, fingerprint */
fn construct_arguments_schema() -> Vec<Argument> {
    let mut arg_schema: Vec<Argument> = Vec::new();
    push_all!(
        arg_schema,
        Argument::new("hash", ArgType::STRING)
        Argument::new("fingerprint", ArgType::STRING)
    );
    return arg_schema;
}

pub fn cuckoofilter_delete(ctx: &Context, args: Vec<String>) -> RedisResult {
    // create delete schema, wrap it with resolver, check validity of the command
    let mut resolver: Resolver = Resolver::new(
        Schema::new(
            Box::new(redis_command_error_handler),
            construct_arguments_schema(),
        ),
        Vec::from(&args[1..]),
    );
    validate_schema!(resolver, ctx);
    command_entry_debug_log!(
        "Cuckoo Filter Delete Function:",
        resolver, ctx,
        "Could not retrieve arguments"
    );
    
    // &args[0] is command "cf.delete"
    let hash = &args[1]; // hash is i1 in pseudocode
    let fingerprint = &args[2];

    let mut exist = ctx.call("SISMEMBER", &[&hash, &fingerprint]).unwrap();
    let mut exist_int: u64 = RedisValue::into(exist); // can only be 1 or 0
    if exist_int == 1 {
        ctx.log_verbose("Query is in cache.");
        return ctx.call("SREM", &[&hash, &fingerprint])
    } else {
        // calculate i2
        let i1 = hash.parse::<u64>().unwrap();
        let mut h = DefaultHasher::new();
        fingerprint.hash(&mut h);
        let i2 = (i1 ^ h.finish()).to_string();
        exist = ctx.call("SISMEMBER", &[&i2, &fingerprint]).unwrap();
        exist_int: u64 = RedisValue::into(exist);
        if exist_int == 1 {
            ctx.log_verbose("Query is in cache.");
            return ctx.call("SREM", &[&i2, &fingerprint])
        } else {
            ctx.log_verbose("Query is not in cache.");
        }
    }
    return RedisResult::Ok(RedisValue::from("Nothing to delete."))

    // let mut cuckoo_filter = cuckoofilter::CuckooFilter::new();
    // remove query from Redis, non-existing key is ignored
    // let remove_query = ctx.call("ZREM", &["query-frequency", &h]);
    // match remove_query {
    //     Ok(_) => ctx.log_verbose("Successfully remove query"),
    //     Err(_) => ctx.log_verbose("Error removing query"),
    // }
    // remove query from cuckoo filter, non-existing key is ignored
    // let key_exists = cuckoo_filter.delete(&[&hash]);

    // return false if key does not exist in filter
    // return RedisResult::Ok(RedisValue::from(key_exists.to_string()))
}
