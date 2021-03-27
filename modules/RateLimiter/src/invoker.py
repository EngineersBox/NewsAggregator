from typing import NamedTuple, Any

class InvocationSchema(NamedTuple):
    arg_name: str
    arg_type: type

class Invoker:

    def __init__(self, classtype: type, *schema: InvocationSchema):
        self.classtype = classtype
        self.schema = schema[0]

    def reflectInvoke(self, args: list) -> Any:
        return self.classtype(*self.coerceArguments(args))

    def coerceArguments(self, args: list) -> list:
        type_coereced_args = []
        for i in range(len(args)):
            type_coereced_args.append(
                self.schema[i].arg_type(args[i])
            )
        return type_coereced_args
