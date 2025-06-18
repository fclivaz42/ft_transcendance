// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   db_main.ts                                         :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: fclivaz <fclivaz@student.42lausanne.ch>    +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/03/05 19:04:37 by fclivaz           #+#    #+#             //
//   Updated: 2025/06/18 23:59:11 by fclivaz          ###   LAUSANNE.ch       //
//                                                                            //
// ************************************************************************** //

import { add_default_user, init_db } from "./db_methods.ts"
import { tables } from "./db_vars.ts"
import RequestHandler from "./db_helpers.ts"
import Fastify from 'fastify'
import type * as fft from 'fastify'

//
// Check if the necessary environment variables are set.
// Exit if any is missing.
//

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

//
// Asynchronously start the database creation/checks.
//

let status = init_db()

if (process.env.RUNMODE === "debug")
	console.log(process.env.API_KEY)

const fastify = Fastify({
	logger: process.env.RUNMODE === "debug" ? true : false
})

//
// Okay, here we go.
// For each available method, procedurally construct a route with such method named after the table.
// The methods supported by the table are defined in db_vars.ts. If the method is defined, register the Fastifty plugin creating the route.
// Example: if Players supports a GET and DELETE request, this will create both "POST /Players" and "DELETE /Players" automatically.
// The function executed is then defined through RequestHandler which will then take the Fastify request as well as
// the table's name and available columns as arguments.
// Any actual work and differentiation should be made in RequestHandler.
//

const methods = ["GET", "POST", "DELETE", "PUT"]

for (const method of methods) {
	for (const item in tables) {
		if (tables[item].Methods[method] !== undefined) {
			for (const route of tables[item].Methods[method]) {
				fastify.register(async function tophandler(fastify: fft.FastifyInstance) {
					fastify[method.toLowerCase()]<{ Params: object }>(`/${tables[item].Name}${route}`, async function handler(request: fft.FastifyRequest, reply: fft.FastifyReply) {
						await RequestHandler[method.toLowerCase()](request, reply, tables[item].Name, tables[item].Fields)
					})
				})
				console.log(`registered ${method} /${tables[item].Name}${route}`)
			}
		}
	}
}

import { passck_route } from "./db_extras.ts"

fastify.register(passck_route)

//
// Now that the funky freestyle procedural route generation is over, check the status of the database creation/checks.
//

status.then(
	function(value) {
		console.log("Database successfully initialized: ", value)
	},
	function(error) {
		console.error("Could not initialize database!", error)
		process.exit(1);
	}
)

if (await add_default_user())
	console.log("Default user added/updated.")
else
	console.error("Could not create user!")

//
// Aaaand start!
//

fastify.listen({ port: 3000, host: '::' }, (err) => {
	if (err) {
		fastify.log.error(err)
		process.exit(1)
	}
})
