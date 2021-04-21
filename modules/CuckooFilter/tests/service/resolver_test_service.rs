use keyed_rate_limiter::schema::schema::Schema;
use keyed_rate_limiter::schema::argument::Argument;
use keyed_rate_limiter::schema::arg_type::ArgType;
use keyed_rate_limiter::resolver::resolver::Resolver;
use rand::Rng;
use rand::distributions::Alphanumeric;
use service::schema_test_service::SchemaTestService;

pub struct ResolverTestService;

impl ResolverTestService {
    fn generate_arg_from_argument(argument: Argument) -> String {
        String::from(match argument.arg {
            ArgType::STRING => "test",
            ArgType::INT => "1",
            ArgType::FLOAT => "2.0",
            ArgType::BOOL => "true"
        })
    }

    fn generate_random_string() -> String {
        rand::thread_rng()
            .sample_iter(&Alphanumeric)
            .take(7)
            .map(char::from)
            .collect()
    }

    pub fn create_valid_args_vector(schema: Schema) -> Vec<String> {
        let mut ret: Vec<String> = Vec::new();
        for arg in schema.args {
            ret.push(ResolverTestService::generate_arg_from_argument(arg));
        }
        ret
    }

    pub fn create_invalid_args_vector(length: usize) -> Vec<String> {
        let mut ret: Vec<String> = Vec::new();
        for _ in 0..length {
            ret.push(ResolverTestService::generate_random_string());
        }
        ret
    }

    pub fn create_valid_resolver() -> Resolver {
        Resolver::new(
            SchemaTestService::create_valid_schema(),
            ResolverTestService::create_valid_args_vector(
                SchemaTestService::create_valid_schema()
            ),
        )
    }

    pub fn create_invalid_short_schema_resolver() -> Resolver {
        Resolver::new(
            SchemaTestService::create_short_valid_schema(),
            ResolverTestService::create_valid_args_vector(
                SchemaTestService::create_valid_schema()
            ),
        )
    }

    pub fn create_invalid_args_count_resolver(length: usize) -> Resolver {
        Resolver::new(
            SchemaTestService::create_valid_schema(),
            ResolverTestService::create_invalid_args_vector(length),
        )
    }

    pub fn create_invalid_args_type_resolver() -> Resolver {
        Resolver::new(
            SchemaTestService::create_valid_schema(),
            ResolverTestService::create_invalid_args_vector(
                SchemaTestService::create_valid_schema().args.len()
            ),
        )
    }
}