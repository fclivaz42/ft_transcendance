// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   db_startup.ts                                      :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: fclivaz <fclivaz@student.42lausanne.ch>    +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/03/18 17:42:46 by fclivaz           #+#    #+#             //
//   Updated: 2025/07/08 08:13:32 by fclivaz          ###   LAUSANNE.ch       //
//                                                                            //
// ************************************************************************** //

import Database from "better-sqlite3"
import type * as sqlt from "better-sqlite3"
import Axios from "axios"
import type * as at from "axios"
import { tables } from "./db_vars.ts"
import { hash_password } from "./db_helpers.ts"
import DatabaseWorker from "./db_methods.ts"
import Logger from "../../libs/helpers/loggers.ts"
import BlockchainSDK from "../../libs/helpers/blockchainSdk.ts"
import { default_users } from "../../libs/interfaces/User.ts"

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
			Logger.info(`DB INIT: dropped ${item["name"]}.`)
		}
	}
	for (const item of tables[table]["Fields"]) {
		if (dbrows.indexOf(item) === -1 && item.length > 0) {
			db.prepare(`ALTER TABLE ${table} ADD ${item} ${tables[table]["Arguments"][tables[table]["Fields"].indexOf(item)]}`).run()
			Logger.info(`DB INIT: added ${item}.`)
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
					Logger.info(`DB INIT: Created table ${tables[item].Name}`);
				}
				else
					check_db_columns(db, tables[item].Name);
			}
			for (const item in default_users) {
				if (db.prepare(`SELECT * FROM ${tables.Players.Name} WHERE ${tables.Players.Fields[0]} = ?`).get(default_users[item].PlayerID) === undefined) {
					let sql = `INSERT INTO ${tables.Players.Name} VALUES (`;
					for (const key of tables.Players.Fields) {
						if (key !== "")
							sql += ` @${key},`
						if (default_users[item][key] === undefined)
							default_users[item][key] = null
					}
					db.prepare(sql.replace(/.$/, ")")).run(default_users[item])
				}
			}
		} catch (error) {
			console.error(error);
			return reject(false);
		} finally {
			db.close()
		}
		return resolve(true);
	})
}

//
// Adds a default user with Admin privileges and guest data.
//

export async function add_default_user() {
	return new Promise(async (resolve, reject) => {
		try {
			const test = DatabaseWorker.get_del(tables.Players.Name, tables.Players.Fields[1], process.env.ADMIN_NAME as string, "get")
			if (test[tables.Players.Fields[1]] === process.env.ADMIN_NAME as string)
				return resolve(true);
		} catch (e) {
			if (e.code !== 404) {
				console.dir(e);
				return reject(false);
			}
		}
		const default_user: object = { DisplayName: process.env.ADMIN_NAME, EmailAddress: "DEFAULTEMAIL", Admin: 1 };
		try {
			default_user["Password"] = await hash_password(process.env.ADMIN_PASSWORD as string)
			DatabaseWorker.post(tables.Players.Name, tables.Players.Fields, default_user)
		} catch (e) {
			console.dir(e);
			return reject(false);
		}
		return resolve(true);
	})
}

//
// Check if the SmartContract already exists in the database.
// If it isnt, it can only mean that it was not generated!
// So we kindly ask the blockchain module to do it and we then store it inside of the CurrentContract table :)
//

export async function check_contract() {
	const block = new BlockchainSDK();
	const resp: object | undefined = DatabaseWorker.get_contract(tables.CurrentContract.Name);
	if (resp !== undefined) {
		await block.deploy(resp[tables.CurrentContract.Fields[0]])
			.then(function(response: at.AxiosResponse) {
				Logger.info(`Sent ${resp[tables.CurrentContract.Fields[0]]} successfully.`)
			})
			.catch(function(error: at.AxiosError) {
				Logger.info(`Failed to send ${resp[tables.CurrentContract.Fields[0]]}\n ${error}`)
			})
		Logger.info(`Blockchain already there: ${resp[tables.CurrentContract.Fields[0]]}`)
		return;
	}
	block.deploy(undefined)
		.then(function(response: at.AxiosResponse) {
			const obj = {};
			obj[tables.CurrentContract.Fields[0]] = response.data;
			DatabaseWorker.post(tables.CurrentContract.Name, tables.CurrentContract.Fields, obj)
			Logger.info(`Blockchain initialized: ${response.data}`)
		})
		.catch(function(error: at.AxiosError) {
			console.error("WARN: BLOCKCHAIN NOT INITIALIZED!")
			Logger.info(`${error.name} ${error.code}`)
		})
}
