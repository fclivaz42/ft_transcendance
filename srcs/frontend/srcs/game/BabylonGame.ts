
import { Engine } from "@babylonjs/core/Engines/engine.js";

import { WebSocketManager } from "./WebSocketManager.js";
import { GameField } from "./GameField.js";
import { createPongCanvas } from "../components/frame/framePong.js";
import { frameManager } from "../managers/FrameManager.js";

export class BabylonGame {
	private engine: Engine;
	private field: GameField;
	private started: boolean = false;
	private static cavasContainer: HTMLDivElement | undefined;
	private static canvas: HTMLCanvasElement | undefined;
	private static websocketManager: WebSocketManager | undefined;

	constructor(addr: string) {
		this.cleanupGame();
		BabylonGame.cavasContainer = createPongCanvas();
		BabylonGame.canvas = BabylonGame.cavasContainer.querySelector<HTMLCanvasElement>("canvas") || undefined;
		if (!BabylonGame.canvas)
			throw new Error("Canvas element not found in the container.");
		this.engine = new Engine(BabylonGame.canvas, true);
		this.field = new GameField(this.engine);

		if (BabylonGame.websocketManager)
			BabylonGame.websocketManager.close();
		BabylonGame.websocketManager = new WebSocketManager(
			(payload) => {
				console.log("WebSocket payload received:", payload);
				this.field.init(payload);
				if (!this.started) {
					if (!BabylonGame.cavasContainer)
						throw new Error("Canvas is not initialized.");
					frameManager.frameChild = BabylonGame.cavasContainer;
					this.engine.resize();
					this.started = true;
					this.engine.runRenderLoop(() => {
						this.field.scene.render();
					});
				}
			},
			(payload) => this.field.update(payload), addr
		);

		window.addEventListener("resize", () => this.engine.resize());
	}

	private cleanupGame() {
		if (BabylonGame.cavasContainer) {
			BabylonGame.cavasContainer.remove();
			BabylonGame.cavasContainer = undefined;
		}
		if (BabylonGame.canvas) {
			BabylonGame.canvas.remove();
			BabylonGame.canvas = undefined;
		}
		if (BabylonGame.websocketManager) {
			BabylonGame.websocketManager.close();
			BabylonGame.websocketManager = undefined;
		}
	}
}
