use redis_module::{RedisResult, RedisValue, Context};
use schema::schema::{Schema, Argument};
use schema::arg_type::ArgType;
use resolver::resolver::Resolver;
use command::error_handler::redis_command_error_handler;

fn construct_arguments_schema() -> Vec<Argument> {
    let mut arg_schema: Vec<Argument> = Vec::new();
    arg_schema.push(Argument::new("key", 0, ArgType::STRING));
    arg_schema.push(Argument::new("cost", 1, ArgType::INT));
    arg_schema.push(Argument::new("burst", 2, ArgType::INT));
    arg_schema.push(Argument::new("rate", 3, ArgType::FLOAT));
    arg_schema.push(Argument::new("period", 4, ArgType::FLOAT));
    return arg_schema;
}

pub fn ratelimit_limit(ctx: &Context, args: Vec<String>) -> RedisResult {
    let mut resolver: Resolver = Resolver::new(
        Schema::new(
            Box::new(redis_command_error_handler),
            construct_arguments_schema(),
        ),
        args
    );
    ctx.log_debug(format!(
        "Rate limiting for: {:?}",
        resolver.all_as_str()
    ).as_str());
    return RedisResult::Ok(RedisValue::from(""))
}