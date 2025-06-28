import type { User } from "./User";

export interface Match {
	MatchID?: string,
	WPlayerID: string | object,
	LPlayerID: string | object,
	WScore: number,
	LScore: number,
	WGuestName: string,
	LGuestName: string,
	StartTime: number,
	EndTime: number,
	MatchIndex: number,
	HashAddress?: string
}

export interface Match_complete extends Match {
	WPlayerID: User,
	LPlayerID: User,
	HashAddress: string
}
