// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   db_vars.ts                                         :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: fclivaz <fclivaz@student.42lausanne.ch>    +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/04/24 01:10:34 by fclivaz           #+#    #+#             //
//   Updated: 2025/06/06 21:04:13 by fclivaz          ###   LAUSANNE.ch       //
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
	IDPrefix: string;
}

interface db_table {
	Name: string;
	Fields: Array<string>;
	Arguments: Array<string>;
	Methods: Array<string>;
	Identification: table_id;
}

export interface db_definition {
	OAuth: db_table;
	Players: db_table;
	Matches: db_table;
	UIDTable: db_table;
	CurrentContract: db_table;
}

const OauthTable: db_table =
{
	"Name": "OAuth",
	"Fields": [
		"SubjectID",
		"IssuerName",
		"EmailAddress",
		"FullName",
		"FirstName",
		"FamilyName",
		"TokenHash",
		"IssueTime",
		"ExpirationTime",
		""
	],
	"Arguments": [
		"TEXT NOT NULL",
		"TEXT NOT NULL",
		"TEXT NOT NULL",
		"TEXT DEFAULT NULL",
		"TEXT DEFAULT NULL",
		"TEXT DEFAULT NULL",
		"TEXT NOT NULL",
		"INTEGER NOT NULL",
		"INTEGER DEFAULT 0",
		"PRIMARY KEY (SubjectID, IssuerName)"
	],
	"Methods": [
		"GET",
		"POST",
		"DELETE",
		"PUT"
	],
	"Identification": {
		"HasID": false,
		"IDPrefix": "O-"
	}
}

const PlayersTable: db_table =
{
	"Name": "Players",
	"Fields": [
		"PlayerID",
		"DisplayName",
		"EmailAddress",
		"PassHash",
		"OAuthID",
		"FriendsList",
		"PhoneNumber",
		"FirstName",
		"FamilyName",
		"Bappy",
		"Admin"
	],
	"Arguments": [
		"TEXT NOT NULL PRIMARY KEY",
		"TEXT UNIQUE NOT NULL",
		"TEXT UNIQUE NOT NULL",
		"TEXT NOT NULL",
		`TEXT DEFAULT NULL REFERENCES ${OauthTable.Name}(${OauthTable.Fields[0]}) ON DELETE SET NULL`,
		"TEXT DEFAULT NULL",
		"TEXT DEFAULT NULL",
		"TEXT DEFAULT NULL",
		"TEXT DEFAULT NULL",
		"INTEGER DEFAULT 0",
		"INTEGER DEFAULT 0"
	],
	"Methods": [
		"GET",
		"POST",
		"PUT",
		"DELETE"
	],
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
		"PlayerOneID",
		"PlayerTwoID",
		"WinnerPlayerID",
		"ScoreOne",
		"ScoreTwo",
		"StartTime",
		"EndTime",
		"MatchIndex"
	],
	"Arguments": [
		"TEXT NOT NULL PRIMARY KEY",
		`TEXT REFERENCES ${PlayersTable.Name}(${PlayersTable.Fields[0]}) ON DELETE SET NULL`,
		`TEXT REFERENCES ${PlayersTable.Name}(${PlayersTable.Fields[0]}) ON DELETE SET NULL`,
		`TEXT REFERENCES ${PlayersTable.Name}(${PlayersTable.Fields[0]}) ON DELETE SET NULL`,
		"INTEGER NOT NULL",
		"INTEGER NOT NULL",
		"INTEGER NOT NULL",
		"INTEGER NOT NULL",
		"INTEGER NOT NULL"
	],
	"Methods": [
		"GET",
		"POST"
	],
	"Identification": {
		"HasID": true,
		"IDPrefix": "M-"
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
	"Methods": [],
	"Identification": {
		"HasID": false,
		"IDPrefix": "U-"
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
	"Methods": [
		"POST"
	],
	"Identification": {
		"HasID": false,
		"IDPrefix": "C-"
	}
}

export const tables: db_definition =
{
	"OAuth": OauthTable,
	"Players": PlayersTable,
	"Matches": MatchesTable,
	"UIDTable": UIDTable,
	"CurrentContract": CurrentContract
}
