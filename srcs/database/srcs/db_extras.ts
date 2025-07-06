// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   db_extras.ts                                       :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: fclivaz <fclivaz@student.42lausanne.ch>    +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/06/18 20:58:12 by fclivaz           #+#    #+#             //
//   Updated: 2025/07/05 23:31:28 by fclivaz          ###   LAUSANNE.ch       //
//                                                                            //
// ************************************************************************** //

import DatabaseWorker from "./db_methods.ts"
import Logger from "../../libs/helpers/loggers.ts"
import fs from "node:fs"
import util from 'util';
import path from "node:path";
import { pipeline } from "node:stream"
import { scrypt } from "crypto"
import { check_request_format } from "./db_helpers.ts"
import { tables } from "./db_vars.ts"
import type * as fft from 'fastify'
import type { MultipartFile } from "@fastify/multipart"
import type { db_params } from "./db_main.ts"
import { fileTypeFromFile } from "file-type";

async function check_password(user: string, field: "PlayerID" | "DisplayName" | "EmailAddress", password: string) {
	return new Promise((resolve, reject) => {
		let user_data: object = {};
		try {
			user_data = DatabaseWorker.get_del("Players", field, user, "get");
			if (!user_data[tables.Players.Fields[3]])
				return reject({ code: 403, string: "error.use.oauth" })
		} catch (exception) {
			console.dir(exception)
			return reject(exception);
		}
		const user_hash: string = user_data["Password"];
		const user_salt: string = user_hash.substring(0, 64);
		if (process.env.RUNMODE === "debug")
			Logger.info(`Recovered salt: ${user_salt}`)
		scrypt(password, user_salt, 66, (err, derivedKey) => {
			if (err) return reject(err);
			if (process.env.RUNMODE === "debug")
				Logger.info(`Recovered hash: ${user_salt + derivedKey.toString('base64')}`)
			if (user_salt + derivedKey.toString('base64') === user_hash)
				return resolve(user_data);
			else
				return resolve(undefined);
		})
	})
}

async function logger_preparser(request: fft.FastifyRequest, reply: fft.FastifyReply, params: db_params, headers: object, mode: "PlayerID" | "DisplayName" | "EmailAddress") {
	try {
		check_request_format(request.headers, request.method, request.params as object)
		if (!headers["password"])
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

async function upload_picture(request: fft.FastifyRequest, reply: fft.FastifyReply, params: db_params, file: MultipartFile) {
	let return_name: string;
	try {
		if (!request.headers["authorization"])
			throw { code: 401, string: "error.missing.authorization" }
		if (request.headers["authorization"] !== process.env.API_KEY)
			throw { code: 401, string: "error.invalid.authorization" }
		if (!file)
			throw { code: 400, string: "error.invalid.file" }
		if (!file.mimetype.startsWith('image/'))
			throw { code: 400, string: "error.invalid.content-type" }
		if (JSON.stringify(params) === "{}")
			return;
		if (params[Object.keys(params)[0]] === "")
			throw { code: 400, string: "error.empty.params" }
		const filename = params.PlayerID + file.filename.slice(file.filename.lastIndexOf('.'))
		const folder: Array<string> = fs.readdirSync(process.env.FILELOCATION as string)
		for (const item of folder)
			if (params.PlayerID === item.split('.')[0])
				fs.rmSync(path.join(process.env.FILELOCATION as string, item))
		const pump = util.promisify(pipeline);
		await pump(file.file, fs.createWriteStream(path.join(process.env.FILELOCATION as string, filename)));
		const ftype = await fileTypeFromFile(path.join(process.env.FILELOCATION as string, filename))
		if (ftype && !ftype.mime.startsWith('image/')) {
			if (process.env.RUNMODE === "debug")
				console.dir(ftype)
			fs.rmSync(path.join(process.env.FILELOCATION as string, filename))
			throw { code: 415, string: "error.not.image" }
		}
		return_name = filename
	} catch (exception) {
		if (typeof exception.code === "number")
			return reply.code(exception.code).send(exception.string)
		console.dir(exception)
		return reply.code(500).send("error.save.failed")
	}
	return reply.code(201).sendFile(return_name)
}

async function get_picture(request: fft.FastifyRequest, reply: fft.FastifyReply, params: db_params) {
	try {
		check_request_format(request.headers, request.method, params)
		const folder: Array<string> = fs.readdirSync(process.env.FILELOCATION as string)
		for (const item of folder)
			if (params.PlayerID === item.split('.')[0])
				return reply.code(200).sendFile(`${item}`)
		throw { code: 404, string: "error.picture.notfound" }
	} catch (exception) {
		if (typeof exception.code === "number")
			return reply.code(exception.code).send(exception.string)
		console.dir(exception)
		return reply.code(500).send("error.internal.fail")
	}
}

export async function extra_routes(fastify: fft.FastifyInstance, options: fft.FastifyPluginOptions) {

	fastify.get<{ Params: db_params }>(`/${tables.Players.Name}/PlayerID/:PlayerID/check_passwd`, async function handler(request: fft.FastifyRequest, reply: fft.FastifyReply) {
		return logger_preparser(request, reply, request.params as db_params, request.headers, "PlayerID")
	})

	fastify.get<{ Params: db_params }>(`/${tables.Players.Name}/DisplayName/:DisplayName/check_passwd`, async function handler(request: fft.FastifyRequest, reply: fft.FastifyReply) {
		return logger_preparser(request, reply, request.params as db_params, request.headers, "DisplayName")
	})

	fastify.get<{ Params: db_params }>(`/${tables.Players.Name}/EmailAddress/:EmailAddress/check_passwd`, async function handler(request: fft.FastifyRequest, reply: fft.FastifyReply) {
		return logger_preparser(request, reply, request.params as db_params, request.headers, "EmailAddress")
	})

	fastify.post<{ Params: db_params }>(`/${tables.Players.Name}/PlayerID/:PlayerID/picture`, async function handler(request: fft.FastifyRequest, reply: fft.FastifyReply) {
		return upload_picture(request, reply, request.params as db_params, await request.file() as MultipartFile)
	})

	fastify.get<{ Params: db_params }>(`/${tables.Players.Name}/PlayerID/:PlayerID/picture`, async function handler(request: fft.FastifyRequest, reply: fft.FastifyReply) {
		return get_picture(request, reply, request.params as db_params)
	})
}
