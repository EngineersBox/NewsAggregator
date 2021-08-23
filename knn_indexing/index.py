from elasticsearch import Elasticsearch
import json, re, datetime
import tensorflow as tf
import tensorflow_hub as hub
import numpy as np
from summary import summary_func
from summary_1 import name_entity

MODEL_URL = "https://tfhub.dev/google/nnlm-en-dim50/2"
MODEL_DIM = 50  # Keep this updated when changing the model
URL = "admin:admin@localhost:9200"
ES = Elasticsearch(URL, verify_certs=False, ssl_show_warn=False)
INDEX_NAME = "knn_index"
# Used for vectorisation
EMBED = hub.load(MODEL_URL)

def init_knn_es_index(index_name):
    if not ES.indices.exists(index_name):
        ES.indices.create(index_name, {
            "settings": {"index.knn": True},
            "mappings": {
                "properties": {
                    "title_v": {
                        "type": "knn_vector",
                        "dimension": MODEL_DIM
                    },
                    "title": {"type": "text"},
                    "art_v": {"type": "knn_vector", "dimension": MODEL_DIM},
                    "art": {"type": "text"},
                    "link": {"type": "text"}
                }
            }
        })
        print("Created knn index")
    else:
        print("Index already exists")

# Turn a sentence into vectors


def vectorise_sent(sent: str):
    sent = re.sub(r"[^\w\s]", "", sent)
    words = sent.split(" ")
    vs = np.zeros((1*MODEL_DIM))
    for word in words:
        x = tf.constant([word])
        embeddings = EMBED(x)
        x = np.asarray(embeddings)
        vs = vs + x
    # Faster, and more likely to have "king-man+woman = queen" relationship
    vs = (vs / len(words)).tolist()
    return vs[0]


def import_data_with_knn(index_name=INDEX_NAME):
    print("Initialising KNN indexes...")
    init_knn_es_index(index_name)
    print("Complete", "Loading data...")
    data_list = json.loads(open("../minitask/result.json").read())
    print("Complete")

    for i in range(len(data_list)):
        data = data_list[i]
        link = data["link"]
        title = data["title"]
        title_v = vectorise_sent(data["title"])
        article = data["art"]
        summary = summary_func.body_summary(article)
        ner_list = name_entity.recognize_name_entity(summary)
        art_v = vectorise_sent(data["art"])
        ES.create(index=index_name, body={"title_v": title_v, "title": title, "art_v": art_v, "art": article,
                                          "link": link, "summary": summary, "ner_list": ner_list}, id=i)
        print(i, "inserted:", title)

    print("Insert Completed")


def knn_query(query: str, index_name=INDEX_NAME):
    global ES
    title_v = vectorise_sent(query)
    search_body = {
        "query": {
            "knn": {
                "art_v": {
                    "vector": title_v,
                    "k": 10
                }
            }
        }
    }
    start = datetime.datetime.now()
    if not ES:
        print("Re-establishing Elasticsearch connection...")
        ES = Elasticsearch(URL, verify_certs=False, ssl_show_warn=False)
        print("Connection established")
    results = ES.search(index=index_name, body=search_body)
    return results


"""
Only support searching of one field. Either title_v or art_v. Could create a functionality of choosing search field
"""
"""
print("Test searching")
query = "airforce"
title_v = vectorise_sent(query)
search_body = {
    "query": {
        "knn": {
            "art_v": {
                "vector": title_v,
                "k": 10
            }
        }
    }
}
start = datetime.datetime.now()
results = es.search(index=index_name, body=search_body, filter_path=["hits.hits._source.title"])
duration = datetime.datetime.now() - start
print("Duration:", duration)
for result in results["hits"]["hits"]:
    print(result)
"""
if __name__ == "__main__":
    import_data_with_knn()
    knn_query("some")
