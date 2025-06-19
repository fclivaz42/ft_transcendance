
import { Engine } from "@babylonjs/core/Engines/engine.js";

import { WebSocketManager } from "./WebSocketManager.js";
import { GameField } from "./GameField.js";

export class BabylonGame {
	private engine: Engine;
	private field: GameField;
	private started: boolean = false;

	constructor(canvas: HTMLCanvasElement, addr: string) {
		this.engine = new Engine(canvas, true);
		this.field = new GameField(this.engine);

		const manager: WebSocketManager = new WebSocketManager(
			(payload) => {
				this.field.init(payload);
				if (!this.started) {
					this.started = true;
					this.engine.runRenderLoop(() => {
						this.field.scene.render();
					});
				}
			},
			(payload) => this.field.update(payload), addr
		);

		// this.engine.runRenderLoop(() => {
		// 	this.field.scene.render();
		// });

		window.addEventListener("resize", () => this.engine.resize());
	}
}