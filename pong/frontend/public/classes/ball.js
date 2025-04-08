
import { MeshBuilder, Vector3, Color3, StandardMaterial, BoundingBox } from "@babylonjs/core";

export class Ball {
	constructor(
		scene,
		name,
		position = new Vector3(0, 0, 0),
		options = {}
	) {
		/* Remove options and make it more setter getter */
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
		this._direction = new Vector3((Math.random() * 99) < 50 ? 1 : -1, 0, 0);
		
		this.mesh = MeshBuilder.CreateSphere(name, { diameter, segments }, scene);
		this.mesh.position = position.clone();

		const material = new StandardMaterial(`${name}-mat`, scene);
		material.diffuseColor = color;
		this.mesh.material = material;

		this._colliders = [];
		this._lastHit = "";
		this._bounceCooldown = 0;
		this._keys = {};
		this._setupInput();

	}

	_setupInput() {
		window.addEventListener("keydown", (e) => {
			this._keys[e.key] = true;
			console.log(e.key);
		});
		window.addEventListener("keyup", (e) => {
			this._keys[e.key] = false;
		});
	}

	getCollisionBox()		{ return this.mesh.getBoundingInfo().boundingBox; }
	getLastHit()			{ return this._lastHit; }

	setLastHit(lastHit)		{ this._lastHit = lastHit; }
	setBaseSpeed(baseSpeed)	{ this._baseSpeed = baseSpeed; }
	setSpeed(speed)			{ this._speed = speed; }
	setStartDir(dir)		{ this._direction = dir.normalize(); }
	setDirection(vector)	{ this._direction = vector.normalize(); }
	setColliders(colliders)	{ this._colliders = colliders; }

	update() {
		this.mesh.position.addInPlace(this._direction.scale(this._speed));

		// if (this._bounceCooldown > 0) {
		// 	this._bounceCooldown--;
		// 	return;
		// }

		if (this._keys[" "] && this._speed === 0.0) {
			this._speed = this._baseSpeed;
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