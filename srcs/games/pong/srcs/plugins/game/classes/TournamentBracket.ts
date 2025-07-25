import PlayerSession from "./PlayerSession.ts";
import TournamentLobby from "./TournamentLobby.ts";
import type {
	TournamentBracketStatus,
	TournamentMatchStatus,
} from "./types.ts";

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
			round: this._currentRound, //0 quarter-final 1 semi-final 2 final
			match: [winner, loser],
			winner,
			score,
		});

		loser.getSocket()?.send(JSON.stringify({ type: "eliminated" }));
		loser.getSocket()?.close();

		// if (
		// 	this._winners[this._currentRound].length ===
		// 	this._rounds[this._currentRound].length
		// ) {
		// 	this._advanceRound();
		// }
	}

	private _createMatches(players: PlayerSession[]): Match[] {
		const matches: Match[] = [];
		for (let i = 0; i < players.length; i += 2) {
			matches.push([players[i], players[i + 1]]);
		}
		return matches;
	}

	public advanceRound(): void {
		const nextPlayers = this._winners[this._currentRound];
		console.log(`Advancing round with next players: ${nextPlayers}`);

		console.log(`nextPlayers length: ${nextPlayers.length}`);

		if (nextPlayers.length === 1) {
			this.isFinished = true;
			console.log("Tournament finished. Winner:", nextPlayers[0].getUserId());
			return;
		}

		this._currentRound++;
		this._rounds[this._currentRound] = this._createMatches(nextPlayers);
		this._winners[this._currentRound] = [];
	}

	public async getTournamentStatus(): Promise<TournamentMatchStatus[][]> {
		return await Promise.all(this._rounds.map(async (matches, roundIndex) =>
			await Promise.all(matches.map(async (match, matchIndex) => ({
				round: roundIndex,
				matchIndex: matchIndex,
				p1: match[0].getUserId(),
				p1UserInfo: (await match[0].getDataFromSDK()),
				p2: match[1].getUserId(),
				p2UserInfo: (await match[1].getDataFromSDK()),
				scoreP1: this._getScore(match, match[0]),
				scoreP2: this._getScore(match, match[1]),
			})))
		));
	}

	private _getScore(match: Match, player: PlayerSession): number {
		const result = this._results.find(
			(res) =>
				(res.match[0] === match[0] && res.match[1] === match[1]) ||
				(res.match[0] === match[1] && res.match[1] === match[0])
		);
		if (!result) return 0;
		return result.match[0] === player ? result.score.p1 : result.score.p2;
	}

	public broadcastBracket(lobby: TournamentLobby) {
		this.getTournamentStatus().then((status) => {
			const payload: TournamentBracketStatus = {
				type: "tournament-status",
				data: status,
			};
			lobby.broadcast(payload);
		});
	}
}
