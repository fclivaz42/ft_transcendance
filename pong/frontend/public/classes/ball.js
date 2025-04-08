
import { MeshBuilder, Vector3, Color3, StandardMaterial } from "@babylonjs/core";

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
			startDir = new Vector3(1, 0, 0)
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

	setDirection(vector) {
		this._direction = vector.normalize();
	}

	setColliders(colliders) {
		this._colliders = colliders;
	}

	/* possibility to do addCollider for .push() */

	update() {
		this.mesh.position.addInPlace(this._direction.scale(this._speed));

		if (this._bounceCooldown > 0) {
			this._bounceCooldown--;
			return;
		}


		for (const collider of this._colliders) {
			if (this._isIntersecting(this.mesh, collider.mesh)) {
				/* Encapsulate this into their classes so they can be easily accessed */
				/* This information should be handled on the backend ? */
				const ballPos = this.mesh.position;
				if (collider.mesh.name.startsWith("player")) {
					const paddleBox = collider.mesh.getBoundingInfo().boundingBox;
					const paddleCenter = paddleBox.centerWorld;
					const paddleHeight = paddleBox.extendSizeWorld.z * 2;
					let hitZ = (ballPos.z - paddleCenter.z) / (paddleHeight / 2);
					if (hitZ > 1) hitZ = 0.95;
					if (hitZ < -1) hitZ = -0.95;
					console.log(`Hit position on paddle ${collider.name} -> ${hitZ}`);
					this._direction.x *= -1;
					this._direction.z += hitZ;
					this._direction.normalize();
					this._bounceCooldown = 2;
				}
				else if (collider.mesh.name.startsWith("wall")) {
					const wallBox = collider.mesh.getBoundingInfo().boundingBox;
					const wallCenter = wallBox.centerWorld;
					const wallWidth = wallBox.extendSizeWorld.x * 2;
					let hitX = (ballPos.z - wallCenter.z) / (wallWidth / 2);
					console.log(`Hit position on paddle ${collider.name} -> ${hitX}`);
					this._direction.z *= -1;
					this._bounceCooldown = 2;
				}
				/* ------------------------------------------------------------------ */
				break;
			}
		}
		
	}
	_isIntersecting(meshA, meshB) {
		return meshA.intersectsMesh(meshB, true);
	}
}