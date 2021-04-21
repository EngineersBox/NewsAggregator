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

#[macro_export]
macro_rules! handled_templated_error {
    ($matcher:expr, $ctx:expr, $err_msg:literal) => {
        match $matcher {
            Err(e) => {
                $ctx.log_warning($err_msg);
                $ctx.log_warning(format!("{}", e).as_str());
                return RedisResult::Err(RedisError::Str($err_msg));
            },
            Ok(v) => v,
        }
    };
    ($matcher:expr, $ctx:expr) => {
        match $matcher {
            Err(e) => {
                let err_msg: String = format!("{}", e);
                $ctx.log_warning(err_msg.as_str());
                return RedisResult::Err(RedisError::String(err_msg));
            },
            Ok(v) => v,
        }
    }
}

#[macro_export]
macro_rules! command_entry_debug_log {
    ($msg:literal, $resolver:expr, $ctx:expr, $err_msg:literal) => {
        $ctx.log_debug(format!(
            "{} {}",
            $msg,
            handled_templated_error!($resolver.all_as_str(), $ctx, $err_msg),
        ).as_str());
    }
}

#[macro_export]
macro_rules! push_all {
    ($vec:expr, $value:expr) => {
        $vec.push($value);
    };
    ($vec:expr, $value:expr, $($values:expr),+) => {
        $vec.push($value);
        push_all!($vec,$($values),+)
    }
}