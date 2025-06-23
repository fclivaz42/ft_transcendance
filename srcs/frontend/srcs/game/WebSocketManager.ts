import { GameField } from "./GameField.js";
import { ServerMessage, InitPayload, UpdatePayload } from "./types.js";

type InitHandler = (payload: InitPayload["payload"]) => void;
type UpdateHanlder = (payload: UpdatePayload["payload"]) => void;

const HOST: string = `wss://${location.host}/game/remote`
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

		window.addEventListener('keydown', (event) => {
			if (event.key === 'w') {
				this.socket.send(JSON.stringify({
					type: "move",
					payload: {
						direction: "up"
					}
				}))
			};
		});

		window.addEventListener('keyup', (event) => {
			if (event.key === 'w') {
				this.socket.send(JSON.stringify({
					type: "move",
					payload: {
						direction: "stop"
					}
				}))
			};
		});

		window.addEventListener('keydown', (event) => {
			if (event.key === 's') {
				this.socket.send(JSON.stringify({
					type: "move",
					payload: {
						direction: "down"
					}
				}))
			};
		});


		window.addEventListener('keyup', (event) => {
			if (event.key === 's') {
				this.socket.send(JSON.stringify({
					type: "move",
					payload: {
						direction: "stop"
					}
				}))
			};
		});

		window.addEventListener('keypress', (event) => {
			if (event.key === " ") {
				this.socket.send(JSON.stringify({
					type: "ball",
					payload: {
						direction: "launch"
					}
				}))
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

}
