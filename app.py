import functools, logging, logging.config, redis
from flask import Flask, request, jsonify, render_template, send_from_directory
from flask_cors import CORS, cross_origin
from minitask.simple_search import simple_match_search
from elasticsearch import Elasticsearch
from summary_1.summary import body_summary
from knn_indexing.index import knn_query
from modules.RateLimiter.src.request_handler import RateLimiter
from urllib3.exceptions import SSLError

logging.config.fileConfig(fname='flask_logging.conf', disable_existing_loggers=False)
logger = logging.getLogger(__name__)

INDEX_NAME = 'knn_index'

ES = Elasticsearch("admin:admin@localhost:9200", verify_certs=False, ssl_show_warn=False)

app = Flask(__name__)

cors = CORS(app)

app.config['CORS_HEADERS'] = 'Content-Type'

class ErrorHandlerWrapper:

    def __call__(self, func):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            self.client_addr = request.remote_addr
            try:
                with self:
                    return func(*args, **kwargs)
            except SSLError as e:
                logger.error('An issue with SSL occured', e)
                response  = {
                    'status_code': e.status_code,
                    'status': 'An issue with SSL occured: {}'.format(e)
                }
                return jsonify(response), e.status_code
            except Exception as e:
                logger.error('An unknown internal error occurred', e)
                response = {
                    'status_code': 500,
                    'status': 'An unknown internal error occurred: {}'.format(e)
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
    logger.warning('the filter is already initialized')


def fingerprint(x):
    return ord(x[0])

@app.route('/')
@ErrorHandlerWrapper()
def index_page():
    return render_template('index.html')

@app.route('/css/<path:filename>')
@ErrorHandlerWrapper()
def send_css(filename):
    return send_from_directory('static/css', filename)

@app.route('/js/<path:filename>')
@ErrorHandlerWrapper()
def send_js(filename):
    return send_from_directory('static/js', filename)

@app.route('/origin_search')
@cross_origin()
@ErrorHandlerWrapper()
@RateLimiter()
def search():
    query = request.args.get('query', None)
    if query:
        print('query is %s' % query)

        in_result = rd.execute_command("cf.check", "test2", hash(query), fingerprint(query))
        if int(in_result) == 1:
            # print('query is checked by cuckoofilter')
            # print('query is probably inside cuckoofilter')
            logger.warning('query is checked by cuckoofilter')
            logger.warning('query is probably inside cuckoofilter')
            result_value = rd.execute_command("get", query)
            return jsonify(result_value)
        else:
            # print('query is checked by cuckoofilter')
            # print('query is not inside cuckoofilter')
            logger.warning('query is checked by cuckoofilter')
            logger.warning('query is not inside cuckoofilter')
            res = simple_match_search(ES, 'news', query)
            list_res = res['hits']['hits']
            for one in list_res:
                # u6250082 Xuguang Song
                sum_txt = body_summary(one['_source']['art'])
                one['_source']['summary'] = ' '.join(sum_txt)
            rd.execute_command("cf.add", "test2", hash(query), fingerprint(query))
            rd.execute_command("set", query, list_res)
            return jsonify(list_res)
    return jsonify([])

@app.route('/search')
@cross_origin()
@ErrorHandlerWrapper()
@RateLimiter()
def knn_search():
    query = request.args.get('query', None)
    if query:
        print('query is %s' % query)

        in_result = rd.execute_command("cf.check", "test2", hash(query), fingerprint(query))
        if in_result:
            # print('query is checked by cuckoofilter')
            # print('query is probably inside cuckoofilter')
            logger.warning('query is checked by cuckoofilter')
            logger.warning('query is probably inside cuckoofilter')
            result_value = rd.execute_command("get", query)
            return jsonify(result_value)
        else:
            # print('query is checked by cuckoofilter')
            # print('query is not inside cuckoofilter')
            logger.warning('query is checked by cuckoofilter')
            logger.warning('query is not inside cuckoofilter')
            res = knn_query(ES, 'news', query)
            list_res = res['hits']['hits']
            for one in list_res:
                # u6250082 Xuguang Song
                sum_txt = body_summary(one['_source']['art'])
                one['_source']['summary'] = ' '.join(sum_txt)
            rd.execute_command("cf.add", "test2", hash(query), fingerprint(query))
            rd.execute_command("set", query, list_res)
            return jsonify(list_res)
    return jsonify([])

if __name__ == '__main__':
    app.run(debug=True)
