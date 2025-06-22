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
