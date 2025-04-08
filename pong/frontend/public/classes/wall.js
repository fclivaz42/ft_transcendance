
import { Paddle } from "./paddle.js";

export class Wall extends Paddle {
	constructor(scene, name, position = new Vector3(0, 0, 0), options = {}) {
		super(scene, name, position, options);
		this._keys = {};
	}

	_setupInput() {
		// Do nothing
	}
}