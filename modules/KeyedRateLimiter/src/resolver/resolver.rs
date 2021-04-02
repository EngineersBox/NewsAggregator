use schema::schema::{Schema, Argument};
use redis_module::RedisError;
use schema::arg_type::ArgType;
use std::str::FromStr;

macro_rules! handled_iter_option {
    ($matcher:expr, $idx:expr) => {
        match $matcher.iter().nth($idx) {
            None => {
                Err(RedisError::String(format!("Argument not provided for index {}", $idx)))?
            },
            Some(value) => value
        }
    }
}

pub struct Resolver {
    schema: Schema,
    cmd_args: Vec<String>,
}

impl Resolver {
    pub fn new(schema: Schema, cmd_args: Vec<String>) -> Resolver {
        Resolver{
            schema,
            cmd_args,
        }
    }
    pub fn all_as_str(&mut self) -> Result<String, RedisError> {
        let mut return_string: String = String::new();
        for i in 0..self.cmd_args.len() {
            let ith_schema_arg: &Argument = handled_iter_option!(self.schema.args, i);
            let ith_cmd_arg: &String = handled_iter_option!(self.cmd_args, i);
            return_string.push_str(format!(
                "[{:?}: {:?}]",
                ith_schema_arg.name,
                ith_cmd_arg
            ).as_str());
        }
        return Ok(return_string)
    }
    fn try_coerce(&self, schema_arg: &Argument, cmd_arg: &String) -> Option<RedisError> {
        macro_rules! parse_arg_type {
            ($cmd_arg:expr, $parse_to:ty) => {
                $cmd_arg.as_str().parse::<$parse_to>().is_err()
            }
        }
        let result: bool = match schema_arg.arg {
            ArgType::INT => parse_arg_type!(cmd_arg, usize),
            ArgType::STRING => parse_arg_type!(cmd_arg, String),
            ArgType::FLOAT => parse_arg_type!(cmd_arg, f32),
            ArgType::BOOL => parse_arg_type!(cmd_arg, bool),
        };
        if !result {
            return Some(RedisError::String(format!("Argument could not be parsed as type {:?}", schema_arg.arg)))
        }
        None
    }
    pub fn at<T: FromStr<Err = RedisError>>(&mut self, idx: usize) -> Result<T, RedisError> {
        let schema_arg: &Argument = handled_iter_option!(self.schema.args, idx);
        let cmd_arg: &String = handled_iter_option!(self.cmd_args, idx);
        match self.try_coerce(schema_arg, cmd_arg) {
            None => cmd_arg.as_str().parse::<T>(),
            Some(e) => Err(e)?
        }
    }
}