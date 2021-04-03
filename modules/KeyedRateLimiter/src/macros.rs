#[macro_export]
macro_rules! validate_schema {
    ($resolver:expr, $ctx:expr) => {
        match $resolver.validate() {
            Some(e) => {
                $ctx.log_warning(format!(
                    "Provided arguments did not validate against schema: {:?}",
                    e.to_string()
                ).as_str());
                return RedisResult::Err(e);
            }
            None => $ctx.log_debug("Successfully validated provided arguments against schema"),
        }
    }
}