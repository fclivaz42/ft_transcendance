export interface Round {
	P1: string;
	P2: string;
	P1Score: number;
	P2Score: number;
	Round: number;
	Match: number;
}

export interface TournamentBracket {
	Rounds: Round[];
}
