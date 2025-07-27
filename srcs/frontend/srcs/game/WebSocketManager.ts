import { i18nHandler } from "../handlers/i18nHandler.js";
import RoutingHandler from "../handlers/RoutingHandler.js";
import NotificationManager from "../managers/NotificationManager.js";
import PongGameManager from "../managers/PongGameManager.js";
import { GameField } from "./GameField.js";
import { ServerMessage, InitPayload, UpdatePayload } from "./types.js";

type InitHandler = (payload: InitPayload["payload"]) => void;
type UpdateHanlder = (payload: UpdatePayload["payload"]) => void;

export const PONG_HOST = `wss://${location.host}/api/game/`

export class WebSocketManager {
	private socket: WebSocket;

	constructor(
		private onInit: InitHandler,
		private onUpdate: UpdateHanlder,
		private addr: string
	) {
		this.socket = new WebSocket(this.addr);

		window.addEventListener('keyup', (event) => {
			if (this.socket.readyState !== WebSocket.OPEN)
				return;
			if (event.key === 'w' || event.key === "s") {
				this.socket.send(JSON.stringify({
					type: "move",
					payload: {
						direction: "stop"
					}
				}))
			};
		});

		window.addEventListener('keypress', (event) => {
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
				case "o":
					data = { type: "ia", payload: { direction: "p1" } };
					break;
				case "p":
					data = { type: "ia", payload: { direction: "p2" } };
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
				case "tournament-match-over":
					PongGameManager.onTournamentMatchOver(msg.payload);
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
					console.warn("[WS] Unknown message type:", msg.type);
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
