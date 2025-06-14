NAME = sarif_blockchain

SHELL = /bin/bash

${NAME}: all

all: start

build:
	@docker compose -f docker-compose.yml build

up: build
	@docker compose -f docker-compose.yml up -d

down:
	@docker compose -f docker-compose.yml down

start: up
	@docker compose -f docker-compose.yml start

stop:
	@docker compose -f docker-compose.yml stop

nuke: down
	@docker image rm ${DOCKER_IMG} || true

prune :
	@docker system prune -af

re: down all

rebuild: nuke
	make all

restart: stop start
