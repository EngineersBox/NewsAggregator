import wikipedia

import gzip, urllib.request

import multiprocessing as mp

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

elastic_search = None
test = []
doc_id = 0
totalLines = 0

def process(line):
    global doc_id
    global totalLines
    # Do indexing here
    formattedLine = line.strip().decode("utf-8")
    print("Reading[", doc_id, "/", totalLines, "]:", formattedLine)
    page = wikipedia.page(formattedLine)
    print("12")
    try:
        data = {"link": page.url, "title": page.title, "art": page.summary}
        print('Added Index [', doc_id, '/', totalLines, ']: ', data['title'])
        index_elastic_search(data, elastic_search, doc_id)
    except (wikipedia.exceptions.PageError, wikipedia.exceptions.DisambiguationError):
        print("Ambiguous or not found, Skipping")
    doc_id += 1
        
def index_elastic_search(data, elastic_search, index):
    # u6250082 Xuguang Song
    '''parameter: data, elastic search engine, ind'''
    try:
        index_result = elastic_search.index(index='wiki', body=data, id=index)
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
    test1 ={ "query":  { 
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
   
if __name__ == '__main__':
    elastic_search = start_elastic_search()
    with gzip.open("../../wikidump/enwiki-20210820-all-titles-in-ns0.gz") as f:
        totalLines = sum(1 for _ in f)
    if not elastic_search.indices.exists(index='wiki'):
        # create the index
        elastic_search.indices.create(index='wiki')  

    wikipedia.set_lang("en")
    with gzip.open("../../wikidump/enwiki-20210820-all-titles-in-ns0.gz") as f:
        # totalLines = sum(1 for _ in f)
        pool = mp.Pool(processes = 10)
        t = pool.imap_unordered(process, f)
        print('In total: ', totalLines)      
        search_index_test(elastic_search)

# if __name__ == '__main__':
#    work()  
