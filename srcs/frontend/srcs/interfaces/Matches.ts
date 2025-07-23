import { Users } from "./Users";

export interface Matches {
	"MatchID": string,
	"WPlayerID": string,
	"LPlayerID": string,
	"WScore": number,
	"LScore": number,
	"WGuestName": string | null,
	"LGuestName": string | null,
	"StartTime": number,
	"EndTime": number,
	"MatchIndex": number,
	"HashAddress": string,
};

export interface MatchComplete {
	"MatchID": string,
	"WPlayerID": Users,
	"LPlayerID": Users,
	"WScore": number,
	"LScore": number,
	"WGuestName": string | null,
	"LGuestName": string | null,
	"StartTime": number,
	"EndTime": number,
	"MatchIndex": number,
	"HashAddress": string,
};
