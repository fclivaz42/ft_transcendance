import {
	Scene,
	Vector3,
	ArcRotateCamera,
	HemisphericLight,
	Engine,
} from "@babylonjs/core";

import {Ball} from "./game_components/Ball.js";
import {Paddle} from "./game_components/Paddle.js";
import {Wall} from "./game_components/Wall.js";
import { InitPayload, UpdatePayload, CameraInitInfo, LightInitInfo} from "./types.js";

export class GameField {
	public scene: Scene;
	private ball: Ball | null = null;
	private p1: Paddle | null = null;
	private p2: Paddle | null = null;
	private walls: Wall[] = [];

	constructor(private engine: Engine) {
		this.scene = new Scene(this.engine);
	}

	public init(payload: InitPayload["payload"]) {
		this.setupCameraAndLight(payload.camera, payload.light);

		this.ball = new Ball(this.scene, payload.ball);
		this.p1 = new Paddle(this.scene, "p1", payload.p1);
		this.p2 = new Paddle(this.scene, "p2", payload.p2);
		
		for (const [name, wall] of Object.entries(payload.walls)) {
			this.walls.push(new Wall(this.scene, name, wall));
		}
	}

	public update(payload: UpdatePayload["payload"]) {
		this.ball?.update(payload.ball);
		this.p1?.update(payload.p1);
		this.p2?.update(payload.p2);
	}

	private setupCameraAndLight(cameraInfo: CameraInitInfo, lightInfo: LightInitInfo) {
		const camera = new ArcRotateCamera(
			"camera",
			cameraInfo.position[0],
			cameraInfo.position[1],
			cameraInfo.position[2],
			new Vector3(...cameraInfo.target),
			this.scene
		);
		camera.attachControl(false);

		new HemisphericLight("light", new Vector3(...lightInfo.direction), this.scene);
	}
}