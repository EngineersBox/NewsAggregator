from collections import Counter
import en_core_web_trf

def recognize_name_entity(summary):
	nlp = en_core_web_trf.load()
	doc = nlp(summary)
	result = [(X.text, X.label_) for X in doc.ents]
	return result
