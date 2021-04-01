mod command;
mod schema;
mod resolver;

#[macro_use]
extern crate redis_module;
extern crate alloc;

use redis_module::native_types::RedisType;
use redis_module::{raw, Context, NextArg, RedisResult, RedisError};
use std::os::raw::c_void;
use schema::schema::{Schema, Argument};
use schema::arg_type::ArgType;

#[derive(Debug)]
struct MyType {
    data: String,
}

redis_module! {
    name: "ratelimit",
    version: 1,
    commands: [
        ["rl.set", alloc_set, "write", 1, 1, 1],
        ["rl.get", alloc_get, "readonly", 1, 1, 1],
    ],
}

fn alloc_set(ctx: &Context, args: Vec<String>) -> RedisResult {
    let mut args = args.into_iter().skip(1);
    let key = args.next_string()?;
    let size = args.next_i64()?;

    ctx.log_debug(format!("key: {}, size: {}", key, size).as_str());

    let key = ctx.open_key_writable(&key);

    match key.get_value::<MyType>(&MY_REDIS_TYPE)? {
        Some(value) => {
            value.data = "B".repeat(size as usize);
        }
        None => {
            let value = MyType {
                data: "A".repeat(size as usize),
            };

            key.set_value(&MY_REDIS_TYPE, value)?;
        }
    }

    Ok(size.into())
}

fn alloc_get(ctx: &Context, args: Vec<String>) -> RedisResult {
    let mut args = args.into_iter().skip(1);
    let key = args.next_string()?;

    let key = ctx.open_key(&key);

    let value = match key.get_value::<MyType>(&MY_REDIS_TYPE)? {
        Some(value) => value.data.as_str().into(),
        None => ().into(),
    };

    Ok(value)
}
