
import { Scene } from "@babylonjs/core/scene.js";
import { Mesh } from "@babylonjs/core/Meshes/mesh.js";
import { CreateBox } from "@babylonjs/core/Meshes/Builders/boxBuilder.js";

import { PaddleInit, PaddleUpdate} from "../types.js";


export class Paddle {
	private mesh: Mesh;

	constructor(scene: Scene, name: string, init: PaddleInit) {
		this.mesh = CreateBox(name, {
			width: init.size[0],
			height: init.size[1],
			depth: init.size[2],
		}, scene);
		this.mesh.position.set(init.position[0], init.position[1], 0);
		console.log(`Paddle position ${name}, ${this.mesh.position.asArray()}`);
	}

	update(update: PaddleUpdate) {
		this.mesh.position.set(update.position[0], update.position[1], 0);
	}
}