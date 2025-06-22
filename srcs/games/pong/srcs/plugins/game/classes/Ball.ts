import { MeshBuilder, Scene, Vector3, Color3, StandardMaterial, BoundingBox, Mesh, FlowGraphBitwiseLeftShiftBlock } from "@babylonjs/core";

const DIAMETER: number = 0.05;
const SEGMENTS: number = 32;
const HITBOX_MOD: number = 1.2;
const MAX_SPEED: number = 0.8;

interface BallOptions {
	color: Color3;
	diameter: number;
	segments: number;
}

interface BallInfo {
	curr_speed: number;
	curr_position: number[];
	size: number[];
}

export default class Ball {

	private _scene: Scene;

	private _mesh: Mesh;
	private _hitbox: Mesh;

	private _name: string;
	private _position: Vector3;
	private _currSpeed: number;
	private _baseSpeed: number;
	private _maxSpeed: number;
	private _colliders: any[];
	private _lastHit: string | null;
	private _playerBounces: number;
	private _diameter: number;
	private _segments: number;
	private _isLaunched: boolean;

	public direction: Vector3;

	constructor(
		scene: Scene,
		name: string,
		position: Vector3 = new Vector3(0, 0, 0),
		options: Partial<BallOptions> = {}
	) {
		const {
			color = Color3.White(),
			diameter = DIAMETER,
			segments = SEGMENTS,
		} = options;

		this._scene = scene;
		this._name = name;
		this._position = position;
		this._currSpeed = 0;
		this._baseSpeed = 0.25;
		this._playerBounces = 0;
		this._diameter = diameter;
		this._segments = segments;
		this.direction = new Vector3(0, 0, 0);

		this._mesh = MeshBuilder.CreateSphere(name, { diameter, segments }, scene);
		this._mesh.position = position.clone();

		this._hitbox = MeshBuilder.CreateSphere(`${name}-hitbox`, {
			diameter: diameter * HITBOX_MOD,
			segments: segments
		}, scene);
		this._hitbox.isVisible = false;
		this._hitbox.isPickable = false;
		this._hitbox.checkCollisions = false;

		this._hitbox.position = position.clone();
		this._mesh.parent = this._hitbox;

		const material: StandardMaterial = new StandardMaterial(`${name}-mat`, scene);
		material.diffuseColor = color;
		this._mesh.material = material;

		this._colliders = [];
		this._lastHit = null;
		this._isLaunched = false;
	}

	public getMesh(): Mesh { return this._mesh; }
	public getCollisionBox(): BoundingBox { return this._hitbox.getBoundingInfo().boundingBox; }
	public getLastHit(): string | null { return this._lastHit; }
	public getPlayerBounces(): number { return this._playerBounces; }
	public getBaseSpeed(): number { return this._baseSpeed; }
	public getCurrSpeed(): number { return this._currSpeed; }
	public getPosition(): Vector3 { return this._hitbox.position; }
	public getColliders(): any[] { return this._colliders; }
	public getBallInitInfo(): BallInfo {
		return {
			curr_speed: this.getCurrSpeed(),
			curr_position: this.getPosition().asArray(),
			// size: this.getCollisionBox().extendSize.scale(2).asArray(),
			size: [this._diameter, this._segments]
		};
	}

	public setLastHit(lastHit: string | null): void { this._lastHit = lastHit; }
	public setBaseSpeed(baseSpeed: number): void { this._baseSpeed = baseSpeed; }
	public setCurrSpeed(currSpeed: number): void { this._currSpeed = currSpeed; }
	public incrCurrSpeed(increment: number): void { this._currSpeed += increment; }
	public setStartDir(dir: Vector3): void { this.direction = dir.normalize(); }
	public setDirection(vector: Vector3): void { this.direction = vector.normalize(); }
	public setColliders(colliders: any[]): void { this._colliders = colliders; }
	public incrPlayerBounce(): void { this._playerBounces++; }

	public launch(): void {
		if (!this._isLaunched) {
			this.direction = Vector3.Zero();
			this._currSpeed = this._baseSpeed;
			this.direction = new Vector3(
				Math.random() < 0.5 ? 1 : -1, 0, 0).normalize();
			// this._hitbox.position.addInPlace(this.direction.scale(this._currSpeed));
			this._isLaunched = true;
		}
	}

	public setIsLaunched(io: boolean) {
		this._isLaunched = io;
	}

	public getHitbox(): Mesh {
		return this._hitbox;
	}

	public update(fps: number): void {
		this._hitbox.position.addInPlace(this.direction.scale(this._currSpeed));

		// add launch control option

		for (const collider of this._colliders) {
			let boxA = this.getCollisionBox();
			let boxB = collider.getCollisionBox();
			if (BoundingBox.Intersects(boxA, boxB)) {
				collider.calculateBounce(this);
				break;
			}
		}
	}
}
