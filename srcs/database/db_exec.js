// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   db_exec.js                                         :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: fclivaz <fclivaz@student.42lausanne.ch>    +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/03/05 19:12:25 by fclivaz           #+#    #+#             //
//   Updated: 2025/03/09 04:19:38 by fclivaz          ###   LAUSANNE.ch       //
//                                                                            //
// ************************************************************************** //

import sqlite3 from "sqlite3"

export const execute = async (db, sql, params = []) => {
	return new Promise((resolve, reject) => {
		db.run(sql, params, (err) => {
			if (err) reject(err);
			resolve();
		});
	});
};

export const init = async (db, sql) => {
	return new Promise((resolve, reject) => {
		db.exec(sql, (err) => {
			if (err) reject(err);
			resolve();
		});
	});
}

export const fetchAll = async (db, sql, params) => {
	return new Promise((resolve, reject) => {
	  db.all(sql, params, (err, rows) => {
	    if (err) reject(err);
	    resolve(rows);
	  });
	});
};

export const fetchFirst = async (db, sql, params = []) => {
	return new Promise((resolve, reject) => {
	  db.get(sql, params, (err, row) => {
	    if (err) reject(err);
	    resolve(row);
	  });
	});
};

export function sortData (obj, order) {
	let arr = [];
	for (let i = 0; order[i] != null; i++)
	{
		let str = order[i]
		console.log(str, i, obj[str])
		if (!obj[str])
				return []
		arr[i] = obj[str]
	}
	return arr
}


export async function checkExists (table, row, value, db) {
	let sql = `SELECT * FROM ${table} WHERE ${row} = ?`;
	try {
		variable = await fetchFirst(db, sql, [ value ]);
		return variable !== undefined;
	} catch (err) {
		console.log(err);
		return true
	}
}

export async function init_db() {
	const db = new sqlite3.Database("/data/SARIF.db")
	try {
		await init(db,
			`CREATE TABLE IF NOT EXISTS Players (
				PlayerID TEXT PRIMARY KEY,
				DisplayName TEXT UNIQUE NOT NULL,
				PassHash TEXT NOT NULL,
				ActiveTokens TEXT,
				EmailAddress TEXT NOT NULL,
				PhoneNumber TEXT NOT NULL,
				RealName TEXT NOT NULL,
				Surname TEXT NOT NULL,
				Bappy INTEGER NOT NULL);
			CREATE TABLE IF NOT EXISTS Matches (
				MatchID TEXT PRIMARY KEY,
				PlayerOneID TEXT NOT NULL,
				PlayerTwoID TEXT NOT NULL,
				WinnerPlayerID TEXT NOT NULL,
				ScoreOne INTEGER NOT NULL,
				ScoreTwo INTEGER NOT NULL,
				StartTime INTEGER NOT NULL,
				EndTime INTEGER NOT NULL,
				FOREIGN KEY (WinnerPlayerID) REFERENCES players(PlayerID) ON DELETE CASCADE,
				FOREIGN KEY (PlayerOneID) REFERENCES players(PlayerID) ON DELETE CASCADE,
				FOREIGN KEY (PlayerTwoID) REFERENCES players(PlayerID) ON DELETE CASCADE)`
		);
	} catch (error) {
		console.log(error);
	} finally {
		db.close()
	}
}
