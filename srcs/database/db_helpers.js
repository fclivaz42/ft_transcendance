// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   db_helpers.js                                      :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: fclivaz <fclivaz@student.42lausanne.ch>    +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/04/21 21:57:13 by fclivaz           #+#    #+#             //
//   Updated: 2025/04/30 02:15:59 by fclivaz          ###   LAUSANNE.ch       //
//                                                                            //
// ************************************************************************** //

import DatabaseWorker from "./db_methods.js"

function check_request_format(headers, method) {
	if (!headers["api_key"])
		throw { code: 401, string: "error.missing.api_key" }
	if (headers["api_key"] !== process.env.API_KEY)
		throw { code: 401, string: "error.invalid.api_key" }
	if ((method === "POST" || method === "PUT") && headers["content-type"] !== "application/json")
		throw { code: 400, string: "error.invalid.content-type" }
}

function get_del_db(request, reply, table, table_fields, op) {
	let response;
	try {
		check_request_format(request.headers, request.method)
		if (!request.headers["field"])
			throw { code: 400, string: "error.missing.field" }
		if (table_fields.indexOf(request.headers["field"]) == -1)
			throw { code: 400, string: "error.invalid.field" }
		if (!request.headers["query"])
			throw { code: 400, string: "error.missing.query" }
		response = DatabaseWorker[op](table, request.headers["field"], request.headers["query"]);
	} catch (exception) {
		if (typeof exception.code === "string")
			return reply.code(500).send(exception.code)
		return reply.code(exception.code).send(exception.string)
	}
	return reply.code(op === "get" ? 200 : 202).send(response)
}

export class RequestHandler {
	constructor() { }

	static get(request, reply, table, table_fields) {
		return get_del_db(request, reply, table, table_fields, "get")
	}

	static delete(request, reply, table, table_fields) {
		return get_del_db(request, reply, table, table_fields, "del")
	}

	static post(request, reply, table, table_fields) {
		let response;
		try {
			check_request_format(request.headers, request.method)
			response = DatabaseWorker.post(table, table_fields, body)
		} catch (exception) {
			return reply.code(exception.code).send(exception.string)
		}
		return reply.code(201).send(response)
	}
	static put(request, reply, table, table_fields) {
		let response;
		try {
			check_request_format(request.headers, request.method)
			if (request.headers["table"] === "Matches")
				throw { code: 400, string: "error.static.table" }
			if (request.body["PlayerID"] === undefined)
				throw { code: 400, string: "error.missing.uuid" }
			if (db.prepare(`SELECT * FROM ? WHERE ? = ?`).get(table, table_fields[0], request.body[table_fields[0]]) === undefined)
				throw { code: 404, string: "error.invalid.uuid" }
			response = DatabaseWorker.put(table, table_fields, request.body);
		} catch (exception) {
			return reply.code(exception.code).send(exception.string)
		}
		return reply.code(205).send(response)
	}
}
