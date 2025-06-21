// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   db_main.ts                                         :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: fclivaz <fclivaz@student.42lausanne.ch>    +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/03/05 19:04:37 by fclivaz           #+#    #+#             //
//   Updated: 2025/06/20 22:08:05 by fclivaz          ###   LAUSANNE.ch       //
//                                                                            //
// ************************************************************************** //

import { add_default_user, check_contract, init_db } from "./db_startup.ts"
import { tables } from "./db_vars.ts"
import RequestHandler from "./db_helpers.ts"
import fs from "node:fs"
import Fastify from 'fastify'
import fastifyStatic from '@fastify/static'
import multipart from '@fastify/multipart'
import type * as fft from 'fastify'
import { extra_routes } from "./db_extras.ts"

//
// Check if the necessary environment variables are set.
// Exit if any is missing.
//

if (process.env.API_KEY === undefined ||
	process.env.DBLOCATION === undefined ||
	process.env.FILELOCATION === undefined ||
	process.env.ADMIN_NAME === undefined ||
	process.env.ADMIN_PASSWORD === undefined ||
	process.env.RUNMODE === undefined) {
	console.error("At least one of the necessary variables to run this program isn't set:",
		process.env.API_KEY === undefined ? "API_KEY" : "",
		process.env.DBLOCATION === undefined ? "DBLOCATION" : "",
		process.env.FILELOCATION === undefined ? "FILELOCATION" : "",
		process.env.ADMIN_NAME === undefined ? "ADMIN_NAME" : "",
		process.env.ADMIN_PASSWORD === undefined ? "ADMIN_PASSWORD" : "",
		process.env.RUNMODE === undefined ? "RUNMODE" : ""
	)
	process.exit(1)
}

//
// Asynchronously start the database creation/checks.
//

let status = init_db()

fs.mkdir(process.env.FILELOCATION, { recursive: true, mode: 0o700 }, (err) => {
	if (err) {
		console.dir(err)
		process.exit(1)
	}
})

if (process.env.RUNMODE === "debug")
	console.log(process.env.API_KEY)

const fastify = Fastify({
	logger: process.env.RUNMODE === "debug" ? true : false
})

fastify.register(multipart)
fastify.register(fastifyStatic, {
	root: process.env.FILELOCATION
});

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
				if (process.env.RUNMODE === "debug")
					console.log(`registered ${method} /${tables[item].Name}${route}`)
			}
		}
	}
}

fastify.register(extra_routes)

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

// WARN: UNCOMMENT ONCE WORKING WITH BLOCKCHAIN
// check_contract()

//
// Aaaand start!
//

fastify.listen({ port: 3000, host: '::' }, (err) => {
	if (err) {
		fastify.log.error(err)
		process.exit(1)
	}
})
