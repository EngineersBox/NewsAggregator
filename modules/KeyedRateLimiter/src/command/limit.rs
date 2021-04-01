use redis_module::RedisError;
use schema::schema::{Schema, Argument};
use schema::arg_type::ArgType;

const ARGUMENTS_SCHEMA: Schema = Schema::new(
    Box::new(|err: RedisError| {
        println!("{:?}", err);
        true
    }),
    vec![
        Argument::new("key", 0, ArgType::STRING),
        Argument::new("cost", 1, ArgType::INT),
        Argument::new("burst", 2, ArgType::INT),
        Argument::new("rate", 3, ArgType::FLOAT),
        Argument::new("period", 0, ArgType::FLOAT)
    ]
);