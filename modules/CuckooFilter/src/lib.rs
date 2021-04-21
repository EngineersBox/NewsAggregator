pub mod schema;
pub mod resolver;
pub mod macros;

#[macro_use]
extern crate redis_module;
extern crate alloc;
extern crate cuckoofilter;

#[allow(unused_imports)]
use command::limit::ratelimit_limit;
#[allow(unused_imports)]
use command::check::ratelimit_check;
#[allow(unused_imports)]
use command::reset::ratelimit_reset;

// Cuckoo Filter Commands
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
        ["rl.limit", ratelimit_limit, "write", 1, 1, 1],
        ["rl.check", ratelimit_check, "readonly", 1, 1, 1],
        ["rl.reset", ratelimit_reset, "write", 1, 1, 1],
        ["cf.insert", cuckoofilter_insert,"write", 1, 1, 1 ],
    ],
}