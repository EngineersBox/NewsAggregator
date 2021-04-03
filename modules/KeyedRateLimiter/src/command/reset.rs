use redis_module::{RedisResult, RedisValue, Context};
use schema::schema::{Schema, Argument};
use schema::arg_type::ArgType;
use resolver::resolver::Resolver;
use command::error_handler::redis_command_error_handler;
use crate::validate_schema;

fn construct_arguments_schema() -> Vec<Argument> {
    let mut arg_schema: Vec<Argument> = Vec::new();
    arg_schema.push(Argument::new("key", ArgType::STRING));
    return arg_schema;
}

pub fn ratelimit_reset(ctx: &Context, args: Vec<String>) -> RedisResult {
    let mut resolver: Resolver = Resolver::new(
        Schema::new(
            Box::new(redis_command_error_handler),
            // This requires constant/compile-time allocation guarantees
            // as such any allocations should be derivable, which means
            // that using the vec![...] macro will not work. As such this
            // method does manual allocation to guarantee it.
            construct_arguments_schema(),
        ),
        args
    );
    validate_schema!(resolver, ctx);
    ctx.log_debug(format!(
        "Resetting rate limit for: {:?}",
        resolver.all_as_str()
    ).as_str());

    // TODO: Implement reset here (essentially just a delete on the key)

    return RedisResult::Ok(RedisValue::from(""))
}