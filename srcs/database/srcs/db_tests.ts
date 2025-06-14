// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   db_tests.ts                                        :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: fclivaz <fclivaz@student.42lausanne.ch>    +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/05/31 20:07:43 by fclivaz           #+#    #+#             //
//   Updated: 2025/05/31 20:07:45 by fclivaz          ###   LAUSANNE.ch       //
//                                                                            //
// ************************************************************************** //

import Database from "better-sqlite3"
import { tables } from "./db_vars.ts"
console.log(process.argv[2])

const db = new Database(process.argv[2]);

console.log(db.pragma("table_info(Players)"))
console.log(db.pragma("table_info(Matches)"))
console.log(db.pragma("table_info(UIDTable)"))
console.log(db.pragma("table_info(CurrentContract)"))

const swag = db.pragma("table_info(Players)") as Array<object>
const tempthing: Array<string> = [];

for (const item of swag) {
	tempthing.push(item["name"]);
	if (tables["Players"]["Fields"].indexOf(item["name"]) === -1)
		console.log(`OBJECT ${item["name"]} DOES NOT EXIST IN DEFINITION! (use DROP)`)
}

for (const item of tables["Players"]["Fields"])
	if (tempthing.indexOf(item) === -1)
		console.log(`OBJECT ${item} DOES NOT EXIST IN DATABASE! (use ALTER)`)
