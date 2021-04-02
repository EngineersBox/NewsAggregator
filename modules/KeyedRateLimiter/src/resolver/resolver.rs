use schema::schema::{Schema, Argument};
use redis_module::RedisError;
use schema::arg_type::ArgType;
use std::str::FromStr;

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
            let ith_schema_arg: Argument = handled_option!(self.schema.args.into_iter().nth(i), i);
            let ith_cmd_arg: String = handled_option!(self.cmd_args.into_iter().nth(i), i);
            return_string.push_str(format!(
                "[{:?}: {:?}]",
                ith_schema_arg.name,
                ith_cmd_arg
            ).as_str());
        }
        return Ok(return_string)
    }
    fn try_coerce(&self, schema_arg: Argument, cmd_arg: String) -> Option<RedisError> {
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
        let schema_arg: Argument = nth_matcher!(self.schema.args.into_iter(), idx);
        let cmd_arg: String = nth_matcher!(self.cmd_args.into_iter(), idx);
        match self.try_coerce(schema_arg, cmd_arg) {
            None => {}
            Some(e) => Err(e)?
        }
        cmd_arg.as_str().parse::<T>()
    }
}

macro_rules! handled_option {
    ($matcher:expr, $idx:expr) => {
        match $matcher {
            None => {
                Err(RedisError::Str(format!("Argument not provided for index {}", $idx).as_str()))?
            },
            Some(value) => value
        }
    }
}

macro_rules! nth_matcher {
    ($matcher:expr, $idx:expr) => {
        match $matcher.nth($idx) {
            None => {
                Err(RedisError::Str(format!("Argument not provided for index {}", $idx).as_str()))?
            },
            Some(value) => value
        }
    }
}