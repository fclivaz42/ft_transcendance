
import { Vector3 } from "@babylonjs/core";
import { Paddle } from "./paddle.js";

export class Wall extends Paddle {
	constructor(scene, name, position = new Vector3(0, 0, 0), options = {}) {
		super(scene, name, position, options);
		this._keys = {};
	}

	_setupInput() {
		// Do nothing
	}

	calculateBounce(ball)	{
		if (!this._passThrough) {
			ball._direction.z *= -1;
			ball._direction.normalize();
			ball._bounceCooldown = 5;
		}
		else {
			ball.mesh.position.set(0, 0, 0);
			ball.mesh.position.addInPlace(new Vector3(0, 0, 0).scale(this._speed));
		}
	}
}