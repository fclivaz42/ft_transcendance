
import { Engine } from "@babylonjs/core/Engines/engine.js";

import { WebSocketManager } from "./WebSocketManager.js";
import { GameField } from "./GameField.js";

export class BabylonGame {
	private engine: Engine;
	private field: GameField;

	constructor(canvas: HTMLCanvasElement) {
		this.engine = new Engine(canvas, true);
		this.field = new GameField(this.engine);

		const manager: WebSocketManager = new WebSocketManager(
			(payload) => this.field.init(payload),
			(payload) => this.field.update(payload)
		);

		this.engine.runRenderLoop(() => {
			this.field.scene.render();
		});

		window.addEventListener("resize", () => this.engine.resize());
	}
}