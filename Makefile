DOCKER_BUILD_NAME:=elasticsearch-ui
VUE_APP_PORT:=8080
FLASK_APP_PORT:=3001
GU_WORKER_COUNT:=4

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

deploy_flask:
	@gunicorn -w $(GU_WORKER_COUNT) -b 127.0.0.1:$(FLASK_APP_PORT) app:app

install_ansible:
	@apt update -y
	@apt install software-properties-common -y
	@apt-add-repository --yes --update ppa:ansible/ansible -y
	@apt install ansible -y