use keyed_rate_limiter::schema::schema::Schema;
use redis_module::{Context, RedisError};
use std::any::Any;
use service::schema_test_service::SchemaTestService;

#[test]
#[allow(non_snake_case)]
fn givenHandlerAndArgs_whenValid_thenSuccessfullyCreatedInstance() {
    let schema: Schema = SchemaTestService::create_valid_schema();
    assert_ne!(
        schema.error_handler.type_id(),
        Box::new(SchemaTestService::valid_error_handler).type_id()
    );
    assert_eq!(schema.args, SchemaTestService::create_valid_args_vector());
}

#[test]
#[allow(non_snake_case)]
#[should_panic]
fn givenHandlerAndArgs_whenInvalidArgs_thenPanics() {
    SchemaTestService::create_invalid_args_schema();
}

#[test]
#[allow(non_snake_case)]
fn givenValidHandler_whenInvoked_thenReturnsValidResponse() {
    let schema: Schema = SchemaTestService::create_valid_schema();
    assert!((schema.error_handler)(&Context::dummy(), RedisError::Str("test")));
    assert_eq!((schema.error_handler)(&Context::dummy(), RedisError::Str("something else")), false);
}

#[test]
#[allow(non_snake_case)]
#[should_panic]
fn givenInvalidHandler_whenInvoked_thenPanics() {
    let schema: Schema = SchemaTestService::create_invalid_handler_schema();
    (schema.error_handler)(&Context::dummy(), RedisError::Str(""));
}