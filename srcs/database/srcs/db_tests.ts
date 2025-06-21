// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   db_tests.ts                                        :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: fclivaz <fclivaz@student.42lausanne.ch>    +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/05/31 20:07:43 by fclivaz           #+#    #+#             //
//   Updated: 2025/06/20 20:34:47 by fclivaz          ###   LAUSANNE.ch       //
//                                                                            //
// ************************************************************************** //

import Database from "better-sqlite3"
import { tables } from "./db_vars.ts"
const print = console.log
const printobj = console.dir
console.log(process.argv[2])


const db = new Database(process.argv[2]);

console.log(db.pragma("table_info(Players)"))
console.log(db.pragma("index_list(Players)"))
console.log(db.pragma("index_info(sqlite_autoindex_Players_3)"))

interface idlist {
	seq: number,
	name: string,
	unique: number,
	origin: string,
	partial: number
}

interface idinfo {
	seqno: number,
	cid: number,
	name: string
}

for (const table in tables) {
	for (const item of db.pragma(`index_list(${tables[table].Name})`) as Array<idlist>) {
		const truc = db.pragma(`index_info(${item.name})`) as Array<idinfo>
		console.log(`${truc[0].name} is unique!`)
	}
}

// const methods = ["GET", "POST", "DELETE", "PUT"]
//
// for (const method of methods) {
// 	for (const item in tables) {
// 		if (tables[item].Methods[method] !== undefined) {
// 			for (const route of tables[item].Methods[method])
// 				print(`Registered ${method} ${route} for ${item}`)
// 		}
// 	}
// }
//
//
// import Fastify from 'fastify'
// import type * as fft from 'fastify'
//
// const fastify = Fastify({
// 	logger: true
// })
//
// type Params = {
// 	query: string;
// }
//
// function params_printer(params: Params) {
// 	if (JSON.stringify(params) === "{}")
// 		return false
// 	if (params[Object.keys(params)[0]] === "") {
// 		console.log("empty params xd")
// 		return true
// 	}
// 	return false
// }
//
// fastify.get<{ Params: Params }>("/route/test/:test", async function handler(request, reply) {
// 	if (params_printer(request.params) === true)
// 		return reply.code(500).send("ponng")
// 	console.log(`Query ${request.params[Object.keys(request.params)[0]]} for field ${Object.keys(request.params)[0]}`)
// 	return reply.code(200).send({ man: "man" })
// })
//
// fastify.get<{ Params: Params }>("/route/2test/:2test", async function handler(request, reply) {
// 	if (params_printer(request.params) === true)
// 		return reply.code(500).send("ping")
// 	console.dir(request.params)
// 	return reply.code(200).send({ man: "man" })
// })
//
// fastify.get<{ Params: Params }>("/", async function handler(request, reply) {
// 	if (params_printer(request.params) === true)
// 		return reply.code(500).send("ffffff")
// 	return reply.code(200).send({ man: "man" })
// })
//
// fastify.listen({ port: 3000, host: '::' }, (err) => {
// 	if (err) {
// 		fastify.log.error(err)
// 		process.exit(1)
// 	}
// })
