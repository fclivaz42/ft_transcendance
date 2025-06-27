// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   db_helpers.ts                                      :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: fclivaz <fclivaz@student.42lausanne.ch>    +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/04/21 21:57:13 by fclivaz           #+#    #+#             //
//   Updated: 2025/06/26 17:12:59 by fclivaz          ###   LAUSANNE.ch       //
//                                                                            //
// ************************************************************************** //

import DatabaseWorker from "./db_methods.ts"
import type * as fft from 'fastify'
import { randomBytes, scrypt } from "crypto"
import type { db_params } from "./db_main.ts"
import Logger from "../../libs/helpers/loggers.ts"
import { tables } from "./db_vars.ts"

//
// Basic checks (eg. API-KEY, Content-Type, etc)
//

export function check_request_format(headers: object, method: string, params: object) {
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

function convert_flist(player: object) {
	if (!player)
		return;
	if (!player[tables.Players.Fields[5]])
		return;
	if (typeof player[tables.Players.Fields[5]] === "string")
		player[tables.Players.Fields[5]] = JSON.parse(player[tables.Players.Fields[5]])
	else if (typeof player[tables.Players.Fields[5]] === "object")
		player[tables.Players.Fields[5]] = JSON.stringify(player[tables.Players.Fields[5]])
}

//
// GET and DELETE are so goddamn similar i just threw them in the same boat.
// Easier to maintain i guess.
//

function get_del_db(request: fft.FastifyRequest, reply: fft.FastifyReply, table: string, table_fields: Array<string>) {
	let response: object | Array<object>;
	const params: db_params = request.params as db_params
	const meth = request.method.toLowerCase()
	try {
		check_request_format(request.headers, request.method, params)
		const regex = new RegExp(`^/${table}\\/multiget$`)
		if (regex.test(request.url)) {
			response = DatabaseWorker.multiget(table, request.headers["field"] as string | undefined, request.headers["array"] as string | undefined) as Array<object>;
			for (const item of response as Array<object>)
				convert_flist(item)
		}
		else if (/^\/Matches\/PlayerID\//.test(request.url)) {
			response = DatabaseWorker.get_del(table, table_fields[1], params.PlayerID as string, "all")
			response = [...response as Array<object>, ...DatabaseWorker.get_del(table, table_fields[2], params.PlayerID as string, "all") as Array<object>];
			for (const item of response as Array<object>)
				convert_flist(item)
		}
		else {
			response = DatabaseWorker.get_del(table, Object.keys(params)[0], params[Object.keys(params)[0]], meth === "get" ? "get" : "run") as object;
			convert_flist(response)
		}
	} catch (exception) {
		if (typeof exception.code === "string")
			return reply.code(500).send(exception.code)
		return reply.code(exception.code).send(exception.string)
	}
	return reply.code(meth === "get" ? 200 : 202).send(response)
}

//
// Guess what. This function hashes a given password.
// Rocket science, eh?
//

export async function hash_password(password: string) {
	return new Promise((resolve, reject) => {
		if (password === "")
			resolve("");
		randomBytes(66, (err, buf) => {
			if (err) return reject(err);
			const salt = buf.toString('base64').substring(0, 64)
			if (process.env.RUNMODE === "debug")
				Logger.info(`Generated salt: ${salt}`)
			scrypt(password, salt, 66, (err, derivedKey) => {
				if (err) return reject(err);
				if (process.env.RUNMODE === "debug")
					Logger.info(`Generated hash: ${salt + derivedKey.toString('base64')}`)
				return resolve(salt + derivedKey.toString('base64'));
			})
		})
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
		const body = request.body as object;
		const params: db_params = request.params as db_params
		let response: object;
		try {
			if (table === "Players") {
				body["Password"] = await hash_password(body["Password"])
				body["Admin"] = 0;
			}
			check_request_format(request.headers, request.method, params)
			convert_flist(body)
			response = DatabaseWorker.post(table, table_fields, body)
		} catch (exception) {
			if (typeof exception.code === "number")
				return reply.code(exception.code).send(exception.string)
			return reply.code(500).send(exception)
		}
		convert_flist(response)
		return reply.code(201).send(response)
	}
	static async put(request: fft.FastifyRequest, reply: fft.FastifyReply, table: string, table_fields: Array<string>) {
		let response: object;
		const body = request.body as object;
		const params: db_params = request.params as db_params
		try {
			if (table === "Players" && body["Password"] !== undefined)
				body["Password"] = await hash_password(body["Password"])
			check_request_format(request.headers, request.method, params)
			convert_flist(body)
			response = DatabaseWorker.put(table, table_fields, body, Object.keys(params)[0], params[Object.keys(params)[0]]);
		} catch (exception) {
			if (typeof exception.code === "number")
				return reply.code(exception.code).send(exception.string)
			return reply.code(500).send(exception)
		}
		convert_flist(response)
		return reply.code(205).send(response)
	}
}
