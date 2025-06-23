
import { Scene } from "@babylonjs/core/scene.js";
import { Mesh } from "@babylonjs/core/Meshes/mesh.js";
import { CreateBox } from "@babylonjs/core/Meshes/Builders/boxBuilder.js";

import { PaddleInit, PaddleUpdate} from "../types.js";
import { Color3, Color4, GlowLayer, StandardMaterial } from "@babylonjs/core";


export class Paddle {
	private mesh: Mesh;

	constructor(scene: Scene, name: string, init: PaddleInit) {
		this.mesh = CreateBox(name, {
			width: init.size[0],
			height: init.size[1],
			depth: init.size[2],
		}, scene);
		this.mesh.position.set(init.position[0], init.position[1], 0);

		const mat = new StandardMaterial("hide", scene);
		mat.alpha = 0;
		mat.disableDepthWrite = false;
		this.mesh.material = mat;

		this.mesh.enableEdgesRendering();
		this.mesh.edgesWidth = 15.0;


		if (name === "p1") {
			this.mesh.edgesColor = new Color4(1, 0, 1, 1);
		}
		if (name === "p2") {
			this.mesh.edgesColor = new Color4(0, 1, 1, 1);
		}
		console.log(`Paddle position ${name}, ${this.mesh.position.asArray()}`);
	}

	update(update: PaddleUpdate) {
		this.mesh.position.set(update.position[0], update.position[1], 0);
	}
}