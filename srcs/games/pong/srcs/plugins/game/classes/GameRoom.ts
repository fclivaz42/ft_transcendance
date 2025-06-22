import Game from "./GameClass.ts"
import PlayerSession from "./PlayerSession.ts";
import { type CameraInitInfo, type LightInitInfo } from "./Playfield.ts";
import { DEFAULT_FPS } from "./Playfield.ts";

interface BallUpdate {
	curr_speed: number;
	curr_position: number[];
}

interface PaddleUpdate {
	max_speed: number;
	position: number[];
}

interface UpdatePayload {
	type: "update";
	payload: {
		ball: BallUpdate;
		p1: PaddleUpdate;
		p2: PaddleUpdate;
	}
}

interface BallInit extends BallUpdate {
	size: number[];
}

interface PaddleInit extends PaddleUpdate { }

interface WallsInit {
	[key: string]: {
		position: number[];
		size: number[];
		passThrough?: boolean;
	};
}

interface InitPayload {
	type: "init";
	payload: {
		ball: BallInit;
		p1: PaddleInit;
		p2: PaddleInit;
		walls: WallsInit;
		camera: CameraInitInfo;
		light: LightInitInfo;
	}
}

type GameMessage = InitPayload | UpdatePayload;

export default class GameRoom {

	public id: string;
	public players: PlayerSession[] = [];
	public game: Game;
	public score: { p1: number | null; p2: number | null };


	constructor(id: string) {
		this.id = id;
		this.game = new Game();
		this.score = { p1: null, p2: null };
	}

	public isFull(): boolean {
		console.log(`current players in room: ${this.players.length}`)
		return this.players.length >= 2;
	}

	public getGame(): Game {
		return this.game;
	}

	public addPlayer(playerSession: PlayerSession): void {
		this.players.push(playerSession);
		playerSession.setRoom(this);

		if (this.players.length === 1) {
			playerSession.setPaddleId('p1');
		} else if (this.players.length === 2) {
			playerSession.setPaddleId('p2');
		}

		if (this.isFull()) {
			console.log(`Room ${this.id} full with players: [${this.players[0].getUserId()}, ${this.players[1].getUserId()}]`);
			console.log("GAME READY TO BE STARTED.");
			this.startGame();
		}
	}

	startGame() {

		this.game.setBroadcastFunction(() => {
			this.broadcast(this.buildUpdatePayload());
		});

		this.broadcast(this.buildInitPayload());
		this.game.gameStart(DEFAULT_FPS);
	}

	public broadcast(message: GameMessage): void {
		for (const p of this.players) {
			try {
				p.send(message)
			} catch (err) {
				console.error(`Failed to send to player: ${this.id}: ${err}`);
			}
		}
	}

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
				light: lightsCamera.getLightInitInfo()
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
}
