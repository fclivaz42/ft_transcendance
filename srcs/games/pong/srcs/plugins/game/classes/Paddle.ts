
import { MeshBuilder, Scene, Vector3, Color3, StandardMaterial, BoundingBox, Mesh, PhysicsRaycastResult } from "@babylonjs/core";
import Ball from "./Ball.ts";
import { Session } from "inspector/promises";
import { PADDLE_SPEED } from "./GameClass.ts";
import { match } from "assert";
import type { WallMap } from "./GameClass.ts";

interface PaddleOptions {
	color: Color3;
	width: number;
	height: number;
	depth: number;
	speed: number;
	isAi: boolean;
};

interface InitInfo {
	max_speed: number;
	position: number[];
	size: number[];
}


export default class Paddle {

	protected _scene: Scene;
	protected _mesh: Mesh;
	protected _name: string;
	protected _speed: number;
	protected _direction: Vector3;
	protected _isAi: boolean;
	protected _position: Vector3;
	protected _colliders: any[] = [];

	private _moveDirection: "up" | "down" | null = null;
	private _bounds: { minY: number, maxY: number } = { minY: -Infinity, maxY: Infinity };
	private _ball: Ball | null = null;
	private _walls: WallMap;
	private _upMoove: number;
	private _downMoove: number;

	static _ballPos: number | undefined = undefined;
	static _ran: number = 3;

	constructor(
		scene: Scene,
		name: string,
		position: Vector3 = new Vector3(0, 0, 0),
		options: Partial<PaddleOptions> = {}
	) {
		const {
			color = Color3.White(),
			width = 0.5,
			height = 0.5,
			depth = 0.5,
			speed = 0.05, // can remove and replace with setter
			isAi = false // can remove and replace with setter
		} = options;

		this._scene = scene;
		this._name = name;
		this._position = position;
		this._speed = speed;
		this._isAi = isAi;
		this._direction = new Vector3(0, 0, 0);
		this._mesh = MeshBuilder.CreateBox(name, { width, height, depth }, scene);
		this._mesh.position = position.clone();
		this._upMoove = 0;
		this._downMoove = 0;

		const material = new StandardMaterial(`${name}-mat`, scene);
		material.diffuseColor = color;
		this._mesh.material = material;
	}


	protected _touchingWall(): boolean {
		for (let i of this._colliders) {
			let boxA = this.getCollisionBox();
			let boxB = i.getCollisionBox();
			if (BoundingBox.Intersects(boxA, boxB)) {
				return true;
			}
		}
		return false;
	}

	public getIsIA(): boolean { return this._isAi; }
	public getMesh(): Mesh { return this._mesh; }
	public getPosition(): Vector3 { return this.getMesh().position; }
	public getSpeed(): number { return this._speed; }
	public getDirection(): Vector3 { return this._direction; }
	public getCollisionBox(): BoundingBox { return this._mesh.getBoundingInfo().boundingBox; }
	public getSize(): Vector3 { return this.getCollisionBox().extendSize.scale(2); }
	public getInitInfo(): InitInfo {
		return {
			max_speed: this.getSpeed(),
			position: this.getPosition().asArray(),
			size: this.getSize().asArray(),
		};
	}

	public setBall(ball: Ball): void { this._ball = ball; }
	public setWalls(walls: WallMap): void { this._walls = walls; }
	public setSpeed(speed: number): void { this._speed = speed; }
	public setColliders(colliders: any): void { this._colliders = colliders; }
	public setAI(io: boolean): void { this._isAi = io; }
	public setMoveDirection(dir: "up" | "down" | null): void {
		this._moveDirection = dir;
	}
	public setVerticalBounds(bounds: { minY: number; maxY: number }): void {
		this._bounds = bounds;
	}


	public calculateBounce(ball: Ball): void {
		const lastHit = ball.getLastHit();
		if (lastHit === this._name) return;
		if (lastHit && lastHit.startsWith("player")) {
			ball.incrPlayerBounce();
		}
		ball.setLastHit(this._name);
		const collisionBox = this.getCollisionBox();
		const collisionCenter = collisionBox.centerWorld;
		const collisionHeight = collisionBox.extendSizeWorld.y * 2;
		let impact = (ball.getHitbox().position.y - collisionCenter.y) / (collisionHeight / 2);
		impact = Math.max(-1, Math.min(impact, 1));
		ball.direction.x *= -1;
		ball.direction.y = (impact * 0.8 + ball.direction.y * 0.2); //weighted average for bounce
		/* To prevent too much of a vertical bounce */
		if (impact !== 0 && Math.abs(ball.direction.y) < 0.1) {
			ball.direction.y = 0.1 * Math.sign(ball.direction.y || 1);
		}
		/* **************************************** */
		ball.direction.normalize();
	}

	public update(fps: number): void {

		// this._direction.set(0, 0, 0);
		// this.getMesh().position.addInPlace(this._direction.scale(this._speed));
		if (this._isAi)
			this.manageIA(fps);
		else {
			if (!this._moveDirection) return;
			console.log("received command to move, attempting to move");
			const deltaY = this._moveDirection === "up" ? this.getSpeed() : -this.getSpeed();
			const currentY = this.getMesh().position.y;
			const newY = currentY + deltaY;

			const boundingInfo = this.getMesh().getBoundingInfo();
			const halfHeight = boundingInfo.boundingBox.extendSize.y;

			const maxY = this._bounds.maxY - halfHeight;
			const minY = this._bounds.minY + halfHeight;

			this.getMesh().position.y = Math.max(minY, Math.min(maxY, newY));
		}
	}

	public iaAlgo(fps: number): void {
		// console.log(`Wall: ${this._walls.upWall.getMesh().position.y.toString}`);
		// console.log(`Wall: ${this._walls.downWall.getMesh().position.y.toString}`);
		try {
			const paddlSpeed = this.getSpeed();
			const ballSpeed = this._ball?.getCurrSpeed();
			const ballY = this._ball?.getMesh().position.y;
			const currentPaddle = this.getMesh().position.y;
			const nWallY = this._walls.northWall.getMesh().position.y;
			const nWallX = this._walls.northWall.getMesh().position.x;
			const sWallY = this._walls.southWall.getMesh().position.y;
			const sWallX = this._walls.southWall.getMesh().position.x;
			if (fps === 1) {
				console.log(`paddleSpedd: ${paddlSpeed}`);
				console.log(`ballSpeed: ${ballSpeed}`);
				console.log(`ballY: ${ballY}`);
				console.log(`currentPaddle: ${currentPaddle}`);
				console.log(`nWallY: ${nWallY}`);
				console.log(`nWallX: ${nWallX}`);
				console.log(`sWallY: ${sWallY}`);
				console.log(`sWallX: ${sWallX}\n`);
				// console.log(`: ${}`);
			}
			if (this._upMoove) {
				this.getMesh().position.y -= this.getSpeed();
				this._upMoove--;
			}
			else if (this._downMoove) {
				this.getMesh().position.y += this.getSpeed();
				this._downMoove--;
			}
		}
		catch (e) {
			throw ("iaAlgo error");
		}
	}

	public async manageIA(fps: number) {

		if (fps === 1)
			Paddle._ballPos = this._ball?.getMesh().position.y;
		if (Paddle._ballPos) {
			this.randMoove(fps);
			this.iaAlgo(fps);
		}
	}

	public randMoove(fps: number): void {
		if (fps % 15 === 0) {
			if (Paddle._ran < 3) {
				this.getMesh().position.y += this.getSpeed();
				Paddle._ran++;
			}
			else if (Paddle._ran > 3) {
				this.getMesh().position.y -= this.getSpeed();
				Paddle._ran--;
			}
			else if (Paddle._ran === 3)
				Paddle._ran = Math.floor((Math.random() * 100) % 6);
		}
	}
}
