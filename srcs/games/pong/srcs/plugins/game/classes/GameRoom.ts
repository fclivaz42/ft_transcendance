import Game from "./GameClass.ts";
import Paddle from "./Paddle.ts";
import PlayerSession from "./PlayerSession.ts";
import { DEFAULT_FPS } from "./Playfield.ts";
import DatabaseSDK from "../../../../../../libs/helpers/databaseSdk.ts";
import { default_users } from "../../../../../../libs/interfaces/User.ts";
import { MAX_SCORE } from "./types.ts";

import type {
	UpdatePayload,
	InitPayload,
	PlayerConnectedPayload,
	PlayerDisconnectedPayload,
	CollisionPayload,
	ScoreUpdatePayload,
	GameOverPayload,
	GameMessage,
	LobbyBroadcastPayload,
	TournamentMessage,
	TournamentInitPayload,
} from "./types.ts";

export default class GameRoom {
	public id: string;
	public players: PlayerSession[] = [];
	public game: Game;
	public score: { p1: number; p2: number };
	public lock: boolean = false;
	protected _lastMessage?: string;
	protected _lastCollision?: CollisionPayload;
	protected _start_time: number = Date.now();

	protected _onGameOver?: (roomId: string) => void;

	constructor(
		id: string,
		vsAI: boolean = false,
		onGameOver?: (roomId: string) => void
	) {
		this.id = id;
		this.game = new Game(vsAI);
		const paddles: Paddle[] = this.game.getPaddles();
		paddles.at(0)?.setGameRoom(this);
		paddles.at(1)?.setGameRoom(this);
		this.score = { p1: 0, p2: 0 };
		this._onGameOver = onGameOver;
	}

	public isFull(): boolean {
		console.log(`current players in room: ${this.players.length}`);
		return this.players.length >= 2;
	}

	public isEmpty(): boolean {
		return this.players.length === 0;
	}

	public getGame(): Game {
		return this.game;
	}

	public getScore(): { p1: number; p2: number } {
		return this.score;
	}

	public setOnGameOver(callback: (roomId: string) => void): void {
		this._onGameOver = callback;
	}

	public addPlayer(
		playerSession: PlayerSession,
		paddleIdOverride: boolean = false
	): void {
		this.players.push(playerSession);

		if (!playerSession.isAI) {
			playerSession.setRoom(this);
			this.broadcast(this.buildPlayerConnectedPayload(playerSession));
		}

		if (paddleIdOverride) {
			playerSession.setPaddleId("p2");
		} else if (this.players.length === 1) {
			playerSession.setPaddleId("p1");
		} else if (this.players.length === 2) {
			playerSession.setPaddleId("p2");
		}

		if (playerSession.isAI) {
			if (playerSession.getPaddleId() === "p1") {
				this.game.setP1IA(true);
			} else {
				this.game.setP2IA(true);
			}
		}

		if (this.isFull() || this.lock) {
			console.log("GAME READY TO BE STARTED.");
			this.startGame();
		}
	}

	public removePlayer(playerSession: PlayerSession): void {
		this.players = this.players.filter((p) => p !== playerSession);
		console.log(
			`Removed player ${playerSession.getUserId()} from room ${this.id}`
		);

		this.broadcast(this.buildPlayerDisconnectedPayload(playerSession));

		if (this.isEmpty()) {
			this.game.gameStop();
			if (this._onGameOver) {
				this._onGameOver(this.id);
			}
			return;
		}
		playerSession.getPaddleId() === "p1"
			? this.game.setP1IA(true)
			: this.game.setP2IA(true);
		// on a player disconnect sets AI to missing player and locks the room
		this.lock = true;
	}

	public addScore(player: number) {
		player === 1 ? this.score.p1++ : this.score.p2++;
		this.broadcast(this.buildScoreUpdatePayload());
		if (this.score.p1 === MAX_SCORE) {
			console.log("GAME OVER!, P1 Won!");
			this._killGame(1);
		} else if (this.score.p2 === MAX_SCORE) {
			console.log("GAME OVER! P2 Won");
			this._killGame(2);
		}
	}

	public startGame() {
		this.game.setBroadcastFunction(() => {
			this.floodlessBroadcast(this.buildUpdatePayload());
		});

		this.game.setRoom(this);

		const ball = this.game.getBall();
		ball.setOnCollision((collisionInfo) => {
			this.floodlessBroadcast(this.buildCollisionPayload(collisionInfo));
		});

		this.broadcast(this.buildInitPayload());
		this._start_time = Date.now();
		this.game.gameStart(DEFAULT_FPS);
	}

	protected async _send_to_db(p1: string, p2: string, winner: number) {
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

	protected async _killGame(winner: number) {
		let res = this._send_to_db(
			this.players[0]
				? this.players[0].getUserId()
				: default_users.Guest.PlayerID,
			this.players[1]
				? this.players[1].getUserId()
				: default_users.Guest.PlayerID,
			winner
		);
		this.broadcast(this.buildGameOverPayload(winner));
		this.game.gameStop();
		if (this._onGameOver) {
			this._onGameOver(this.id);
		}
		res
			.then(function (response) {
				console.log(`Match successfully created:`);
				console.dir(response.data);
			})
			.catch(function (error) {
				console.error(`WARN: match could not be sent to db!`);
				console.dir(error);
			});
	}

	public broadcast(
		message: GameMessage | LobbyBroadcastPayload | TournamentMessage
	): void {
		if (message.type !== "update") {
			// console.log(JSON.stringify(message, null, 2));
		}
		for (const p of this.players) {
			try {
				p.send(message);
			} catch (err) {
				console.error(`Failed to send to player: ${this.id}: ${err}`);
			}
		}
	}

	public floodlessBroadcast(
		message: GameMessage | LobbyBroadcastPayload | TournamentMessage
	): void {
		if (message.type === "collision") {
			const payload = message.payload;
			if (
				this._lastCollision &&
				this._lastCollision.payload.collider === payload.collider
			) {
				return;
			}
			this._lastCollision = message;
		} else if (message.type === "update") {
			const current = JSON.stringify(message);
			if (this._lastMessage === current) return;
			this._lastMessage = current;
		}

		// debug
		if (message.type !== "update") {
			// console.log(JSON.stringify(message, null, 2));
		}
		// enddebug

		for (const p of this.players) {
			try {
				p.send(message);
			} catch (err) {
				console.error(`Failed to send to player: ${this.id}: ${err}`);
			}
		}
	}

	/* BUILDING PAYLOADS ---------------------------------------------------------------------------- */
	private buildInitPayload(): InitPayload {
		const game = this.game;
		const ball = game.getBall();
		const [p1, p2] = game.getPaddles();
		const walls = game.getWallsForWs();
		const lightsCamera = game.getField();

		const initPayload: InitPayload = {
			type: "init",
			payload: {
				ball: ball.getBallInitInfo(),
				p1: p1.getInitInfo(),
				p2: p2.getInitInfo(),
				walls: walls,
				camera: lightsCamera.getCameraInitInfo(),
				light: lightsCamera.getLightInitInfo(),
				roomID: this.id,
				connectedPlayers: {
					p1: this.players.at(0)?.getUserId(),
					p2: this.players.at(1)?.getUserId(),
				},
			},
		};
		return initPayload;
	}

	protected buildUpdatePayload(): UpdatePayload {
		const game = this.game;
		const ball = game.getBall();
		const [p1, p2] = game.getPaddles();

		const updatePayload: UpdatePayload = {
			type: "update",
			payload: {
				ball: {
					curr_speed: ball.getCurrSpeed(),
					curr_position: ball.getPosition().asArray(),
				},
				p1: {
					max_speed: p1.getSpeed(),
					position: p1.getPosition().asArray(),
				},
				p2: {
					max_speed: p2.getSpeed(),
					position: p2.getPosition().asArray(),
				},
			},
		};
		return updatePayload;
	}

	private buildPlayerConnectedPayload(
		sessions: PlayerSession
	): PlayerConnectedPayload {
		const playerConnectedPayload: PlayerConnectedPayload = {
			type: "connect",
			payload: {
				playerID: sessions.getUserId(),
				roomID: this.id,
			},
		};
		return playerConnectedPayload;
	}

	private buildPlayerDisconnectedPayload(
		sessions: PlayerSession
	): PlayerDisconnectedPayload {
		const playerDisconnectedPayload: PlayerDisconnectedPayload = {
			type: "disconnect",
			payload: {
				playerID: sessions.getUserId(),
			},
		};
		return playerDisconnectedPayload;
	}

	private buildScoreUpdatePayload(): ScoreUpdatePayload {
		const scoreUpdate: ScoreUpdatePayload = {
			type: "score",
			payload: {
				score: {
					p1: this.score.p1,
					p2: this.score.p2,
				},
			},
		};
		return scoreUpdate;
	}

	protected buildCollisionPayload(collisionInfo: string): CollisionPayload {
		const collisionPayload: CollisionPayload = {
			type: "collision",
			payload: {
				collider: collisionInfo,
			},
		};
		return collisionPayload;
	}

	public buildGameOverPayload(winner: number): GameOverPayload {
		const gameOver: GameOverPayload = {
			type: "gameover",
			payload: {
				winner: winner === 1 ? "p1" : "p2",
				loser: winner === 1 ? "p2" : "p1",
				final_score: this.score,
			},
		};
		return gameOver;
	}
}


// TODO: close socket on gameover for single games
