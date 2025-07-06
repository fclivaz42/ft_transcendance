// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   db_methods.ts                                      :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: fclivaz <fclivaz@student.42lausanne.ch>    +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/03/18 17:42:46 by fclivaz           #+#    #+#             //
//   Updated: 2025/06/30 18:23:43 by fclivaz          ###   LAUSANNE.ch       //
//                                                                            //
// ************************************************************************** //

import Database from "better-sqlite3"
import { tables } from "./db_vars.ts"
import { randomUUID } from "node:crypto"
import type * as sqlt from "better-sqlite3"
import fs from "node:fs";
import path from "node:path";

//
// Export as a non-instantiable class in order to directly call the static members.
// Allows me to export only one thing which houses all the possible operations on the database.
//

export default class DatabaseWorker {

	private constructor() { }

	//
	// Return a row from the table "table", in which "query" exists in the row's "field" if mode is "get".
	// Return all rows from the table "table", in which "query" exists in the row's "field" if mode is "all".
	// DELETE all rows from the table "table", in which "query" exists in the row's "field" if mode is "run".
	//

	static get_del(table: string, field: string, query: string, mode: "get" | "all" | "run") {
		const db = new Database(process.env.DBLOCATION, { readonly: mode === "run" ? false : true });
		let response: object | Array<object> | sqlt.RunResult;
		const sql = mode === "run" ? "DELETE" : "SELECT *"
		try {
			if (table === tables.Players.Name && mode === "run") {
				response = db.prepare(`SELECT * FROM ${table} WHERE ${field} = ?`).get(query) as object
				if (response === undefined)
					throw { code: 404, string: "error.value.notfound" }
				const filename = response[tables.Players.Fields[0]]
				const folder: Array<string> = fs.readdirSync(process.env.FILELOCATION as string)
				for (const item of folder)
					if (filename === item.split('.')[0])
						fs.rmSync(path.join(process.env.FILELOCATION as string, item))
			}
			response = db.prepare(`${sql} FROM ${table} WHERE ${field} = ?`)[mode](query) as object
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
		let retobj = {}
		try {
			let sql = `INSERT INTO ${table} VALUES (`;
			if (tables[table].Identification.HasID) {
				let generated_uid: string = tables[table].Identification.IDPrefix + randomUUID();
				while (check_uid(db, tables.UIDTable.Name, tables.UIDTable.Fields[0], generated_uid))
					generated_uid = tables[table].Identification.IDPrefix + randomUUID()
				body[table_fields[0]] = generated_uid
			}
			check_duplicate(db, table, body, null, null)
			for (const key of table_fields) {
				if (key !== "")
					sql += ` @${key},`
				if (body[key] === undefined)
					body[key] = null
			}
			db.prepare(sql.replace(/.$/, ")")).run(body)
			retobj = db.prepare(`SELECT * FROM ${table} WHERE ${table_fields[0]} = ?`).get(body[table_fields[0]]) as object
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
		return retobj;
	}

	//
	// Update the table "table" with the information in "body".
	// The SQL is procedurally generated and will accept a request of any size,
	// as long as it is equal to or smaller than the size of the row it is trying to affect.
	//

	static put(table: string, table_fields: Array<string>, body: object, field: string, query: string) {
		const db = new Database(process.env.DBLOCATION);
		let response: object;
		try {
			if (db.prepare(`SELECT * FROM ${table} WHERE ${field} = ?`).get(query) === undefined)
				throw { code: 404, string: "error.invalid.uuid" }
			let sql = `UPDATE ${table}\nSET`;
			let count = 0;
			check_duplicate(db, table, body, field, query)
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
			db.prepare(sql).run(body, query)
			response = db.prepare(`SELECT * FROM ${table} WHERE ${field} = ?`).get(query) as object
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

	static multiget(table: string, field: string | undefined, array: string | undefined) {
		const db = new Database(process.env.DBLOCATION, { readonly: true });
		let response: Array<object>;
		try {
			if (field === undefined || array === undefined) {
				response = db.prepare(`SELECT * FROM ${table}`).all() as Array<object>
			}
			else {
				const uarray = JSON.parse(array)
				response = []
				for (const item of uarray) {
					const ret = db.prepare(`SELECT * FROM ${table} WHERE ${field} = ?`).get(item) as object
					if (ret)
						response.push(ret)
				}
			}
			if (response === undefined)
				throw { code: 404, string: "error.values.notfound" }
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

//
// Check for duplicate entries dynamically so we gracefully throw an error rather than
// make SQlite yell at you.
//

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

function check_duplicate(db: sqlt.Database, table: string, body: object, field: string | null, query: string | null) {
	for (const item of db.pragma(`index_list(${table})`) as Array<idlist>) {
		const truc = db.pragma(`index_info(${item.name})`) as Array<idinfo>
		if (body[truc[0].name] !== undefined) {
			const test = db.prepare(`SELECT * FROM ${table} WHERE ${truc[0].name} = ?`).get(body[truc[0].name]) as object
			if (test !== undefined && ((field === null && query === null) || (test[field as string] !== query))) {
				throw { code: 409, string: `error.duplicate.${truc[0].name}` }
			}
		}
	}
}
