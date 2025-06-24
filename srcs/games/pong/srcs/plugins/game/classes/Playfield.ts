
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
	Mesh,
} from "@babylonjs/core";

const WIDTH: number = 512;
const HEIGHT: number = 256;

export const DEFAULT_FPS: number = 60;

const ALPHA: number = Math.PI / 2;
const BETA: number = Math.PI / 2;
const RADIUS: number = 15;

export interface CameraInitInfo {
	name: string;
	position: number[];
	target: number[];
	mode: number;
}

export interface LightInitInfo {
	name: string;
	direction: number[];
}

interface Updatable {
	update(fps: number): void;
}


export default class PlayField {
	private _scene: Scene;
	private _engine: NullEngine = new NullEngine();
	private _updatables: Updatable[] = [];
	private _intervalId: NodeJS.Timeout | null = null;
	private _camera: ArcRotateCamera;
	private _light: HemisphericLight;
	private _bg: Mesh;
	private static _fps: number = 0;

	constructor() {

		this._engine.setSize(WIDTH, HEIGHT);
		this._scene = new Scene(this._engine);
		this._camera = this._setupCamera();
		this._light = this._setupLight();
		this._bg = this._setupBackground();

	};

	private _setupCamera(): ArcRotateCamera {
		const camera = new ArcRotateCamera(
			"mainCam",
			ALPHA, BETA, RADIUS,
			Vector3.Zero(),
			this._scene
		)
		camera.mode = Camera.ORTHOGRAPHIC_CAMERA;
		return camera;
	}

	private _setupLight() {
		const light = new HemisphericLight("light", new Vector3(0, 0.5, -1), this._scene);
		return light;
	}

	private _setupBackground(): Mesh {
		const bg = MeshBuilder.CreatePlane("bg", { size: 30 }, this._scene);
		const bgMaterial = new StandardMaterial("bgMat", this._scene);
		bgMaterial.diffuseColor = Color3.Blue();
		bg.material = bgMaterial;
		return bg;
	}

	public getScene(): Scene {
		return this._scene;
	}

	public getCamera(): ArcRotateCamera {
		return this._camera;
	}

	public getCameraInitInfo(): CameraInitInfo {
		const initInfo = {
			name: this.getCamera().name,
			position: this.getCamera().position.asArray(),
			target: this.getCamera().target.asArray(),

			mode: this.getCamera().mode,
		};
		return initInfo;
	}

	public getLight() {
		return this._light;
	}

	public getLightInitInfo(): LightInitInfo {
		const initInfo = {
			name: this.getLight.name,
			direction: this.getLight().direction.asArray(),
		};
		return initInfo;
	}

	public addUpdatable(obj: Updatable): void {
		if (typeof obj.update === "function") {
			this._updatables.push(obj);
		}
	}

	public start(fps: number = DEFAULT_FPS, broadCast?: () => void): void {
		if (this._intervalId !== null) {
			this.stop();
		}
		const frameTime = 1000 / fps;
		this._intervalId = setInterval(() => {
			for (const obj of this._updatables) {
				obj.update(PlayField._fps);
			}
			PlayField._fps < 60 ? PlayField._fps++ : PlayField._fps = 0;
			if (broadCast) broadCast();
			this._scene.render();
		}, frameTime);
	}

	public stop(): void {
		if (this._intervalId !== null) {
			clearInterval(this._intervalId);
			this._intervalId = null;
		}
	}
}
