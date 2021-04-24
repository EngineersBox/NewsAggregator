mod command;
pub mod schema;
pub mod resolver;
pub mod macros;

#[macro_use]
extern crate redis_module;
extern crate alloc;

#[allow(unused_imports)]


#[derive(Debug)]
struct MyType {
    data: String,
}

redis_module! {
    name: "cuckoo_filter",
    version: 1,
    data_types: [],
    commands: [
        ["cf.delete", cuckoofilter_delete, "write", 1, 1, 1]
    ],
}