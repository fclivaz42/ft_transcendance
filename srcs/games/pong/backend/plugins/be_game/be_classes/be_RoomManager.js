
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
		for (const room in this.rooms.values()) {
			if (!room.isFull()) return room;
		}
		return null;
	}

	assignPlayer(socket) {
		const session = new PlayerSession(socket);
		let room = this.findAvailableRoom();
		if (!room) {
			room = this.createRoom();
		}
		room.addPlayer(session);
		return session;
	}
}
