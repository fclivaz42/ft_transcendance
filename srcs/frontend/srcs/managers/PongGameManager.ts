
import { Engine } from "@babylonjs/core/Engines/engine.js";

import { WebSocketManager } from "../game/WebSocketManager.js";
import { GameField } from "../game/GameField.js";
import { createPongCanvas } from "../components/frame/framePong.js";
import { frameManager } from "./FrameManager.js";

class PongGameManager {
	private engine: Engine | undefined;
	private field: GameField | undefined;
	private started: boolean = false;
	private canvasContainer: HTMLDivElement | undefined;
	private canvas: HTMLCanvasElement | undefined;
	private websocketManager: WebSocketManager | undefined;

	public reset() {
		if (this.started) {
			this.started = false;
			this.cleanupGame();
			if (this.engine)
				this.engine.dispose();
		}
	}

	public initialize(addr: string) {
		this.reset();

		this.canvasContainer = createPongCanvas();
		this.canvas = this.canvasContainer.querySelector<HTMLCanvasElement>("canvas") || undefined;
		this.engine = new Engine(this.getCanvas, true);
		this.field = new GameField(this.engine);

		if (this.websocketManager)
			this.websocketManager.close();
		this.websocketManager = new WebSocketManager(
			(payload) => {
				console.log("WebSocket payload received:", payload);
				this.getField.init(payload);
				if (!this.started) {
					if (!this.canvasContainer)
						throw new Error("Canvas is not initialized.");
					frameManager.frameChild = this.canvasContainer;
					this.getEngine.resize();
					this.started = true;
					this.getEngine.runRenderLoop(() => {
						if (!this.getField)
							throw new Error("GameField is not initialized.");
						this.getField.scene.render();
					});
				}
			},
			(payload) => this.getField.update(payload), addr
		);

		window.addEventListener("resize", () => {
			this.getEngine.resize();
		});
	}

	private cleanupGame() {
		if (this.canvasContainer) {
			this.canvasContainer.remove();
			this.canvasContainer = undefined;
		}
		if (this.canvas) {
			this.canvas.remove();
			this.canvas = undefined;
		}
		if (this.websocketManager) {
			this.websocketManager.close();
			this.websocketManager = undefined;
		}
	}

	private get getEngine(): Engine {
		if (!this.engine) {
			throw new Error("Engine is not initialized.");
		}
		return this.engine;
	}

	private get getField(): GameField {
		if (!this.field) {
			throw new Error("GameField is not initialized.");
		}
		return this.field;
	}

	private get getCanvas(): HTMLCanvasElement {
		if (!this.canvas) {
			throw new Error("Canvas is not initialized.");
		}
		return this.canvas;
	}
}

export default new PongGameManager();
