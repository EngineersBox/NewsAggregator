mod command;
mod schema;
mod resolver;

#[macro_use]
extern crate redis_module;
extern crate alloc;

use command::limit::ratelimit_limit;
use command::check::ratelimit_check;

#[derive(Debug)]
struct MyType {
    data: String,
}

redis_module! {
    name: "ratelimit",
    version: 1,
    commands: [
        ["rl.limit", ratelimit_limit, "write", 1, 1, 1],
        ["rl.check", ratelimit_check, "readonly", 1, 1, 1],
    ],
}
