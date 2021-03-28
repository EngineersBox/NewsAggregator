from flask import Flask, request, jsonify, url_for, render_template, send_from_directory
from flask_cors import CORS, cross_origin
from minitask.simple_search import simple_match_search
from elasticsearch import Elasticsearch
from summary_1.summary import body_summary
from knn_indexing.index import knn_query
import redis

# INDEX_NAME = 'news'

# ES = Elasticsearch([{'host' : 'localhost', 'port': 9200}])

INDEX_NAME = 'knn_index'

ES = Elasticsearch("http://admin:admin@localhost:9200", verify_certs=False, ssl_show_warn=False)

app = Flask(__name__)

cors = CORS(app)

app.config['CORS_HEADERS'] = 'Content-Type'

# reference of kristoff-it 2020 https://github.com/kristoff-it/redis-cuckoofilter
rd = redis.Redis()
# load the module in Cuckoofilter remember
try:
    rd.execute_command("cf.init", "test2", "64k")
except:
    print("the filter is already initialized")
 
def fingerprint(x):
    return ord(x[0])

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
def search():
    query = request.args.get('query', None)
    if query:
        print('query is %s' % query)

        in_result = rd.execute_command("cf.check", "test2", hash(query), fingerprint(query))
        if in_result:
            print('query is checked by cuckoofilter')
            print('query is probably inside cuckoofilter')
            result_value = rd.execute_command("get", query)
            return jsonify(result_value)
        else:
            print('query is checked by cuckoofilter')
            print('query is not inside cuckoofilter')
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
def knn_search():
    
    query = request.args.get('query', None)
    if query:
        res = knn_query(query)
        list_res = res['hits']['hits']
        return jsonify(list_res)
    return jsonify([])

if __name__ == '__main__':
    app.run(debug=True)
