import PlayerSession from "./PlayerSession.ts";
import TournamentLobby from "./TournamentLobby.ts";
import TournamentBracket from "./TournamentBracket.ts";
import GameRoom from "./GameRoom.ts";

import {
	TournamentScore,
	TournamentInitPayload,
	TournamentPlayerConnected,
	TournamentPlayerDisconnected,
	TournamentScoreUpdatePayload,
	TournamentMatchOverPayload,
	TournamentOverPayload,
	type TournamentMessage,
	type LobbyBroadcastPayload,
} from "./types.ts";

export default class TournamentRoom extends GameRoom {
	//inherits id: string
	//inherits player: PlayerSession[] = [];
	//inherits game: Game;
	//inherits lock: boolean;
	// inherits _lastMessage?: string as PRIVATE;
	// inherits _lastCollision?: CollisionPayload as PRIVATE;
	// inherits _start_time: number = Date.now(): as PRIVATE;
	public override score: TournamentScore;
	private _lobby: TournamentLobby;
	private _bracket: TournamentBracket;
	constructor(
		id: string,
		vsAI: boolean = false,
		lobby: TournamentLobby,
		bracket: TournamentBracket,
		onGameOver?: (roomId: string) => void
	) {
		super(id, vsAI, onGameOver);
		this._lobby = lobby;
		this.score = { p1: 0, p2: 0, round: this._bracket.getCurrentRound() };
	}

	// public isFull(): boolean inherited
	// public isEmpty(): boolean inherited
	// public getGame(): Game inherited

	public override getScore(): TournamentScore {
		return this.score;
	}

	public override addScore(player: number): void {
		player === 1 ? this.score.p1++ : this.score.p2++;
		this.score.round = this._bracket.getCurrentRound();
		this.broadcast(this.buildScoreUpdatePayload());
		if (this.score.p1 === 6) {
			console.log("GAME OVER!, P1 Won!");
			this._killGame(1);
		} else if (this.score.p2 === 6) {
			console.log("GAME OVER! P2 Won");
			this._killGame(2);
		}
	}

	// TODO: Please adjust to Tournament! @fclivaz 
	override async _send_to_db(p1: string, p2: string, winner: number) {
		const db_sdk = new DatabaseSDK();
		let winner_id: string = winner === 1 ? p1 : p2;
		let loser_id: string = winner === 1 ? p2 : p1;
		if (winner_id.startsWith("AI_")) winner_id = default_users.Guest.PlayerID;
		if (loser_id.startsWith("AI_")) loser_id = default_users.Guest.PlayerID;
		return db_sdk.create_match({
			WPlayerID: await db_sdk
				.get_user(winner_id, "PlayerID")
				.then((response) => response.data.PlayerID)
				.catch((error) => default_users.Deleted.PlayerID),
			LPlayerID: await db_sdk
				.get_user(loser_id, "PlayerID")
				.then((response) => response.data.PlayerID)
				.catch((error) => default_users.Deleted.PlayerID),
			WScore: this.score.p1 > this.score.p2 ? this.score.p1 : this.score.p2,
			LScore: this.score.p1 < this.score.p2 ? this.score.p1 : this.score.p2,
			StartTime: this._start_time,
			EndTime: Date.now(),
			// WARN: MUST BE CHANGED FOR TOURNAMENT
			MatchIndex: 0,
		});
	}
}
