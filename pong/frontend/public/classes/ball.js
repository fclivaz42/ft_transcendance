
import { MeshBuilder, Vector3, Color3, StandardMaterial, PickingInfo } from "@babylonjs/core";

export class Ball {
	constructor(
		scene,
		name,
		position = new Vector3(0, 0, 0),
		options = {}
	) {
		const {
			color = Color3.White(),
			diameter = 0.05,
			segments = 32,
			speed = 0.15,
	} = options;

		this.scene = scene;
		this.name = name;
		this._position = position;
		this._speed = speed;
		this._direction = new Vector3(1, 0, 0).normalize();
		
		this.mesh = MeshBuilder.CreateSphere(name, { diameter, segments }, scene);
		this.mesh.position = position.clone();

		const material = new StandardMaterial(`${name}-mat`, scene);
		material.diffuseColor = color;
		this.mesh.material = material;

		this._colliders = [];
		this._bounceCooldown = 0;

	}

	setDirection(vector) {
		this._direction = vector.normalize();
	}

	setColliders(colliders) {
		this._colliders = colliders;
	}

	update() {
		this.mesh.position.addInPlace(this._direction.scale(this._speed));

		if (this._bounceCooldown > 0) {
			this._bounceCooldown--;
			return;
		}

		for (const collider of this._colliders) {
			if (this._isIntersecting(this.mesh, collider.mesh)) {
				// let intersection = this._isIntersecting(this.mesh, collider.mesh);
				// console.log(intersection);
				this._direction.x *= -1;
				this._direction.normalize();
				this._bounceCooldown = 2;
				break;
			}
		}
		
	}
	_isIntersecting(meshA, meshB) {
		return meshA.intersectsMesh(meshB, true);
	}
}