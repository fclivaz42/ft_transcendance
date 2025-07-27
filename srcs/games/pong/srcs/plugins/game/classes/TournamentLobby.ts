import PlayerSession from "./PlayerSession.ts";
import TournamentBracket from "./TournamentBracket.ts";
import TournamentRoom from "./TournamentRoom.ts";
import { shuffle } from "../helpers/shuffle.ts";
import { generateRoomId } from "../helpers/id_generator.ts";
import TournamentManager from "./TournamentManager.ts";
import { MAX_SCORE } from "./types.ts";
import type {
	RoomScore,
	TournamentMessage,
	TournamentOverPayload,
	TournamentPlayerConnected,
	TournamentPlayerDisconnected,
} from "./types.ts";

export default class TournamentLobby {
	public lobbyID: string;
	public _players: PlayerSession[] = [];
	public _rooms: Map<string, TournamentRoom> = new Map();
	private _manager: TournamentManager | undefined;
	private _matchingOpen: boolean = true;
	private _bracket: TournamentBracket;
	private _tournamentStarted: boolean = false;
	private _waitTimer: NodeJS.Timeout | null = null;
	private _roundTimer: NodeJS.Timeout | null = null;

	private readonly MAX_PLAYERS = 8;
	private readonly WAIT_TIME_MS = 10_000;
	private readonly MATCH_START_COUNTDOWN_MS = 5_000;

	constructor(id: string) {
		this.lobbyID = id;
	}

	/* *************************************************************** */
	/*            TIMERS                                               */
	/* *************************************************************** */

	public startWaitTimer(): void {
		if (this._waitTimer) return;

		console.log(`Starting ${this.WAIT_TIME_MS / 1000}s tournament fill timer`);
		this._waitTimer = setTimeout(() => {
			if (this._players.length !== this.MAX_PLAYERS) {
				console.log("Filling with AI");
				this._fillAI(); // implement
			}
			this.startRoundTimer();
		}, this.WAIT_TIME_MS);
	}

	public healthCheck(): boolean {
		const realPlayers = this.countRealPlayers();
		console.log(`[HealthCheck] ${this.lobbyID} → ${realPlayers} real players`);
		return realPlayers > 0;
	}

	public startRoundTimer(): void {
		if (this._roundTimer) return;
		if (!this._bracket) {
			const shuffled = shuffle([...this._players]);
			this._bracket = new TournamentBracket(shuffled, this.MAX_PLAYERS);
		}
		this._bracket.broadcastBracket(this);
		console.log(
			`Starting round ${this._bracket.getCurrentRound()} in ${
				this.MATCH_START_COUNTDOWN_MS / 1000
			}s`
		);
		this._roundTimer = setTimeout(() => {
			this._launchTournament(); // implement
		}, this.MATCH_START_COUNTDOWN_MS);
	}

	public clearWaitTimer() {
		if (this._waitTimer) {
			clearTimeout(this._waitTimer);
			this._waitTimer = null;
		}
	}

	public clearRoundTimer() {
		if (this._roundTimer) {
			clearTimeout(this._roundTimer);
			this._roundTimer = null;
		}
	}

	/* *************************************************************** */
	/*            TOURNAMENT LOGIC                                     */
	/* *************************************************************** */

	private _launchTournament() {
		if (!this._tournamentStarted) {
			this._tournamentStarted = true;
		}
		this.clearRoundTimer();
		if (this._bracket.isFinished) {
			return;
		}
		this._startNextRound();
	}

	private _startNextRound(): void {
		if (!this._bracket) return;

		const matches = this._bracket.getCurrentMatches();
		if (matches.every((m) => m.isComplete())) return;

		for (const match of matches) {
			if (!match.p1 || !match.p2) return;
			if (match.p1.isAI && match.p2.isAI) {
				const winner = Math.random() < 0.5 ? match.p1 : match.p2;
				const winnerScore = MAX_SCORE;
				const loserScore = Math.floor(Math.random() * (MAX_SCORE - 1));
				this._bracket.markMatchResult(match.matchIndex, {
					p1: winner === match.p1 ? winnerScore : loserScore,
					p2: winner === match.p2 ? winnerScore : loserScore,
				});
				console.log(
					`Match between ${match.p1.getUserId()} and ${match.p2.getUserId()} has concluded successfully!`
				);
			} else if (match.p1.isAI || match.p2.isAI) {
				this._handleAIRoom(match.p1, match.p2, match.matchIndex);
			} else {
				const room = this.createRoom(false, match.matchIndex);
				this._attachGameOverCallback(room, match.p1, match.p2);
				room.addPlayer(match.p1);
				room.addPlayer(match.p2, true);
				room.lock = true;
			}
		}
	}

	private _handleAIRoom(
		p1: PlayerSession,
		p2: PlayerSession,
		matchIndex: number
	) {
		if (p1.isAI && p2.isAI) {
			console.warn("Skipping AI vs AI in _handleAIRoom");
			return;
		}
		const room = this.createRoom(true, matchIndex);
		this._attachGameOverCallback(room, p1, p2);
		room.addPlayer(p1);
		room.addPlayer(p2, true);
		room.lock = true;
	}

	private _attachGameOverCallback(
		room: TournamentRoom,
		p1: PlayerSession,
		p2: PlayerSession
	) {
		room.setOnGameOver((roomId: string) => {
			console.log(`Game over in room ${roomId}`);
			const matchIndex = room.getMatchIndex();
			const score = room.getScore();
			this._bracket.markMatchResult(matchIndex, score);
			this._bracket.broadcastBracket(this);

			if (this._bracket.isFinished) {
				const winner = this._bracket.getFinalWinner();
				if (!winner) {
					console.error(
						`Tournament finished, but winner could not be determined`
					);
					return;
				}
				console.log(`Tournament finished! Winner: ${winner.getUserId()}`);
				this.lobbyBroadcast(this.buildTournamentOverPayload(winner));
				this._manager?.terminateLobby(this);
			} else if (
				this._bracket?.isRoundComplete(this._bracket.getCurrentRound())
			) {
				console.log("Attempting to start next round!");
				this._bracket.advanceRound();
				this.startRoundTimer();
			}
		});
	}

	public createRoom(
		vsAI: boolean = false,
		matchIndex: number
	): TournamentRoom {
		const roomId = "TOURNAMENT_" + generateRoomId();
		const room = new TournamentRoom(
			roomId,
			vsAI,
			this,
			this._bracket,
			matchIndex,
			(id) => {
				this._rooms.delete(id);
				console.log(`TournamentRoom ${id} deleted (empty or game over).`);
			}
		);
		this._rooms.set(roomId, room);
		console.log(`Created TournamentRoom with ID: ${roomId}`);
		return room;
	}

	/* *************************************************************** */
	/*           GETTERS & SETTERS                                     */
	/* *************************************************************** */

	public isFull(): boolean {
		console.log(`current players in the lobby: ${this._players.length}`);
		return this._players.length >= this.MAX_PLAYERS;
	}

	public countRealPlayers() {
		return this._players.filter(p => !p.isAI).length;
	}

	public isEmpty(): boolean {
		return this._players.length === 0;
	}

	public getMatchingOpen(): boolean {
		return this._matchingOpen;
	}

	public setMatchingOpen(val: boolean): void {
		this._matchingOpen = val;
	}

	public getPlayers(): PlayerSession[] {
		return this._players;
	}

	/* *************************************************************** */
	/*            PLAYER MANAGEMENT                                    */
	/* *************************************************************** */

	public addPlayer(playerSession: PlayerSession): void {
		this._players.push(playerSession);
		this.lobbyBroadcast(this.buildTournamentPlayerConnected(playerSession)); // implement
		console.log(`Player ${playerSession.getUserId()} joined ${this.lobbyID}`);
		console.log(
			`Current Players: ${this._players.length} / ${this.MAX_PLAYERS}`
		);
	}

	public removePlayer(playerSession: PlayerSession): void {
		this._players = this._players.filter((p) => p !== playerSession);
		console.log(
			`Removed player ${playerSession.getUserId()} from TournamentLobby ${
				this.lobbyID
			}`
		);
		this.lobbyBroadcast(this.buildTournamentPlayerDisconnected(playerSession));
	}

	private _fillAI() {
		const aiNeeded: number = this.MAX_PLAYERS - this._players.length;
		for (var i = 0; i < aiNeeded; i++) {
			const aiSession = new PlayerSession(null, `P-${i + 1}`);
			aiSession.isAI = true;
			this.addPlayer(aiSession);
		}
	}

	public linkManager(manager: TournamentManager) {
		this._manager = manager;
	}

	public shutdown(): void {
		for (const player of this._players) {
			if (!player.isAI) {
				player.getSocket()?.close();
			}
			this._bracket.cleanUp()
			this._players = [];
			this._rooms.clear();
		}
	}

	/* *************************************************************** */
	/*            WS BROADCASTING                                      */
	/* *************************************************************** */

	public lobbyBroadcast(message: TournamentMessage): void {
		if (message.type !== "update") {
			// console.log(JSON.stringify(message, null, 2));
		}
		for (const p of this._players) {
			try {
				p.send(message);
			} catch (err) {
				console.error(`Failed to send to player: ${this.lobbyID}: ${err}`);
			}
		}
	}

	public buildTournamentPlayerConnected(
		sessions: PlayerSession
	): TournamentPlayerConnected {
		const playerConnectedPayload: TournamentPlayerConnected = {
			type: "tournament-connect",
			payload: {
				playerID: sessions.getUserId(),
				roomID: this.lobbyID,
				lobbyID: this.lobbyID,
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
				lobbyID: this.lobbyID,
			},
		};
		return playerDisconnectedPayload;
	}

	private buildTournamentOverPayload(
		winner: PlayerSession
	): TournamentOverPayload {
		const tournamentOverPayload: TournamentOverPayload = {
			type: "tournament-over",
			payload: {
				winner: winner.getUserId(),
				lobbyID: this.lobbyID,
			},
		};
		return tournamentOverPayload;
	}
}
