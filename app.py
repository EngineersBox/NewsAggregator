
import functools, logging, logging.config, redis, gzip, time, json
from flask.wrappers import Response
from lxml import etree
from flask import Flask, request, jsonify, render_template, send_from_directory
from flask_cors import CORS, cross_origin
from index_datas.simple_search import simple_match_search
from elasticsearch import Elasticsearch
from summary_1.summary import body_summary
from knn_indexing.index import knn_query
from modules.RateLimiter.src.request_handler import RateLimiter
from urllib3.exceptions import SSLError
from collections import OrderedDict
from typing import Callable
from fast_autocomplete import AutoComplete

AUTOCOMPLETE_MAX_COST = 3
AUTOCOMPLETE_SIZE = 5

logging.config.fileConfig(fname="flask_logging.conf", disable_existing_loggers=False)
logger = logging.getLogger(__name__)

CF_KEY = "news"
INDEX_NAME = "knn_index"
ES = Elasticsearch("admin:admin@localhost:9200", verify_certs=False, ssl_show_warn=False)

app = Flask(__name__)
cors = CORS(app)
app.config["CORS_HEADERS"] = "Content-Type"

def getAutocompleteEntries() -> dict:
    words = {}
    logger.info("Starting autocomplete words intialisation...")
    with gzip.open('wikidump/enwiki-20210820-abstract.xml.gz', 'rb') as f:
        doc_id = 1
        for _, element in etree.iterparse(f, events=('end',), tag='doc'):
            if (doc_id % 78 == 1):
                title = element.findtext('./title')
                logger.debug("Creating autocomplete word entry for [id={0}] [title={1}]".format(doc_id, title))
                words[title[11:]] = {}
            doc_id += 1
            element.clear()
    logger.info("Finished autocomplete words intialisation")
    return words

autocomplete = AutoComplete(words=getAutocompleteEntries())

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
                logger.error("An internal error occurred", e)
                response = {
                    "status_code": 500,
                    "status": "An internal error occurred: {}".format(e)
                }
                return jsonify(response), 500
        return wrapper

    def __enter__(self):
        return

    def __exit__(self, _a, _b, _c):
        return

class TimedResponseWrapper:
    
    def __call__(self, func):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            start_time = time.time_ns()
            response: Response = func(*args, **kwargs)
            result = json.loads(response.get_data())
            result["duration"] = time.time_ns() - start_time
            return jsonify(result)
        return wrapper

    def __enter__(self):
        return

    def __exit__(self, _a, _b, _c):
        return


rd = redis.Redis()
try:
    rd.execute_command("cf.init", CF_KEY, "64k")
except:
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
@TimedResponseWrapper()
def search():
    query = request.args.get("query", None, type=str)
    return base_search(query, lambda es,en,q: simple_match_search(es,en,q))

@app.route("/search")
@cross_origin()
@ErrorHandlerWrapper()
@RateLimiter()
@TimedResponseWrapper()
def knn_search():
    query = request.args.get("query", None, type=str)
    return base_search(query, lambda _es,_en,q: knn_query(q))

#Suggestion route invoked by a POST request returning relevant JSON entries for suggestion values
@cross_origin()
@ErrorHandlerWrapper()
@app.route("/suggest")
def suggest():
        postdata = request.args.get("input", None, type=str)
        suggest = autocomplete.search(
            word=postdata,
            max_cost=AUTOCOMPLETE_MAX_COST,
            size=AUTOCOMPLETE_SIZE
        )
        result = {}
        for x in (0, len(suggest)):
            result["suggest{0}".format(x)] = suggest[x]
        return jsonify(result)

def main():
    app.run(debug=True)

if __name__ == "__main__":
    main()
