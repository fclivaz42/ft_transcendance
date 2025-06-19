// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   db_methods.ts                                      :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: fclivaz <fclivaz@student.42lausanne.ch>    +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/03/18 17:42:46 by fclivaz           #+#    #+#             //
//   Updated: 2025/06/20 01:44:55 by fclivaz          ###   LAUSANNE.ch       //
//                                                                            //
// ************************************************************************** //

import Database from "better-sqlite3"
import { tables } from "./db_vars.ts"
import { randomUUID, randomBytes, scrypt } from "node:crypto"
import type * as sqlt from "better-sqlite3"
import type { db_definition } from "./db_vars.ts"
import { hash_password } from "./db_helpers.ts"

//
// Export as a non-instantiable class in order to directly call the static members.
// Allows me to export only one thing which houses all the possible operations on the database.
//

export default class DatabaseWorker {

	private constructor() { }

	//
	// Return a row from the table "table", in which "query" exists in the row's "field".
	//

	static get(table: string, field: string, query: string) {
		const db = new Database(process.env.DBLOCATION, { readonly: true });
		let response: object;
		try {
			response = db.prepare(`SELECT * FROM ${table} WHERE ${field} = ?`).get(query) as object
			if (response === undefined)
				throw { code: 404, string: "error.value.notfound" }
		} catch (exception) {
			if (process.env.RUNMODE === "debug")
				console.dir(exception)
			if (typeof exception.code === "string")
				throw { code: 500, string: exception.code }
			throw { code: exception.code, string: exception.string }
		} finally {
			db.close()
		}
		return response;
	}

	//
	// Delete a row from the table "table", in which "query" exists in the row's "field".
	//

	static del(table: string, field: string, query: string) {
		const db = new Database(process.env.DBLOCATION);
		let response: sqlt.RunResult;
		try {
			response = db.prepare(`DELETE FROM ${table} WHERE ${field} = ?`).run(query);
			if (response === undefined)
				throw { code: 404, string: "error.value.notfound" }
		} catch (exception) {
			if (process.env.RUNMODE === "debug")
				console.dir(exception)
			if (typeof exception.code === "string")
				throw { code: 500, string: exception.code }
			throw { code: exception.code, string: exception.string }
		} finally {
			db.close()
		}
		return response;
	}

	//
	// Create a new entry in the table "table" with the data in "body".
	// Any key in "body" that is not in "table_fields" will be discarded.
	// If the row requires an unique identifier, generate it and add it to "body".
	// After that, check if duplicate entries for Players exist.
	// The SQL is procedurally generated so it will attempt to create the row with the data provided.
	//

	static post(table: string, table_fields: Array<string>, body: object) {
		const db = new Database(process.env.DBLOCATION);
		try {
			let sql = `INSERT INTO ${table} VALUES (`;
			if (tables[table].Identification.HasID) {
				let generated_uid: string = tables[table].Identification.IDPrefix + randomUUID();
				while (check_uid(db, tables.UIDTable.Name, tables.UIDTable.Fields[0], generated_uid))
					generated_uid = tables[table].Identification.IDPrefix + randomUUID()
				body[table_fields[0]] = generated_uid
			}
			// TODO: Insert function to check for dupes here! and do it for POST too while we're at it :)
			// if (table === "Players") {
			// 	if (db.prepare(`SELECT * FROM Players WHERE ${table_fields[1]} = ?`).get(body[table_fields[1]]) !== undefined)
			// 		throw { code: 409, string: "error.nameid.exists" }
			// 	if (db.prepare(`SELECT * FROM Players WHERE ${table_fields[6]} = ?`).get(body[table_fields[6]]) !== undefined)
			// 		throw { code: 409, string: "error.email.exists" }
			// }
			for (const key of table_fields) {
				if (key !== "")
					sql += ` @${key},`
				if (body[key] === undefined)
					body[key] = null
			}
			db.prepare(sql.replace(/.$/, ")")).run(body)
		} catch (exception) {
			if (process.env.RUNMODE === "debug")
				console.dir(exception)
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

	//
	// Update the table "table" with the information in "body".
	// The SQL is procedurally generated and will accept a request of any size,
	// as long as it is equal to or smaller than the size of the row it is trying to affect.
	//

	static put(table: string, table_fields: Array<string>, body: object, field: string, query: string) {
		const db = new Database(process.env.DBLOCATION);
		let response: sqlt.RunResult;
		try {
			if (db.prepare(`SELECT * FROM ${table} WHERE ${field} = ?`).get(query) === undefined)
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
			sql += `\nWHERE ${field} = ?`
			response = db.prepare(sql).run(body, query)
		} catch (exception) {
			if (process.env.RUNMODE === "debug")
				console.dir(exception)
			if (typeof exception.code === "string")
				throw { code: 500, string: exception.code }
			throw { code: exception.code, string: exception.string }
		} finally {
			db.close()
		}
		return response;
	}

	//
	// Retrieve SmartContract from the database.
	//

	static get_contract(table: string) {
		const db = new Database(process.env.DBLOCATION, { readonly: true });
		let response: object;
		try {
			response = db.prepare(`SELECT * FROM ${table}`).get() as object
			if (response === undefined)
				return undefined;
		} catch (exception) {
			if (process.env.RUNMODE === "debug")
				console.dir(exception)
			throw { code: 500, string: exception.code }
		} finally {
			db.close()
		}
		return response;
	}
}

//
// Check if the UID we are trying to generate already exists.
// (Chances are abysmally low, but you never know how bad your luck can be.)
//

function check_uid(db: sqlt.Database, table: string, field: string, uid: string) {
	if (db.prepare(`SELECT * FROM ${table} WHERE ${field} = ?`).get(uid) === undefined) {
		db.prepare(`INSERT INTO ${table} (${field}) VALUES (?)`).run(uid)
		return false
	}
	return true
}
