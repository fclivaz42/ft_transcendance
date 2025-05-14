import Database from "better-sqlite3"
import { tables } from "./db_vars.js"

const db = new Database("../../data/SARIF.db");

const swag = db.pragma("table_info(Players)")

for (const item of swag)
	if (tables["Players"]["Fields"].indexOf(item["name"]) === -1 )
		console.log(`OBJECT ${item["name"]} DOES NOT EXIST!`)
	else
		console.log(`item ${item["name"]} is here :3`)
