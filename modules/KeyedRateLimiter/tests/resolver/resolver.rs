use redis_module::RedisError;
use keyed_rate_limiter::schema::schema::Schema;
use keyed_rate_limiter::resolver::resolver::Resolver;
use service::resolver_test_service::ResolverTestService;
use keyed_rate_limiter::schema::argument::Argument;
use service::schema_test_service::SchemaTestService;

// Test Summary
// -------------------------------------
// 1. Validation
// 1a. Valid schema and cmd args
// 1b. Valid schema and invalid cmd args
//
// 2. Convert all to string
// 2a. Valid schema args and cmd args
// 2b. Cmd arg does not exist
//
// 3. Get at index
// 3a. Both cmd and schema args exist
// 3b. Cmd arg does not exist
// 3c. Schema arg does not exist
//
// 4. Get at index
// 4a. Both cmd and schema args exist
// 4b. Cmd arg does not exist
// 4c. Schema arg does not exist
// 4d. Invalid type cast

macro_rules! handled_iter_option {
    ($matcher:expr, $idx:expr) => {
        match $matcher.iter().nth($idx) {
            None => {
                panic!("Argument not provided for index {}", $idx)
            },
            Some(value) => value
        }
    }
}

#[test]
#[allow(non_snake_case)]
fn givenResolver_whenValidatedWithValidated_thenValid() {
    let mut resolver: Resolver = ResolverTestService::create_valid_resolver();
    assert!(resolver.validate().is_none());
}

#[test]
#[allow(non_snake_case)]
fn givenResolver_whenValidatedWithInvalidArgsCount_thenInvalid() {
    let mut resolver: Resolver = ResolverTestService::create_invalid_args_count_resolver(2);
    assert_eq!(resolver.validate().is_none(), false);
}

#[test]
#[allow(non_snake_case)]
fn givenResolver_whenValidatedWithInvalidArgsType_thenInvalid() {
    let mut resolver: Resolver = ResolverTestService::create_invalid_args_type_resolver();
    assert_eq!(resolver.validate().is_none(), false);
}

#[test]
#[allow(non_snake_case)]
fn givenValidSchemaAndResolver_whenAllAsString_thenConvertsSuccessfully() {
    let mut resolver: Resolver = ResolverTestService::create_valid_resolver();
    let result_all_as_str: Result<String, RedisError> = resolver.all_as_str();
    assert_eq!(result_all_as_str.is_err(), false);
    let all_as_str: String = result_all_as_str.unwrap();
    let schema: Schema = SchemaTestService::create_valid_schema();
    let cmd_args: Vec<String> = ResolverTestService::create_valid_args_vector(SchemaTestService::create_valid_schema());
    for i in 0..SchemaTestService::create_valid_schema().args.len() {
        let ith_schema_arg: &Argument = handled_iter_option!(schema.args, i);
        let ith_cmd_arg: &String = handled_iter_option!(cmd_args, i);
        assert!(all_as_str.contains(format!(
            "{}: {}",
            ith_schema_arg.name,
            ith_cmd_arg,
        ).as_str()));
    }
}

#[test]
#[should_panic]
#[allow(non_snake_case)]
fn givenInvalidCmdArgsCountAndResolver_whenAllAsString_thenCreatedLimitedString() {
    let arg_count: usize = 2;
    let mut resolver: Resolver = ResolverTestService::create_invalid_args_count_resolver(arg_count.clone());
    let result_all_as_str: Result<String, RedisError> = resolver.all_as_str();
    assert_eq!(result_all_as_str.is_err(), false);
    let all_as_str: String = result_all_as_str.unwrap();
    let schema: Schema = SchemaTestService::create_valid_schema();
    let cmd_args: Vec<String> = ResolverTestService::create_valid_args_vector(SchemaTestService::create_valid_schema());
    for i in 0..arg_count {
        let ith_schema_arg: &Argument = handled_iter_option!(schema.args, i);
        let ith_cmd_arg: &String = handled_iter_option!(cmd_args, i);
        assert!(all_as_str.contains(format!(
            "{}: {}",
            ith_schema_arg.name,
            ith_cmd_arg,
        ).as_str()));
    }
    for i in arg_count..SchemaTestService::create_valid_schema().args.len() {
        handled_iter_option!(schema.args, i);
        handled_iter_option!(cmd_args, i);
    }
}

#[test]
#[allow(non_snake_case)]
fn givenInvalidSchemaAndResolver_whenAllAsString_thenReturnsRedisError() {
    let mut resolver: Resolver = ResolverTestService::create_invalid_short_schema_resolver();
    let result_all_as_str: Result<String, RedisError> = resolver.all_as_str();
    assert!(result_all_as_str.is_err());
    assert_eq!(result_all_as_str.err().unwrap().to_string(), "Argument not provided for index 3");
}

#[test]
#[allow(non_snake_case)]
fn givenValidResolver_whenIndexed_thenReturnsCorrectResult() {
    let mut resolver: Resolver = ResolverTestService::create_valid_resolver();
    macro_rules! resolver_at_assertion {
        ($resolver:expr, $idx:literal, $at_type:ty, $value:literal) => {
            let result_at: Result<_, RedisError> = $resolver.at::<$at_type>($idx);
            assert_eq!(result_at.is_err(), false);
            assert_eq!(result_at.unwrap(), $value)
        }
    }
    resolver_at_assertion!(resolver, 0, String, "test");
    resolver_at_assertion!(resolver, 1, usize, 1);
    resolver_at_assertion!(resolver, 2, usize, 1);
    resolver_at_assertion!(resolver, 3, f32, 2.0);
    resolver_at_assertion!(resolver, 4, f32, 2.0);
}

macro_rules! resolver_at_failed_assertion {
    ($resolver:expr, $idx:literal, $at_type:ty, $value:literal) => {
            let result_at: Result<_, RedisError> = $resolver.at::<$at_type>($idx);
            assert!(result_at.is_err());
            assert_eq!(result_at.err().unwrap().to_string(), $value)
        }
}

#[test]
#[allow(non_snake_case)]
fn givenInvalidCmdArgsCountAndResolver_whenIndexed_thenReturnsRedisError() {
    let mut resolver: Resolver = ResolverTestService::create_invalid_args_count_resolver(1);
    resolver_at_failed_assertion!(resolver, 1, usize, "Argument not provided for index 1");
}

#[test]
#[allow(non_snake_case)]
fn givenInvalidSchemaArgsCountAndResolver_whenIndexed_thenReturnsRedisError() {
    let mut resolver: Resolver = ResolverTestService::create_invalid_short_schema_resolver();
    resolver_at_failed_assertion!(resolver, 3, f32, "Argument not provided for index 3");
}

#[test]
#[allow(non_snake_case)]
fn givenValidResolver_whenIndexedForInvalidType_thenReturnsRedisError() {
    let mut resolver: Resolver = ResolverTestService::create_valid_resolver();
    resolver_at_failed_assertion!(resolver, 0, usize, "Argument \"key\" with value \"test\" could not be parsed as type usize");
}
