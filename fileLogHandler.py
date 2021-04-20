import logging, datetime, os

class FileHandler(logging.FileHandler):
    def __init__(self, path, mode):
        path = path + "/" + datetime.datetime.now().isoformat()
        os.mkdir(path)
        super(FileHandler, self).__init__(path, mode)
