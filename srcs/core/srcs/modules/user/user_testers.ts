// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   db_testers.js                                      :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: fclivaz <fclivaz@student.42lausanne.ch>    +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/05/12 23:02:45 by fclivaz           #+#    #+#             //
//   Updated: 2025/05/14 13:48:03 by fclivaz          ###   LAUSANNE.ch       //
//                                                                            //
// ************************************************************************** //

import Axios from 'axios'
import * as crypto from 'crypto';

export async function test_get(request, reply) {
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
}

export async function test_post(request, reply) {
	let stmt = Axios.create({
		url: "/Players",
		baseURL: "http://sarif_db:3000",
		headers: {
			'Content-Type': 'application/json',
			'api_key': process.env.API_KEY
		}
	})
	crypto.randomBytes(64, (err, buf) => {
		if (err) throw err;
		const salt = buf.toString('base64')
		crypto.scrypt(request.body["Password"], salt, 64, (err, derivedKey) => {
			if (err) throw err;
			const object = {
				'PlayerID': crypto.randomUUID(),
				'DisplayName': request.body["DisplayName"],
				'PassHash': salt + "$$" + derivedKey.toString('base64'),
				'EmailAddress': request.body["EmailAddress"],
				'PhoneNumber': request.body["PhoneNumber"],
				'RealName': request.body["RealName"],
				'Surname': request.body["Surname"],
				'Bappy': request.body["Bappy"],
				'Admin': 0,
				'ActiveTokens': 'NULL'
			}
			stmt.post("http://sarif_db:3000/Players", JSON.stringify(object))
				.then(function(response) {
					return reply.code(response.status).send(JSON.stringify(response.data))
				})
				.catch(function(error) {
					console.log(error)
					return reply.code(error.status).send(error.data)
				})
		})
	})
}

export async function test_delete(request, reply) {
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
}

export async function test_put(request, reply) {
	const plaintext = "ftgilkay"

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
		'PassHash': "bcrypt.hashSync(plaintext, salt)",
		'EmailAddress': 'fclivaz@pm.me'
	}))
		.then(function(response) {
			return reply.code(response.status).send(JSON.stringify(response.data))
		})
		.catch(function(error) {
			console.log(error)
			return reply.code(error.status).send(error.data)
		})
}
