# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    Makefile                                           :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: fclivaz <fclivaz@student.42lausanne.ch>    +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2025/02/22 22:04:45 by fclivaz           #+#    #+#              #
#    Updated: 2025/03/04 21:08:14 by fclivaz          ###   LAUSANNE.ch        #
#                                                                              #
# **************************************************************************** #

NAME = sarif

DATADIR = data

${NAME}: all

all: start

build:
	mkdir -p ${DATADIR}
	docker-compose -p ${NAME} -f ./docker/docker-compose.yml build

up: build
	docker-compose -p ${NAME} -f ./docker/docker-compose.yml up -d

down:
	docker-compose -p ${NAME} -f ./docker/docker-compose.yml down -v
	rm -rf ${DATADIR}

start: up
	mkdir -p ${DATADIR}
	docker-compose -p ${NAME} -f ./docker/docker-compose.yml start

stop:
	docker-compose -p ${NAME} -f ./docker/docker-compose.yml stop

status:
	docker ps -a

network:
	docker network ls

prune:
	docker system prune -af

nuke: down prune
	rm -rf ${DATADIR}

re: nuke
	make all
