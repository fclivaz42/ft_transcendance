// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   db_methods.js                                      :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: fclivaz <fclivaz@student.42lausanne.ch>    +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/03/18 17:42:46 by fclivaz           #+#    #+#             //
//   Updated: 2025/03/19 22:29:14 by fclivaz          ###   LAUSANNE.ch       //
//                                                                            //
// ************************************************************************** //

import Database from "better-sqlite3"

function checkRequestFormat (headers, body) {
	if (!headers["api_key"])
		throw {code: 401, string: "error.missing.api_key"}
	if (headers["api_key"] !== process.env.API_KEY)
		throw {code: 401, string: "error.invalid.api_key"}
	if (headers["content-type"] !== "application/json")
		throw {code: 400, string: "error.invalid.content-type"}
	if (!body["table"])
		throw {code: 400, string: "error.invalid.format"}
	if (!(body["table"] == "Players" || body["table"] == "Matches"))
		throw {code: 400, string: "error.invalid.table"}
}

export async function dbget (fastify, options) {
	fastify.get('/', function handler (request, reply) {
		const db = new Database("/data/SARIF.db", {readonly: true});
		let response;
		try {
			checkRequestFormat(request.headers, request.body)
			const body = request.body;
			let sql;
		} catch (exception) {
			return reply.code(exception.code).send(exception.string)
		} finally {
			db.close()
		}
		return reply.code(200).send(response)
	})
}

export async function dbpost (fastify, options) {
	fastify.post('/', function handler (request, reply) {
		const db = new Database("/data/SARIF.db");
		try {
			checkRequestFormat(request.headers, request.body)
			const body = request.body;
			let sql, rcode;
			if (body["table"] === "Players") {
				if (!body["ActiveTokens"])
					body["ActiveTokens"] = "NULL"
				const findID = db.prepare('SELECT * FROM Players WHERE PlayerID = ?')
				if (findID.get(body["PlayerID"]) !== undefined)
					throw {code: 409, string: "error.uuid.exists"}
				const findName = db.prepare('SELECT * FROM Players WHERE DisplayName = ?')
				if (findName.get(body["DisplayName"]) !== undefined)
					throw {code: 409, string: "error.nameid.exists"}
				sql = db.prepare(`INSERT INTO Players VALUES (@PlayerID, @DisplayName, @PassHash, @ActiveTokens, @EmailAddress, @PhoneNumber, @RealName, @Surname, @Bappy)`);
			}
			else if (body["table"] === "Matches") {
				const findID = db.prepare('SELECT * FROM Matches WHERE MatchID = ?')
				if (findID.get(body["MatchID"]) !== undefined)
					throw {code: 409, string: "error.uuid.exists"}
				sql = db.prepare(`INSERT INTO Players VALUES (@MatchID, @PlayerOneID, @PlayerTwoID, @WinnerPlayerID, @ScoreOne, @ScoreTwo, @StartTime, @EndTime)`);
			}
			else
				throw {code: 400, string: "error.invalid.table"}
			try {
				rcode = sql.run(body)
			}
			catch (error) {
				if (error instanceof RangeError)
					throw {code: 400, string: "error.missing.entries"}
				throw {code: 500, string: "error.database.fucked"}
			}
		} catch (exception) {
			return reply.code(exception.code).send(exception.string)
		} finally {
			db.close()
		}
		return reply.code(201).send(request.body)
	})
}

export async function dbdel(fastify, options) {
	fastify.delete('/', function handler (request, reply) {
		const db = new Database("/data/SARIF.db");
		let response;
		try {
			checkRequestFormat(request.headers, request.body)
			const body = request.body;
			let sql;
		} catch (exception) {
			return reply.code(exception.code).send(exception.string)
		} finally {
			db.close()
		}
		return reply.code(200).send(response)
	})
}

export async function dbput (fastify, options) {
	fastify.put('/', function handler (request, reply) {
		const db = new Database("/data/SARIF.db");
		let response;
		try {
			checkRequestFormat(request.headers, request.body)
			const body = request.body;
			let sql;
		} catch (exception) {
			return reply.code(exception.code).send(exception.string)
		} finally {
			db.close()
		}
		return reply.code(200).send(response)
	})
}

export function init_db() {
	const db = new Database("/data/SARIF.db")
	try {
		db.prepare(
			`CREATE TABLE IF NOT EXISTS Players (
				PlayerID TEXT PRIMARY KEY,
				DisplayName TEXT UNIQUE NOT NULL,
				PassHash TEXT NOT NULL,
				ActiveTokens TEXT,
				EmailAddress TEXT NOT NULL,
				PhoneNumber TEXT NOT NULL,
				RealName TEXT NOT NULL,
				Surname TEXT NOT NULL,
				Bappy INTEGER NOT NULL);`).run();
		db.prepare(
			`CREATE TABLE IF NOT EXISTS Matches (
				MatchID TEXT PRIMARY KEY,
				PlayerOneID TEXT NOT NULL,
				PlayerTwoID TEXT NOT NULL,
				WinnerPlayerID TEXT NOT NULL,
				ScoreOne INTEGER NOT NULL,
				ScoreTwo INTEGER NOT NULL,
				StartTime INTEGER NOT NULL,
				EndTime INTEGER NOT NULL,
				FOREIGN KEY (WinnerPlayerID) REFERENCES players(PlayerID) ON DELETE CASCADE,
				FOREIGN KEY (PlayerOneID) REFERENCES players(PlayerID) ON DELETE CASCADE,
				FOREIGN KEY (PlayerTwoID) REFERENCES players(PlayerID) ON DELETE CASCADE)`).run();
	} catch (error) {
		console.log(error);
	} finally {
		db.close()
	}
}
