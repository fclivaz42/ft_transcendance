// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   db_extras.ts                                       :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: fclivaz <fclivaz@student.42lausanne.ch>    +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/06/18 20:58:12 by fclivaz           #+#    #+#             //
//   Updated: 2025/06/19 00:05:44 by fclivaz          ###   LAUSANNE.ch       //
//                                                                            //
// ************************************************************************** //

import DatabaseWorker from "./db_methods.ts"
import Axios from "axios"
import type * as at from "axios"
import type * as fft from 'fastify'
import { randomBytes, scrypt } from "crypto"

export async function check_password(user: string, field: "DisplayName" | "EmailAddress", password: string) {
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
export async function passck_route(fastify: fft.FastifyInstance, options: fft.FastifyPluginOptions) {
	fastify.get<{ Params: Disname }>("/check/:DisplayName", async function handler(request: fft.FastifyRequest, reply: fft.FastifyReply) {
		const parms: Disname = request.params as Disname;
		const headrs = request.headers as object;
		if (await check_password(parms.DisplayName, "DisplayName", headrs["password"]))
			reply.code(200).send({ skill: "solution" })
		else
			reply.code(403).send({ skill: "issue" })
	})
}
