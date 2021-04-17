use redis_module::{RedisError, RedisResult, RedisValue, Context};
use schema::schema::Schema;
use schema::arg_type::ArgType;
use resolver::resolver::Resolver;
use command::error_handler::redis_command_error_handler;
use crate::{command_entry_debug_log, handled_templated_error, push_all, validate_schema};
use schema::argument::Argument;
use redis::{Commands,RedisResult as OtherRedisResult};

fn construct_arguments_schema() -> Vec<Argument> {
    let mut arg_schema: Vec<Argument> = Vec::new();
    push_all!(
        arg_schema,
        Argument::new("query", ArgType::STRING),
        Argument::new("documents", ArgType::STRING)
    );
    return arg_schema;
}

const REDIS_CLIENT_ADDESS: &str = "redis://host.docker.internal/";

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

    // Get The Arguements
    let key = vec![0];
    let documents = vec![1];

    // Connect to the redis database
    let client = redis::Client::open(REDIS_CLIENT_ADDESS)?;
    let mut con = client.get_connection()?;

    // Instantiate the Cuckoo Filter and populate it with the query entry
    let mut cuckoo_filter = cuckoofilter::CuckooFilter::new();
    let _get_reply: OtherRedisResult<String> = con.get(key.clone());

    let str_get = match _get_reply {
        Ok(sg) => format!("{:?}", sg),
        Err(e) => panic!("error {:?}", e),
    };

    // if str_get.to_string() != "Nil" {
    //     cuckoo_filter.add(&key);
    // } 

    // let key_exists = cuckoo_filter.contains(&key);
    // // TODO: SET TTL
    // if key_exists {
    //     let increase_existing_freq: OtherRedisResult<String> = con.zincr("query-frequency",key.clone(), "one");
    //     match increase_existing_freq {
    //         Ok(_) => println!("Successfully increase freq"),
    //         Err(_) => println!("error increasing freq"),
    //     }
    // } else{
    //     let enter_new_element: OtherRedisResult<String> = con.set(key.clone(), documents);
    //     let enter_new_element_frequency: OtherRedisResult<String> = con.zadd("query-frequency",key.clone(),1);

    //     match enter_new_element {
    //         Ok(_) => println!("Successfully add new key into redis database"),
    //         Err(_) => println!("error adding new key"),
    //     }

    //     match enter_new_element_frequency {
    //         Ok(_) => println!("Successfully add new key freq"),
    //         Err(_) => println!("error adding new key freq"),
    //     }


    // }

    return RedisResult::Ok(RedisValue::from(str_get))
}