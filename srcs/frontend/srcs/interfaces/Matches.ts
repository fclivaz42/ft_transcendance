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

export interface Match_complete {
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
