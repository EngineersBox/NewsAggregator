use redis_module::native_types::RedisType;
use schema::arg_type::ArgType;
use std::error::Error;
use alloc::vec::IntoIter;
use redis_module::RedisError;

pub struct Argument {
    pub name: &'static str,
    pub idx: usize,
    pub arg: ArgType,
}

impl Argument {
    pub fn new(name: &str, idx: usize, arg: ArgType) -> Argument {
        Argument{
            name,
            idx,
            arg,
        }
    }
}

type ErrorHandler = dyn Fn(RedisError) -> bool; // Return true if can continue, false if should stop parsing

pub struct Schema {
    pub error_handler: Box<ErrorHandler>,
    pub args: IntoIter<Argument>,
}

impl Schema {
    pub fn new(error_handler: Box<ErrorHandler>, args: Vec<Argument>) -> Schema {
        Schema {
            error_handler,
            args: args.into_iter()
        }
    }
}