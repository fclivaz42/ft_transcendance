// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   db_players.js                                      :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: fclivaz <fclivaz@student.42lausanne.ch>    +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/03/18 17:42:46 by fclivaz           #+#    #+#             //
//   Updated: 2025/04/23 18:45:10 by fclivaz          ###   LAUSANNE.ch       //
//                                                                            //
// ************************************************************************** //

import Database from "better-sqlite3"
import { check_get, check_post, check_delete, check_put } from "./db_checks.js"
import { dbget, dbpost, dbdel, dbput, tables } from "./db_methods.js"

const table_fields =	["PlayerID",
						"DisplayName",
						"PassHash",
						"ActiveTokens",
						"EmailAddress",
						"PhoneNumber",
						"RealName",
						"Surname",
						"Bappy",
						"Admin"]

export async function get_players(fastify) {
	fastify.get(`/${tables[0]}`, get_db(request, reply, tables[0], table_fields))
}

export async function dbpost(fastify) {
	fastify.post('/', function handler(request, reply) {
		const db = new Database("/data/SARIF.db");
		try {
			checkRequestFormat(request.headers, request.method)
			const body = request.body;
			let sql;
			if (request.headers["table"] === "Players") {
				if (!body[pfs[3]])
					body[pfs[3]] = "NULL"
				if (db.prepare(`SELECT * FROM Players WHERE ${pfs[0]} = ?`).get(body[pfs[0]]) !== undefined)
					throw { code: 409, string: "error.uuid.exists" }
				if (db.prepare(`SELECT * FROM Players WHERE ${pfs[1]} = ?`).get(body[pfs[1]]) !== undefined)
					throw { code: 409, string: "error.nameid.exists" }
				sql = db.prepare(`INSERT INTO Players VALUES (@${pfs[0]}, @${pfs[1]}, @${pfs[2]}, @${pfs[3]}, @${pfs[4]}, @${pfs[5]}, @${pfs[6]}, @${pfs[7]}, @${pfs[8]}, @${pfs[9]})`);
			}
			else if (request.headers["table"] === "Matches") {
				if (db.prepare(`SELECT * FROM Matches WHERE ${mfs[0]} = ?`).get(body[mfs[0]]) !== undefined)
					throw { code: 409, string: "error.uuid.exists" }
				sql = db.prepare(`INSERT INTO Matches VALUES (@${mfs[0]}, @${mfs[1]}, @${mfs[2]}, @${mfs[3]}, @${mfs[4]}, @${mfs[5]}, @${mfs[6]}, @${mfs[7]})`);
			}
			else
				throw { code: 400, string: "error.invalid.table" }
			try {
				sql.run(body)
			}
			catch (error) {
				if (error instanceof RangeError)
					throw { code: 400, string: "error.missing.entries" }
				if (typeof error.code === "string")
					throw { code: 500, string: error.code }
				throw { code: 500, string: "error.database.fucked" }
			}
		} catch (exception) {
			if (typeof exception.code === "string")
				return reply.code(500).send(exception.code)
			return reply.code(exception.code).send(exception.string)
		} finally {
			db.close()
		}
		return reply.code(201).send(JSON.stringify(request.body))
	})
}

export async function dbdel(fastify) {
	fastify.delete('/', function handler(request, reply) {
		const db = new Database("/data/SARIF.db");
		let response;
		try {
			checkRequestFormat(request.headers, request.method)
			if (request.headers["table"] === "Matches")
				throw { code: 400, string: "error.unsupported.table" }
			if (!request.headers["field"])
				throw { code: 400, string: "error.missing.field" }
			if (request.headers["table"] === "Players" && pfs.indexOf(request.headers["field"]) == -1)
				throw { code: 400, string: "error.invalid.field" }
			if (!request.headers["query"])
				throw { code: 400, string: "error.missing.query" }
			let sql = db.prepare(`DELETE from ${request.headers["table"]} WHERE ${request.headers["field"]} = ?`);
			response = sql.run(request.headers["query"]);
			if (response === undefined)
				throw { code: 404, string: "error.value.notfound" }
		} catch (exception) {
			if (typeof exception.code === "string")
				return reply.code(500).send(exception.code)
			return reply.code(exception.code).send(exception.string)
		} finally {
			db.close()
		}
		return reply.code(202).send(response)
	})
}

export async function dbput(fastify) {
	fastify.put('/', function handler(request, reply) {
		const db = new Database("/data/SARIF.db");
		let response;
		try {
			checkRequestFormat(request.headers, request.method)
			const body = request.body;
			if (request.headers["table"] === "Matches")
				throw { code: 400, string: "error.static.table" }
			if (body["PlayerID"] === undefined)
				throw { code: 400, string: "error.missing.uuid" }
			if (db.prepare(`SELECT * FROM Players WHERE ${pfs[0]} = ?`).get(body[pfs[0]]) === undefined)
				throw { code: 404, string: "error.invalid.uuid" }
			let sql = `UPDATE ${request.headers["table"]}\nSET`;
			let count = 0;
			for (let key in body) {
				if (pfs.indexOf(key) == 0 )
					continue ;
				else if (pfs.indexOf(key) == -1 )
					throw { code: 400, string: "error.invalid.field" }
				else {
					sql += ` ${key} = @${key},`
					++count
				}
			}
			if (count === 0)
				throw { code: 400, string: "error.missing.fields" }
			sql = sql.slice(0, -1)
			sql += `\nWHERE ${pfs[0]} = @${pfs[0]}`
			response = db.prepare(sql).run(body)
		} catch (exception) {
			return reply.code(exception.code).send(exception.string)
		} finally {
			db.close()
		}
		return reply.code(205).send(response)
	})
}

export function init_db() {
	const db = new Database("/data/SARIF.db")
	try {
		db.prepare(
			`CREATE TABLE IF NOT EXISTS Players (
				${pfs[0]} TEXT PRIMARY KEY,
				${pfs[1]} TEXT UNIQUE NOT NULL,
				${pfs[2]} TEXT NOT NULL,
				${pfs[3]} TEXT,
				${pfs[4]} TEXT NOT NULL,
				${pfs[5]} TEXT NOT NULL,
				${pfs[6]} TEXT NOT NULL,
				${pfs[7]} TEXT NOT NULL,
				${pfs[8]} INTEGER NOT NULL,
				${pfs[9]} INTEGER NOT NULL)`).run();
		db.prepare(
			`CREATE TABLE IF NOT EXISTS Matches (
				${mfs[0]} TEXT PRIMARY KEY,
				${mfs[1]} TEXT,
				${mfs[2]} TEXT,
				${mfs[3]} TEXT,
				${mfs[4]} INTEGER NOT NULL,
				${mfs[5]} INTEGER NOT NULL,
				${mfs[6]} INTEGER NOT NULL,
				${mfs[7]} INTEGER NOT NULL,
				FOREIGN KEY (${mfs[1]}) REFERENCES Players(${pfs[0]}) ON DELETE SET NULL
				FOREIGN KEY (${mfs[2]}) REFERENCES Players(${pfs[0]}) ON DELETE SET NULL,
				FOREIGN KEY (${mfs[3]}) REFERENCES Players(${pfs[0]}) ON DELETE SET NULL)`).run();
	} catch (error) {
		console.log(error);
	} finally {
		db.close()
	}
}
