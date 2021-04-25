// use redis::{Commands,RedisResult as OtherRedisResult};
use redis_module::{RedisError, RedisResult, RedisValue, Context};
// helper functions
use schema::arg_type::ArgType;
use schema::argument::Argument;
use schema::schema::Schema;
use resolver::resolver::Resolver;
use command::error_handler::redis_command_error_handler;
// macros
use crate::{command_entry_debug_log, handled_templated_error, push_all, validate_schema};

/* DELETE command has one argument: query */
fn construct_arguments_schema() -> Vec<Argument> {
    let mut arg_schema: Vec<Argument> = Vec::new();
    push_all!(
        arg_schema,
        Argument::new("query", ArgType::STRING)
    );
    return arg_schema;
}

pub fn cuckoofilter_delete(ctx: &Context, args: Vec<String>) -> RedisResult {
    // create delete schema, wrap it with resolver, check validity of the command
    let mut resolver: Resolver = Resolver::new(
        Schema::new(
            Box::new(redis_command_error_handler),
            construct_arguments_schema(),
        ),
        Vec::from(&args[1..]),
    );
    validate_schema!(resolver, ctx);
    command_entry_debug_log!(
        "Cuckoo Filter Delete Function:",
        resolver, ctx,
        "Could not retrieve arguments"
    );

    let key = &args[1]; // &args[0] is command "cf.delete"
    let mut cuckoo_filter = cuckoofilter::CuckooFilter::new();

    // remove query from Redis, non-existing key is ignored
    let remove_query = ctx.call("ZREM", &["query-frequency", &key]);
    match remove_query {
        Ok(_) => ctx.log_verbose("Successfully remove query"),
        Err(_) => ctx.log_verbose("Error removing query"),
    }
    // remove query from cuckoo filter, non-existing key is ignored
    let key_exists = cuckoo_filter.delete(&[&key]);

    // return false if key does not exist in filter
    return RedisResult::Ok(RedisValue::from(key_exists.to_string()))
}
