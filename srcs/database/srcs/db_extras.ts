// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   db_extras.ts                                       :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: fclivaz <fclivaz@student.42lausanne.ch>    +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/06/18 20:58:12 by fclivaz           #+#    #+#             //
//   Updated: 2025/06/19 21:36:16 by fclivaz          ###   LAUSANNE.ch       //
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

async function check_password(user: string, field: "PlayerID" | "DisplayName" | "EmailAddress", password: string) {
	return new Promise((resolve, reject) => {
		let user_data: object = {};
		try {
			user_data = DatabaseWorker.get("Players", field, user);
		} catch (exception) {
			console.dir(exception)
			reject(false);
		}
		const user_hash: string = user_data["Password"];
		const user_salt: string = user_hash.substring(0, 64);
		if (process.env.RUNMODE === "debug")
			console.log(`Recovered salt: ${user_salt}`)
		scrypt(password, user_salt, 66, (err, derivedKey) => {
			if (err) reject(false);
			if (process.env.RUNMODE === "debug")
				console.log(`Recovered hash: ${user_salt + derivedKey.toString('base64')}`)
			if (user_salt + derivedKey.toString('base64') === user_hash)
				resolve(true);
			else
				resolve(false);
		})
	})
}

interface Disname {
	DisplayName: string
}

const pump = util.promisify(pipeline);

export async function extra_routes(fastify: fft.FastifyInstance, options: fft.FastifyPluginOptions) {

	fastify.get<{ Params: Disname }>("/check/:DisplayName", async function handler(request: fft.FastifyRequest, reply: fft.FastifyReply) {
		const parms: Disname = request.params as Disname;
		const headrs = request.headers as object;
		if (await check_password(parms.DisplayName, "DisplayName", headrs["password"]))
			return reply.code(200).send({ skill: "solution" })
		else
			return reply.code(403).send({ skill: "issue" })
	})

	fastify.get<{ Params: Disname }>("/download/:DisplayName", async function handler(request: fft.FastifyRequest, reply: fft.FastifyReply) {
		const parms: Disname = request.params as Disname;
		if (fs.existsSync(`${process.env.FILELOCATION}/${parms.DisplayName}.png`))
			return reply.code(200).sendFile(`${parms.DisplayName}.png`)
		else
			return reply.code(404).send({ skill: "issue" })
	})

	fastify.post<{ Params: Disname }>("/upload/:DisplayName", async function handler(request: fft.FastifyRequest, reply: fft.FastifyReply) {
		const parms: Disname = request.params as Disname;
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
