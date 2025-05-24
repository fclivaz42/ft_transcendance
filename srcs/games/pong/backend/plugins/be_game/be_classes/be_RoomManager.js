
import GameRoom from "./be_GameRoom.js";
import PlayerSession from "./be_PlayerSession.js";

export default class RoomManager {
	constructor() {
		this.rooms = new Map();
		this.roomCount = 0;
	}

	_generateRandomLetter() {
		return String.fromCharCode(65 + Math.floor(Math.random() * 26));
	}

	_generateRandomNumber() {
		return Math.floor(Math.random() * 10);
	}

	_shuffle(arr) {
		const copy = [...arr];
		let currentIndex = copy.length;

		while (currentIndex != 0) {
			let randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex--;
			[copy[currentIndex], copy[randomIndex]] = [
				copy[randomIndex], copy[currentIndex]];
		}
		return copy;
	}

	_generateRoomId() {
		const letters = Array.from({length: 2}, () => this._generateRandomLetter());
		const numbers = Array.from({length: 2}, () => this._generateRandomNumber().toString());
		const merged = this._shuffle(letters.concat(numbers)).join('');
		return merged;
	}

	createRoom() {
		const roomId = this._generateRoomId();
		const room = new GameRoom(roomId);
		this.rooms.set(roomId, room);
		console.log(`Created Room with ID: ${roomId}`);
		return room;
	}

	findAvailableRoom() {
		console.log("Searching for room...");
		for (const room of this.rooms.values()) {
			if (!room.isFull()) return room;
		}
		console.log("Available room not found...");
		return null;
	}

	assignPlayer(socket, { userid, mode = 'remote', roomId = null} = {}) {
		const session = new PlayerSession(socket, userid);

		let room;

		switch (mode) {
			case "remote":
				room = this.findAvailableRoom();
				if (!room) {
					room = this.createRoom();
				}
				break;
			case "friend_host":
				if (roomId && this.rooms.has(roomId)) {
					room = this.rooms.get(roomId);
				} else {
					room = this.createRoom(roomId);
				}
				break;
			case "friend_join":
				if (roomId && this.rooms.has(roomId)) {
					room = this.rooms.get(roomId);
				} else {
					console.log(`Room: ${roomId} not found.`)
					socket.close();
					return;
				}
				break;
			case "local":
				room = this.createRoom();
				room.addPlayer(session);
				// room.forceLocalPlayer(session); // assign both paddles, change controls
				return session;
			case "computer":
				room = this.createRoom();
				room.addPlayer(session);
				//room.addAI(); integrate fake player
				return session;
			default:
				throw new Error(`Unknown mode: ${mode}`);
		}

		room.addPlayer(session);
		return session;
	}
}

// TODO: make so that the update payload is broadcasted to all connected player in the given session
//       work in GameClass.js
// TODO: logic for local game, need to adjust controls for 1 keyboard,
//       listen to different messages on frontend
// TODO: logic for ai, probably simpler
// TODO: front ender render of the whole thing
