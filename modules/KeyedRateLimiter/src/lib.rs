mod command;
pub mod schema;
pub mod resolver;
pub mod macros;

#[macro_use]
extern crate redis_module;
extern crate alloc;

#[allow(unused_imports)]
use command::limit::ratelimit_limit;
#[allow(unused_imports)]
use command::check::ratelimit_check;
#[allow(unused_imports)]
use command::reset::ratelimit_reset;

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
    ],
}