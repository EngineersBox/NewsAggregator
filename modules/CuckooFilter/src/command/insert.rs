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
        Argument::new("query", ArgType::STRING),
        Argument::new("documents", ArgType::STRING)
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
        "Cuckoo Filter Insert Function:",
        resolver, ctx,
        "Could not retrieve arguments"
    );

    // Get The Arguements. args[0] is the command
    let key = &args[1];
    let documents = &args[2];

    // Instantiate the Cuckoo Filter and populate it with the query entry
    let mut cuckoo_filter = cuckoofilter::CuckooFilter::new();
    let _get_reply = ctx.call("GET", &[&key]);

    let str_get = match _get_reply {
        Ok(sg) => format!("{:?}", sg),
        Err(e) => panic!("error {:?}", e),
    };

    if str_get.to_string() != "Null" {
        cuckoo_filter.add(&[&key]);
    } 

    let key_exists = cuckoo_filter.contains(&[&key]);
    // TODO: SET TTL
    if key_exists {
        let increase_existing_freq = ctx.call("ZINCRby", &["query-frequency", "1" ,&key]);
        match increase_existing_freq {
            Ok(_) => ctx.log_verbose("Successfully increase freq"),
            Err(_) => ctx.log_verbose("error increasing freq"),
        }
    } else{
        let enter_new_element = ctx.call("SET", &[&key, &documents]);
        let enter_new_element_frequency = ctx.call("ZADD", &["query-frequency", "1", &key]);

        match enter_new_element {
            Ok(_) => ctx.log_verbose("Successfully add new key into redis database"),
            Err(_) => ctx.log_verbose("error adding new key"),
        }

        match enter_new_element_frequency {
            Ok(_) => ctx.log_verbose("Successfully add new key freq"),
            Err(_) => ctx.log_verbose("error adding new key freq"),
        }
    }
    return RedisResult::Ok(RedisValue::from(key_exists.to_string()))
}
