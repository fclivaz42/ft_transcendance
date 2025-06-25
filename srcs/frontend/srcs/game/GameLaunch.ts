import PongGameManager from "../managers/PongGameManager.js";

export function startGame(addr: string) {
	PongGameManager.initialize(addr);
}
