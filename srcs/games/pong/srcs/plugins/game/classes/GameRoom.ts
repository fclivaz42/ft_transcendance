import Game from "./GameClass.ts"
import Paddle from "./Paddle.ts";
import PlayerSession from "./PlayerSession.ts";
import { type CameraInitInfo, type LightInitInfo } from "./Playfield.ts";
import { DEFAULT_FPS } from "./Playfield.ts";

interface BallUpdate {
	curr_speed: number,
	curr_position: number[]
};

interface PaddleUpdate {
	max_speed: number,
	position: number[]
};

interface RoomScore {
	p1: number,
	p2: number
};


interface BallInit extends BallUpdate {
	size: number[],
};

interface PaddleInit extends PaddleUpdate { }

interface WallsInit {
	[key: string]: {
		position: number[],
		size: number[],
		passThrough?: boolean
	}
};

interface UpdatePayload {
	type: "update",
	payload: {
		ball: BallUpdate,
		p1: PaddleUpdate,
		p2: PaddleUpdate
	}
};

interface InitPayload {
	type: "init",
	payload: {
		ball: BallInit,
		p1: PaddleInit,
		p2: PaddleInit,
		walls: WallsInit,
		camera: CameraInitInfo,
		light: LightInitInfo,
		roomID: string,
		connectedPlayers: ConnectedPlayers
	}
};

interface PlayerConnectedPayload {
	type: "connect",
	payload: {
		playerID: string,
		roomID: string
	}
};

interface PlayerDisconnectedPayload {
	type: "disconnect",
	payload: {
		playerID: string
	}
};

interface CollisionPayload {
	type: "collision",
	payload: {
		collider: string
	}
};

interface ScoreUpdatePayload {
	type: "score",
	payload: {
		score: RoomScore
	}
}

interface GameOverPayload {
	type: "gameover",
	payload: {
		winner: string,
		final_score: RoomScore
	}
}

interface ConnectedPlayers {
	p1: string | undefined,
	p2: string | undefined
}

type GameMessage = InitPayload 
				| UpdatePayload
				| PlayerConnectedPayload
				| PlayerDisconnectedPayload
				| CollisionPayload
				| ScoreUpdatePayload
				| GameOverPayload;

export default class GameRoom {

	public id: string;
	public players: PlayerSession[] = [];
	public game: Game;
	public score: { p1: number; p2: number };
	public lock: boolean = false;
	private _lastMessage?: string;
	private _lastCollision?: CollisionPayload;

	private _onGameOver?: (roomId: string) => void;

	constructor(id: string, vsAI: boolean = false, onGameOver?: (roomId: string) => void) {
		this.id = id;
		this.game = new Game(vsAI);
		const paddles: Paddle[] = this.game.getPaddles();
		paddles.at(0)?.setGameRoom(this);
		paddles.at(1)?.setGameRoom(this);
		this.score = { p1: 0, p2: 0 };
		this._onGameOver = onGameOver;
	}

	public isFull(): boolean {
		console.log(`current players in room: ${this.players.length}`)
		return this.players.length >= 2;
	}

	public isEmpty(): boolean {
		return this.players.length === 0;
	}

	public getGame(): Game {
		return this.game;
	}

	public getScore(): { p1: number, p2: number } {
		return this.score;
	}

	public addPlayer(playerSession: PlayerSession): void {
		this.players.push(playerSession);
		playerSession.setRoom(this);
		this.broadcast(this.buildPlayerConnectedPayload(playerSession))

		if (this.players.length === 1) {
			playerSession.setPaddleId('p1');
		} else if (this.players.length === 2) {
			playerSession.setPaddleId('p2');
		}

		if (this.isFull() || this.lock) {
			// console.log(`Room ${this.id} full with players: [${this.players[0].getUserId()}, ${this.players[1].getUserId()}]`);
			console.log("GAME READY TO BE STARTED.");
			this.startGame();
		}
	}

	public removePlayer(playerSession: PlayerSession): void {
		this.players = this.players.filter(p => p !== playerSession);
		console.log(`Removed player ${playerSession.getUserId()} from room ${this.id}`);

		this.broadcast(this.buildPlayerDisconnectedPayload(playerSession));

		if (this.isEmpty()) {
			this.game.gameStop();
			if (this._onGameOver) {
				this._onGameOver(this.id);
			}
			return ;
		}
		playerSession.getPaddleId() === "p1" ? this.game.setP1IA(true) : this.game.setP2IA(true);
		// on a player disconnect sets AI to missing player and locks the room
		this.lock = true;
	}

	public addScore(player: number) {
		player === 1 ? this.score.p1++ : this.score.p2++;
		this.broadcast(this.buildScoreUpdatePayload());
		if (this.score.p1 === 6) {
			console.log("GAME OVER!, P1 Won!");
			this._killGame(1);
		} else if (this.score.p2 === 6) {
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
		})

		this.broadcast(this.buildInitPayload());
		this.game.gameStart(DEFAULT_FPS);
	}

	private _killGame(winner: number) {
		this.broadcast(this.buildGameOverPayload(winner));
		this.game.gameStop();
		if (this._onGameOver) {
			this._onGameOver(this.id);
		}
	}

	public broadcast(message: GameMessage): void {
		if (message.type !== 'update') {
			console.log(JSON.stringify(message, null, 2));
		}
		for (const p of this.players) {
			try {
				p.send(message)
			} catch (err) {
				console.error(`Failed to send to player: ${this.id}: ${err}`);
			}
		}
	}

	public floodlessBroadcast(message: GameMessage): void {
		
		if (message.type === 'collision') {
			const payload = message.payload;
			if (
				this._lastCollision &&
				this._lastCollision.payload.collider === payload.collider
			) {
				return;
			}
			this._lastCollision = message;

		} else if (message.type === 'update') {
			const current = JSON.stringify(message);
			if (this._lastMessage === current)
				return;
			this._lastMessage = current;
		}

		// debug
		if (message.type !== 'update') {
			console.log(JSON.stringify(message, null, 2));
		}
		// enddebug

		for (const p of this.players) {
			try {
				p.send(message)
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
		const walls = game.getWallsForWs()
		const lightsCamera = game.getField();

		const initPayload: InitPayload = {
			type: 'init',
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
					p2: this.players.at(1)?.getUserId()
				}
			}
		}
		return initPayload;
	}

	private buildUpdatePayload(): UpdatePayload {
		const game = this.game;
		const ball = game.getBall();
		const [p1, p2] = game.getPaddles();

		const updatePayload: UpdatePayload = {
			type: 'update',
			payload: {
				ball: {
					curr_speed: ball.getCurrSpeed(),
					curr_position: ball.getPosition().asArray(),
				},
				p1: {
					max_speed: p1.getSpeed(),
					position: p1.getPosition().asArray()
				},
				p2: {
					max_speed: p2.getSpeed(),
					position: p2.getPosition().asArray()
				}
			}
		}
		return updatePayload;
	}

	private buildPlayerConnectedPayload(sessions: PlayerSession): PlayerConnectedPayload {
		const playerConnectedPayload: PlayerConnectedPayload = {
			type: "connect",
			payload: {
				playerID: sessions.getUserId(),
				roomID: this.id
			}
		}
		return playerConnectedPayload;
	}

	private buildPlayerDisconnectedPayload(sessions: PlayerSession): PlayerDisconnectedPayload {
		const playerDisconnectedPayload: PlayerDisconnectedPayload = {
			type: "disconnect",
			payload: {
				playerID: sessions.getUserId()
			}
		}
		return playerDisconnectedPayload;
	}

	private buildScoreUpdatePayload(): ScoreUpdatePayload {
		const scoreUpdate: ScoreUpdatePayload = {
			type: "score",
			payload: {
				score: {
					p1: this.score.p1,
					p2: this.score.p2
				}
			}
		}
		return scoreUpdate;
	}

	private buildCollisionPayload(collisionInfo: string): CollisionPayload {
		const collisionPayload: CollisionPayload = {
			type: "collision",
			payload: {
				collider: collisionInfo
			}
		}
		return collisionPayload;
	}

	private buildGameOverPayload(winner: number): GameOverPayload {
		const gameOver: GameOverPayload = {
			type: "gameover",
			payload: {
				winner: winner === 1 ? "p1" : "p2",
				final_score: this.score
			}
		}
		return gameOver;
	}
}
