// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   core_db.js                                         :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: fclivaz <fclivaz@student.42lausanne.ch>    +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/04/18 22:04:35 by fclivaz           #+#    #+#             //
//   Updated: 2025/05/01 03:48:16 by fclivaz          ###   LAUSANNE.ch       //
//                                                                            //
// ************************************************************************** //

import Axios from 'axios'
import { v4 as uuidv4 } from 'uuid'
import bcrypt from 'bcrypt'

export async function dbget(fastify) {
	fastify.get('/dbp', function handler(request, reply) {

		let stmt = Axios.create({
			url: "/Players",
			baseURL: "http://sarif_db:3000",
			headers: {
				'Content-Type': 'application/json',
				'api_key': process.env.API_KEY,
				'field': "DisplayName",
				'query': "Bropler"
			}
		})

		stmt.get("http://sarif_db:3000/Players", JSON.stringify(request.body))
			.then(function(response) {
				return reply.code(response.status).send(JSON.stringify(response.data))
			})
			.catch(function(error) {
				console.log(error)
				return reply.code(error.status).send(error.data)
			})

	})
}

export async function dbpost(fastify) {
	fastify.post('/dbp', function handler(request, reply) {
		const plaintext = "mot2pass2ouf"
		const salt = bcrypt.genSaltSync(15)

		let stmt = Axios.create({
			url: "/Players",
			baseURL: "http://sarif_db:3000",
			headers: {
				'Content-Type': 'application/json',
				'api_key': process.env.API_KEY
			}
		})

		stmt.post("http://sarif_db:3000/Players", JSON.stringify({
			'PlayerID': uuidv4(),
			'DisplayName': "Bropler",
			'PassHash': bcrypt.hashSync(plaintext, salt),
			'EmailAddress': 'fclivaz@email.com',
			'PhoneNumber': '0123456789',
			'RealName': 'Fabos',
			'Surname': 'L\'éclatos',
			'Bappy': 186253162,
			'Admin': 0,
			'ActiveTokens': 'NULL'
		}))
			.then(function(response) {
				return reply.code(response.status).send(JSON.stringify(response.data))
			})
			.catch(function(error) {
				console.log(error)
				return reply.code(error.status).send(error.data)
			})
	})
}

export async function dbdel(fastify) {
	fastify.delete('/dbp', function handler(request, reply) {

		let stmt = Axios.create({
			url: "/Matches",
			baseURL: "http://sarif_db:3000",
			headers: {
				'api_key': process.env.API_KEY,
				'field': "DisplayName",
				'query': "Broller"
			}
		})

		stmt.delete("http://sarif_db:3000/Matches")
			.then(function(response) {
				return reply.code(response.status).send(JSON.stringify(response.data))
			})
			.catch(function(error) {
				console.log(error)
				return reply.code(error.status).send(error.data)
			})

	})
}

export async function dbput(fastify) {
	fastify.put('/dbp', function handler(request, reply) {
		const plaintext = "ftgilkay"
		const salt = bcrypt.genSaltSync(15)

		let stmt = Axios.create({
			url: "/Players",
			baseURL: "http://sarif_db:3000",
			headers: {
				'Content-Type': 'application/json',
				'api_key': process.env.API_KEY,
				'field': "DisplayName",
				'query': "Bropler"
			}
		})

		stmt.put("http://sarif_db:3000/Players", JSON.stringify({
			'PlayerID': 'ee390171-1bcd-4b58-9780-ef4ef9f49e65',
			'DisplayName': "Broller",
			'PassHash': bcrypt.hashSync(plaintext, salt),
			'EmailAddress': 'fclivaz@pm.me'
		}))
			.then(function(response) {
				return reply.code(response.status).send(JSON.stringify(response.data))
			})
			.catch(function(error) {
				console.log(error)
				return reply.code(error.status).send(error.data)
			})

	})
}
