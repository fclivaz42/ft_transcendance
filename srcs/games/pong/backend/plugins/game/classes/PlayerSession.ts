import GameRoom from "./GameRoom.ts";
import fastifyWebsocket, { type WebSocket } from "@fastify/websocket";

export interface OutgoingMessage {
	type: string;
	[key: string]: any;
}

export default class PlayerSession {
	private _socket: WebSocket;
	private _userId: string | null;
	private _playerReady: boolean;
	private _room: GameRoom | null;
	private _paddleId: string | null;

	constructor(socket: WebSocket, userId: string | null = null) {
		this._socket = socket;
		this._userId = userId;
		this._playerReady = false;
		this._room = null;
		this._paddleId = null;
	}

	public getSocket(): WebSocket 						{ return this._socket; }
	public getUserId(): string | null 					{ return this._userId; }
	public isReady(): boolean 							{ return this._playerReady; }
	public getPaddleId(): string | null 				{ return this._paddleId; }
	public getRoom(): GameRoom | null 					{ return this._room; }
	
	public setReady(ready: boolean): void 				{ this._playerReady = ready; }
	public setRoom(room: GameRoom | null): void 		{ this._room = room; }
	public setPaddleId(paddleId: string | null): void 	{ this._paddleId = paddleId; }
	
	
	public send(message: OutgoingMessage): void {
		try {
			this._socket.send(JSON.stringify(message));
		} catch (err) {
			console.error("Failed to send message to client:", err);
		}
	}



}