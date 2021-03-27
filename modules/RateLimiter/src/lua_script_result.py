class LuaScriptResult:

    def __init__(self, reqcount: int, timeleft: int):
        self.reqcount = reqcount
        self.timeleft = timeleft

    def __str__(self):
        return f"{self.reqcount} :: {self.timeleft} ms"
