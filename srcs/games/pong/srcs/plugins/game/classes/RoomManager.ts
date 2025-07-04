
import GameRoom from "./GameRoom.ts";
import PlayerSession from "./PlayerSession.ts";
import fastifyWebsocket, { type WebSocket } from "@fastify/websocket";

type GameMode = 'remote' | 'friend_host' | 'friend_join' | 'local' | 'computer';

export interface AssignPlayerOptions {
	userId: string;
	mode?: GameMode;
	roomId?: string | null;
}

export default class RoomManager {
	private _rooms: Map<string, GameRoom> = new Map();
	private _connectedSessions: Map<string, PlayerSession> = new Map();

	/* ROOM ID GENERATION -------------------------------------------------------------------------- */
	protected _generateRandomLetter(): string {
		return String.fromCharCode(65 + Math.floor(Math.random() * 26));
	}

	protected _generateRandomNumber(): number {
		return Math.floor(Math.random() * 10);
	}

	protected _shuffle<T>(arr: T[]): T[] {
		const copy = [...arr];
		let currentIndex: number = copy.length;

		while (currentIndex !== 0) {
			let randomIndex: number = Math.floor(Math.random() * currentIndex);
			currentIndex--;
			[copy[currentIndex], copy[randomIndex]] = [
				copy[randomIndex], copy[currentIndex]
			];
		}
		return copy;
	}

	protected _generateRoomId(): string {
		const letters = Array.from({ length: 2 }, () => this._generateRandomLetter());
		const numbers = Array.from({ length: 2 }, () => this._generateRandomNumber().toString());
		return this._shuffle(letters.concat(numbers)).join('');
	}
	/* --------------------------------------------------------------------------------------------- */

	public createRoom(vsAI: boolean = false): GameRoom {
		const roomId = this._generateRoomId();
		const room = new GameRoom(roomId, vsAI, (id) => {
			this._rooms.delete(id);
			console.log(`Room ${id} deleted (empty or game over).`);
		});
		this._rooms.set(roomId, room);
		console.log(`Created Room with ID: ${roomId}`);
		return room;
	}

	public findAvailableRoom(): GameRoom | null {
		console.log("Searching for room...");
		for (const room of this._rooms.values()) {
			if (!room.isFull() && !room.lock) return room;
		}
		console.log("Available room not found...");
		return null;
	}

	public assignPlayer(socket: WebSocket, options: AssignPlayerOptions): PlayerSession {
		const { userId, mode, roomId = null } = options;
		const session = new PlayerSession(socket, userId);
		this.addSession(session);

		let room: GameRoom | undefined;

		switch (mode) {
			case "remote":
				room = this.findAvailableRoom() ?? this.createRoom();
				room.addPlayer(session);
				break;
			case "friend_host":
				room = roomId && this._rooms.get(roomId) || this.createRoom();
				room.addPlayer(session);
				break;
			case "friend_join":
				if (roomId && this._rooms.has(roomId)) {
					room = this._rooms.get(roomId);
					room?.addPlayer(session);
				} else {
					console.log(`Room: ${roomId} not found.`)
					socket.close();
				}
				break;
			case "local":
				room = this.createRoom();
				room.addPlayer(session);
				// room.forceLocalPlayer(session); // assign both paddles, change controls
				return session;
			case "computer":
				room = this.createRoom(true);
				room.lock = true;
				room.addPlayer(session);
				break;
			default:
				throw new Error(`Unknown mode: ${mode}`);
		}
		return session;
	}

	/* MANAGING SESSIONS --------------------------------------------------------------------------- */
	public addSession(session: PlayerSession): void {
		this._connectedSessions.set(session.getUserId(), session);
	}

	public getSession(userId: string): PlayerSession | undefined {
		return this._connectedSessions.get(userId);
	}

	public removeSession(session: PlayerSession): void {
		this._connectedSessions.delete(session.getUserId());

		const room = session.getRoom();
		if (room) {
			room.removePlayer(session);
			if (room.isEmpty()) {
				this._rooms.delete(room.id);
			}
		}
	}
	/* --------------------------------------------------------------------------------------------- */
}


// TODO: make so that the update payload is broadcasted to all connected player in the given session
//       work in GameClass.js
// TODO: logic for local game, need to adjust controls for 1 keyboard,
//       listen to different messages on frontend
