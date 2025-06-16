// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   db_helpers.ts                                      :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: fclivaz <fclivaz@student.42lausanne.ch>    +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/04/21 21:57:13 by fclivaz           #+#    #+#             //
//   Updated: 2025/06/13 21:15:40 by fclivaz          ###   LAUSANNE.ch       //
//                                                                            //
// ************************************************************************** //

import DatabaseWorker from "./db_methods.ts"
import Axios from "axios"
import type * as at from "axios"
import type * as fft from 'fastify'
import { randomUUID } from "node:crypto"

//
// Basic checks (eg. API-KEY, Content-Type, etc)
//

function check_request_format(headers: object, method: string, params: object) {
	if (!headers["authorization"])
		throw { code: 401, string: "error.missing.authorization" }
	if (headers["authorization"] !== process.env.API_KEY)
		throw { code: 401, string: "error.invalid.authorization" }
	if ((method === "POST" || method === "PUT") && headers["content-type"] !== "application/json")
		throw { code: 400, string: "error.invalid.content-type" }
	if (JSON.stringify(params) === "{}")
		return;
	if (params[Object.keys(params)[0]] === "")
		throw { code: 400, string: "error.empty.params" }
}

//
// GET and DELETE are so goddamn similar i just threw them in the same boat. Easier to maintain i guess.
//

function get_del_db(request: fft.FastifyRequest, reply: fft.FastifyReply, table: string, table_fields: Array<string>) {
	let response: object;
	const params: object = request.params as object
	try {
		check_request_format(request.headers, request.method, params)
		response = DatabaseWorker[request.method.toLowerCase()](table, Object.keys(params)[0], params[Object.keys(params)[0]]);
	} catch (exception) {
		if (typeof exception.code === "string")
			return reply.code(500).send(exception.code)
		return reply.code(exception.code).send(exception.string)
	}
	return reply.code(request.method.toLowerCase() === "get" ? 200 : 202).send(response)
}

//
// Check if the SmartContract already exists in the database.
// If it isnt, it can only mean that it was not generated!
// So we kindly ask the blockchain module to do it and we then store it inside of the CurrentContract table.
//

async function check_contract(request: fft.FastifyRequest, reply: fft.FastifyReply, table: string, table_fields: Array<string>) {
	const resp: object | undefined = DatabaseWorker.get_contract(table);
	if (resp !== undefined) {
		return reply.code(200).send(resp[table_fields[0]]);
	}
	const tamer: at.AxiosInstance = Axios.create({
		method: "post",
		baseURL: "http://sarif_blockchain:8080",
		headers: {
			'Content-Type': 'application/json',
			'Authorization': process.env.API_KEY,
		}
	});
	await tamer.post("/deploy", "")
		.then(function(response: at.AxiosResponse) {
			const obj = {};
			obj[table_fields[0]] = response.data;
			DatabaseWorker.post(table, table_fields, obj)
			return reply.code(response.status).send(response.data)
		})
		.catch(function(error: at.AxiosError) {
			console.log(error)
			return reply.code(500).send("error.contract.deployment")
		})
}

//
// This static, non-instantiable class allows for the procedural route generation.
// Its functions are lower-cased methods, each one doing basic checks or some parsing before
// sending it all the the actual DatabaseWorker, which will handle the SQL. Allows to
// break things like checks and whatnot into more maintainable functions.
//

export default class RequestHandler {
	private constructor() { }

	static async get(request: fft.FastifyRequest, reply: fft.FastifyReply, table: string, table_fields: Array<string>) {
		return get_del_db(request, reply, table, table_fields)
	}

	static async delete(request: fft.FastifyRequest, reply: fft.FastifyReply, table: string, table_fields: Array<string>) {
		return get_del_db(request, reply, table, table_fields)
	}

	static async post(request: fft.FastifyRequest, reply: fft.FastifyReply, table: string, table_fields: Array<string>) {
		if (table === "CurrentContract")
			return await check_contract(request, reply, table, table_fields)
		const body = request.body as object;
		const params: object = request.params as object
		let response: string;
		try {
			check_request_format(request.headers, request.method, params)
			response = DatabaseWorker.post(table, table_fields, body)
		} catch (exception) {
			return reply.code(exception.code).send(exception.string)
		}
		return reply.code(201).send(response)
	}
	static async put(request: fft.FastifyRequest, reply: fft.FastifyReply, table: string, table_fields: Array<string>) {
		let response: object;
		const body = request.body as object;
		const params: object = request.params as object
		try {
			check_request_format(request.headers, request.method, params)
			response = DatabaseWorker.put(table, table_fields, body, Object.keys(params)[0], params[Object.keys(params)[0]]);
		} catch (exception) {
			return reply.code(exception.code).send(exception.string)
		}
		return reply.code(205).send(response)
	}
}
