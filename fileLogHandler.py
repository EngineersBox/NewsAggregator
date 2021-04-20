import logging, datetime, os
from pathlib import Path

class FileHandler(logging.FileHandler):
    def __init__(self, path, mode):
        Path(path).mkdir(parents=True, exist_ok=True)
        path = "{}/{}.log".format(path, datetime.datetime.now().isoformat())
        super(FileHandler, self).__init__(path, mode)
