// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   db_methods.js                                      :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: fclivaz <fclivaz@student.42lausanne.ch>    +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/03/18 17:42:46 by fclivaz           #+#    #+#             //
//   Updated: 2025/04/30 02:18:13 by fclivaz          ###   LAUSANNE.ch       //
//                                                                            //
// ************************************************************************** //

import Database from "better-sqlite3"
import { tables } from "./db_vars.js"

export class DatabaseWorker {

	constructor() { }

	get(table, field, query) {
		let response;
		try {
			const db = new Database("/data/SARIF.db", { readonly: true });
			response = db.prepare(`SELECT * from ? WHERE ? = ?`).get(table, field, query);
			if (response === undefined)
				throw { code: 404, string: "error.value.notfound" }
		} catch (exception) {
			if (typeof exception.code === "string")
				throw { code: 500, string: exception.string }
			throw { code: exception.code, string: exception.string }
		} finally {
			db.close()
		}
		return response
	}


	del(table, field, query) {
		let response;
		try {
			const db = new Database("/data/SARIF.db");
			response = db.prepare(`DELETE from ? WHERE ? = ?`).run(table, field, query);
			if (response === undefined)
				throw { code: 404, string: "error.value.notfound" }
		} catch (exception) {
			if (typeof exception.code === "string")
				throw { code: 500, string: exception.string }
			throw { code: exception.code, string: exception.string }
		} finally {
			db.close()
		}
		return response
	}

	post(table, table_fields, body) {
		const db = new Database("/data/SARIF.db");
		try {
			let sql = `INSERT INTO ${table} VALUES ( `;
			if (db.prepare(`SELECT * FROM Players WHERE ${table_fields[0]} = ?`).get(body[table_fields[0]]) !== undefined)
				throw { code: 409, string: "error.uuid.exists" }
			if (db.prepare(`SELECT * FROM Players WHERE ${table_fields[1]} = ?`).get(body[table_fields[1]]) !== undefined)
				throw { code: 409, string: "error.nameid.exists" }
			for (const key in body) {
				if (table_fields.indexOf(key) === 0)
					continue;
				else if (table_fields.indexOf(key) === -1)
					throw { code: 400, string: "error.invalid.field" }
				else {
					sql += ` @${key},`
					++count
				}
			}
			if (count === 0)
				throw { code: 400, string: "error.missing.fields" }
			sql.replace(/.$/, ")")
			db.prepare(sql).run(body)
		} catch (exception) {
			if (error instanceof RangeError)
				throw { code: 400, string: "error.missing.entries" }
			if (typeof exception.code === "string")
				throw { code: 500, string: exception.string }
			throw { code: exception.code, string: exception.string }
		} finally {
			db.close()
		}
		return JSON.stringify(body)
	}

	put(table, table_fields, body) {
		let response;
		try {
			const db = new Database("/data/SARIF.db");
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
				throw { code: 500, string: exception.string }
			throw { code: exception.code, string: exception.string }
		} finally {
			db.close()
		}
		return response
	}
}

export function init_db() {
	const db = new Database("/data/SARIF.db")
	try {
		for (const item of tables) {
			if (item.Fields.length !== item.Arguments.length) {
				console.warn(`${item.Name}'s Fields and Arguments are of different lengths. Skipping.`)
				continue;
			}
			let sql = `CREATE TABLE IF NOT EXISTS ${item.Name} (\n`;
			for (let x = 0; x < item.Fields.length; x++) {
				if (x === item.Fields.length - 1)
					sql += `${item.Fields[x]} ${item.Arguments[x]})`
				else
					sql += `${item.Fields[x]} ${item.Arguments[x]},\n`
			}
			db.prepare(sql).run();
		}
	} catch (error) {
		console.error(error);
	} finally {
		db.close()
	}
}
