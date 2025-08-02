import { i18nHandler } from "../handlers/i18nHandler.js";
import RoutingHandler from "../handlers/RoutingHandler.js";
import NotificationManager from "../managers/NotificationManager.js";
import PongGameManager from "../managers/PongGameManager.js";
import { ServerMessage, InitPayload, UpdatePayload, CollisionPayload } from "./types.js";

type InitHandler = (payload: InitPayload["payload"]) => void;
type UpdateHanlder = (payload: UpdatePayload["payload"]) => void;
type CollisionHandler = (payload: CollisionPayload["payload"]) => void;

export const PONG_HOST = `ws${location.protocol === "https:" ? "s" : ""}://${location.host}/api/game/`

export class WebSocketManager {
	private socket: WebSocket;

	constructor(
		private onInit: InitHandler,
		private onUpdate: UpdateHanlder,
		private onCollision: CollisionHandler,
		private addr: string
	) {
		this.socket = new WebSocket(this.addr);

		window.addEventListener('keyup', (event) => {
			if (this.socket.readyState !== WebSocket.OPEN)
				return;
			switch (event.key) {
				case "w":
				case "s":
					this.socket.send(JSON.stringify({
						type: "move",
						payload: {
							direction: "stop"
						}
					}));
					break;
				case "ArrowUp":
				case "ArrowDown":
					if (RoutingHandler.url.searchParams.get("room") === "local") {
						this.socket.send(JSON.stringify({
							type: "move2",
							payload: {
								direction: "stop"
							}
						}));
					}
					break;
			}
		});

		window.addEventListener('keydown', (event) => {
			if (this.socket.readyState !== WebSocket.OPEN)
				return;
			let data: any | undefined;
			switch (event.key) {
				case "w":
					data = { type: "move", payload: { direction: "up" } };
					break;
				case "s":
					data = { type: "move", payload: { direction: "down" } };
					break;
				case " ":
					data = { type: "ball", payload: { direction: "launch" } };
					break;
				case "ArrowUp":
					if (RoutingHandler.url.searchParams.get("room") === "local")
						data = { type: "move2", payload: { direction: "up" } };
					break;
				case "ArrowDown":
					if (RoutingHandler.url.searchParams.get("room") === "local")
						data = { type: "move2", payload: { direction: "down" } };
					break;
			}
			if (data)
				this.socket.send(JSON.stringify(data));
		});

		this.socket.onmessage = (event) => {
			if (event.data === "pong!") {
				PongGameManager.calculatePing();
				return;
			}
			const msg: ServerMessage = JSON.parse(event.data);
			switch (msg.type) {
				case "pingResponse":
					PongGameManager.onPingResponse(msg.payload);
					break;
				case "tournament-init":
				case "init":
					this.onInit(msg.payload);
					break;
				case "update":
					this.onUpdate(msg.payload);
					break;
				case "tournament-score":
				case "score":
					PongGameManager.onScoreUpdate(msg.payload.score);
					break;
				case "collision":
					this.onCollision(msg.payload);
					break;
				case "tournament-match-over":
					PongGameManager.onTournamentMatchOver(msg.payload);
					break;
				case "tournament-over":
					PongGameManager.onTournamentOver(msg.payload);
					break;
				case "gameover":
					PongGameManager.onGameOver(msg.payload);
					break;
				case "connect":
					PongGameManager.onConnect(msg.payload);
					break;
				case "tournament-status":
					PongGameManager.onBracketUpdate(msg.payload);
					break;
				default:
					console.warn("[WS] Unknown message type:", msg);
					return;
			}
		};

		this.socket.onopen = () => {
			console.log("[WS] Connected", this.socket.readyState);
		}

		this.socket.onerror = (e) => {
			console.error("[WS] Error:", e);
			if (this.socket.readyState === WebSocket.CLOSED) {
				RoutingHandler.setRoute("/");
				NotificationManager.notify({
					level: "error",
					title: i18nHandler.getValue("notification.generic.errorTitle"),
					message: i18nHandler.getValue("notification.generic.errorMessage"),
				});
			}
		}
	}

	public close() {
		if (this.socket.readyState === WebSocket.OPEN || this.socket.readyState === WebSocket.CONNECTING) {
			this.socket.close();
			console.log("[WS] Closed connection");
		}
	}

	public get socketInstance() {
		return this.socket;
	}
}
