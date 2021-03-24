DOCKER_BUILD_NAME:=elasticsearch-ui
VUE_APP_PORT:=8080

install:
	@python3.8 -m pip install -r requirements.txt
	@python3.8 -m spacy download en_core_web_sm
	@cd frontend && npm i

build_docker_ui:
	@docker build -t vuejs-cookbook/dockerize-vuejs-app .

start_docker_ui:
	@docker run -p 3002:$(VUE_APP_PORT) -d --name $(DOCKER_BUILD_NAME) vuejs-cookbook/dockerize-vuejs-app

start_flask:
	@sh ./run_server.sh
