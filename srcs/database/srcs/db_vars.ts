// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   db_vars.ts                                         :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: fclivaz <fclivaz@student.42lausanne.ch>    +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/04/24 01:10:34 by fclivaz           #+#    #+#             //
//   Updated: 2025/05/31 20:07:25 by fclivaz          ###   LAUSANNE.ch       //
//                                                                            //
// ************************************************************************** //

const OauthTable =
{
	"Name": "OauthTable",
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
	]
}

const PlayersTable =
{
	"Name": "Players",
	"Fields": [
		"PlayerID",
		"DisplayName",
		"EmailAddress",
		"PassHash",
		"OAuthID",
		"ActiveToken",
		"SessionID",
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
	]
}

const MatchesTable =
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
	]
}

const UIDTable =
{
	"Name": "UIDTable",
	"Fields": [
		"UID"
	],
	"Arguments": [
		"TEXT NOT NULL PRIMARY KEY"
	],
	"Methods": [
		"POST"
	]
}

const ActiveTokens =
{
	"Name": "ActiveTokens",
	"Fields": [
		"Token",
		"PlayerID"
	],
	"Arguments": [
		"TEXT NOT NULL PRIMARY KEY",
		`TEXT REFERENCES ${PlayersTable.Name}(${PlayersTable.Fields[0]}) ON DELETE CASCADE`,
	],
	"Methods": [
		"GET",
		"POST",
		"DELETE"
	]
}

const CurrentContract =
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
	]
}

export const tables =
{
	"OauthTable": OauthTable,
	"Players": PlayersTable,
	"Matches": MatchesTable,
	"UIDTable": UIDTable,
	"ActiveTokens": ActiveTokens,
	"CurrentContract": CurrentContract
}
