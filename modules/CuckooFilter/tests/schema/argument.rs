use keyed_rate_limiter::schema::argument::Argument;
use keyed_rate_limiter::schema::arg_type::ArgType;

// Valid creation tests

#[test]
#[allow(non_snake_case)]
fn givenNameAndArgs_whenValidAndArgTypeIsString_thenSuccessfullyCreatesInstance() {
    let name: &str = "Some test 953 argument name";
    let argtype: ArgType = ArgType::STRING;
    let argument: Argument = Argument::new(name, argtype.clone());
    assert_eq!(name, argument.name);
    assert_eq!(argtype, argument.arg);
}

#[test]
#[allow(non_snake_case)]
fn givenNameAndArgs_whenValidAndArgTypeIsInt_thenSuccessfullyCreatesInstance() {
    let name: &str = "Some test 953 argument name";
    let argtype: ArgType = ArgType::INT;
    let argument: Argument = Argument::new(name, argtype.clone());
    assert_eq!(name, argument.name);
    assert_eq!(argtype, argument.arg);
}

#[test]
#[allow(non_snake_case)]
fn giveNameAndArgs_whenValidAndArgTypeIsFloat_thenSuccessfullyCreatesInstance() {
    let name: &str = "Some test 953 argument name";
    let argtype: ArgType = ArgType::FLOAT;
    let argument: Argument = Argument::new(name, argtype.clone());
    assert_eq!(name, argument.name);
    assert_eq!(argtype, argument.arg);
}

#[test]
#[allow(non_snake_case)]
fn givenNameAndArgs_whenValidAndArgTypeIsBool_thenSuccessfullyCreatesInstance() {
    let name: &str = "Some test 953 argument name";
    let argtype: ArgType = ArgType::BOOL;
    let argument: Argument = Argument::new(name, argtype.clone());
    assert_eq!(name, argument.name);
    assert_eq!(argtype, argument.arg);
}