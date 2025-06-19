import { BabylonGame } from "./BabylonGame.js";

export function startGame(addr: string) {
	const canvas = document.getElementById("game") as HTMLCanvasElement;
	if (!canvas) {
		console.error("Game canvas not found.");
		return;
	}

	new BabylonGame(canvas, addr);
}
