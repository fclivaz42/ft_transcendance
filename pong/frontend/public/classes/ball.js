
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
			segments = 32,
			speed = 0.15, // can remove and replace with setter
			startDir = new Vector3(1, 0, 0) // can remove and replace with setter
	} = options;

		this.scene = scene;
		this.name = name;
		this._position = position;
		this._speed = speed;
		this._direction = startDir.normalize();
		
		this.mesh = MeshBuilder.CreateSphere(name, { diameter, segments }, scene);
		this.mesh.position = position.clone();

		const material = new StandardMaterial(`${name}-mat`, scene);
		material.diffuseColor = color;
		this.mesh.material = material;

		this._colliders = [];
		this._bounceCooldown = 0;

	}

	getCollisionBox()		{ return this.mesh.getBoundingInfo().boundingBox; }

	setSpeed(speed)			{ this._speed = speed; }
	setStartDir(dir)		{ this._direction = dir.normalize(); }
	setDirection(vector)	{ this._direction = vector.normalize(); }
	setColliders(colliders)	{ this._colliders = colliders; }

	update() {
		this.mesh.position.addInPlace(this._direction.scale(this._speed));

		if (this._bounceCooldown > 0) {
			this._bounceCooldown--;
			return;
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