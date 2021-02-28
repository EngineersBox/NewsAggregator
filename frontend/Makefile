DOCKER_BUILD_NAME:=elasticsearch-ui
VUE_APP_PORT:=8080

build_docker_ui:
	@docker build -t vuejs-cookbook/dockerize-vuejs-app . && docker run -it -p 8080:8080 --rm --name $(DOCKER_BUILD_NAME) vuejs-cookbook/dockerize-vuejs-app

start_docker_ui:
	@docker run -it -p $(VUE_APP_PORT):$(VUE_APP_PORT) --rm --name $(DOCKER_BUILD_NAME) vuejs-cookbook/dockerize-vuejs-app && open http://localhost:$(VUE_APP_PORT)
