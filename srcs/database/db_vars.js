// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   db_vars.js                                         :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: fclivaz <fclivaz@student.42lausanne.ch>    +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/04/24 01:10:34 by fclivaz           #+#    #+#             //
//   Updated: 2025/04/30 01:32:36 by fclivaz          ###   LAUSANNE.ch       //
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
					"TEXT NOT NULL",
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
					"EndTime"],
	"Arguments":	["TEXT NOT NULL PRIMARY KEY",
					`TEXT REFERENCES ${PlayersTable.Name}(${PlayersTable.Fields[0]})`,
					`TEXT REFERENCES ${PlayersTable.Name}(${PlayersTable.Fields[0]})`,
					`TEXT REFERENCES ${PlayersTable.Name}(${PlayersTable.Fields[0]})`,
					"INTEGER NOT NULL",
					"INTEGER NOT NULL",
					"INTEGER NOT NULL",
					"INTEGER NOT NULL"],
	"Methods":		["GET",
					"POST"]
}

export const tables =
{
	"Players": PlayersTable,
	"Matches": MatchesTable
}
