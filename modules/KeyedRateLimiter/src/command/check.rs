use redis_module::{RedisError, RedisResult, RedisValue, Context};
use schema::schema::Schema;
use schema::arg_type::ArgType;
use resolver::resolver::Resolver;
use command::error_handler::redis_command_error_handler;
use crate::{command_entry_debug_log, handled_templated_error, push_all, validate_schema};
use schema::argument::Argument;

fn construct_arguments_schema() -> Vec<Argument> {
    let mut arg_schema: Vec<Argument> = Vec::new();
    push_all!(
        arg_schema,
        Argument::new("key", ArgType::STRING),
        Argument::new("burst", ArgType::INT),
        Argument::new("rate", ArgType::FLOAT),
        Argument::new("period", ArgType::FLOAT)
    );
    return arg_schema;
}

pub fn ratelimit_check(ctx: &Context, args: Vec<String>) -> RedisResult {
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

    // TODO: Implement check here to get the amount of requests left and time left

    return RedisResult::Ok(RedisValue::from("EXAMPLE RETURN"))
}