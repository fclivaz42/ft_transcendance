
export default class PlayerSession {
	constructor(socket, userId = null) {
		this.socket = socket;
		this.userId = userId;
		this.playerReady = false;
		this.room = null;
	}
	
	send(message) {
		try {
			this.socket.send(JSON.stringify(message));
		} catch (err) {
			console.error("Failed to send message to client:", err);
		}
	}

	setReady(io) {
		this.playerReady = io;
	}
}