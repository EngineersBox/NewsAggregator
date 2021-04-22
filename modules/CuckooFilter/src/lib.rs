pub mod command;
pub mod schema;
pub mod resolver;
pub mod macros;

#[macro_use]
extern crate redis_module;
extern crate alloc;
extern crate cuckoofilter;

#[allow(unused_imports)]
use command::insert::cuckoofilter_insert;

#[derive(Debug)]
struct MyType {
    data: String,
}

redis_module! {
    name: "ratelimiter",
    version: 1,
    data_types: [],
    commands: [
        ["cf.insert", cuckoofilter_insert,"write", 1, 1, 1 ],
    ],
}