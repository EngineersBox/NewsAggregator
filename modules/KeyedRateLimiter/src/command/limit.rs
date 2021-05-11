use redis_module::{RedisError, RedisResult, RedisValue, Context};
use schema::schema::Schema;
use schema::arg_type::ArgType;
use resolver::resolver::Resolver;
use command::error_handler::redis_command_error_handler;
use crate::{command_entry_debug_log, handled_templated_error, push_all, validate_schema};
use schema::argument::Argument;
extern crate timeit;


fn construct_arguments_schema() -> Vec<Argument> {
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

pub fn ratelimit_limit(ctx: &Context, args: Vec<String>) -> RedisResult {
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
        "Rate limiting for:",
        resolver, ctx,
        "Could not retrieve arguments"
    );

    // TODO: Implement rate limiting here using the GCRA algorithm (variant of leaky bucket)

    // get value from input vector
    let key = &args[1];
    let cost:i32 = match resolver.at :: <i32> (2) {
        Ok(v) =>  v,
        Err(e) => 0,
    };

    let burst:i32 = match resolver.at :: <i32> (3) {
        Ok(v) =>  v,
        Err(e) => 0,
    };

    let rate:f64 = match resolver.at :: <f64> (4) {
        Ok(v) =>  v,
        Err(e) => 0.0,
    };

    let period:f64 = match resolver.at :: <f64> (5) {
        Ok(v) =>  v,
        Err(e) => 0.0,
    };


    let emission_interval:f64 = period / rate;
    let increment:f64 = emission_interval * cost as f64;
    let burst_offset:f64 = emission_interval * burst as f64;

    let current_time = timeit::get_time();

    let sec:i64 = current_time.sec as i64;
    let microseconds :i64 = current_time.nsec as i64 /1000;

    

    let jan_1_2017:f64 = 1483228800.0;

    let convert_now:f64 = (sec as f64 - jan_1_2017) + (microseconds as f64/1000000.0);

    let _tat_repl : RedisResult = ctx.call("get", &[&key]);

    let mut tat: f64 = convert_now;

    match _tat_repl.unwrap(){
        RedisValue::SimpleStringStatic(value) => {tat = value.parse().unwrap()}
        RedisValue::SimpleString(value) => {tat = value.parse().unwrap()}
        RedisValue::BulkString(value) => {}
        RedisValue::Integer(value) => {}
        RedisValue::Float(value) => { tat = value;}
        RedisValue::Array(value) => {}
        RedisValue::Null => {}
        RedisValue::NoReply => {}
    };


    let new_tat: f64 = convert_now.max(tat);

    let allow_at:f64 = new_tat - burst_offset;

    let diff:f64 = convert_now -allow_at;

    let limited;
    let retry_after;
    let reset_after;

    let remainning_float:f64 = diff/emission_interval;
    let mut remainning = remainning_float.round();


    if remainning < 0.0 {
        limited = 1;
        remainning = 0.0;
        reset_after = tat - convert_now;
        retry_after = diff * -1.0;
    }else{
        limited = 0;
        reset_after = new_tat -convert_now;
        ctx.call("set", &[&key, &(new_tat.to_string())]);

        // set the ttl
        let time_limit = 86400;
        ctx.call("expire", &[&key, &(time_limit.to_string())]);
        retry_after = -1.0;
    }

    let result = format!("limited: {} remainning: {} retry after: {}  reset after: {}",limited.to_string(),remainning.to_string(),retry_after.to_string(),reset_after.to_string());

    return RedisResult::Ok(RedisValue::from(result))
}