
import Paddle from "./Paddle.js";
import Wall from "./Wall.js";
import Ball from "./Ball.js";
import PlayField from "./Playfield.js";
import { Vector3, Color3 } from "@babylonjs/core";

export default class Game {
	constructor() {

		this.field = new PlayField();
		this.scene = this.field.getScene();

		this.showBoxes = false;

		this._broadcastUpdate = null;

		this.p1 = new Paddle(
			this.scene,
			"player1",
			new Vector3(-14.5, 0, 0), {
				color: Color3.White(),
				speed: 0.4,
				height: 2.8,
				width: 0.3
			});
		this.p1.mesh.showBoundingBox = this.showBoxes;

		this.p2 = new Paddle(
			this.scene,
			"player2",
			new Vector3(14.5, 0, 0), {
				color: Color3.White(),
				speed: 0.4,
				controls: {"up": "ArrowUp", "down": "ArrowDown"},
				height: 2.8,
				width: 0.3
			});
		this.p2.mesh.showBoundingBox = this.showBoxes;

		this.ball = new Ball(
			this.scene,
			"ball",
			new Vector3(0, 0, 0), {
				color: Color3.White(),
				diameter: 0.6
			});
			this.ball.setBaseSpeed(0.2);
			this.ball.showBoundingBox = this.showBoxes;

		this.walls = {
			"northWall": new Wall(
				this.scene,
				"northWall",
				new Vector3(0, 8.05, 0), {
					color: Color3.White(),
					width: 30,
					height: 0.5,
					depth: 0.5
			}),
			"southWall": new Wall(
				this.scene,
				"southWall",
				new Vector3(0, -8.05, 0), {
					color: Color3.White(),
					width: 30,
					height: 0.5,
					depth: 0.5
			}),
			"eastWall": new Wall(
				this.scene,
				"eastWall",
				new Vector3(15.2, 0, 0), {
					color: Color3.White(),
					width: 0.5,
					height: 16.6,
					depth: 0.5
			}),
			"westWall": new Wall(
				this.scene,
				"westWall",
				new Vector3(-15.2, 0, 0), {
					color: Color3.White(),
					width: 0.5,
					height: 16.6,
					depth: 0.5
			}),
		}
		for (let [key, value] of Object.entries(this.walls)) {
			value.mesh.showBoundingBox = this.showBoxes;
			if (key.startsWith("east") || key.startsWith("west"))
				value.setPassThrough(true);
		}

		this.p1.setColliders([this.walls.northWall, this.walls.southWall]);
		this.p2.setColliders([this.walls.northWall, this.walls.southWall]);
		this.ball.setColliders([
			this.p1,
			this.p2,
			this.walls.northWall,
			this.walls.southWall,
			this.walls.eastWall,
			this.walls.westWall
		]);
		// console.log(this.ball._colliders.map(c=>c.name));

	};

	getBall() {
		return this.ball;
	}

	getPaddles() {
		return [this.p1, this.p2];
	}

	getWalls() {
		return this.walls;
	}

	getWallsForWs() {
		const retWalls = {};

		for (const [name, wall] of Object.entries(this.walls)) {
			retWalls[name] = wall.getInitInfo()
		}
		return retWalls;
	}

	setBroadcastFunction(func) {
		this._broadcastUpdate = func;
	}

	gameStart(fps=60) {
		this.field.addUpdatable(this.p1);
		this.field.addUpdatable(this.p2);
		this.field.addUpdatable(this.ball);

		this.field.start(fps);
	}
}
