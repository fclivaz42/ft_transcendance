// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   db_methods.ts                                      :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: fclivaz <fclivaz@student.42lausanne.ch>    +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/03/18 17:42:46 by fclivaz           #+#    #+#             //
//   Updated: 2025/05/26 21:41:16 by fclivaz          ###   LAUSANNE.ch       //
//                                                                            //
// ************************************************************************** //

import Database from "better-sqlite3"
import { tables } from "./db_vars.ts"
import type * as sqlt from "better-sqlite3"

export default class DatabaseWorker {

	private constructor() { }

	static get(table: string, field: string, query: string) {
		const db = new Database(process.env.DBLOCATION, { readonly: true });
		let response: object;
		try {
			response = db.prepare(`SELECT * FROM ${table} WHERE ${field} = ?`).get(query) as object
			if (response === undefined)
				throw { code: 404, string: "error.value.notfound" }
		} catch (exception) {
			if (typeof exception.code === "string")
				throw { code: 500, string: exception.code }
			throw { code: exception.code, string: exception.string }
		} finally {
			db.close()
		}
		return response;
	}

	static del(table: string, field: string, query: string) {
		const db = new Database(process.env.DBLOCATION);
		let response: sqlt.RunResult;
		try {
			response = db.prepare(`DELETE FROM ${table} WHERE ${field} = ?`).run(query);
			if (response === undefined)
				throw { code: 404, string: "error.value.notfound" }
		} catch (exception) {
			if (typeof exception.code === "string")
				throw { code: 500, string: exception.code }
			throw { code: exception.code, string: exception.string }
		} finally {
			db.close()
		}
		return response;
	}

	static post(table: string, table_fields: Array<string>, body: object) {
		const db = new Database(process.env.DBLOCATION);
		try {
			let sql = `INSERT INTO ${table} VALUES (`;
			let count = 0;
			if (db.prepare(`SELECT * FROM ${table} WHERE ${table_fields[0]} = ?`).get(body[table_fields[0]]) !== undefined)
				throw { code: 409, string: "error.uuid.exists" }
			if (db.prepare(`SELECT * FROM UIDTable WHERE ${table_fields[0]} = ?`).get(body[table_fields[0]]) === undefined)
				throw { code: 409, string: "error.uuid.ungenerated" }
			if (table === "Players" && db.prepare(`SELECT * FROM Players WHERE ${table_fields[1]} = ?`).get(body[table_fields[1]]) !== undefined)
				throw { code: 409, string: "error.nameid.exists" }
			if (table === "Players" && db.prepare(`SELECT * FROM Players WHERE ${table_fields[6]} = ?`).get(body[table_fields[6]]) !== undefined)
				throw { code: 409, string: "error.email.exists" }
			for (const key in body) {
				if (table_fields.indexOf(key) === -1)
					throw { code: 400, string: `error.invalid.field ${key}` }
				else {
					sql += ` @${table_fields[count]},`
					++count
				}
			}
			// if (count !== table_fields.length)
			// 	throw { code: 400, string: "error.missing.fields" }
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
		return JSON.stringify(body);
	}

	static put(table: string, table_fields: Array<string>, body: object) {
		const db = new Database(process.env.DBLOCATION);
		let response: sqlt.RunResult;
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
		return response;
	}

	static check_uid(table: string, field: string, uid: string) {
		const db = new Database(process.env.DBLOCATION);
		try {
			if (db.prepare(`SELECT * FROM ${table} WHERE ${field} = ?`).get(uid) === undefined) {
				db.prepare(`INSERT INTO ${table} (${field}) VALUES (?)`).run(uid)
				return false
			}
			return true
		} catch (exception) {
			throw { code: 500, string: exception.code }
		} finally {
			db.close()
		}
	}
}

function check_db_columns(db: sqlt.Database, table: string) {
	const result = db.pragma(`table_info(${table})`) as Array<object>
	const dbrows: Array<string> = [];
	for (const item of result) {
		dbrows.push(item["name"]);
		if (tables[table]["Fields"].indexOf(item["name"]) === -1) {
			db.prepare(`ALTER TABLE ${table} DROP COLUMN ${item["name"]}`).run()
			console.log(`DB INIT: dropped ${item["name"]}.`)
		}
	}
	for (const item of tables[table]["Fields"]) {
		if (dbrows.indexOf(item) === -1) {
			db.prepare(`ALTER TABLE ${table} ADD ${item} ${tables[table]["Arguments"][tables[table]["Fields"].indexOf(item)]}`).run()
			console.log(`DB INIT: added ${item}.`)
		}
	}
}

export async function init_db() {
	return new Promise((resolve, reject) => {
		const db = new Database(process.env.DBLOCATION)
		try {
			for (const item in tables) {
				const result = db.pragma(`table_info(${tables[item].Name})`) as Array<object>
				if (result.length === 0) {
					if (tables[item].Fields.length !== tables[item].Arguments.length) {
						console.warn(`${tables[item].Name}'s Fields and Arguments are of different lengths. Skipping.`)
						continue;
					}
					let sql = `CREATE TABLE ${tables[item].Name} (\n`;
					for (let x = 0; x < tables[item].Fields.length; x++) {
						if (x === tables[item].Fields.length - 1)
							sql += `${tables[item].Fields[x]} ${tables[item].Arguments[x]})`
						else
							sql += `${tables[item].Fields[x]} ${tables[item].Arguments[x]},\n`
					}
					db.prepare(sql).run()
					console.log(`DB INIT: Created table ${tables[item].Name}`);
				}
				else
					check_db_columns(db, tables[item].Name);
			}
		} catch (error) {
			console.error(error);
			reject(false);
		} finally {
			db.close()
		}
		resolve(true);
	})
}
