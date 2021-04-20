import functools, logging, logging.config
from flask import Flask, request, jsonify, render_template, send_from_directory
from flask_cors import CORS, cross_origin
from minitask.simple_search import simple_match_search
from elasticsearch import Elasticsearch
from summary_1.summary import body_summary
from knn_indexing.index import knn_query
from modules.RateLimiter.src.request_handler import RateLimiter
from urllib3.exceptions import SSLError

# INDEX_NAME = 'news'

# ES = Elasticsearch([{'host' : 'localhost', 'port': 9200}])

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
                    'status': 'An issue with SSL occured: {}'.format(e.message)
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

@app.route('/')
def index_page():
    return render_template('index.html')

@app.route('/css/<path:filename>')
def send_css(filename):
    return send_from_directory('static/css', filename)

@app.route('/js/<path:filename>')
def send_js(filename):
    return send_from_directory('static/js', filename)

@app.route('/origin_search')
@cross_origin()
@ErrorHandlerWrapper()
# @RateLimiter()
def search():
    query = request.args.get('query', None)
    if query:
        print('query is %s' % query)
        res = simple_match_search(ES, 'news', query)
        list_res = res['hits']['hits']
        for one in list_res:
            # u6250082 Xuguang Song
            sum_txt = body_summary(one['_source']['art'])
            one['_source']['summary'] = ' '.join(sum_txt)
        return jsonify(list_res)
    return jsonify([])

@app.route('/search')
@cross_origin()
@ErrorHandlerWrapper()
# @RateLimiter()
def knn_search():
    query = request.args.get('query', None)
    if query:
        res = knn_query(query)
        list_res = res['hits']['hits']
        return jsonify(list_res)
    return jsonify([])

if __name__ == '__main__':
    app.run(debug=True)
