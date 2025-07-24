import GameRoom from "./GameRoom.ts";
import PlayerSession from "./PlayerSession.ts";

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
		this.broadcast(this.buildPlayerConnectedPayload(playerSession));
	}
}
