// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   db_methods.js                                      :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: fclivaz <fclivaz@student.42lausanne.ch>    +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/03/18 17:42:46 by fclivaz           #+#    #+#             //
//   Updated: 2025/05/07 18:11:29 by fclivaz          ###   LAUSANNE.ch       //
//                                                                            //
// ************************************************************************** //

import Database from "better-sqlite3"
import { tables } from "./db_vars.js"

export default class DatabaseWorker {

	constructor() { }

	static get(table, field, query) {
		const db = new Database("/data/SARIF.db", { readonly: true });
		let response;
		try {
			response = db.prepare(`SELECT * from ${table} WHERE ${field} = ?`).get(query);
			if (response === undefined)
				throw { code: 404, string: "error.value.notfound" }
		} catch (exception) {
			if (typeof exception.code === "string")
				throw { code: 500, string: exception.code }
			throw { code: exception.code, string: exception.string }
		} finally {
			db.close()
		}
		return response
	}

	static del(table, field, query) {
		const db = new Database("/data/SARIF.db");
		let response;
		try {
			response = db.prepare(`DELETE from ${table} WHERE ${field} = ?`).run(query);
			if (response === undefined)
				throw { code: 404, string: "error.value.notfound" }
		} catch (exception) {
			if (typeof exception.code === "string")
				throw { code: 500, string: exception.code }
			throw { code: exception.code, string: exception.string }
		} finally {
			db.close()
		}
		return response
	}

	static post(table, table_fields, body) {
		const db = new Database("/data/SARIF.db");
		try {
			let sql = `INSERT INTO ${table} VALUES (`;
			let count = 0;
			if (db.prepare(`SELECT * FROM ${table} WHERE ${table_fields[0]} = ?`).get(body[table_fields[0]]) !== undefined)
				throw { code: 409, string: "error.uuid.exists" }
			if (table === "Players" && db.prepare(`SELECT * FROM Players WHERE ${table_fields[1]} = ?`).get(body[table_fields[1]]) !== undefined)
				throw { code: 409, string: "error.nameid.exists" }
			for (const key in body) {
				if (table_fields.indexOf(key) === -1)
					throw { code: 400, string: `error.invalid.field ${key}` }
				else {
					sql += ` @${table_fields[count]},`
					++count
				}
			}
			if (count !== table_fields.length)
				throw { code: 400, string: "error.missing.fields" }
			db.prepare(sql.replace(/.$/, ")")).run(body)
		} catch (exception) {
			if (exception instanceof RangeError)
				throw { code: 400, string: "error.missing.entries" }
			if (typeof exception.code === "string")
				throw { code: 500, string: exception.code }
			throw exception
		} finally {
			db.close()
		}
		return JSON.stringify(body)
	}

	static put(table, table_fields, body) {
		const db = new Database("/data/SARIF.db");
		let response;
		try {
			if (db.prepare(`SELECT * FROM ${table} WHERE ${table_fields[0]} = ?`).get(body[table_fields[0]]) === undefined)
				throw { code: 404, string: "error.invalid.uuid" }
			let sql = `UPDATE ${table}\nSET`;
			let count = 0;
			for (const key in body) {
				if (table_fields.indexOf(key) === 0)
					continue;
				else if (table_fields.indexOf(key) === -1)
					throw { code: 400, string: "error.invalid.field" }
				else {
					sql += ` ${key} = @${key},`
					++count
				}
			}
			if (count === 0)
				throw { code: 400, string: "error.missing.fields" }
			sql = sql.slice(0, -1)
			sql += `\nWHERE ${table_fields[0]} = @${table_fields[0]}`
			response = db.prepare(sql).run(body)
		} catch (exception) {
			if (typeof exception.code === "string")
				throw { code: 500, string: exception.code }
			throw { code: exception.code, string: exception.string }
		} finally {
			db.close()
		}
		return response
	}
}


function check_db_columns(db) {

}

export function init_db() {
	const db = new Database("/data/SARIF.db")
	try {
		for (const item in tables) {
			if (tables[item].Fields.length !== tables[item].Arguments.length) {
				console.warn(`${tables[item].Name}'s Fields and Arguments are of different lengths. Skipping.`)
				continue;
			}
			let sql = `CREATE TABLE IF NOT EXISTS ${tables[item].Name} (\n`;
			for (let x = 0; x < tables[item].Fields.length; x++) {
				if (x === tables[item].Fields.length - 1)
					sql += `${tables[item].Fields[x]} ${tables[item].Arguments[x]})`
				else
					sql += `${tables[item].Fields[x]} ${tables[item].Arguments[x]},\n`
			}
			db.prepare(sql).run();
		}
	} catch (error) {
		console.error(error);
	} finally {
		db.close()
	}
}
