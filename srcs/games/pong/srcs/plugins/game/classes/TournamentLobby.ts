import GameRoom from "./GameRoom.ts";
import PlayerSession from "./PlayerSession.ts";

import type {
	TournamentPlayerConnected,
	TournamentPlayerDisconnected,
} from "./types.ts";



export default class TournamentLobby extends GameRoom {
	constructor(id: string = "TOURNAMENT_LOBBY") {
		super(id, false);
		this.lock = true;
	}

	public broadcastTimer(secondsRemaining: number): void {
		this.floodlessBroadcast({
			type: "timer",
			payload: { secondsRemaining },
		});
	}

	public broadcastMatchResult(
		roomID: string,
		winner: string,
		score: { p1: number; p2: number }
	): void {
		this.broadcast({
			type: "match_result",
			payload: { roomID, winner, score },
		});
	}

	public override addPlayer(playerSession: PlayerSession): void {
		this.players.push(playerSession);
		this.broadcast(this.buildTournamentPlayerConnected(playerSession));
	}

	public override removePlayer(playerSession: PlayerSession): void {
		this.players = this.players.filter((p) => p !== playerSession);
		console.log(
			`Removed player ${playerSession.getUserId()} from TournamentLobby ${
				this.id
			}`
		);
		this.broadcast(this.buildTournamentPlayerDisconnected(playerSession));
	}

	public buildTournamentPlayerConnected(
		sessions: PlayerSession
	): TournamentPlayerConnected {
		const playerConnectedPayload: TournamentPlayerConnected = {
			type: "tournament-connect",
			payload: {
				playerID: sessions.getUserId(),
				roomID: this.id,
				lobbyID: this.id,
			},
		};
		return playerConnectedPayload;
	}

	private buildTournamentPlayerDisconnected(
		sessions: PlayerSession
	): TournamentPlayerDisconnected {
		const playerDisconnectedPayload: TournamentPlayerDisconnected = {
			type: "tournament-disconnect",
			payload: {
				playerID: sessions.getUserId(),
				lobbyID: this.id,
			},
		};
		return playerDisconnectedPayload;
	}
}
