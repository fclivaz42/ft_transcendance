
import { Scene, Mesh, MeshBuilder} from "@babylonjs/core";
import { PaddleInit, PaddleUpdate} from "../types.js";


export class Paddle {
	private mesh: Mesh;

	constructor(scene: Scene, name: string, init: PaddleInit) {
		this.mesh = MeshBuilder.CreateBox(name, {
			width: init.size[0],
			height: init.size[1],
			depth: init.size[2],
		}, scene);
		this.mesh.position.set(init.position[0], init.position[1], 0);
	}

	update(update: PaddleUpdate) {
		this.mesh.position.set(update.position[0], update.position[1], 0);
	}
}