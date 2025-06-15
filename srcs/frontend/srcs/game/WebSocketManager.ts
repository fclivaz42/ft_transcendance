import { ServerMessage, InitPayload, UpdatePayload } from "./types.js";

type InitHandler = (payload: InitPayload["payload"]) => void;
type UpdateHanlder = (payload: UpdatePayload["payload"]) => void;

const HOST: URL = new URL("ws://127.0.0.1:1337/")
HOST.pathname = "game/remote/userId=123";

export class WebSocketManager {
	private socket: WebSocket;

	constructor(
		private onInit: InitHandler,
		private onUpdate: UpdateHanlder,
	) {
		this.socket = new WebSocket(HOST.toString());
		console.log("I am being called!");
		console.log(this.socket);
		this.socket.onopen = () => {
			console.log("[WS] Connected");
		}
		this.socket.onmessage = (event) => {
			const msg: ServerMessage = JSON.parse(event.data);
			if (msg.type === "init") this.onInit(msg.payload);
			else if (msg.type === "update") this.onUpdate(msg.payload);
		};
		this.socket.onerror = (e) => console.error("[WS] Error", e);
	}
}