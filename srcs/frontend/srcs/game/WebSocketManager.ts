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
		console.log("I am being called!");
		console.log(this.socket);

		window.addEventListener('keyup', (event) => {
			if (this.socket.readyState !== WebSocket.OPEN)
				return;
			console.log("Key up event:", event.key);
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
			console.log("Key press event:", event.key);
			switch (event.key) {
				case "w": {
					this.socket.send(JSON.stringify({
						type: "move",
						payload: {
							direction: "up"
						}
					}));
					break;
				}
				case "s": {
					this.socket.send(JSON.stringify({
						type: "move",
						payload: {
							direction: "down"
						}
					}));
					break;
				}
				case " ": {
					this.socket.send(JSON.stringify({
						type: "ball",
						payload: {
							direction: "launch"
						}
					}));
					break;
				}
			}
		});

		this.socket.onmessage = (event) => {
			const msg: ServerMessage = JSON.parse(event.data);
			if (msg.type === "init") {
				console.log(msg);
				this.onInit(msg.payload);
			}
			else if (msg.type === "update") this.onUpdate(msg.payload);
		};

		this.socket.onopen = () => {
			console.log("[WS] Connected", this.socket.readyState);
		}

		this.socket.onerror = (e) => console.error("[WS] Error", e);
	}

	public close() {
		if (this.socket.readyState === WebSocket.OPEN || this.socket.readyState === WebSocket.CONNECTING) {
			this.socket.close();
			console.log("[WS] Closed connection");
		}
	}
}
