import wikipedia, gzip, requests

from elasticsearch import Elasticsearch as es

from elasticsearch import helpers as h

from dataclasses import dataclass

from wikipedia.exceptions import WikipediaException


"""
Need to create the index first before using this script
curl -XPUT https://localhost:9200/example3 --insecure -u admin:admin
"""
URL = 'https://localhost:9200/example3/_doc/'

# the code with idea inspired by https://www.cnblogs.com/shaosks/p/7592229.html

def start_import(test_size = 1000):
    # u6250082 Xuguang Song
    '''import all the data news from data set and use 1000 as test set'''

    totalLines = 0
    with requests.urlopen("https://dumps.wikimedia.org/wikidatawiki/latest/wikidatawiki-latest-all-titles-in-ns0.gz") as r:
        with gzip.GzipFile(fileobj=r) as f:
            totalLines = sum(1 for _ in f)

    elastic_search = start_elastic_search()
    if not elastic_search.indices.exists(index='news'):
        # create the index
        elastic_search.indices.create(index='news')
        
    with requests.urlopen("https://dumps.wikimedia.org/wikidatawiki/latest/wikidatawiki-latest-all-titles-in-ns0.gz") as r:
        with gzip.GzipFile(fileobj=r) as f:
            totalLines = sum(1 for _ in f)
            doc_id = 1
            wikipedia.set_lang("en")
            for line in f:
                formattedLine = line.strip().decode("utf-8")
                print("Reading[", doc_id, "/", totalLines, "]:", formattedLine)
                page = wikipedia.page(formattedLine)
                try:
                    data = {"link": page.url, "title": page.title, "art": page.summary}
                    print('Added Index [', doc_id, '/', totalLines, ']: ', data['title'])
                    index_elastic_search(data, elastic_search, doc_id)
                except (wikipedia.exceptions.PageError, wikipedia.exceptions.DisambiguationError):
                    print("Ambiguous or not found, Skipping")
                    continue
                doc_id += 1
                if (doc_id > test_size):
                    break

    print('In total: ', totalLines)
    search_index_test(elastic_search)

def index_elastic_search(data, elastic_search, index):
    # u6250082 Xuguang Song
    '''parameter: data, elastic search engine, ind'''
    
    try:

        index_result = elastic_search.index(index='news', body=data, id=index)

    except:
        print(data)
    print('success')

def start_elastic_search():
    # u6250082 Xuguang Song
    '''start elastic search'''

    ip_url = ["127.0.0.1"]
    # initialize elastic search
    new_es = es(ip_url, timeout=35, max_retries=8, retry_on_timeout=True)
    return new_es

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
    output = elastic_search.search(index='news', body=test1)
    print('searching finished with total time: ', output['took'], '\n')
    print('result: ', '\n')
    for hit in output['hits']['hits']:
        # print search result
        print ('match news title: ', hit['_source']['title'], '\n', 'match news link: ', hit['_source']['link'], '\n', '-------------------------------------------------------------')

if __name__ == '__main__':
    start_import()
