import type { User } from "./User";

export interface Match {
	MatchID?: string,
	WPlayerID: string | User,
	LPlayerID: string | User,
	WScore: number,
	LScore: number,
	WGuestName?: string,
	LGuestName?: string,
	StartTime: number,
	EndTime: number,
	MatchIndex: number,
	HashAddress?: string
}

export interface Match_hash {
	MatchID: string,
	HashAddress: string
}

export interface Match_complete extends Match {
	WPlayerID: User,
	LPlayerID: User,
}
