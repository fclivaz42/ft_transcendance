import { MeshBuilder, Vector3, Color3, StandardMaterial, BoundingBox } from "@babylonjs/core";

export default class Ball {
	constructor(
		scene,
		name,
		position = new Vector3(0, 0, 0),
		options = {}
	) {
		const {
			color = Color3.White(),
			diameter = 0.05,
			segments = 32
	} = options;

		this.scene = scene;
		this.name = name;
		this._position = position;
		this._baseSpeed = 0.15;
		this._speed = 0.0;
		this._playerBounces = 0;
		this._direction = new Vector3((Math.random() * 99) < 50 ? 1 : -1, 0, 0).normalize();
		
		this.mesh = MeshBuilder.CreateSphere(name, { diameter, segments }, scene);
		this.mesh.position = position.clone();

		const material = new StandardMaterial(`${name}-mat`, scene);
		material.diffuseColor = color;
		this.mesh.material = material;

		this._colliders = [];
		this._lastHit = null;
		this._bounceCooldown = 0;
		this._keys = {};
		this._setupInput();

	}

	_setupInput() {
		window.addEventListener("keydown", (e) => {
			this._keys[e.key] = true;
		});
		window.addEventListener("keyup", (e) => {
			this._keys[e.key] = false;
		});
	}

	getCollisionBox()		{ return this.mesh.getBoundingInfo().boundingBox; }
	getLastHit()			{ return this._lastHit; }
	getPlayerBounces()		{ return this._playerBounces; }
	getBaseSpeed()			{ return this._baseSpeed; }
	getSpeed()				{ return this._speed; }
	getPosition()			{ return this._position; }

	setLastHit(lastHit)		{ this._lastHit = lastHit; }
	setBaseSpeed(baseSpeed)	{ this._baseSpeed = baseSpeed; }
	setSpeed(speed)			{ this._speed = speed; }
	incrSpeed(increment)	{ this._speed += increment };
	setStartDir(dir)		{ this._direction = dir.normalize(); }
	setDirection(vector)	{ this._direction = vector.normalize(); }
	setColliders(colliders)	{ this._colliders = colliders; }
	incrPlayerBounce()		{ this._playerBounces++; }

	update() {
		this.mesh.position.addInPlace(this._direction.scale(this._speed));

		if (this._keys[" "] && this._speed === 0.0) {
			this._speed = this._baseSpeed;
			this._lastHit = null; 

			this._direction = new Vector3(Math.random() < 0.5 ? -1 : 1, 0, 0);
		}
		for (const collider of this._colliders) {
			let boxA = this.getCollisionBox();
			let boxB = collider.mesh.getBoundingInfo().boundingBox;
			if (BoundingBox.Intersects(boxA, boxB, true)) {
				collider.calculateBounce(this);
				break;
			}
		}
		
	}
}