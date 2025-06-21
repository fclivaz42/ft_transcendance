// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   db_extras.ts                                       :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: fclivaz <fclivaz@student.42lausanne.ch>    +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/06/18 20:58:12 by fclivaz           #+#    #+#             //
//   Updated: 2025/06/20 21:59:47 by fclivaz          ###   LAUSANNE.ch       //
//                                                                            //
// ************************************************************************** //

import DatabaseWorker from "./db_methods.ts"
import Axios from "axios"
import type * as at from "axios"
import type * as fft from 'fastify'
import * as fs from "node:fs"
import { pipeline } from "node:stream"
import util from 'util';
import { randomBytes, scrypt } from "crypto"
import type { MultipartFile } from "@fastify/multipart"
import { check_request_format } from "./db_helpers.ts"

const pump = util.promisify(pipeline);

async function check_password(user: string, field: "PlayerID" | "DisplayName" | "EmailAddress", password: string) {
	return new Promise((resolve, reject) => {
		let user_data: object = {};
		try {
			user_data = DatabaseWorker.get("Players", field, user);
		} catch (exception) {
			console.dir(exception)
			return reject(exception);
		}
		const user_hash: string = user_data["Password"];
		const user_salt: string = user_hash.substring(0, 64);
		if (process.env.RUNMODE === "debug")
			console.log(`Recovered salt: ${user_salt}`)
		scrypt(password, user_salt, 66, (err, derivedKey) => {
			if (err) return reject(err);
			if (process.env.RUNMODE === "debug")
				console.log(`Recovered hash: ${user_salt + derivedKey.toString('base64')}`)
			if (user_salt + derivedKey.toString('base64') === user_hash)
				return resolve(user_data);
			else
				return resolve(undefined);
		})
	})
}

interface logger {
	PlayerID?: string,
	DisplayName?: string,
	EmailAddress?: string
}

async function logger_preparser(request: fft.FastifyRequest, reply: fft.FastifyReply, params: logger, headers: object, mode: "PlayerID" | "DisplayName" | "EmailAddress") {
	try {
		check_request_format(request.headers, request.method, request.params as object)
		if (headers["password"] === undefined)
			throw { code: 400, string: "error.missing.password" }
		const usr = await check_password(params[mode] as string, mode, headers["password"])
		if (usr !== undefined)
			return reply.code(200).send(usr)
		else
			return reply.code(403).send({ skill: "issue" })
	} catch (exception) {
		if (typeof exception.code === "number")
			return reply.code(exception.code).send(exception.string)
		return reply.code(500).send(exception)
	}
}

export async function extra_routes(fastify: fft.FastifyInstance, options: fft.FastifyPluginOptions) {

	fastify.get<{ Params: logger }>("/pass_id/:PlayerID", async function handler(request: fft.FastifyRequest, reply: fft.FastifyReply) {
		return logger_preparser(request, reply, request.params as logger, request.headers, "PlayerID")
	})

	fastify.get<{ Params: logger }>("/pass_name/:DisplayName", async function handler(request: fft.FastifyRequest, reply: fft.FastifyReply) {
		return logger_preparser(request, reply, request.params as logger, request.headers, "DisplayName")
	})

	fastify.get<{ Params: logger }>("/pass_mail/:EmailAddress", async function handler(request: fft.FastifyRequest, reply: fft.FastifyReply) {
		return logger_preparser(request, reply, request.params as logger, request.headers, "EmailAddress")
	})

	fastify.get<{ Params: logger }>("/download/:DisplayName", async function handler(request: fft.FastifyRequest, reply: fft.FastifyReply) {
		const parms: logger = request.params as logger;
		if (fs.existsSync(`${process.env.FILELOCATION}/${parms.DisplayName}.png`))
			return reply.code(200).sendFile(`${parms.DisplayName}.png`)
		else
			return reply.code(404).send({ skill: "issue" })
	})

	fastify.post<{ Params: logger }>("/upload/:DisplayName", async function handler(request: fft.FastifyRequest, reply: fft.FastifyReply) {
		const parms: logger = request.params as logger;
		const part = await request.file({
			limits: {
				fileSize: 4 * 1024 * 1024
			}
		}) as MultipartFile

		const filename = parms.DisplayName + part?.filename.slice(part?.filename.lastIndexOf('.'))
		await pump(part.file, fs.createWriteStream(`${process.env.FILELOCATION}/${filename}`));
		return reply.code(200).send({ skill: "solution" })
	})
}
