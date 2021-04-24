use redis::{Commands,RedisResult as OtherRedisResult};
use redis_module::{RedisError, RedisResult, RedisValue, Context};
// helper functions
use schema::arg_type::ArgType;
use schema::argument::Argument;
use schema::schema::Schema;
use resolver::resolver::Resolver;
use command::error_handler::redis_command_error_handler;
// macros
use crate::{command_entry_debug_log, handled_templated_error, push_all, validate_schema};

const REDIS_CLIENT_ADDRESS: &str = "redis://host.docker.internal/";

// delete command needs only one argument being the query
fn construct_arguments_schema() -> Vec<Argument> {
    /* define DELETE command schema */
    let mut arg_schema: Vec<Argument> = Vec::new();
    push_all!(
        arg_schema,
        Argument::new("query", ArgType::STRING)
    );
    return arg_schema;
}

// need to understand what Context does
pub fn cuckoofilter_delete(ctx: &Context, args: Vec<String>) -> RedisResult {
    // create delete schema, wrap it with resolver, check validity of the command
    let mut resolver: Resolver = Resolver::new(
        Schema::new(
            Box::new(redis_command_error_handler),
            construct_arguments_schema(),
        ),
        Vec::from(&args[1..]), // start from the second element?
    );
    validate_schema!(resolver, ctx);
    command_entry_debug_log!(
        "Cuckoo Filter Delete Function:",
        resolver, ctx,
        "Could not retrieve arguments"
    );

    // the command is valid, execute it
    let key = &args[0];
    let mut cuckoo_filter = cuckoofilter::CuckooFilter::new();
    let client = redis::Client::open(REDIS_CLIENT_ADDESS)?;
    let mut con = client.get_connection()?;
    let _get_reply: OtherRedisResult<String> = con.get(key.clone());


    // return deleted documents?
    return RedisResult::Ok(RedisValue::from(str_get))
}
