
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
	private pingInterval: {
		lastCheck: number | undefined;
		ping: number | undefined;
		sentPing: number | undefined;
	} = {ping: undefined, sentPing: undefined, endTime: undefined};

	public calculatePing() {
		if (this.pingInterval.sentPing === undefined) {
			if (!this.websocketManager || !this.websocketManager.socket)
				throw new Error("WebSocketManager or socket is not initialized.");
			this.pingInterval.sentPing = Date.now();
			this.websocketManager.socketInstance.send("ping!");
			return;
		}
		this.pingInterval.ping = Date.now() - this.pingInterval.sentPing;
		// TODO: send ping to server
		/*this.websocketManager?.socketInstance.send(JSON.stringify({
			type: "ping",
			payload: {
				ping: this.pingInterval.ping
			}
		}));*/
		this.pingInterval.sentPing = undefined;
		const pingElemens = document.querySelectorAll<HTMLSpanElement>("[data-ping]");
		for (const element of pingElemens) {
			// TODO: differentiate between players
			element.textContent = `${this.pingInterval.ping}ms`;
		}
	}

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
						if (!this.pingInterval.sentPing && (!this.pingInterval.lastCheck || Date.now() - this.pingInterval.lastCheck > 3000)) {
							this.calculatePing();
							this.pingInterval.lastCheck = Date.now();
						}
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
		this.pingInterval = {
			ping: undefined,
			sentPing: undefined,
			lastCheck: undefined
		}
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
			const identifier = element.getAttribute("data-score");
			if (!identifier || !(identifier in score)) continue;
			const updatedScore = score[identifier].toString();
			if (element.textContent === updatedScore) continue;
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
