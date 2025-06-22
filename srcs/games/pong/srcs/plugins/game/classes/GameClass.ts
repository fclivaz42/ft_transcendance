
import Paddle from "./Paddle.ts";
import Wall from "./Wall.ts";
import Ball from "./Ball.ts";
import PlayField from "./Playfield.ts";
import { Scene, Vector3, Color3 } from "@babylonjs/core";
import GameRoom from "./GameRoom.ts";

const SHOW_BOXES: boolean = false;

/* Ball defines */
const BALL_SPEED: number = 0.2;
const BALL_DIAMETER: number = 0.6;

/* Paddle defines */
const PLAYER_HEIGHT: number = 2.8;
const PLAYER_WIDTH: number = 0.3;
export const PADDLE_SPEED: number = 0.4;

/* Wall defines */
const WALL_WIDTH: number = 30;
const WALL_HEIGHT: number = 0.5;
const WALL_DEPTH: number = 0.5;

/* Goal defines */
const GOAL_WIDTH: number = 0.5;
const GOAL_HEIGHT: number = 16.6;
const GOAL_DEPTH: number = 0.5;

/* Default FPS for serverside simulation */

interface BroadcastFunction {
	(): void;
}

interface WallMap {
	[key: string]: Wall;
}

export default class Game {
	private _field: PlayField;
	private _scene: Scene;
	private _broadcastUpdate: BroadcastFunction | null = null;

	private _p1: Paddle;
	private _p2: Paddle;
	private _ball: Ball;
	private _walls: WallMap;
	private _room: GameRoom | null = null;

	constructor() {
		this._field = new PlayField();
		this._scene = this._field.getScene();

		/* Building all Walls */
		this._walls = {
			"northWall": new Wall(
				this._scene,
				"northWall",
				new Vector3(0, 8.05, 0), {
				color: Color3.White(),
				width: WALL_WIDTH,
				height: WALL_HEIGHT,
				depth: WALL_DEPTH
			}),
			"southWall": new Wall(
				this._scene,
				"southWall",
				new Vector3(0, -8.05, 0), {
				color: Color3.White(),
				width: WALL_WIDTH,
				height: WALL_HEIGHT,
				depth: WALL_DEPTH
			}),
			"eastWall": new Wall(
				this._scene,
				"eastWall",
				new Vector3(15.2, 0, 0), {
				color: Color3.White(),
				width: GOAL_WIDTH,
				height: GOAL_HEIGHT,
				depth: GOAL_DEPTH
			}),
			"westWall": new Wall(
				this._scene,
				"westWall",
				new Vector3(-15.2, 0, 0), {
				color: Color3.White(),
				width: GOAL_WIDTH,
				height: GOAL_HEIGHT,
				depth: GOAL_DEPTH
			}),
		}
		const bounds: { minY: number, maxY: number } = this.getVerticalBounds();

		/* Creating Player 1 Paddle */
		this._p1 = new Paddle(
			this._scene,
			"player1",
			new Vector3(-14.5, 0, 0), {
			color: Color3.White(),
			speed: PADDLE_SPEED,
			height: PLAYER_HEIGHT,
			width: PLAYER_WIDTH
		});
		this._p1.getMesh().showBoundingBox = SHOW_BOXES;
		this._p1.setVerticalBounds(bounds);

		/* Creating Player 2 Paddle */
		this._p2 = new Paddle(
			this._scene,
			"player2",
			new Vector3(14.5, 0, 0), {
			color: Color3.White(),
			speed: PADDLE_SPEED,
			height: PLAYER_HEIGHT,
			width: PLAYER_WIDTH
		});
		/* Creating Ball */
		this._ball = new Ball(
			this._scene,
			"ball",
			new Vector3(0, 0, 0), {
			color: Color3.White(),
			diameter: BALL_DIAMETER
		});
		this._ball.setBaseSpeed(BALL_SPEED);
		this._ball.getMesh().showBoundingBox = SHOW_BOXES;

		for (let [key, value] of Object.entries(this._walls)) {
			value.getMesh().showBoundingBox = SHOW_BOXES;
			value.setGame(this);
			if (key.startsWith("east") || key.startsWith("west"))
				value.setPassThrough(true);
		}

		// set ia brut
		/* this._p2.setAI(true);
		if (this._p2.getIsIA())
			this._p2.setBall(this._ball); */

		this._p2.getMesh().showBoundingBox = SHOW_BOXES;
		this._p2.setVerticalBounds(bounds);

		/* Setting colliders for the paddles and the ball */
		this._p1.setColliders([this._walls.northWall, this._walls.southWall]);
		this._p2.setColliders([this._walls.northWall, this._walls.southWall]);
		this._ball.setColliders([
			this._p1,
			this._p2,
			this._walls.northWall,
			this._walls.southWall,
			this._walls.eastWall,
			this._walls.westWall
		]);
	};

	/* Methods */
	public getBall(): Ball {
		return this._ball;
	}

	public getField(): PlayField {
		return this._field;
	}

	public getPaddles(): Paddle[] {
		return [this._p1, this._p2];
	}

	public getWalls(): WallMap {
		return this._walls;
	}

	public getVerticalBounds(): { minY: number; maxY: number } {
		const north = this._walls.northWall.getMesh();
		const south = this._walls.southWall.getMesh();

		if (!north || !south) {
			return { minY: -7, maxY: 7.5 }; // un-hardcode later // these are defaults in case something goes wrong
		}

		const northHalf = (north.scaling.y || 1) * (north.getBoundingInfo()?.boundingBox.extendSize.y ?? 0.25);
		const maxY = (north.position.y - northHalf);

		const southHalf = (south.scaling.y || 1) * (south.getBoundingInfo()?.boundingBox.extendSize.y ?? 0.25);
		const minY = (south.position.y - southHalf);

		return { minY, maxY };
	}

	public getWallsForWs(): Record<string, ReturnType<Wall["getInitInfo"]>> {
		const retWalls: Record<string, ReturnType<Wall["getInitInfo"]>> = {};

		for (const [name, wall] of Object.entries(this._walls)) {
			retWalls[name] = wall.getInitInfo()
		}
		return retWalls;
	}

	public setBroadcastFunction(func: BroadcastFunction): void {
		this._broadcastUpdate = func;
	}

	public gameStart(fps: number): void {
		this._field.addUpdatable(this._p1);
		this._field.addUpdatable(this._p2);
		this._field.addUpdatable(this._ball);
		this._field.start(fps, this._broadcastUpdate || undefined);
	}

	public score(player: number): void {
		if (this._room) {
			this._room.addScore(player); 
		}
	}

	public setRoom(room: GameRoom) {
		this._room = room;
	}
}
