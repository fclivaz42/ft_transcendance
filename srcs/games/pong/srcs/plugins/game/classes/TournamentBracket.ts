import { User } from "../../../../../../libs/interfaces/User.ts";
import NewTournamentLobby from "./new-TournamentLobby.ts";
import PlayerSession from "./PlayerSession.ts";
import TournamentLobby from "./TournamentLobby.ts";
import Matchup from "./Matchup.ts";
import type {
	RoomScore,
	TournamentBracketStatus,
	TournamentMatchStatus,
} from "./types.ts";

type Match = [PlayerSession, PlayerSession];

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

	private _createMatches(players: PlayerSession[]): void {
		for (let i = 0; i < players.length; i += 2) {
			const matchIndex = i / 2;
			const p1 = players[i];
			const p2 = players[i + 1];
			this._matchups.push(new Matchup(0, matchIndex, p1, p2));
		}
		for (let i = 4; i < 7; i++) {
			this._matchups.push(new Matchup(i == 7 ? 2 : 1, i, null, null));
		}
	}

	public getCurrentRound(): number {
		return this._currentRound;
	}

	private _ejectLoser(loser: PlayerSession | null) {
		if (!loser) return;
		loser.getSocket().send(JSON.stringify({type: "eliminated"}));
		loser.getSocket().close();
	}

	private _advanceWinner(matchup: Matchup, winner: PlayerSession | null) {
		const round = matchup.round;
		const index = matchup.matchIndex;
		if (round < 2) {
			if (round == 0) {

			} else {

		}
		}
		// handle win
	}

	public markMatchResult(matchIndex: number, score: RoomScore) {
		const matchup = this._matchups[matchIndex];
		matchup.scoreP1 = score.p1;
		matchup.scoreP2 = score.p2;

		this._ejectLoser(matchup.getLoser());
		this._advanceWinner(matchup, matchup.getWinner());


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

	public broadcastBracket(lobby: /* TournamentLobby | */ NewTournamentLobby) {
		this.getTournamentStatus().then((status) => {
			const payload: TournamentBracketStatus = {
				type: "tournament-status",
				data: status,
			};
			lobby.lobbyBroadcast(payload);
		});
	}
}

// adjust advance player to next round
// adjust broadcast of bracket to send a simple array of objects
// finish transferring heavy lifting logic to TournamentLobby from TournamentManager
	// startNextRound new logic
	// all necessary broadcasts
	// ideally TournamentRoom does not need to be touched
	// send bracket at round start, each match end
// cleanup and test!
