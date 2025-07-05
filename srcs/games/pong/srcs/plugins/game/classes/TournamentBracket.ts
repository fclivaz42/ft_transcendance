import PlayerSession from "./PlayerSession.ts";

type Match = [PlayerSession, PlayerSession];

interface MatchResult {
    round: number;
    match: Match;
    winner: PlayerSession;
    score: { p1: number; p2: number };
}

export default class TournamentBracket {
	private _rounds: Match[][] = [];
	private _winners: PlayerSession[][] = [];
    private _results: MatchResult[] = [];
	public isFinished: boolean = false;

	private _currentRound = 0;

	constructor(initialPlayers: PlayerSession[], maxPlayers: number) {
		if (initialPlayers.length !== maxPlayers) {
			throw new Error("Tournament must start with exactly 8 players.");
		}
		this._rounds[0] = this._createMatches(initialPlayers);
		this._winners[0] = [];
	}

	public getCurrentMatches(): Match[] {
		return this._rounds[this._currentRound];
	}

	public getCurrentRound(): number {
		return this._currentRound;
	}

    public getResults(): MatchResult[] {
        return this._results;
    }

    public isRoundComplete(): boolean {
        return (
            this._winners[this._currentRound]?.length ===
            this._rounds[this._currentRound]?.length
        );
    }

	public markMatchResult(
		winner: PlayerSession,
		loser: PlayerSession,
		score: { p1: number; p2: number }
	): void {
		this._winners[this._currentRound].push(winner);

		this._results.push({
            round: this._currentRound,
            match: [winner, loser],
            winner,
            score
        });

        loser.getSocket()?.send(JSON.stringify({ type: "eliminated" }));
        loser.getSocket()?.close();

        if (
            this._winners[this._currentRound].length ===
            this._rounds[this._currentRound].length
        ) {
            this._advanceRound();
        }
	}

	private _createMatches(players: PlayerSession[]): Match[] {
		const matches: Match[] = [];
		for (let i = 0; i < players.length; i += 2) {
			matches.push([players[i], players[i + 2]]);
		}
		return matches;
	}

	private _advanceRound(): void {
		const nextPlayers = this._winners[this._currentRound];

		if (nextPlayers.length === 1) {
			this.isFinished = true;
			console.log("Tournament finished. Winner:", nextPlayers[0].getUserId());
			return;
		}

		this._currentRound++;
		this._rounds[this._currentRound] = this._createMatches(nextPlayers);
		this._winners[this._currentRound] = [];
	}
}
