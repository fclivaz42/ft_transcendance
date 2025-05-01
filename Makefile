# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    Makefile                                           :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: fclivaz <fclivaz@student.42lausanne.ch>    +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2025/02/22 22:04:45 by fclivaz           #+#    #+#              #
#    Updated: 2025/05/01 02:29:44 by fclivaz          ###   LAUSANNE.ch        #
#                                                                              #
# **************************************************************************** #

NAME = sarif

DATADIR = data

SHELL = /bin/bash

GENERATOR = dd if=/dev/random of=/dev/stdout bs=256 count=1 2>/dev/null | base64 | tr -d '\n'

${NAME}: all

all: start

build:
	mkdir -p ${DATADIR}
	docker-compose -p ${NAME} -f ./srcs/docker-compose.yml build

up: build
	API_KEY="$$($(GENERATOR))" docker-compose -p ${NAME} -f ./srcs/docker-compose.yml up -d

down:
	docker-compose -p ${NAME} -f ./srcs/docker-compose.yml down -v

start: up
	mkdir -p ${DATADIR}
	docker-compose -p ${NAME} -f ./srcs/docker-compose.yml start

stop:
	docker-compose -p ${NAME} -f ./srcs/docker-compose.yml stop

status:
	docker ps -a

network:
	docker network ls

prune:
	docker system prune -af

nuke: down prune
	rm -rf ${DATADIR}

re: down all

rebuild: nuke
	make all

restart: stop start
