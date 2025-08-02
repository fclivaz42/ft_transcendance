import GameRoom from "./GameRoom.ts";
import PlayerSession from "./PlayerSession.ts";
import { generateRoomId } from "../helpers/id_generator.ts";
import fastifyWebsocket, { type WebSocket } from "@fastify/websocket";

type GameMode = "remote" | "friend_host" | "friend_join" | "local" | "computer";

export interface AssignPlayerOptions {
	userId: string;
	mode?: GameMode;
	roomId?: string | null;
}

export default class RoomManager {
	protected _rooms: Map<string, GameRoom> = new Map();
	protected _connectedSessions: Map<string, PlayerSession> = new Map();

	public createRoom(vsAI: boolean = false): GameRoom {
		const roomId = generateRoomId();
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
			if (!room.isFull() && !room.lock && !room.closed) {
				return room;
			}
		}
		console.log("Available room not found...");
		return null;
	}

	public assignPlayer(
		socket: WebSocket,
		options: AssignPlayerOptions
	): PlayerSession {
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
				room = (roomId && this._rooms.get(roomId)) || this.createRoom();
				room.closed = true;
				room.addPlayer(session);
				break;
			case "friend_join":
				if (roomId && this._rooms.has(roomId)) {
					room = this._rooms.get(roomId);
					room?.addPlayer(session);
				} else {
					console.log(`Room: ${roomId} not found.`);
					session.send({
						type: "close-socket",
						message: "RoomID not found"
					});
					socket.close();
				}
				break;
			case "local":
				room = this.createRoom();
				room.closed = true;
				room.addPlayer(session);
				const localPlayer = new PlayerSession(null, "P-0");
				localPlayer.isAI = false;
				localPlayer.local = true;
				room.addPlayer(localPlayer);
				room.lock = true;
				return session;
			case "computer":
				room = this.createRoom(true);
				const aiSession = new PlayerSession(null, "P-0");
				room.addPlayer(session);
				room.addPlayer(aiSession, true);
				room.lock = true;
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
			else if (room.isEmptyAIExclusive()) {
				console.log("found AI!");
				room.removeAIfromRoom();
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
