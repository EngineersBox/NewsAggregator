use redis_module::{RedisError, Context};
use schema::argument::Argument;
use std::collections::HashSet;

pub type ErrorHandler = dyn Fn(&Context, RedisError) -> bool; // Return true if can continue, false if should stop parsing

pub struct Schema {
    pub error_handler: Box<ErrorHandler>,
    pub args: Vec<Argument>,
}

impl Schema {
    pub fn has_unique_elements(iter: &[Argument]) -> bool {
        let mut uniq: HashSet<&str> = HashSet::new();
        iter.into_iter().all(move |x| uniq.insert(x.name))
    }

    pub fn new(error_handler: Box<ErrorHandler>, args: Vec<Argument>) -> Schema {
        assert!(Schema::has_unique_elements(args.as_slice().clone()));
        Schema {
            error_handler,
            args
        }
    }
}