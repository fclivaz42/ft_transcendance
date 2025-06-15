
import { Scene, Mesh, MeshBuilder} from "@babylonjs/core";
import { WallsInit } from "../types.js";

type SingleWallInit = WallsInit[string];

export class Wall {
	private mesh: Mesh;

	constructor(scene: Scene, name: string, init: SingleWallInit) {
		this.mesh = MeshBuilder.CreateBox(name, {
			width: init.size[0],
			height: init.size[1],
			depth: init.size[2],
		}, scene);
		this.mesh.position.set(init.position[0], init.position[1], 0);
	}
}