use keyed_rate_limiter::schema::schema::{ErrorHandler, Schema};
use keyed_rate_limiter::schema::arg_type::ArgType;
use redis_module::{Context, RedisError, RedisString};
use keyed_rate_limiter::schema::argument::Argument;
use keyed_rate_limiter::push_all;
use std::any::Any;

fn example_error_handler(_ctx: &Context, err: RedisError) -> bool {
    "test" == err.to_string().as_str()
}

fn create_valid_args_vector() -> Vec<Argument> {
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

fn create_invalid_args_vector() -> Vec<Argument> {
    let mut arg_schema: Vec<Argument> = Vec::new();
    push_all!(
        arg_schema,
        Argument::new("key", ArgType::STRING),
        Argument::new("key", ArgType::INT)
    );
    return arg_schema;
}

macro_rules! create_valid_schema {
    () => {
        Schema::new(
            Box::new(example_error_handler),
            create_valid_args_vector()
        );
    }
}

#[test]
#[allow(non_snake_case)]
fn givenHandlerAndArgs_whenValid_thenSuccessfullyCreatedInstance() {
    let schema: Schema = create_valid_schema!();
    assert_ne!(schema.error_handler.type_id(), Box::new(example_error_handler).type_id());
    assert_eq!(schema.args, create_valid_args_vector());
}

#[test]
#[allow(non_snake_case)]
#[should_panic]
fn givenHandlerAndArgs_whenInvalid_thenPanics() {
    Schema::new(
        Box::new(example_error_handler),
        create_invalid_args_vector()
    );
}

#[test]
#[allow(non_snake_case)]
fn givenValidHandler_whenInvoked_thenReturnsValidResponse() {
    let schema: Schema = create_valid_schema!();
    assert!((schema.error_handler)(&Context::dummy(), RedisError::Str("test")));
    assert_eq!((schema.error_handler)(&Context::dummy(), RedisError::Str("something else")), false);
}