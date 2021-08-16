import functools, logging, logging.config, redis, json
from flask import Flask, request, jsonify, render_template, send_from_directory
from flask_cors import CORS, cross_origin
from minitask.simple_search import simple_match_search
from elasticsearch import Elasticsearch
from summary_1.summary import body_summary
from knn_indexing.index import knn_query
from modules.RateLimiter.src.request_handler import RateLimiter
from urllib3.exceptions import SSLError
from collections import OrderedDict
from typing import Callable

logging.config.fileConfig(fname="flask_logging.conf", disable_existing_loggers=False)
logger = logging.getLogger(__name__)

CF_KEY = "test2"
INDEX_NAME = "knn_index"
ES = Elasticsearch("admin:admin@localhost:9200", verify_certs=False, ssl_show_warn=False)

app = Flask(__name__)
cors = CORS(app)
app.config["CORS_HEADERS"] = "Content-Type"

class ErrorHandlerWrapper:

    def __call__(self, func):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            self.client_addr = request.remote_addr
            try:
                with self:
                    return func(*args, **kwargs)
            except SSLError as e:
                logger.error("An issue with SSL occured", e)
                response  = {
                    "status_code": e.status_code,
                    "status": "An issue with SSL occured: {}".format(e)
                }
                return jsonify(response), e.status_code
            except Exception as e:
                logger.error("An unknown internal error occurred", e)
                response = {
                    "status_code": 500,
                    "status": "An unknown internal error occurred: {}".format(e)
                }
                return jsonify(response), 500
        return wrapper

    def __enter__(self):
        return

    def __exit__(self, _a, _b, _c):
        return


# reference of kristoff-it 2020 https://github.com/kristoff-it/redis-cuckoofilter
rd = redis.Redis()
# load the module in Cuckoofilter remember
try:

    rd.execute_command("cf.init", "test2", "64k")

except:

    # print("the filter is already initialized")

    # logging output
    logger.warning("the filter is already initialized")


def fingerprint(x):
    return ord(x[0])

@app.route("/")
@ErrorHandlerWrapper()
def index_page():
    return render_template("index.html")

@app.route("/css/<path:filename>")
@ErrorHandlerWrapper()
def send_css(filename):
    return send_from_directory("static/css", filename)

@app.route("/js/<path:filename>")
@ErrorHandlerWrapper()
def send_js(filename):
    return send_from_directory("static/js", filename)


def base_search(query: str, search_method: Callable[[Elasticsearch, str, str], None]):
    if not query:
        return jsonify([])

    in_result = rd.execute_command("cf.check", CF_KEY, hash(query), fingerprint(query))
    if int(in_result) == 1:
        orderedLoad = lambda x: json.loads(x, object_pairs_hook=OrderedDict)
        result_value = list(map(orderedLoad, rd.execute_command("LRANGE", query, 0, -1)))
        return jsonify(result={
            "result": result_value,
            "from": "Redis"
        })
    res = search_method(ES, "news", query)
    list_res = res["hits"]["hits"]
    for one in list_res:
        sum_txt = body_summary(one["_source"]["art"])
        one["_source"]["summary"] = " ".join(sum_txt)
    rd.execute_command("cf.add", "test2", hash(query), fingerprint(query))
    for elem in list_res:
        rd.execute_command("RPUSH", query, json.dumps(elem))
    return jsonify(result={
        "result": list_res,
        "from": "Elasticsearch"
    })

@app.route("/origin_search")
@cross_origin()
@ErrorHandlerWrapper()
@RateLimiter()
def search():
    query = request.args.get("query", None, type=str)
    return base_search(query, lambda es,en,q: simple_match_search(es,en,q))

@app.route("/search")
@cross_origin()
@ErrorHandlerWrapper()
@RateLimiter()
def knn_search():
    query = request.args.get("query", None, type=str)
    return base_search(query, lambda _es,_en,q: knn_query(q))

if __name__ == "__main__":
    app.run(debug=True)
