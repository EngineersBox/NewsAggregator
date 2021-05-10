
// jack's example:

use redis_module::{RedisError, RedisResult, RedisValue, Context};
use schema::schema::Schema;
use schema::arg_type::ArgType;
use resolver::resolver::Resolver;
use command::error_handler::redis_command_error_handler;
use crate::{command_entry_debug_log, handled_templated_error, push_all, validate_schema};
use schema::argument::Argument;
use redis_module::raw::{open_key, KeyType, close_key, KeyMode, RedisModuleKey};
fn construct_arguments_schema() -> Vec<Argument> {
    let mut arg_schema: Vec<Argument> = Vec::new();
    push_all!(
        arg_schema,
        Argument::new("key", ArgType::STRING),
        Argument::new("hash", ArgType::INT),
        Argument::new("fingerprint", ArgType::INT)
    );
    return arg_schema;
}
pub fn cuckoofilter_add(ctx: &Context, args: Vec<String>) -> RedisResult {
    let mut resolver: Resolver = Resolver::new(
        Schema::new(
            Box::new(redis_command_error_handler),
            // This requires constant/compile-time allocation guarantees
            // as such any allocations should be derivable, which means
            // that using the vec![...] macro will not work. As such this
            // method does manual allocation to guarantee it.
            construct_arguments_schema(),
        ),
        Vec::from(&args[1..]),
    );
    validate_schema!(resolver, ctx);
    command_entry_debug_log!(
        "Rate limiting for:",
        resolver, ctx,
        "Could not retrieve arguments"
    );
    let key_exists: RedisResult = ctx.call("EXISTS", &[resolver.at::<String>(0).expect("invalid").as_str()]);
    handled_templated_error!(key_exists, ctx, "Key does not exist");
    let key_type_query: RedisResult = ctx.call("TYPE", &[resolver.at::<String>(0).expect("invalid").as_str()]);
    let key_type_value: RedisValue = handled_templated_error!(key_type_query, ctx, "Invalid key type");

    // type checking
    let key_type: &str = match key_type_value {
        RedisValue::SimpleStringStatic(value) => value,
        RedisValue::SimpleString(value) => value.as_str(),
        RedisValue::BulkString(value) => value.as_str(),
        RedisValue::Integer(value) => return RedisResult::Err(RedisError::Str("Invalid key type")),
        RedisValue::Float(value) => return RedisResult::Err(RedisError::Str("Invalid key type")),
        RedisValue::Array(value) => return RedisResult::Err(RedisError::Str("Invalid key type")),
        RedisValue::Null => return RedisResult::Err(RedisError::Str("Key does not exist")),
        RedisValue::NoReply => return RedisResult::Err(RedisError::Str("Invalid key type")),
    };

    // use do_add
    return do_add(String::from(key_type),
                  ctx,
                  resolver.at::<String>(0).expect("invalid"),
                  resolver.at::<u64>(1).expect("invalid"),
                  resolver.at::<u32>(2).expect("invalid")
    );
}

fn do_add(key_type: String, ctx: &Context, key: String, hash: u64, fp: u32) -> RedisResult {
    return RedisResult::Ok(RedisValue::Null);
}
