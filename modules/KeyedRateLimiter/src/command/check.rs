use redis_module::{RedisError, RedisResult, RedisValue, Context};
use schema::schema::{Schema, Argument};
use schema::arg_type::ArgType;
use resolver::resolver::Resolver;

const ARGUMENTS_SCHEMA: Schema = Schema::new(
    Box::new(|err: RedisError| {
        println!("{:?}", err);
        true
    }),
    vec![
        Argument::new(String::from("key"), 0, ArgType::STRING),
        Argument::new(String::from("burst"), 1, ArgType::INT),
        Argument::new(String::from("rate"), 2, ArgType::FLOAT),
        Argument::new(String::from("period"), 3, ArgType::FLOAT)
    ]
);

pub fn ratelimit_check(ctx: &Context, args: Vec<String>) -> RedisResult {
    let mut resolver: Resolver = Resolver::new(ARGUMENTS_SCHEMA, args);
    ctx.log_debug(format!(
        "Querying rate limit for: {:?}",
        resolver.all_as_str()
    ).as_str());
    return RedisResult::Ok(RedisValue::from(""))
}