// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   db_checks.js                                       :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: fclivaz <fclivaz@student.42lausanne.ch>    +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/04/21 21:57:13 by fclivaz           #+#    #+#             //
//   Updated: 2025/04/23 18:40:01 by fclivaz          ###   LAUSANNE.ch       //
//                                                                            //
// ************************************************************************** //

function check_request_format(headers, method) {
	if (!headers["api_key"])
		throw { code: 401, string: "error.missing.api_key" }
	if (headers["api_key"] !== process.env.API_KEY)
		throw { code: 401, string: "error.invalid.api_key" }
	if ((method === "POST" || method === "PUT") && headers["content-type"] !== "application/json")
		throw { code: 400, string: "error.invalid.content-type" }
}

export function get_db(request, reply, table, table_fields) {
		let response;
		try {
			check_request_format(request.headers, request.method)
			if (!request.headers["field"])
				throw { code: 400, string: "error.missing.field" }
			if (table_fields.indexOf(request.headers["field"]) == -1)
				throw { code: 400, string: "error.invalid.field" }
			if (!request.headers["query"])
				throw { code: 400, string: "error.missing.query" }
			response = dbget(table[1], request.headers["field"], request.headers["query"]);
			if (response === undefined)
				throw { code: 404, string: "error.value.notfound" }
		} catch (exception) {
			if (typeof exception.code === "string")
				return reply.code(500).send(exception.code)
			return reply.code(exception.code).send(exception.string)
		}
		return reply.code(200).send(response)
}

export function check_post(headers, method, body) {
	check_request_format(headers, method)
}
