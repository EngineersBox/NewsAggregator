from pysummarization.nlpbase.auto_abstractor import AutoAbstractor
from pysummarization.tokenizabledoc.simple_tokenizer import SimpleTokenizer
from pysummarization.abstractabledoc.top_n_rank_abstractor import TopNRankAbstractor

def body_summary(document_string):
	# Object of automatic summarization.
	auto_abstractor = AutoAbstractor()
	# Set tokenizer.
	auto_abstractor.tokenizable_doc = SimpleTokenizer()
	# Set delimiter for making a list of sentence.
	auto_abstractor.delimiter_list = [".", "\n"]
	# Object of abstracting and filtering document.
	abstractable_doc = TopNRankAbstractor()
	# Summarize document.
	result_dict = auto_abstractor.summarize(document_string, abstractable_doc)

	return result_dict["summarize_result"]
