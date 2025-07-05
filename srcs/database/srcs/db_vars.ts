// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   db_vars.ts                                         :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: fclivaz <fclivaz@student.42lausanne.ch>    +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/04/24 01:10:34 by fclivaz           #+#    #+#             //
//   Updated: 2025/07/02 18:55:35 by fclivaz          ###   LAUSANNE.ch       //
//                                                                            //
// ************************************************************************** //

//
// Definition of the entire Database structure, parameters, routes, names etc.
// Each db_table is composed of:
// - Its Name
// - A Fields array containing every row for the table
// - An Arguments array containing every data type / argument for the corresponding row
// - Methods, defining what kind of operations you can do on the table
// - Identification, an object stating
// - - If the table needs to use an UUIDv4 (which MUST be the first column!)
// - - What should the prefix of that UUID be.
// Finally, you should include your newly defined table in the db_definition structure
// which hosts every defined table with a key of the same name.
// This whole structure allows for the automatic generation/checks as well as
// the procedural SQL generation in the PUT and POST requests.
//

interface table_id {
	HasID: boolean;
	IDPrefix?: string;
}

interface methods {
	GET?: Array<string>,
	POST?: Array<string>,
	PUT?: Array<string>,
	DELETE?: Array<string>
}

interface db_table {
	Name: string;
	Fields: Array<string>;
	Arguments: Array<string>;
	Methods: methods;
	Identification: table_id;
}

export interface db_definition {
	Players: db_table;
	Matches: db_table;
	Tournaments: db_table;
	UIDTable: db_table;
	CurrentContract: db_table;
}

const PlayersTable: db_table =
{
	"Name": "Players",
	"Fields": [
		"PlayerID",
		"DisplayName",
		"EmailAddress",
		"Password",
		"OAuthID",
		"FriendsList",
		"Private",
		"LastAlive",
		"Admin"
	],
	"Arguments": [
		"TEXT NOT NULL PRIMARY KEY",
		"TEXT UNIQUE NOT NULL",
		"TEXT UNIQUE NOT NULL",
		"TEXT NOT NULL",
		"TEXT DEFAULT NULL",
		"TEXT DEFAULT NULL",
		"INTEGER DEFAULT 0",
		"INTEGER DEFAULT 0",
		"INTEGER DEFAULT 0",
		"INTEGER DEFAULT 0"
	],
	"Methods": {
		"GET": [
			"/multiget",
			"/PlayerID/:PlayerID",
			"/OAuthID/:OAuthID",
			"/DisplayName/:DisplayName",
			"/EmailAddress/:EmailAddress"
		],
		"POST": [
			""
		],
		"DELETE": [
			"/PlayerID/:PlayerID",
			"/DisplayName/:DisplayName",
			"/EmailAddress/:EmailAddress"
		],
		"PUT": [
			"/PlayerID/:PlayerID",
		]
	},
	"Identification": {
		"HasID": true,
		"IDPrefix": "P-"
	}
}

const MatchesTable: db_table =
{
	"Name": "Matches",
	"Fields": [
		"MatchID",
		"WPlayerID",
		"LPlayerID",
		"WScore",
		"LScore",
		"WGuestName",
		"LGuestName",
		"StartTime",
		"EndTime",
		"MatchIndex",
		"HashAddress",
	],
	"Arguments": [
		"TEXT NOT NULL PRIMARY KEY",
		`TEXT REFERENCES ${PlayersTable.Name}(${PlayersTable.Fields[0]}) ON DELETE SET NULL`,
		`TEXT REFERENCES ${PlayersTable.Name}(${PlayersTable.Fields[0]}) ON DELETE SET NULL`,
		"INTEGER NOT NULL",
		"INTEGER NOT NULL",
		"TEXT DEFAULT NULL",
		"TEXT DEFAULT NULL",
		"INTEGER NOT NULL",
		"INTEGER NOT NULL",
		"INTEGER NOT NULL",
		"TEXT DEFAULT NULL"
	],
	"Methods": {
		"GET": [
			"/multiget",
			"/PlayerID/:PlayerID",
			"/MatchID/:MatchID",
		],
		"POST": [
			""
		],
		"PUT": [
			"/MatchID/:MatchID",
		]
	},
	"Identification": {
		"HasID": true,
		"IDPrefix": "M-"
	}
}

const TournamentsTable: db_table =
{
	"Name": "Tournaments",
	"Fields": [
		"TournamentID",
		"TournamentData"
	],
	"Arguments": [
		"TEXT NOT NULL",
		"TEXT NOT NULL"
	],
	"Methods": {
		"GET": [
			"/TournamentID/:TournamentID",
		],
		"POST": [
			""
		],
	},
	"Identification": {
		"HasID": true,
		"IDPrefix": "T-"
	}
}

const UIDTable: db_table =
{
	"Name": "UIDTable",
	"Fields": [
		"UID"
	],
	"Arguments": [
		"TEXT NOT NULL PRIMARY KEY"
	],
	"Methods": {},
	"Identification": {
		"HasID": false
	}
}

const CurrentContract: db_table =
{
	"Name": "CurrentContract",
	"Fields": [
		"ContractAddress"
	],
	"Arguments": [
		"TEXT NOT NULL PRIMARY KEY"
	],
	"Methods": {
		"GET": [
			""
		],
	},
	"Identification": {
		"HasID": false
	}
}

export const tables: db_definition =
{
	"Players": PlayersTable,
	"Matches": MatchesTable,
	"Tournaments": TournamentsTable,
	"UIDTable": UIDTable,
	"CurrentContract": CurrentContract
}
