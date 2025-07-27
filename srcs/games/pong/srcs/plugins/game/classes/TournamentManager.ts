import { generateRoomId } from "../helpers/id_generator.ts";
import TournamentLobby from "./TournamentLobby.ts";
import PlayerSession from "./PlayerSession.ts";
import RoomManager from "./RoomManager.ts";

export default class TournamentManager extends RoomManager {
	private _tournaments: Map<string, TournamentLobby> = new Map();

	private readonly MAX_PLAYERS = 8;

	private _findAvailableTournament(): TournamentLobby | null {
		console.log("Searching for available tournament...");
		for (const lobby of this._tournaments.values()) {
			if (!lobby.isFull() && lobby.getMatchingOpen()) return lobby;
		}
		console.log("Available lobby not found...");
		return null;
	}

	public assignTournamentPlayer(session: PlayerSession) {
		let lobby = this._findAvailableTournament();
		if (!lobby) {
			lobby = new TournamentLobby("LOBBY_" + generateRoomId());
			lobby.linkManager(this);
		}
		this._tournaments.set(lobby.lobbyID, lobby);

		session.setLobby(lobby);
		lobby.addPlayer(session);

		if (lobby.getPlayers().length === 1) {
			lobby.startWaitTimer();
		}

		if (lobby.getPlayers.length === this.MAX_PLAYERS) {
			lobby.clearWaitTimer();
			lobby.startRoundTimer();
		}
	}

	public terminateLobby(lobby: TournamentLobby): void {
		lobby.shutdown();
		this._tournaments.delete(lobby.lobbyID);
	}
}
