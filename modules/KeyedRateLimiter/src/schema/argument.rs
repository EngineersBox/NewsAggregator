use schema::arg_type::ArgType;

pub struct Argument {
    pub name: &'static str,
    pub arg: ArgType,
}

impl Argument {
    pub fn new(name: &'static str, arg: ArgType) -> Argument {
        Argument{
            name,
            arg,
        }
    }
}