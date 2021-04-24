use schema::schema::Schema;
use redis_module::RedisError;
use schema::arg_type::ArgType;
use std::str::FromStr;
use std::any::type_name;
use schema::argument::Argument;

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
                "[{}: {}]",
                ith_schema_arg.name,
                ith_cmd_arg
            ).as_str());
        }
        return Ok(return_string)
    }
    pub fn at<T: FromStr>(&mut self, idx: usize) -> Result<T, RedisError> {
        let cmd_arg: &String = handled_iter_option!(self.cmd_args, idx);
        let schema_arg: &Argument = handled_iter_option!(self.schema.args, idx);
        match FromStr::from_str(cmd_arg.as_str()) {
            Err(_) => Err(RedisError::String(format!(
                "Argument {:?} with value {:?} could not be parsed as type {}",
                schema_arg.name,
                cmd_arg.as_str(),
                type_name::<T>()
            )))?,
            Ok(value) => Ok(value),
        }
    }
    fn try_coerce(&mut self, idx: usize) -> Option<RedisError> {
        let schema_arg: &Argument = match self.schema.args.iter().nth(idx) {
            None => {
                return Some(RedisError::String(format!("Argument not provided for index {}", idx)))
            },
            Some(value) => value
        };
        macro_rules! parse_check_err {
            ($i:expr, $parse_to:ty) => {
                match self.at::<$parse_to>($i) {
                    Err(e) => return Some(e),
                    Ok(_) => true,
                }
            }
        }
        match schema_arg.arg {
            ArgType::INT => parse_check_err!(idx, usize),
            ArgType::STRING => parse_check_err!(idx, String),
            ArgType::FLOAT => parse_check_err!(idx, f32),
            ArgType::BOOL => parse_check_err!(idx, bool),
        };
        None
    }
    pub fn validate(&mut self) -> Option<RedisError> {
        if self.schema.args.len() != self.cmd_args.len() {
            Some(RedisError::String(format!(
                "Provided arguments differ in quantity to schema definition: [schema: {:?}] != [provided: {:?}]",
                self.schema.args.len(),
                self.cmd_args.len()
            )));
        }
        macro_rules! iter_some_on_error {
            ($matcher:expr, $idx:expr) => {
                if let None = $matcher.iter().nth($idx) {
                    return Some(RedisError::String(format!("Argument not provided for index {}", $idx)));
                }
            }
        }
        for i in 0..self.schema.args.len() {
            iter_some_on_error!(self.schema.args, i);
            iter_some_on_error!(self.cmd_args, i);
            if let Some(e) = self.try_coerce(i) {
                return Some(e);
            }
        }
        None
    }
}