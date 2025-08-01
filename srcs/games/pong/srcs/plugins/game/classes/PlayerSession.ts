import GameRoom from "./GameRoom.ts";
import Paddle from "./Paddle.ts";
import fastifyWebsocket, { type WebSocket } from "@fastify/websocket";
import UsersSdk from "../../../../../../libs/helpers/usersSdk.ts";
import type { User } from "../../../../../../libs/interfaces/User.ts";
import type TournamentLobby from "./TournamentLobby.ts";

export interface OutgoingMessage {
	type: string;
	[key: string]: any;
}

export default class PlayerSession {
	private _socket: WebSocket | null;
	private _userId: string;
	private _playerReady: boolean;
	private _room: GameRoom | null;
	private _tournamentLobby: TournamentLobby | undefined;
	private _paddleId: string | null;
	private _userSdk: UsersSdk = new UsersSdk();
	private _userObjectFromDB: Partial<User>;
	private _hasDisconnected: boolean = false;
	public isAI: boolean;
	private _special: boolean = false;

	constructor(socket: WebSocket | null, userId: string) {
		this._socket = socket;
		this._userId = userId;
		this._playerReady = false;
		this._room = null;
		this._paddleId = null;
		this.isAI = this._socket ? false : true;
		this.getDataFromSDK();
	}

	public async getDataFromSDK() {
		if (!this._userObjectFromDB && !this.isAI)
			this._userObjectFromDB = this._userSdk.filterPublicUserData(
				(await this._userSdk.getUser(this._userId)).data
			);
		return this._userObjectFromDB;
	}

	public get local(): boolean {
		return this._special;
	}

	public set local(val: boolean) {
		this._special = val;
	}

	public get disconnected(): boolean {
		return this._hasDisconnected;
	}

	public set disconnected(val: boolean) {
		this._hasDisconnected = val;
	}

	public getTournamentLobby(): TournamentLobby | undefined {
		return this._tournamentLobby;
	}

	public getSocket(): WebSocket | null {
		return this._socket;
	}
	public getUserId(): string {
		return this._userId;
	} // removed | null
	public isReady(): boolean {
		return this._playerReady;
	}
	public getPaddleId(): string | null {
		return this._paddleId;
	}
	public getRoom(): GameRoom | null {
		return this._room;
	}

	public setReady(ready: boolean): void {
		this._playerReady = ready;
	}
	public setRoom(room: GameRoom | null): void {
		this._room = room;
	}

	public setLobby(lobby: TournamentLobby): void {
		this._tournamentLobby = lobby;
	}

	public setPaddleId(paddleId: string | null): void {
		this._paddleId = paddleId;
	}

	public getPaddle(): Paddle | null {
		const room = this.getRoom();
		if (!room) return null;

		const game = room.getGame();
		const [p1, p2] = game.getPaddles();

		if (this._paddleId === "p1") return p1;
		if (this._paddleId === "p2") return p2;
		return null;
	}

	public send(message: OutgoingMessage): void {
		try {
			if (this._socket) this._socket.send(JSON.stringify(message));
		} catch (err) {
			console.error("Failed to send message to client:", err);
		}
	}
}
