
import {
	NullEngine,
	Scene,
	ArcRotateCamera,
	Camera,
	HemisphericLight,
	Vector3,
	Color3,
	MeshBuilder,
	StandardMaterial,
} from "@babylonjs/core";

export class PlayField {
	constructor() {
		this.engine = new NullEngine({
			renderWidth: 512,
			renderHeight: 256,
			textureSize: 512
		});

		this.scene = new Scene(this.engine);

		this.updatables = [];
		this.intervalId = null;
		this.camera = this.#_setupCamera();
		this.light = this.#_setupLight();
		this.bg = this.#_setupBackground();

	};

	#_setupCamera() {
		const camera = new ArcRotateCamera(
			"mainCam",
			Math.PI / 2, Math.PI / 2, 15, // make variables
			Vector3.Zero(),
			this.scene
		)
		camera.mode = Camera.ORTHOGRAPHIC_CAMERA;
		return camera;
	}

	#_setupLight() {
		const light = new HemisphericLight("light", new Vector3(0, 0.5, -1), this.scene);
		return light;
	}

	#_setupBackground() {
		const bg = new MeshBuilder.CreatePlane("bg", {size: 30}, this.scene);
		const bgMaterial = new StandardMaterial("bgMat", this.scene);
		bgMaterial.diffuseColor = Color3.Blue();
		bg.material = bgMaterial;
		return bg;
	}

	getScene() {
		return this.scene;
	}

	getCamera() {
		return this.camera;
	}

	getLight() {
		return this.light;
	}

	addUpdatable(obj) {
		if (typeof obj.update === "function") {
			this.updatables.push(obj);
		}
	}

	start(fps = 60) {
		if (this.intervalId !== null) {
			this.stop();
		}
		const frameTime = 1000 / fps;
		this.intervalId = setInterval(() => {
			for (const obj of this.updatables) {
				obj.update();
			}
			this.scene.render();
		}, frameTime);
	}

	stop() {
		if (this.intervalId !== null) {
			clearInterval(this.intervalId);
			this.intervalId = null;
		}
	}
}