// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   db_methods.js                                      :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: fclivaz <fclivaz@student.42lausanne.ch>    +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/03/06 01:26:20 by fclivaz           #+#    #+#             //
//   Updated: 2025/03/09 04:21:18 by fclivaz          ###   LAUSANNE.ch       //
//                                                                            //
// ************************************************************************** //
//
import sqlite3 from "sqlite3"
import { execute, fetchAll, fetchFirst, sortData, checkExists } from "./db_exec.js"

export async function dbget (fastify, options) {
	fastify.get('/', function handler (request, reply) {
		const db = new sqlite3.Database("/data/SARIF.db")
		const headers = request.headers;
		if (!headers["api_key"])
			return reply.code(401).send({reason: "error.missing.api_key"})
		if (headers["api_key"] !== process.env.API_KEY)
			return reply.code(401).send({reason: "error.invalid.api_key"})
	})
}

export async function dbpost (fastify, options) {
	fastify.post('/', async function handler (request, reply) {
		const db = new sqlite3.Database("/data/SARIF.db")
		const headers = request.headers;
		if (!headers["api_key"])
			return reply.code(401).send({reason: "error.missing.api_key"})
		if (headers["api_key"] !== process.env.API_KEY)
			return reply.code(401).send({reason: "error.invalid.api_key"})
		if (headers["content-type"] !== "application/json")
			return reply.code(400).send({reason: "error.invalid.format"})
		const body = request.body;
		let sql, result;
		if (!body["table"])
			return reply.code(400).send({reason: "error.invalid.format"})
		if (body["table"] === "Players") {
			if (!body["ActiveTokens"])
				body["ActiveTokens"] = "NULL"
			if (await checkExists("Players", "PlayerID", body["PlayerID"], db)) {
				db.close()
				return reply.code(409).send({reason: "error.uuid.exists"})
				}
			else if (await checkExists("Players", "DisplayName", body["DisplayName"], db)) {
				db.close()
				return reply.code(409).send({reason: "error.nameid.exists"})
			}
			sql = `INSERT INTO Players(PlayerID, DisplayName, PassHash, ActiveTokens, EmailAddress, PhoneNumber, RealName, Surname, Bappy) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)`;
			result = sortData(body, ["PlayerID", "DisplayName", "PassHash", "ActiveTokens", "EmailAddress", "PhoneNumber", "RealName", "Surname", "Bappy"])
		}
		else if (body["table"] === "Matches") {
			if (checkExists("Matches", "MatchID", body["MatchID"], db)) {
				db.close()
				return reply.code(409).send({reason: "error.uuid.exists"})
			}
			sql = `INSERT INTO Players(MatchID, PlayerOneID, PlayerTwoID, WinnerPlayerID, ScoreOne, ScoreTwo, StartTime, EndTime) VALUES(?, ?, ?, ?, ?, ?, ?, ?)`;
			result = sortData(body, ["MatchID", "PlayerOneID", "PlayerTwoID", "WinnerPlayerID", "ScoreOne", "ScoreTwo", "StartTime", "EndTime"])
		}
		else {
			db.close()
			return reply.code(400).send({reason: "error.invalid.table"})
		}
		if (result.length == 0) {
			db.close()
			return reply.code(400).send({reason: "error.missing.entries"})
		}
		try {
			console.dir(result)
			console.log(sql)
			console.log("squealing")
			execute(db, sql, result)
		} catch (error) {
			return reply.code(500).send({reason: "error.database.fucked"}, error)
		} finally {
			db.close()
		}
		console.log("squealed")
		return reply.code(201).send(body)
	})
}

export async function dbdel (fastify, options) {
	fastify.delete('/', function handler (request, reply) {
		const db = new sqlite3.Database("/data/SARIF.db")
		const headers = request.headers;
		if (!headers["api_key"])
			return reply.code(401).send({reason: "error.missing.api_key"})
		if (headers["api_key"] !== process.env.API_KEY)
			return reply.code(401).send({reason: "error.invalid.api_key"})
	})
}

export async function dbput (fastify, options) {
	fastify.put('/', function handler (request, reply) {
		const db = new sqlite3.Database("/data/SARIF.db")
		const headers = request.headers;
		if (!headers["api_key"])
			return reply.code(401).send({reason: "error.missing.api_key"})
		if (headers["api_key"] !== process.env.API_KEY)
			return reply.code(401).send({reason: "error.invalid.api_key"})
	})
}
