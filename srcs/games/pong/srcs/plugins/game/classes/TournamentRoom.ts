import PlayerSession from "./PlayerSession.ts";
import TournamentBracket from "./TournamentBracket.ts";
import GameRoom from "./GameRoom.ts";
import { DEFAULT_FPS } from "./Playfield.ts";
import DatabaseSDK from "../../../../../../libs/helpers/databaseSdk.ts";
import { default_users } from "../../../../../../libs/interfaces/User.ts";

import {
	type TournamentScore,
	type TournamentInitPayload,
	type TournamentScoreUpdatePayload,
	type TournamentMatchOverPayload,
	MAX_SCORE,
} from "./types.ts";
import TournamentLobby from "./TournamentLobby.ts";

export default class TournamentRoom extends GameRoom {
	public override score: TournamentScore;
	private _matchIndex: number;
	private _lobby: TournamentLobby;
	private _bracket: TournamentBracket;

	constructor(
		id: string,
		vsAI: boolean = false,
		lobby: TournamentLobby,
		bracket: TournamentBracket,
		matchIndex: number,
		onGameOver?: (roomId: string) => void
	) {
		super(id, vsAI, onGameOver);
		this.id = id;
		this._lobby = lobby;
		this._bracket = bracket;
		this._matchIndex = matchIndex;
		this.score = { p1: 0, p2: 0, round: 0 };
		this._onGameOver = onGameOver;
	}

	public getMatchIndex(): number {
		return this._matchIndex;
	}

	public setMatchIndex(matchIndex: number): void {
		this._matchIndex = matchIndex;
	}

	public override addPlayer(
		playerSession: PlayerSession,
		paddleIdOverride: boolean = false
	): void {
		this.players.push(playerSession);

		if (!playerSession.isAI) {
			playerSession.setRoom(this);
			this.broadcast(this._lobby.buildTournamentPlayerConnected(playerSession));
		}

		if (paddleIdOverride) {
			playerSession.setPaddleId("p2");
		} else if (this.players.length === 1) {
			playerSession.setPaddleId("p1");
		} else if (this.players.length === 2) {
			playerSession.setPaddleId("p2");
		}

		if (playerSession.isAI) {
			const paddles = this.game.getPaddles();
			if (playerSession.getPaddleId() === "p1") {
				this.game.setP1IA(true);
				paddles[0].setBall(this.game.getBall());
				paddles[0].setWalls(this.game.getWalls());
				paddles[0].setGameRoom(this);
			} else {
				this.game.setP2IA(true);
				paddles[1].setBall(this.game.getBall());
				paddles[1].setWalls(this.game.getWalls());
				paddles[1].setGameRoom(this);
			}
		}
		if (this.isFull() || this.lock) {
			console.log("GAME READY TO BE STARTED.");
			this.startGame();
		}
	}

	public override getScore(): TournamentScore {
		return this.score;
	}

	public override addScore(player: number): void {
		player === 1 ? this.score.p1++ : this.score.p2++;
		this.score.round = this._bracket?.getCurrentRound();
		this.broadcast(this.buildTournamentScoreUpdatePayload());
		if (this.score.p1 === MAX_SCORE) {
			console.log("GAME OVER!, P1 Won!");
			this._killGame(1);
		} else if (this.score.p2 === MAX_SCORE) {
			console.log("GAME OVER! P2 Won");
			this._killGame(2);
		}
	}

	public override startGame() {
		this.game.setBroadcastFunction(() => {
			this.floodlessBroadcast(this.buildUpdatePayload());
		});

		this.game.setRoom(this);

		const ball = this.game.getBall();
		ball.setOnCollision((collisionInfo) => {
			this.floodlessBroadcast(this.buildCollisionPayload(collisionInfo));
		});

		this.broadcast(this.buildTournamentInitPayload());
		this._start_time = Date.now();
		console.log("Made it to startGame... Starting game with:");
		console.log(
			`${this.players[0].getUserId()} and ${this.players[1].getUserId()}`
		);
		this.game.gameStart(DEFAULT_FPS);
	}

	private buildTournamentInitPayload(): TournamentInitPayload {
		const game = this.game;
		const ball = game.getBall();
		const [p1, p2] = game.getPaddles();
		const walls = game.getWallsForWs();
		const lightsCamera = game.getField();

		const initPayload: TournamentInitPayload = {
			type: "tournament-init",
			payload: {
				ball: ball.getBallInitInfo(),
				p1: p1.getInitInfo(),
				p2: p2.getInitInfo(),
				walls: walls,
				camera: lightsCamera.getCameraInitInfo(),
				light: lightsCamera.getLightInitInfo(),
				roomID: this.id,
				connectedPlayers: {
					p1: this.players[0]?.getUserId(),
					p2: this.players[1]?.getUserId(),
				},
			},
		};
		return initPayload;
	}

	private buildTournamentScoreUpdatePayload(): TournamentScoreUpdatePayload {
		const scoreUpdate: TournamentScoreUpdatePayload = {
			type: "tournament-score",
			payload: {
				score: {
					p1: this.score.p1,
					p2: this.score.p2,
					round: this._bracket.getCurrentRound(),
				},
			},
		};
		return scoreUpdate;
	}

	private buildTournamentMatchOverPayload(
		winner: number
	): TournamentMatchOverPayload {
		const gameOver: TournamentMatchOverPayload = {
			type: "tournament-match-over",
			payload: {
				winner: winner === 1 ? "p1" : "p2",
				loser: winner === 1 ? "p2" : "p1",
				final_score: this.score,
				bracket: this._bracket.getTournamentStatus(),
			},
		};
		return gameOver;
	}

	override async _killGame(winner: number) {
		let res = this._send_to_db(
			this.players[0] ? this.players[0].getUserId() : default_users.Deleted.PlayerID,
			this.players[1] ? this.players[1].getUserId() : default_users.Deleted.PlayerID,
			winner,
			this._matchIndex
		);
		this.broadcast(this.buildTournamentMatchOverPayload(winner));
		this.game.gameStop();
		if (this._onGameOver) {
			this._onGameOver(this.id);
		}
		res
			.then(function(response) {
				console.log(`Match successfully created:`);
				console.dir(response.data);
			})
			.catch(function(error) {
				if (typeof error === "string") {
					if (error.includes("database"))
						console.error(`WARN: Database down! Match not saved.`)
					else if (error.includes("blockchain"))
						console.error(`WARN: Blockchain down! Match not validated.`)
				}
				else
					console.error(`WARN: unknown error! ${error}`)
			});
	}
}
