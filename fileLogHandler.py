import logging, datetime, os

class FileHandler(logging.FileHandler):
    def __init__(self, path, mode):
        os.mkdir(path)
        path = "{}/{}.log".format(path, datetime.datetime.now().isoformat())
        super(FileHandler, self).__init__(path, mode)
