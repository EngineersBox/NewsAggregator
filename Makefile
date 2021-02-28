DOCKER_BUILD_NAME:=elasticsearch-ui
VUE_APP_PORT:=8080

install:
	@python3.8 -m pip install -r requirements.txt
	@python3.8 -m spacy download en_core_web_sm
	@cd frontend && npm i

build_docker_ui:
	@cd frontend && docker build -t vuejs-cookbook/dockerize-vuejs-app . && docker run -it -p 8080:8080 --rm --name $(DOCKER_BUILD_NAME) vuejs-cookbook/dockerize-vuejs-app

start_docker_ui:
	@cd frontend && docker run -it -p $(VUE_APP_PORT):$(VUE_APP_PORT) --rm --name $(DOCKER_BUILD_NAME) vuejs-cookbook/dockerize-vuejs-app && open http://localhost:$(VUE_APP_PORT)

start_flask:
	@sh ./run_server.sh