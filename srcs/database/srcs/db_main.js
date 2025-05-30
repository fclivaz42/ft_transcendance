// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   db_main.js                                         :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: fclivaz <fclivaz@student.42lausanne.ch>    +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/03/05 19:04:37 by fclivaz           #+#    #+#             //
//   Updated: 2025/04/30 18:40:24 by fclivaz          ###   LAUSANNE.ch       //
//                                                                            //
// ************************************************************************** //

import { init_db } from "./db_methods.js"
import { tables } from "./db_vars.js"
import RequestHandler from "./db_helpers.js"
import Fastify from 'fastify'

const fastify = Fastify({
	logger: process.env.RUNMODE === "debug" ? true : false
})

const methods = ["GET", "POST", "DELETE", "PUT"]

init_db()

if (process.env.RUNMODE === "debug")
	console.log(process.env.API_KEY)

for (const method of methods) {
	for (const item in tables) {
		if (tables[item].Methods.indexOf(method) > -1) {
			fastify.register(function tophandler(fastify) {
				fastify[method.toLowerCase()](`/${tables[item].Name}`, function handler(request, reply) {
					RequestHandler[method.toLowerCase()](request, reply, tables[item].Name, tables[item].Fields)
				})
			})
		}
	}
}

fastify.listen({ port: 3000, host: '::' }, (err) => {
	if (err) {
		fastify.log.error(err)
		process.exit(1)
	}
})
