import TournamentLobby from "./TournamentLobby.ts";
import PlayerSession from "./PlayerSession.ts";
import Matchup from "./Matchup.ts";
import type {
	RoomScore,
	TournamentBracketStatus,
	TournamentMatchStatus,
} from "./types.ts";
import { match } from "assert";

export default class TournamentBracket {
	private _matchups: Matchup[] = [];
	private _currentRound = 0;
	public isFinished: boolean = false;

	constructor(initialPlayers: PlayerSession[], maxPlayers: number) {
		if (initialPlayers.length !== maxPlayers) {
			throw new Error("Tournament must start with exactly 8 players.");
		}

		this._createMatches(initialPlayers);
	}

	/* *************************************************************** */
	/*           GETTERS & SETTERS                                     */
	/* *************************************************************** */

	public getCurrentMatches(): Matchup[] {
		return this._matchups.filter((m) => m.round === this._currentRound);
	}

	public getCurrentRound(): number {
		return this._currentRound;
	}

	private _createMatches(players: PlayerSession[]): void {
		for (let i = 0; i < players.length; i += 2) {
			const matchIndex = i / 2;
			const p1 = players[i];
			const p2 = players[i + 1];
			this._matchups.push(new Matchup(0, matchIndex, p1, p2));
		}
		for (let i = 4; i < 7; i++) {
			this._matchups.push(new Matchup(i == 6 ? 2 : 1, i, null, null));
		}
	}

	public isRoundComplete(round: number): boolean {
		console.log("DEBUG:");
		const matches = this._matchups.filter((m) => m.round === round);
		for (const match of matches) {
			console.log(`match index: ${match.matchIndex}`);
		}
		return matches.every((m) => m.isComplete()) ? true : false;
	}

	public getTournamentStatus(): TournamentMatchStatus[] {
		const statusList: TournamentMatchStatus[] = [];

		for (const matchup of this._matchups) {
			const status: TournamentMatchStatus = {
				round: matchup.round,
				matchIndex: matchup.matchIndex,
				p1: matchup.p1?.getUserId() ?? null,
				p2: matchup.p2?.getUserId() ?? null,
				scoreP1: matchup.scoreP1,
				scoreP2: matchup.scoreP2,
			};
			statusList.push(status);
		}
		return statusList;
	}

	/* *************************************************************** */
	/*           BRACKET LOGIC                                         */
	/* *************************************************************** */

	private _advanceWinner(matchup: Matchup, winner: PlayerSession | null) {
		const round: number = matchup.round;
		const index: number = matchup.matchIndex;

		if (!winner) return;

		if (round >= 2) {
			this.isFinished = true;
			console.log(`Tournament finished. Winner: ${winner.getUserId()}`);
			return;
		}

		const nextRound: number = round + 1;
		const nextMatchIndex: number = this._adjustMatchIndex(
			Math.floor(index / 2),
			nextRound
		);
		if (nextMatchIndex < 0)
			throw new Error("Error: something went wrong in _adjustMatchIndex");

		const nextMatch = this._matchups.find(
			(m) => m.round === nextRound && m.matchIndex === nextMatchIndex
		);

		if (!nextMatch) throw new Error("Next round match not found");

		if (index % 2 === 0) {
			nextMatch.p1 = winner;
		} else {
			nextMatch.p2 = winner;
		}
	}

	private _ejectLoser(loser: PlayerSession | null) {
		if (!loser || loser.isAI) return;
		loser.getSocket()?.send(JSON.stringify({ type: "eliminated" }));
		loser.getSocket()?.close();
	}

	private _adjustMatchIndex(matchIndex: number, round: number): number {
		if (round !== 1 && round !== 2) throw new Error("getting wrong matchIndex here!");
		if (round === 1) return 4 + matchIndex;
		if (round === 2) return 6;
		return -1;
	}

	public markMatchResult(matchIndex: number, score: RoomScore) {
		console.log(`Entered markMatchResult for matchInbdex: ${matchIndex}`);
		const matchup = this._matchups[matchIndex];
		if (matchup.isComplete()) {
			console.warn(`Match ${matchIndex} already completed.`);
			return;
		}

		matchup.scoreP1 = score.p1;
		matchup.scoreP2 = score.p2;

		this._ejectLoser(matchup.getLoser());
		this._advanceWinner(matchup, matchup.getWinner());
	}

	public advanceRound(): void {
		if (this._currentRound < 2) this._currentRound++;
		console.log(`Advancing round to ${this._currentRound}`);
		console.log(`Next matches:`);
		for (const matchup of this._matchups.filter(
			(m) => m.round === this._currentRound
		)) {
			console.log(`Round: ${this._currentRound}`);
			console.log(`MatchIndex: ${matchup.matchIndex}`);
			console.log(`P1: ${matchup.p1}`);
			console.log(`P2: ${matchup.p2}`);
		}
	}

	public cleanUp(): void {
		this._matchups = [];
		this._currentRound = 0;
	}

	/* *************************************************************** */
	/*          BROADCAST MESSAGES                                     */
	/* *************************************************************** */

	public broadcastBracket(lobby: TournamentLobby): void {
		const payload: TournamentBracketStatus = {
			type: "tournament-status",
			payload: this.getTournamentStatus(),
		};
		lobby.lobbyBroadcast(payload);
	}

	public getFinalWinner(): PlayerSession | null {
		const finals = this._matchups.filter((m) => m.round === 2);
		return finals.at(0)?.getWinner() ?? null;
	}
}
