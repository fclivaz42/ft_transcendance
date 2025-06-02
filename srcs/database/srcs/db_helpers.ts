// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   db_helpers.ts                                      :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: fclivaz <fclivaz@student.42lausanne.ch>    +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/04/21 21:57:13 by fclivaz           #+#    #+#             //
//   Updated: 2025/06/01 19:49:27 by fclivaz          ###   LAUSANNE.ch       //
//                                                                            //
// ************************************************************************** //

import DatabaseWorker from "./db_methods.ts"
import Axios from "axios"
import type * as atype from "axios"
import type * as fft from 'fastify'
import { randomUUID } from "node:crypto"

function check_request_format(headers: object, method: string) {
	if (!headers["api_key"])
		throw { code: 401, string: "error.missing.api_key" }
	if (headers["api_key"] !== process.env.API_KEY)
		throw { code: 401, string: "error.invalid.api_key" }
	if ((method === "POST" || method === "PUT") && headers["content-type"] !== "application/json")
		throw { code: 400, string: "error.invalid.content-type" }
}

function get_del_db(request: fft.FastifyRequest, reply: fft.FastifyReply, table: string, table_fields: Array<string>) {
	let response: object;
	try {
		check_request_format(request.headers, request.method)
		if (!request.headers["field"])
			throw { code: 400, string: "error.missing.field" }
		if (table_fields.indexOf(request.headers["field"] as string) == -1)
			throw { code: 400, string: "error.invalid.field" }
		if (!request.headers["query"])
			throw { code: 400, string: "error.missing.query" }
		response = DatabaseWorker[request.method.toLowerCase()](table, request.headers["field"], request.headers["query"]);
	} catch (exception) {
		if (typeof exception.code === "string")
			return reply.code(500).send(exception.code)
		return reply.code(exception.code).send(exception.string)
	}
	return reply.code(request.method.toLowerCase() === "get" ? 200 : 202).send(response)
}

function create_new_uid(request: fft.FastifyRequest, reply: fft.FastifyReply, table: string, table_fields: Array<string>) {
	try {
		check_request_format(request.headers, request.method)
		var generated_uid: string = randomUUID();
		while (DatabaseWorker.check_uid(table, table_fields[0], generated_uid))
			generated_uid = randomUUID();
	} catch (exception) {
		return reply.code(exception.code).send(exception.string)
	}
	return reply.code(200).send(generated_uid)
}

function check_contract(request: fft.FastifyRequest, reply: fft.FastifyReply, table: string, table_fields: Array<string>) {
	const tamer: atype.AxiosInstance = Axios.create({
		method: "post",
		baseURL: "http://sarif_blockchain:8080",
		headers: {
			'Content-Type': 'application/json',
			'api_key': process.env.API_KEY,
		}
	});
	tamer.post("/deploy", "")
		.then(function(response: atype.AxiosResponse) {
			console.log(`yippie ${response.data}`)
			return reply.code(response.status).send(JSON.stringify(response.data))
		})
		.catch(function(error: atype.AxiosError) {
			console.log(error)
		})
}

export default class RequestHandler {
	private constructor() { }

	static get(request: fft.FastifyRequest, reply: fft.FastifyReply, table: string, table_fields: Array<string>) {
		return get_del_db(request, reply, table, table_fields)
	}

	static delete(request: fft.FastifyRequest, reply: fft.FastifyReply, table: string, table_fields: Array<string>) {
		return get_del_db(request, reply, table, table_fields)
	}

	static post(request: fft.FastifyRequest, reply: fft.FastifyReply, table: string, table_fields: Array<string>) {
		if (table === "UIDTable")
			return create_new_uid(request, reply, table, table_fields)
		if (table === "CurrentContract")
			return check_contract(request, reply, table, table_fields)
		const body = request.body as object;
		let response: string;
		try {
			check_request_format(request.headers, request.method)
			response = DatabaseWorker.post(table, table_fields, body)
		} catch (exception) {
			return reply.code(exception.code).send(exception.string)
		}
		return reply.code(201).send(response)
	}
	static put(request: fft.FastifyRequest, reply: fft.FastifyReply, table: string, table_fields: Array<string>) {
		let response: object;
		const body = request.body as object;
		try {
			check_request_format(request.headers, request.method)
			if (body[table_fields[0]] === undefined)
				throw { code: 400, string: "error.missing.uuid" }
			response = DatabaseWorker.put(table, table_fields, body);
		} catch (exception) {
			return reply.code(exception.code).send(exception.string)
		}
		return reply.code(205).send(response)
	}
}
