import { Scene } from "@babylonjs/core/scene.js";
import { Vector3 } from "@babylonjs/core/Maths/math.vector.js";
import { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera.js";
import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight.js";
import { Engine } from "@babylonjs/core/Engines/engine.js";

import { Ball } from "./game_components/Ball.js";
import { Paddle } from "./game_components/Paddle.js";
import { Wall } from "./game_components/Wall.js";

import { InitPayload, UpdatePayload, CameraInitInfo, LightInitInfo } from "./types.js";
import { GlowLayer } from "@babylonjs/core";

// Temp values, overriding WebSocket info
const ALPHA: number = Math.PI / 2;
const BETA: number = Math.PI / 2;
const RADIUS: number = -26;

export class GameField {
    public scene: Scene;
    private ball: Ball | null = null;
    private p1: Paddle | null = null;
    private p2: Paddle | null = null;
    private walls: Wall[] = [];
    private glowLayer: GlowLayer;

    constructor(private engine: Engine) {
        this.scene = new Scene(this.engine);
        
        // GLOW LAYER AVEC FORTE INTENSITÉ
        this.glowLayer = new GlowLayer("glow", this.scene);
        this.glowLayer.intensity = 2.0;
        console.log("🔥 GLOW LAYER ACTIVÉ - Intensité 2.0");
    }

    public init(payload: InitPayload["payload"]) {
        console.log("🎮 DÉBUT INIT GAMEFIELD");
        console.log("📦 Payload reçu:", payload);
        
        this.setupCameraAndLight(payload.camera, payload.light);

        console.log("⚽ CRÉATION BALLE...");
        console.log("📍 Position balle dans payload:", payload.ball.curr_position);
        
        this.ball = new Ball(this.scene, payload.ball);
        console.log("⚽ BALLE CRÉÉE:", this.ball ? "✅ SUCCÈS" : "❌ ÉCHEC");
        
        this.p1 = new Paddle(this.scene, "p1", payload.p1);
        this.p2 = new Paddle(this.scene, "p2", payload.p2);

        for (const [name, wall] of Object.entries(payload.walls)) {
            this.walls.push(new Wall(this.scene, name, wall));
        }
        
        console.log("🎮 INIT GAMEFIELD TERMINÉ");
    }

    public update(payload: UpdatePayload["payload"]) {
        console.log("🔄 UPDATE GAMEFIELD");
        console.log("📍 Position balle reçue:", payload.ball.curr_position);
        
        if (this.ball) {
            console.log("⚽ Mise à jour balle...");
            this.ball.update(payload.ball);
        } else {
            console.log("❌ PAS DE BALLE À METTRE À JOUR");
        }
        
        this.p1?.update(payload.p1);
        this.p2?.update(payload.p2);
    }

    private setupCameraAndLight(cameraInfo: CameraInitInfo, lightInfo: LightInitInfo) {
        const camera = new ArcRotateCamera(
            "camera",
            ALPHA,
            BETA,
            RADIUS,
            Vector3.Zero(),
            this.scene
        );
        camera.attachControl(this.engine.getRenderingCanvas(), false);
        this.scene.activeCamera = camera;
        console.log("📷 Camera position:", camera.position.asArray());

        new HemisphericLight("light", new Vector3(...lightInfo.direction), this.scene);
    }

    public dispose(): void {
        console.log("🧹 Nettoyage du GameField");
        
        if (this.ball) {
            this.ball.dispose();
            this.ball = null;
        }
        
        if (this.p1) {
            this.p1.dispose();
            this.p1 = null;
        }
        
        if (this.p2) {
            this.p2.dispose();
            this.p2 = null;
        }
        
        this.walls.forEach(wall => wall.dispose());
        this.walls = [];
        
        if (this.glowLayer) {
            this.glowLayer.dispose();
        }
        
        if (this.scene) {
            this.scene.dispose();
        }
    }
}
