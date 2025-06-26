
import { Engine } from "@babylonjs/core/Engines/engine.js";

import { WebSocketManager } from "../game/WebSocketManager.js";
import { GameField } from "../game/GameField.js";
import { createPongCanvas } from "../components/frame/framePong.js";
import { frameManager } from "./FrameManager.js";

function enforceDefined<T>(value: T | undefined, message: string): T {
	if (!value)
		throw new Error(message);
	return value;
}

interface frontElements {
	canvasContainer: HTMLDivElement;
	canvas: HTMLCanvasElement;
	scoreElement: HTMLSpanElement;
}

class PongGameManager {
	private engine: Engine | undefined;
	private field: GameField | undefined;
	private started: boolean = false;
	private frontElements: frontElements | undefined;
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

		const canvasContainer = createPongCanvas();
		this.frontElements = {
			canvasContainer: canvasContainer,
			canvas: enforceDefined(canvasContainer.querySelector<HTMLCanvasElement>("canvas"), "Canvas element not found in the container.") as HTMLCanvasElement,
			scoreElement: enforceDefined(canvasContainer.querySelector<HTMLSpanElement>("#score"), "Score element not found in the container.") as HTMLSpanElement
		}
		this.engine = new Engine(this.getFrontElements.canvas, true);
		this.field = new GameField(this.engine);

		if (this.websocketManager)
			this.websocketManager.close();
		this.websocketManager = new WebSocketManager(
			(payload) => {
				console.log("WebSocket payload received:", payload);
				this.getField.init(payload);
				if (!this.started) {
					frameManager.frameChild = this.getFrontElements.canvasContainer;
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
		if (this.frontElements)
				for (const element of Object.values(this.frontElements))
					if (element) element.remove();
		this.frontElements = undefined;
	}

	private get getEngine(): Engine {
		if (!this.engine)
			throw new Error("Engine is not initialized.");
		return this.engine;
	}

	private get getField(): GameField {
		if (!this.field)
			throw new Error("GameField is not initialized.");
		return this.field;
	}

	private get getFrontElements(): frontElements{
		if (!this.frontElements)
			throw new Error("Front elements are not initialized.");
		return this.frontElements;
	}

	public onScoreUpdate(score: Record<string, number>) {
		for (const element of this.getFrontElements.scoreElement.children) {
			console.log("loop element", element);
			const identifier = element.getAttribute("data-score");
			if (!identifier || !(identifier in score)) continue;
			console.log("identifier", identifier, "score", score[identifier]);
			console.log("condition check", element.textContent, "==", score[identifier].toString());
			console.log(element.textContent === score[identifier].toString());
			const updatedScore = score[identifier].toString();
			if (element.textContent === updatedScore) continue;
			console.log("Updating score for", identifier, "to", updatedScore);
			// Update text content with animation
			window.requestAnimationFrame(() => {
					element.classList.add("animate-slide-up-fade");
					element.textContent = updatedScore;
					setTimeout(() => {
							element.classList.remove("animate-slide-up-fade");
					}, 1000);
			});
		}
	}
}

export default new PongGameManager();
