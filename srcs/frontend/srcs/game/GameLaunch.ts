import { BabylonGame } from "./BabylonGame.js";

export function startGame() {
	const canvas = document.getElementById("game") as HTMLCanvasElement;
	if (!canvas) {
		console.error("Game canvas not found.");
		return;
	}

	new BabylonGame(canvas);
}