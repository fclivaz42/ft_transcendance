
import { Engine } from "@babylonjs/core";
import { Scene } from "@babylonjs/core";
import { FreeCamera } from "@babylonjs/core";
import { HemisphericLight } from "@babylonjs/core";
import { Vector3 } from "@babylonjs/core";
import { MeshBuilder } from "@babylonjs/core";
import { StandardMaterial } from "@babylonjs/core";
import { Color3 } from "@babylonjs/core";

export class PlayField {
	constructor(canvasId = "renderCanvas") {
		this.canvas = document.getElementById(canvasId);
		this.engine = new Engine(this.canvas, true);
		this.scene = new Scene(this.engine);

		this.updatables = [];

		this.camera = this._setupCamera();
		this.light = this._setupLight();
		this.floor = this._setupFloor();
	};

	_setupCamera() {
		const camera = new FreeCamera(
			"mainCam",
			new Vector3(0, 30, 0),
			this.scene
		);
		camera.attachControl(this.canvas, true);
		camera.setTarget( new Vector3(0, 0, 0));
		camera.upVector = ( new Vector3(0, -1, 0));
		return camera;
	}

	_setupLight() {
		const light = new HemisphericLight("light", new Vector3(1, 1, 0), this.scene);
		return light;
	}

	_setupFloor() {
		const ground = MeshBuilder.CreateGround(
			"ground",
			{ width: 30, height: 16.67 },
			this.scene
		)
		const groundMaterial = new StandardMaterial("groundMat", this.scene);
		groundMaterial.diffuseColor = Color3.Blue();
		ground.material = groundMaterial;
		return ground;
	}

	
	getScene() {
		return this.scene;
	}
	
	getCamera() {
		return this.camera;
	}
	
	addUpdatable(obj) {
		if (typeof obj.update === "function") {
			this.updatables.push(obj);
		}
	}
	
	start() {
		this.engine.runRenderLoop(() => {
			for (const obj of this.updatables) {
				obj.update();
			}
			this.scene.render();
		});

		// window.addEventListener("resize", function () {
		// 	this.engine.resize();
		// });
	}
}
