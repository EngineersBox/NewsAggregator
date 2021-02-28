import requests
from elasticsearch import Elasticsearch
import json

from summary_1.summary import body_summary

path2json_file = "./result.json"
n_of_documents = 1000
index_name = "search_set"
# filename : path to the json file which should be open
# number : how many documents should be extracted

def get_documents_from_json(path, number):
	documents  = json.loads(open (path2json_file).read())
	if len(documents) < number :
		raise IndexError("There isn't enough documents")

	return documents[:number]


# check whether connect to server
# create es connection
def connect_to_es():
	# make sure that we can hit the ES server
	res = requests.get('http://localhost:9200')
	print(res.content)

	print("-----------------connect complete ------------------")

	#connect to ES server 
	es = Elasticsearch([{'host' : 'localhost', 'port': 9200}])

	return es

def check_index(index_name,es):
	# if we have the index,we can skip this step
	# if not, we need to create the index and 
	# add the top 1000 document in result.json file to es

	if es.indices.exists( index = index_name):
		return

	es.indices.create(index = index_name)

	documents = get_documents_from_json(path2json_file,n_of_documents)

	for i in range(n_of_documents):
		# add each document to index
		es.index(index = index_name , doc_type = 'news' , id = i, body = documents[i])

# link, title ,art, unixtime
# part : which part we want to search 
def simple_match_search(es, index_name ,query):
	body = {
		"query" : {
			"match" : {
				"art" : query
			}
		}
	}

	res = es.search(index = index_name , body = body)

	return res


def main():
	# make sure that we can hit the ES server
	res = requests.get('http://localhost:9200')
	print(res.content)

	print("-----------------connect complete ------------------")

	#connect to ES server 
	es = Elasticsearch([{'host' : 'localhost', 'port': 9200}])
	#x = json.loads(open ("../result.json").read())
	#print(x[1])

	check_index(index_name, es)
	query = "president"
	part = "art"
	res = simple_match_search(es, index_name, query)

	list_result = res['hits']['hits']

	for one in list_result:
		print(body_summary((one['_source'])['art']))
		print('--------------------------------------------------------')

if __name__ == "__main__":
    main()