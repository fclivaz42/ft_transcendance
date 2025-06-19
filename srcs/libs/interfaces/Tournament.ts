export interface TournamentMatch {
	MatchID: string,
	MatchIndex: number,
	ParentMatchOne?: TournamentMatch,
	ParentMatchTwo?: TournamentMatch,
}

export interface Tournament {
	TournamentWinner: TournamentMatch
}
