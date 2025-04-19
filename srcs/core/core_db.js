// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   core_db.js                                         :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: fclivaz <fclivaz@student.42lausanne.ch>    +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/04/18 22:04:35 by fclivaz           #+#    #+#             //
//   Updated: 2025/04/19 02:01:58 by fclivaz          ###   LAUSANNE.ch       //
//                                                                            //
// ************************************************************************** //

import Axios from 'axios'

export async function dbget(fastify) {
	fastify.get('/db', function handler(request, reply) {

	let stmt = Axios.create({
		url: "/",
		baseURL: "http://sarif_db:3000",
		headers: {
			'Content-Type': 'application/json',
			'api_key' : process.env.API_KEY,
			'table': request.headers["table"],
			'field': request.headers["field"],
			'query': request.headers["query"]
		}
	})

	stmt.get("http://sarif_db:3000/", JSON.stringify(request.body))
		.then(function (response) {
			return reply.code(response.status).send(JSON.stringify(response.data))
		})
		.catch(function (error) {
			console.log(error)
			return reply.code(error.status).send(error.data)
		})

	})
}


export async function dbpost(fastify) {
	fastify.post('/db', function handler(request, reply) {

	let stmt = Axios.create({
			url: "/",
			baseURL: "http://sarif_db:3000",
			headers: {
				'Content-Type': 'application/json',
				'api_key' : process.env.API_KEY,
				'table': request.headers["table"]
			},
		})

	stmt.post("http://sarif_db:3000/", JSON.stringify(request.body))
		.then(function (response) {
			return reply.code(response.status).send(JSON.stringify(response.data))
		})
		.catch(function (error) {
			console.log(error)
			return reply.code(error.status).send(error.data)
		})
	})
}
