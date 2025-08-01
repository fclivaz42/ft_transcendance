// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   db_main.ts                                         :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: fclivaz <fclivaz@student.42lausanne.ch>    +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/03/05 19:04:37 by fclivaz           #+#    #+#             //
//   Updated: 2025/07/05 23:31:15 by fclivaz          ###   LAUSANNE.ch       //
//                                                                            //
// ************************************************************************** //

import { betterFastify, fastifyLogger } from "../../libs/helpers/fastifyHelper.ts";
import Logger from "../../libs/helpers/loggers.ts";
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

if (!process.env.API_KEY ||
	!process.env.DBLOCATION ||
	!process.env.FILELOCATION ||
	!process.env.ADMIN_NAME ||
	!process.env.ADMIN_PASSWORD ||
	!process.env.RUNMODE) {
	console.error("At least one of the necessary variables to run this program isn't set:",
		!process.env.API_KEY ? "API_KEY" : "",
		!process.env.DBLOCATION ? "DBLOCATION" : "",
		!process.env.FILELOCATION ? "FILELOCATION" : "",
		!process.env.ADMIN_NAME ? "ADMIN_NAME" : "",
		!process.env.ADMIN_PASSWORD ? "ADMIN_PASSWORD" : "",
		!process.env.RUNMODE ? "RUNMODE" : ""
	)
	process.exit(1)
}

//
// Asynchronously start the database creation/checks.
//

let status = init_db()

fs.mkdir(process.env.FILELOCATION, { recursive: true, mode: 0o755 }, (err) => {
	if (err) {
		console.dir(err)
		process.exit(1)
	}
})

if (process.env.RUNMODE === "debug")
	Logger.info(process.env.API_KEY)

if (!process.env.KEY_PATH ||
	!process.env.CERT_PATH) {
		throw new Error("KEY_PATH and CERT_PATH environment variables must be set to run the server with HTTPS.");
	}

const fastify = Fastify({
	logger: false,
	https: {
		key: fs.readFileSync(process.env.KEY_PATH),
		cert: fs.readFileSync(process.env.CERT_PATH)
	}
})

betterFastify(fastify);

fastify.register(multipart, {
	limits: {
		fileSize: 8 * 1024 * 1024
	}
})
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

export interface db_params {
	PlayerID?: string,
	OAuthID?: string,
	MatchID?: string,
	TournamentID?: string,
	DisplayName?: string,
	EmailAddress?: string,
}

for (const method of methods) {
	for (const item in tables) {
		if (tables[item].Methods[method] !== undefined) {
			for (const route of tables[item].Methods[method]) {
				fastify.register(async function tophandler(fastify: fft.FastifyInstance) {
					fastify[method.toLowerCase()]<{ Params: db_params }>(`/${tables[item].Name}${route}`, async function handler(request: fft.FastifyRequest, reply: fft.FastifyReply) {
						await RequestHandler[method.toLowerCase()](request, reply, tables[item].Name, tables[item].Fields)
					})
				})
				if (process.env.RUNMODE === "debug")
					Logger.info(`registered ${method} /${tables[item].Name}${route}`)
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
		Logger.info(`Database successfully initialized: ${value}`)
	},
	function(error) {
		Logger.error(`Could not initialize database! ${error}`)
		process.exit(1);
	}
)

if (await add_default_user())
	Logger.info("Default user added/updated.")
else
	Logger.error("Could not create user!")

// WARN: UNCOMMENT ONCE WORKING WITH BLOCKCHAIN
check_contract()

//
// Aaaand start!
//

fastify.listen({ port: 3000, host: '::' }, (err) => {
	if (err) {
		fastify.log.error(err)
		process.exit(1)
	}
})


fastify.addHook("onResponse", async (req, res) => {
	// @ts-expect-error
	fastifyLogger(req, res);
});

fastify.addHook("onError", async (req, res, error) => {
	Logger.error(`Error occurred: ${error.message}`);
	// @ts-expect-error
	fastifyLogger(req, res);
});
