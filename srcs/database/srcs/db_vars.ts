// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   db_vars.js                                         :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: fclivaz <fclivaz@student.42lausanne.ch>    +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/04/24 01:10:34 by fclivaz           #+#    #+#             //
//   Updated: 2025/05/13 00:38:55 by fclivaz          ###   LAUSANNE.ch       //
//                                                                            //
// ************************************************************************** //

const PlayersTable =
{
	"Name":			"Players",
	"Fields":		["PlayerID",
					"DisplayName",
					"PassHash",
					"ActiveTokens",
					"EmailAddress",
					"PhoneNumber",
					"RealName",
					"Surname",
					"Bappy",
					"Admin"],
	"Arguments":	["TEXT NOT NULL PRIMARY KEY",
					"TEXT UNIQUE NOT NULL",
					"TEXT NOT NULL",
					"TEXT",
					"TEXT UNIQUE NOT NULL",
					"TEXT NOT NULL",
					"TEXT NOT NULL",
					"TEXT NOT NULL",
					"INTEGER NOT NULL",
					"INTEGER"],
	"Methods":		["GET",
					"POST",
					"PUT",
					"DELETE"]
}

const MatchesTable =
{
	"Name":			"Matches",
	"Fields":		["MatchID",
					"PlayerOneID",
					"PlayerTwoID",
					"WinnerPlayerID",
					"ScoreOne",
					"ScoreTwo",
					"StartTime",
					"EndTime",
					"CryptoHash"],
	"Arguments":	["TEXT NOT NULL PRIMARY KEY",
					`TEXT REFERENCES ${PlayersTable.Name}(${PlayersTable.Fields[0]}) ON DELETE SET NULL`,
					`TEXT REFERENCES ${PlayersTable.Name}(${PlayersTable.Fields[0]}) ON DELETE SET NULL`,
					`TEXT REFERENCES ${PlayersTable.Name}(${PlayersTable.Fields[0]}) ON DELETE SET NULL`,
					"INTEGER NOT NULL",
					"INTEGER NOT NULL",
					"INTEGER NOT NULL",
					"INTEGER NOT NULL",
					"TEXT NOT NULL"],
	"Methods":		["GET",
					"POST"]
}

export const tables =
{
	"Players": PlayersTable,
	"Matches": MatchesTable
}
