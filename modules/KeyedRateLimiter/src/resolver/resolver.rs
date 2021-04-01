use schema::schema::{Schema, Argument};
use alloc::vec::IntoIter;
use redis_module::RedisError;
use schema::arg_type::ArgType;
use std::str::FromStr;

pub struct Resolver {
    schema: Schema,
    cmd_args: IntoIter<String>,
}

impl Resolver {
    pub fn new(schema: Schema, cmd_args: Vec<String>) -> Resolver {
        Resolver{
            schema,
            cmd_args: cmd_args.into_iter(),
        }
    }
    fn try_coerce(&self, schema_arg: Argument) -> Option<RedisError> {
        let result: bool = match schema_arg.arg {
            ArgType::INT => cmd_arg.as_str().parse::<usize>().is_err(),
            ArgType::STRING => cmd_arg.as_str().parse::<String>().is_err(),
            ArgType::FLOAT => cmd_arg.as_str().parse::<f32>().is_err(),
            ArgType::BOOL => cmd_arg.as_str().parse::<bool>().is_err(),
        };
        if !result {
            return Some(RedisError::Str(format!("Argument could not be parsed as type {:?}", schema_arg.arg).as_str()))
        }
        None
    }
    pub fn at<T: FromStr<Err = RedisError>>(&mut self, idx: usize) -> Result<T, RedisError> {
        let schema_arg: Argument = match self.schema.args.nth(idx) {
            None => {
                Err(RedisError::Str(format!("Argument not provided for index {}", idx).as_str()))?
            },
            Some(value) => value
        };
        let cmd_arg: String = match self.cmd_args.nth(idx) {
            None => {
                Err(RedisError::Str(format!("Argument not provided for index {}", idx).as_str()))?
            },
            Some(value) => value
        };
        match self.try_coerce(schema_arg) {
            None => {}
            Some(e) => Err(e)?
        }
        cmd_arg.as_str().parse::<T>()
    }
}