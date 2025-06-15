
import { Scene } from "@babylonjs/core/scene.js";
import { Mesh } from "@babylonjs/core/Meshes/mesh.js";
import { CreateSphere } from "@babylonjs/core/Meshes/Builders/sphereBuilder.js";

import { BallInit, BallUpdate} from "../types.js";


export class Ball {
	private mesh: Mesh;

	constructor(scene: Scene, init: BallInit) {
		this.mesh = CreateSphere(
			"ball",
			{
				diameter: init.size[0],
				segments: init.size[1],
			},
			scene,
		)
		this.mesh.position.set(init.curr_position[0], init.curr_position[1], 0);
	}

	update(update: BallUpdate) {
		this.mesh.position.set(update.curr_position[0], update.curr_position[1], 0);
	}
}