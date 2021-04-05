use redis_module::{RedisError, Context};
use schema::argument::Argument;

pub type ErrorHandler = dyn Fn(&Context, RedisError) -> bool; // Return true if can continue, false if should stop parsing

pub struct Schema {
    pub error_handler: Box<ErrorHandler>,
    pub args: Vec<Argument>,
}

impl Schema {
    pub fn new(error_handler: Box<ErrorHandler>, args: Vec<Argument>) -> Schema {
        Schema {
            error_handler,
            args
        }
    }
}