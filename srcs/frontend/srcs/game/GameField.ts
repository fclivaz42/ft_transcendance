import { Scene } from "@babylonjs/core/scene.js";
import { Vector3 } from "@babylonjs/core/Maths/math.vector.js";
import { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera.js";
import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight.js";
import { Engine } from "@babylonjs/core/Engines/engine.js";

import { Ball } from "./game_components/Ball.js";
import { Paddle } from "./game_components/Paddle.js";
import { Wall } from "./game_components/Wall.js";

import { GridTron } from "./effects/GridTron.js";
import { GlowLayer } from "@babylonjs/core/Layers/glowLayer.js";
import { Color3 } from "@babylonjs/core/Maths/math.color.js";
import { InitPayload, UpdatePayload, CameraInitInfo, LightInitInfo } from "./types.js";

// Temp values, overriding WebSocket info
const ALPHA: number = Math.PI / 2;
const BETA: number = Math.PI / 2;
const RADIUS: number = -22;

export class GameField {
	public scene: Scene;
	private ball: Ball | null = null;
	private p1: Paddle | null = null;
	private p2: Paddle | null = null;
	private walls: Wall[] = [];

	private glowLayer: GlowLayer;
	private gridTron: GridTron | null = null;

	constructor(private engine: Engine) {
		this.scene = new Scene(this.engine);

		this.glowLayer = new GlowLayer("glow", this.scene);
		this.glowLayer.intensity = 0.8;
	}

	public init(payload: InitPayload["payload"]) {
		this.setupCameraAndLight(payload.camera, payload.light);

		// FUCK YOU SKYBOX
		// var skybox = MeshBuilder.CreateBox("skyBox", {size:1000.0}, this.scene);
		// var skyboxMaterial = new StandardMaterial("skyBox", this.scene);
		// skyboxMaterial.backFaceCulling = false;
		// skyboxMaterial.reflectionTexture = new CubeTexture("assets/textures/corona.dds", this.scene);
		// skyboxMaterial.reflectionTexture.coordinatesMode = Texture.SKYBOX_MODE;
		// skyboxMaterial.diffuseColor = new Color3(0, 0, 0);
		// skyboxMaterial.specularColor = new Color3(0, 0, 0); 
		// skybox.material = skyboxMaterial;

		this.createGridTronEffect();
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
			// cameraInfo.position[0],
			// cameraInfo.position[1],
			// cameraInfo.position[2],
			ALPHA,
			BETA,
			RADIUS,
			// new Vector3(...cameraInfo.target),
			Vector3.Zero(),
			this.scene
		);
		// camera.attachControl(this.engine.getRenderingCanvas(), false);
		camera.inputs.clear();
		camera.inputs.addPointers();
		this.scene.activeCamera = camera;

		new HemisphericLight("light", new Vector3(...lightInfo.direction), this.scene);
	}
	// --- Effect Grid  ---
	private createGridTronEffect(): void {
		const gridConfig = {
			gameWidth: 13.5 * 2, // = 27.4
			gameHeight: 15.7,
			gameReferenceZ: 0,
			gridTotalDepth: 40,
			gridSize: 2,
			lineWidth: 0.08,
			emissiveColor: new Color3(0.1, 0.4, 0.6)
		};

		this.gridTron = new GridTron(this.scene, gridConfig);
		this.gridTron.create();

		// (bleu clair)
		this.gridTron.setColorRGB(0.3, 0.6, 1);
	}


	public get grid(): GridTron | null {
		return this.gridTron;
	}
}
