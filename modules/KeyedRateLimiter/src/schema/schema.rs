use schema::arg_type::ArgType;
use redis_module::RedisError;

pub struct Argument {
    pub name: &'static str,
    pub idx: usize,
    pub arg: ArgType,
}

impl Argument {
    pub fn new(name: String, idx: usize, arg: ArgType) -> Argument {
        Argument{
            name: name.as_str(),
            idx,
            arg,
        }
    }
}

type ErrorHandler = dyn Fn(RedisError) -> bool; // Return true if can continue, false if should stop parsing

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