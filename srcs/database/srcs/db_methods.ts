// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   db_methods.ts                                      :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: fclivaz <fclivaz@student.42lausanne.ch>    +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/03/18 17:42:46 by fclivaz           #+#    #+#             //
//   Updated: 2025/06/18 23:39:24 by fclivaz          ###   LAUSANNE.ch       //
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

//
// Automatically check if any column has been changed in db_vars.ts
// If changes are detected, rows are dropped or added automatically using the arguments given.
// NOTE: Argument changes do NOT get reflected yet!
//

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
		if (dbrows.indexOf(item) === -1 && item.length > 0) {
			db.prepare(`ALTER TABLE ${table} ADD ${item} ${tables[table]["Arguments"][tables[table]["Fields"].indexOf(item)]}`).run()
			console.log(`DB INIT: added ${item}.`)
		}
	}
}

//
// Automatically and asynchronously initialize the database.
// Creates the necessary tables, fields and arguments using db_vars.ts
// Procedurally generates the SQL, so any modification in db_vars.ts will get reflected onto the live database.
// Returns a boolean Promise. True if the database was succesfully initialized, False if not.
//

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

//
// Adds a default user with Admin privileges.
//

export async function add_default_user() {
	return new Promise((resolve, reject) => {
		(async () => {
			try {
				const test = DatabaseWorker.get(tables.Players.Name, tables.Players.Fields[1], process.env.ADMIN_NAME as string)
				if (test[tables.Players.Fields[1]] === process.env.ADMIN_NAME as string)
					resolve(true);
			} catch (e) {
				if (e.code !== 404) {
					console.dir(e);
					reject(false);
				}
			}
			const default_user: object = { DisplayName: process.env.ADMIN_NAME, EmailAddress: "DEFAULTEMAIL", Admin: 1 };
			try {
				default_user["Password"] = await hash_password(process.env.ADMIN_PASSWORD as string)
				DatabaseWorker.post(tables.Players.Name, tables.Players.Fields, default_user)
			} catch (e) {
				console.dir(e);
				reject(false);
			}
			resolve(true);
		})()
	})
}
