
import { Engine } from "@babylonjs/core/Engines/engine.js";

import { WebSocketManager } from "../game/WebSocketManager.js";
import { GameField } from "../game/GameField.js";
import { createPongCanvas } from "../components/frame/framePong.js";
import { frameManager } from "./FrameManager.js";
import { GameOverPayload, InitPayload, PlayerConnectedPayload } from "../game/types.js";
import UserHandler from "../handlers/UserHandler.js";
import { i18nHandler } from "../handlers/i18nHandler.js";
import createUserAvatar from "../components/usermenu/userAvatar.js";
import { Users } from "../interfaces/Users.js";
import { createPongGameoverDialog } from "../components/dialog/pongGameover/index.js";
import RoutingHandler from "../handlers/RoutingHandler.js";

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
	} = {ping: undefined, sentPing: undefined, lastCheck: undefined};
	private users: Record<"p1" | "p2", Users | undefined> = {
		p1: undefined,
		p2: undefined
	}

	public calculatePing() {
		if (this.pingInterval.sentPing === undefined) {
			if (!this.websocketManager || !this.websocketManager.socketInstance)
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
		const pingElemens = document.querySelectorAll<HTMLSpanElement>("[data-pong-ping]");
		for (const element of pingElemens) {
			// TODO: differentiate between players
			element.textContent = `${this.pingInterval.ping}ms`;
		}
	}

	public reset() {
		this.started = false;
		this.cleanupGame();
		this.websocketManager?.close();
		this.engine?.dispose();
	}

	private async initializeFrontElements(payload: InitPayload["payload"]) {
		this.getFrontElements.canvasContainer.querySelectorAll("[data-pong-displayname]").forEach(async (element) => {
			const identifier = element.getAttribute("data-pong-displayname");
			if (!identifier || !(identifier in payload)) throw new Error(`Identifier ${identifier} not found in payload.`);
			const playerData = identifier === "p1" ? payload.connectedPlayers.p1 : payload.connectedPlayers.p2;
			const avatarElement = this.getFrontElements.canvasContainer.querySelector<HTMLImageElement>(`[data-pong-avatar="${identifier}"]`);
			if (playerData === undefined) {
				const botUser: Users = {
					DisplayName: i18nHandler.getValue("pong.computer") || "Computer",
					PlayerID: "bot"
				}
				this.users[identifier as "p1" | "p2"] = botUser;
				avatarElement?.replaceWith(await createUserAvatar({isComputer: true, sizeClass: "lg:w-20 lg:h-20 w-14 h-14"}));
				element.textContent = i18nHandler.getValue("pong.computer") || "Computer";
				return;
			}
			const user = UserHandler.fetchUser(playerData);
			user.then(async (userData) => {
				this.users[identifier as "p1" | "p2"] = userData;
				if (!userData) throw new Error(`User data for ${identifier} not found.`);
				element.textContent = userData.DisplayName;
				avatarElement?.replaceWith(await createUserAvatar({playerId: userData.PlayerID, sizeClass: "lg:w-20 lg:h-20 w-14 h-14"}));
			}).catch((error) => {
				console.error(`Error fetching user data for ${identifier}:`, error);
				element.textContent = "Unknown User";
			});
		});
	}

	public async initialize(addr: string) {
		this.reset();
		const canvasContainer = await createPongCanvas(addr.includes("computer"));
		this.frontElements = {
			canvasContainer: canvasContainer,
			canvas: enforceDefined(canvasContainer.querySelector<HTMLCanvasElement>("canvas"), "Canvas element not found in the container.") as HTMLCanvasElement,
			scoreElement: enforceDefined(canvasContainer.querySelector<HTMLSpanElement>("#score"), "Score element not found in the container.") as HTMLSpanElement
		}
		this.engine = new Engine(this.getFrontElements.canvas, true);
		this.field = new GameField(this.engine);

		this.websocketManager = new WebSocketManager(
			(payload) => {
				console.log("WebSocket payload received:", payload);
				this.initializeFrontElements(payload);
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

	public getPlayers(): Record<"p1" | "p2", Users | undefined> {
		return this.users;
	}

	public onGameOver(payload: GameOverPayload["payload"]) {
		console.log("Game Over payload received:", payload);
		const winner = this.users[payload.winner as "p1" | "p2"];
		if (!winner) {
			console.error("Winner not found in users:", payload.winner);
			return;
		}
		const finalScore = payload.final_score as {p1: number, p2: number};
		console.log(`Game Over! Winner: ${winner.DisplayName}, Final Score: P1 - ${finalScore.p1}, P2 - ${finalScore.p2}`);
		createPongGameoverDialog(payload, this.users);
	}

	public onConnect(payload: PlayerConnectedPayload["payload"]) {
		if (RoutingHandler.searchParams.get("room") !== "host")
			return;
		RoutingHandler.url.searchParams.set("room", payload.roomID);
		RoutingHandler.updateUrl();
		const pongRoomCode = document.querySelector<HTMLInputElement>("#pong-room-code");
		if (!pongRoomCode)
			throw new Error("Pong room code input not found.");
		const input = pongRoomCode.querySelector("#pong-room-code-input") as HTMLInputElement;
		if (!input)
			throw new Error("Pong room code input element not found.");
		input.value = payload.roomID;
		pongRoomCode.classList.replace("hidden", "flex");
	}
}

export default new PongGameManager();
