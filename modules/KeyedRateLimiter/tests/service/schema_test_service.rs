use redis_module::{Context, RedisError};
use keyed_rate_limiter::schema::arg_type::ArgType;
use keyed_rate_limiter::schema::argument::Argument;
use keyed_rate_limiter::push_all;
use keyed_rate_limiter::schema::schema::Schema;

pub struct SchemaTestService;

impl SchemaTestService {
    pub fn valid_error_handler(_ctx: &Context, err: RedisError) -> bool {
        "test" == err.to_string().as_str()
    }

    pub fn invalid_error_handler(_ctx: &Context, _err: RedisError) -> bool {
        panic!("Invalid panic in error handler")
    }

    pub fn create_valid_args_vector() -> Vec<Argument> {
        let mut arg_schema: Vec<Argument> = Vec::new();
        push_all!(
            arg_schema,
            Argument::new("key", ArgType::STRING),
            Argument::new("cost", ArgType::INT),
            Argument::new("burst", ArgType::INT),
            Argument::new("rate", ArgType::FLOAT),
            Argument::new("period", ArgType::FLOAT)
        );
        return arg_schema;
    }

    pub fn create_short_valid_args_vector() -> Vec<Argument> {
        let mut arg_schema: Vec<Argument> = Vec::new();
        push_all!(
            arg_schema,
            Argument::new("key", ArgType::STRING),
            Argument::new("cost", ArgType::INT),
            Argument::new("burst", ArgType::INT)
        );
        return arg_schema;
    }

    pub fn create_invalid_args_vector() -> Vec<Argument> {
        let mut arg_schema: Vec<Argument> = Vec::new();
        push_all!(
            arg_schema,
            Argument::new("key", ArgType::STRING),
            Argument::new("key", ArgType::INT)
        );
        return arg_schema;
    }

    pub fn create_valid_schema() -> Schema {
        Schema::new(
            Box::new(SchemaTestService::valid_error_handler),
            SchemaTestService::create_valid_args_vector()
        )
    }

    pub fn create_short_valid_schema() -> Schema {
        Schema::new(
            Box::new(SchemaTestService::valid_error_handler),
            SchemaTestService::create_short_valid_args_vector()
        )
    }

    pub fn create_invalid_handler_schema() -> Schema {
        Schema::new(
            Box::new(SchemaTestService::invalid_error_handler),
            SchemaTestService::create_valid_args_vector()
        )
    }

    pub fn create_invalid_args_schema() -> Schema {
        Schema::new(
            Box::new(SchemaTestService::valid_error_handler),
            SchemaTestService::create_invalid_args_vector()
        )
    }
}