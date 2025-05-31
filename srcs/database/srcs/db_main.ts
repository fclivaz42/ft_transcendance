// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   db_main.ts                                         :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: fclivaz <fclivaz@student.42lausanne.ch>    +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/03/05 19:04:37 by fclivaz           #+#    #+#             //
//   Updated: 2025/05/26 20:30:05 by fclivaz          ###   LAUSANNE.ch       //
//                                                                            //
// ************************************************************************** //

import { init_db } from "./db_methods.ts"
import { tables } from "./db_vars.ts"
import RequestHandler from "./db_helpers.ts"
import Fastify from 'fastify'
import type * as fft from 'fastify'

if (process.env.API_KEY === undefined ||
	process.env.DBLOCATION === undefined ||
	process.env.FILELOCATION === undefined ||
	process.env.RUNMODE === undefined) {
	console.error("At least one of the necessary variables to run this program isn't set:",
		process.env.API_KEY === undefined ? "API_KEY" : "",
		process.env.DBLOCATION === undefined ? "DBLOCATION" : "",
		process.env.FILELOCATION === undefined ? "FILELOCATION" : "",
		process.env.RUNMODE === undefined ? "RUNMODE" : ""
	)
	process.exit(1)
}

let status = init_db()

if (process.env.RUNMODE === "debug")
	console.log(process.env.API_KEY)

const fastify = Fastify({
	logger: process.env.RUNMODE === "debug" ? true : false
})

const methods = ["GET", "POST", "DELETE", "PUT"]

for (const method of methods) {
	for (const item in tables) {
		if (tables[item].Methods.indexOf(method) > -1) {
			fastify.register(async function tophandler(fastify: fft.FastifyInstance) {
				fastify[method.toLowerCase()](`/${tables[item].Name}`, async function handler(request: fft.FastifyRequest, reply: fft.FastifyReply) {
					RequestHandler[method.toLowerCase()](request, reply, tables[item].Name, tables[item].Fields)
				})
			})
		}
	}
}

status.then(
	function(value) {
		console.log("Database successfully initialized: ", value)
	},
	function(error) {
		console.error("Could not initialize database!", error)
		process.exit(1);
	}
)

fastify.listen({ port: 3000, host: '::' }, (err) => {
	if (err) {
		fastify.log.error(err)
		process.exit(1)
	}
})
