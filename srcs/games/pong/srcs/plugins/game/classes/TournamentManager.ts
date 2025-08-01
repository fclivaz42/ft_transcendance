import { generateRoomId } from "../helpers/id_generator.ts";
import TournamentLobby from "./TournamentLobby.ts";
import PlayerSession from "./PlayerSession.ts";
import RoomManager from "./RoomManager.ts";

export default class TournamentManager extends RoomManager {
	private _tournaments: Map<string, TournamentLobby> = new Map();
	private _healthCheckInterval: NodeJS.Timeout | null = null;

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
		this.addSession(session);

		session.setLobby(lobby);
		lobby.addPlayer(session);

		if (lobby.getPlayers().length === 1) {
			lobby.startWaitTimer();
		}

		if (lobby.getPlayers.length === this.MAX_PLAYERS) {
			lobby.clearWaitTimer();
			lobby.startRoundTimer();
		}

		this._startHealthCheck();
	}

	private _startHealthCheck() {
		if (this._healthCheckInterval) return;

		const CHECK_INTERVAL_MS = 2500;
		this._healthCheckInterval = setInterval(() => {
			if (this._tournaments.size > 0) {
				console.log(`tournaments size: ${this._tournaments.size}`);
				this._healthCheck();
			} else {
				this._stopHealthCheck();
			}
		}, CHECK_INTERVAL_MS);
	}

	private _stopHealthCheck() {
		if (this._healthCheckInterval) {
			clearInterval(this._healthCheckInterval);
			this._healthCheckInterval = null;
		}
	}

	private _healthCheck() {
		for (const tournament of this._tournaments.values()) {
			if (!tournament.healthCheck()) this.terminateLobby(tournament);
			else console.log(`${tournament.lobbyID}: health check OK!`);
		}
	}

	public terminateLobby(lobby: TournamentLobby): void {
		lobby.shutdown();
		this._tournaments.delete(lobby.lobbyID);
	}

	public removeSession(session: PlayerSession): void {
		this._connectedSessions.delete(session.getUserId());
		const lobby = session.getTournamentLobby();
		if (lobby) {
			lobby.removePlayer(session);
			if (lobby.isEmpty()) {
				this._tournaments.delete(lobby.lobbyID);
			}
		}
	}
}
