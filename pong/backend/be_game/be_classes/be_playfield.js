
import { NullEngine,
		Scene,
		ArcRotateCamera,
		HemisphericLight,
		Vector3,
		MeshBuilder,
		StandardMaterial,
		Color3,
		Camera
	} from "babylonjs";

export class PlayField {
	constructor() {
		this.engine = new NullEngine({
			renderWidth: 512,
			renderHeight: 256,
			textureSize: 512
		});

		this.scene = new Scene(this.engine);

		this.updatables = [];
		this.camera = this._setupCamera();
		this.light = this._setupLight();

	};

	_setupCamera() {
		const camera = new ArcRotateCamera(
			"mainCam",
			Math.PI * 1.5, 0, 30,
			new Vector3(0, 0, 0),
			this.scene
		);
		camera.mode = Camera.ORTHOGRAPHIC_CAMERA;
		return camera;
	}

	_setupLight() {
		const light = new HemisphericLight("light", new Vector3(0, 0.5, -1), this.scene);
		return light;
	}
}