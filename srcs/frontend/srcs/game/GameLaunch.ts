import { BabylonGame } from "./BabylonGame.js";

export function startGame(addr: string) {
	new BabylonGame(addr);
}
