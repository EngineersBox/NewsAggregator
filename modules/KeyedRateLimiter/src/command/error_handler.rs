use redis_module::{RedisError, Context};

pub(crate) fn redis_command_error_handler(ctx: &Context, err: RedisError) -> bool {
    ctx.log_warning(err.to_string().as_str());
    true
}