use redis_module::{RedisError, RedisResult, RedisValue, Context};
use schema::schema::Schema;
use schema::arg_type::ArgType;
use resolver::resolver::Resolver;
use command::error_handler::redis_command_error_handler;
use crate::{command_entry_debug_log, handled_templated_error, push_all, validate_schema};
use schema::argument::Argument;

fn construct_arguments_schema() -> Vec<Argument> {
    let mut arg_schema: Vec<Argument> = Vec::new();
    push_all!(
        arg_schema,
        Argument::new("name", ArgType::STRING),
        Argument::new("size", ArgType::STRING)
    );
    return arg_schema;
}

pub fn cuckoofilter_insert(ctx: &Context, args: Vec<String>) -> RedisResult {
    let mut resolver: Resolver = Resolver::new(
        Schema::new(
            Box::new(redis_command_error_handler),
            // This requires constant/compile-time allocation guarantees
            // as such any allocations should be derivable, which means
            // that using the vec![...] macro will not work. As such this
            // method does manual allocation to guarantee it.
            construct_arguments_schema(),
        ),
        Vec::from(&args[1..]),
    );
    validate_schema!(resolver, ctx);
    command_entry_debug_log!(
        "Cuckoo Filter Init Function:",
        resolver, ctx,
        "Could not retrieve arguments"
    );

    // Get The Arguements. args[0] is the command
    let NAME_OF_CUCKOO_FILTER = &args[1];
    let SIZE_OF_CUCKOO_FILTER = &args[2];

    // Check if the name of the cuckoo filter exists
    let key_exists: RedisResult = ctx.call("EXISTS", &[resolver.at::<String>(0).expect("invalid").as_str()]);
    handled_templated_error!(key_exists, ctx, "Cuckoo Filter does not exist");
    let key_type_query: RedisResult = ctx.call("TYPE", &[resolver.at::<String>(0).expect("invalid").as_str()]);
    let key_type_value: RedisValue = handled_templated_error!(key_type_query, ctx, "Invalid key type");

    ctx.call("HSET", &[NAME_OF_CUCKOO_FILTER, "capacity", 0, "Number of Buckets", 0]);
    new CuckooFilter(NAME_OF_CUCKOO_FILTER, SIZE_OF_CUCKOO_FILTER, ctx);

    return RedisResult::Ok(RedisValue::from(key_exists.to_string()))
}
