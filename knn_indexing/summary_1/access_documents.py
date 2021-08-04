import json
import summary
import name_entity

def main():
	x = json.loads(open ("../../result.json").read())
	test_art = x[1]['art']
	print(test_art)
	print("-----------------------------------------")
	t = summary.body_summary(test_art)
	tt = ""
	for i in t:
		tt += i
	name_entity.recognize_name_entity(tt)

if __name__ == "__main__":
    main()
