import { match } from "node:assert";
import GameRoom from "./GameRoom.ts";
import PlayerSession from "./PlayerSession.ts";
import RoomManager from "./RoomManager.ts";
import TournamentBracket from "./TournamentBracket.ts";
import TournamentLobby from "./TournamentLobby.ts";

type GameMode = "tournament";

export default class TournamentManager extends RoomManager {
	private _lobby: TournamentLobby = new TournamentLobby("TOURNAMENT_LOBBY");
	// private _tournaments: Map<number, TournamentLobby> = new Map();
	private _bracket?: TournamentBracket;
	private _tournamentStarted: boolean = false;
	private _tournamentTimer: NodeJS.Timeout | null = null;
	private _launchCountdown: NodeJS.Timeout | null = null;

	private readonly MAX_PLAYERS = 8;
	private readonly WAIT_TIME_MS = 10_000;
	private readonly LAUNCH_COUNTDOWN_MS = 5_000;

	public assignTournamentPlayer(session: PlayerSession) {
		// this._assignToAvailableTournament
		if (this._tournamentStarted) {
			session.getSocket()?.close();
			// TODO: set up full Tournament logic, I guess it's ok if it's like a live event?
			// Maybe a message in front end Tournament started by a player X let's goo!
			return;
		}

		this._lobby.addPlayer(session);
		this.addSession(session);

		console.log(
			`Player ${session.getUserId()} joined tournament (${
				this._lobby.players.length
			}/8)`
		);

		if (this._lobby.players.length === 1) {
			this._startWaitTimer();
		}

		if (this._lobby.players.length === this.MAX_PLAYERS) {
			this._clearWaitTimer();
			this._startCountdownToLaunch();
		}
	}

	private _attachGameOverCallback(
		room: GameRoom,
		p1: PlayerSession,
		p2: PlayerSession
	) {
		room.setOnGameOver((roomId: string) => {
			console.log(`Game over in room ${roomId}`);
			const score = room.getScore();
			const winner = score.p1 > score.p2 ? p1 : p2;
			const loser = winner === p1 ? p2 : p1;

			this._bracket?.markMatchResult(winner, loser, score);

			if (this._bracket?.isFinished) {
				console.log("Tournament finished!");
			} else if (this._bracket?.isRoundComplete()) {
				console.log("Attempting to start next round!");
				this._startNextRound();
			}
		});
	}

	private _fillAI(count: number = 0) {
		const aiNeeded: number = this.MAX_PLAYERS - this._lobby.players.length;
		for (let i = 0; i < aiNeeded; i++) {
			const aiSession = new PlayerSession(null, `AI_${i}`);
			this._lobby.addPlayer(aiSession);
		}
	}

	private _startWaitTimer() {
		if (this._tournamentTimer) return;

		console.log(`Starting ${this.WAIT_TIME_MS / 1000}s tournament fill timer`);
		this._tournamentTimer = setTimeout(() => {
			if (this._lobby.players.length !== this.MAX_PLAYERS) {
				console.log("Filling with AI");
				this._fillAI();
				this._startCountdownToLaunch();
			}
		}, this.WAIT_TIME_MS);
	}

	private _startCountdownToLaunch() {
		if (this._launchCountdown) return;

		console.log(`Starting matches in ${this.LAUNCH_COUNTDOWN_MS / 1000}s.`);
		this._launchCountdown = setTimeout(() => {
			this._launchTournament();
		}, this.LAUNCH_COUNTDOWN_MS);
	}

	private _handleAIRoom(p1: PlayerSession, p2: PlayerSession) {
		if (p1.isAI && p2.isAI) {
			console.warn("Skipping AI vs AI in _handleAIRoom");
			return;
		}
		const room = this.createRoom(true);
		room.addPlayer(p1);
		room.addPlayer(p2, true);
		room.lock = true;
		this._attachGameOverCallback(room, p1, p2);
	}

	private _launchTournament() {
		this._tournamentStarted = true;
		this._clearLaunchCountdown();

		const shuffled = this._shuffle([...this._lobby.players]);
		console.log(
			`Length of players just before starting bracket: ${shuffled.length}.`
		);
		this._bracket = new TournamentBracket(shuffled, this.MAX_PLAYERS);

		this._startNextRound();
	}

	private _startNextRound(): void {
		if (!this._bracket) return;

		const matches = this._bracket.getCurrentMatches();
		if (matches.length === 0) return;

		console.log(`Starting round ${this._bracket.getCurrentRound() + 1}`);

		for (const [p1, p2] of matches) {
			if (p1.isAI && p2.isAI) {
				const winner = Math.random() < 0.5 ? p1 : p2;
				const loser = winner === p1 ? p2 : p1;

				const winnerScore = 6;
				const loserScore = Math.floor(Math.random() * 5);

				this._bracket.markMatchResult(winner, loser, {
					p1: winner === p1 ? winnerScore : loserScore,
					p2: winner === p2 ? winnerScore : loserScore,
				});
				console.log(
					`Match between ${p1.getUserId()} and ${p2.getUserId()} has concluded successfully!`
				);
			} else if (p1.isAI || p2.isAI) {
				this._handleAIRoom(p1, p2);
			} else {
				const room = this.createRoom();
				room.addPlayer(p1);
				room.addPlayer(p2, true);
				room.lock = true;
				this._attachGameOverCallback(room, p1, p2);
			}
		}
	}

	private _clearWaitTimer() {
		if (this._tournamentTimer) {
			clearTimeout(this._tournamentTimer);
			this._tournamentTimer = null;
		}
	}

	private _clearLaunchCountdown() {
		if (this._launchCountdown) {
			clearTimeout(this._launchCountdown);
			this._launchCountdown = null;
		}
	}
}
