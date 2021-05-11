
class HTTP_429_TooManyRequests(Exception):
    def __init__(self, expiry: int):
        self.expiry = expiry
        self.message = f"try again in {expiry} ms"
        super().__init__(self.message)

    def __str__(self):
        return self.message

class HTTP_400_BadRequest(Exception):
    def __init__(self, message: str):
        self.message = message
        super().__init__(message)

    def __str__(self):
        return self.message
