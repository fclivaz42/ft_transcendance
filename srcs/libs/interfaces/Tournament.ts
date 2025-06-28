import type { Match_complete, Match } from "./Match"

export interface Tournament_metadata {
	TournamentID?: string,
	TournamentData: Array<string>
}

export interface Tournament_lite {
	TournamentID: string,
	TournamentData: Array<Match>
}

export interface Tournament_full {
	TournamentID: string,
	TournamentData: Array<Match_complete>
}
