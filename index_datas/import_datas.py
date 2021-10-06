
import pandas as pd
import requests
import json
import gzip
from lxml import etree

import wikipedia, gzip, threading
from urllib.request import urlopen

from elasticsearch import Elasticsearch as es
from wikipedia.exceptions import PageError, DisambiguationError
import ssl
from multiprocessing import Pool
import multiprocessing
from elasticsearch import Elasticsearch as es
elastic_search = es(["127.0.0.1"], timeout=35, max_retries=8, retry_on_timeout=True)
from elasticsearch import helpers as h
from dataclasses import dataclass 

@dataclass
class Abstract:
    """Wikipedia abstract"""
    ID: int
    title: str
    abstract: str
    url: str

    @property
    def fulltext(self):
        return ' '.join([self.title, self.abstract])

"""
Need to create the index first before using this script
curl -XPUT https://localhost:9200/example3 --insecure -u admin:admin
"""
URL = 'https://localhost:9200/example3/_doc/'

def index_elastic_search(data, elastic_search):
    # u6250082 Xuguang Song
    '''parameter: data, elastic search engine, ind'''
    try:
        index_result = elastic_search.index(index='wiki', body=data)
    except:
        print(data)
    print('success')

# the code with idea inspired by https://www.cnblogs.com/shaosks/p/7592229.html
def start_import(test_size = 1000):
    # u6250082 Xuguang Song
    '''import all the data news from data set and use 1000 as test set'''

    data_set = []
    with gzip.open('../../wikidump/enwiki-20210820-abstract.xml.gz', 'rb') as f:
        doc_id = 1
        # iterparse will yield the entire `doc` element once it finds the
        # closing `</doc>` tag
        for _, element in etree.iterparse(f, events=('end',), tag='doc'):
            title = element.findtext('./title')
            title = title[11:0]
            link = element.findtext('./url')
            art = element.findtext('./abstract')
            data_set.append({"link": link, "title": title, "art": art})

            print("added", title)
            print(doc_id,"/100million")
            doc_id += 1
            element.clear()

    total_number = len(data_set)
    print('in total: ', total_number)

    data_set_test = data_set[:total_number-2]
    global elastic_search
    if not elastic_search.indices.exists( index = 'wiki'):
        # create the index
	    elastic_search.indices.create(index = 'wiki')
    # for x in range(total_number-2):
    #     print('adding: ', data_set_test[x]['title'])
    #     index_elastic_search(data_set_test[x], elastic_search, x)
    # search_index_test(elastic_search)

    pool = Pool(10) 
    result_iter = pool.map(process, data_set_test)

def process(data):

    global elastic_search

    print("thread_id :", multiprocessing.current_process())
    try:
        print('adding: ', data['title'])
        index_elastic_search(data, elastic_search)
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
    output = elastic_search.search(index='news', body=test1)
    print('searching finished with total time: ', output['took'], '\n')
    print('result: ', '\n')
    for hit in output['hits']['hits']:
        # print search result
        print ('match news title: ', hit['_source']['title'], '\n', 'match news link: ', hit['_source']['link'], '\n', '-------------------------------------------------------------')

if __name__ == '__main__': 
    start_import() 
