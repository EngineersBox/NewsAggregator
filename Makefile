DOCKER_BUILD_NAME:=elasticsearch-ui
VUE_APP_PORT:=8080
FLASK_APP_PORT:=3001
GU_WORKER_COUNT:=4

.PHONY: install compose_build compose_up compose_down install_ansible install_all create_indexes

install_all: install install_ansible

install:
	@python3.8 -m pip install --upgrade pip
	@python3.8 -m pip install --no-cache-dir -r requirements.txt
	@python3.8 -m spacy download en_core_web_sm
	@cd frontend && npm i

compose_build:
	@docker-compose build

compose_up:
	@docker-compose up -d

compose_down:
	@docker-compose down

install_ansible:
	@apt update -y
	@apt install software-properties-common -y
	@apt-add-repository -yu ppa:ansible/ansible
	@apt install ansible -y

create_indexes:
	@cd minitask && python3.8 import_data.py
