import wikipedia, gzip, threading
from urllib.request import urlopen
from elasticsearch import Elasticsearch as es
from wikipedia.exceptions import PageError, DisambiguationError
import ssl
from multiprocessing import Pool
import multiprocessing

elastic_search = es(["127.0.0.1"], timeout=35, max_retries=8, retry_on_timeout=True)

"""
Need to create the index first before using this script
curl -XPUT https://localhost:9200/example3 --insecure -u admin:admin
"""
URL = 'https://localhost:9200/example3/_doc/'

# the code with idea inspired by https://www.cnblogs.com/shaosks/p/7592229.html

def process(line):
    formattedLine = line.strip().decode("utf-8")
    print("Line:", formattedLine)
    print("thread_id :", multiprocessing.current_process())
    try:
        page = wikipedia.page(formattedLine)
        data = {"link": page.url, "title": page.title, "art": page.summary}
        index_elastic_search(data)
    except (PageError, DisambiguationError):
        print("Ambiguous or not found, Skipping")
        

def index_elastic_search(data):
    global elasticsearch
    try:
        elastic_search.index(index='news', body=data)
        print("Added document: ", data["title"])
    except (Exception) as e:
        print("Could not index document, {0}:".format(data["title"]), e)

def search_index_test(elastic_search):
    # u6250082 Xuguang Song
    '''test with query to match ACT'''

    q = "ACT"
    position = "title"
    test1 = {
            "query": {
                "match": {
                    position: q
                }
            }
        }
    # output = elastic_search.search(index='news', doc_type='web_news', body=test1)
    print('\n', 'searching for keyword: ', q, " ", "in", " article ", position, '\n')
    output = elastic_search.search(index='wiki', body=test1)
    print('searching finished with total time: ', output['took'], '\n')
    print('result: ', '\n')
    for hit in output['hits']['hits']:
        # print search result
        print ('match news title: ', hit['_source']['title'], '\n', 'match news link: ', hit['_source']['link'], '\n', '-------------------------------------------------------------')

def locked_iter(it):
    it = iter(it)
    lock = threading.Lock()
    while True:
        try:
            with lock:
                value = next(it)
        except StopIteration:
            return
        yield value

def main():
    global doc_id, lock
    if not elastic_search.indices.exists(index='news'):
        elastic_search.indices.create(index='news')
    totalLines = 0
    ssl._create_default_https_context = ssl._create_unverified_context
    with urlopen("https://dumps.wikimedia.org/enwiki/20210820/enwiki-20210820-all-titles-in-ns0.gz") as r:
        with gzip.GzipFile(fileobj=r) as f:
            pool = Pool(10)
            result_iter = pool.imap_unordered(process, f, chunksize=50)
            for _ in result_iter:
                totalLines += 1

    print('In Total:', totalLines)
    search_index_test(elastic_search)

if __name__ == '__main__':
    main()
