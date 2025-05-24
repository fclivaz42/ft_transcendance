import Game from "./be_GameClass.js"

export default class GameRoom {
	constructor(id) {
		this.id = id;
		this.players = [];
		this.game = new Game()
	}

	isFull() {
		return this.players.length >= 2;
	}

	addPlayer(playerSession) {
		this.players.push(playerSession);
		playerSession.room = this;

		if (this.isFull()) {
			this.startGame();
		}
	}

	startGame() {
		this.game.gameStart()
		this.broadcast(this.buildInitPayload());
	}

	broadcast(message) {
		for (const p of this.players) {
			try {
				p.socket.send(JSON.stringify(message))
			} catch (err) {
				console.error(`Failed to send to player: ${this.id}: ${err}`);
			}
		}
	}

	buildInitPayload() {
		const game = this.game;
        const ball = game.getBall();
        const [p1, p2] = game.getPaddles();
        const walls = game.getWallsForWs()
        const lightsCamera = game.field;

        const initPayload = {
            type: 'init',
            payload: {
                ball: ball.getBallInitInfo(),
                p1: p1.getInitInfo(),
                p2: p2.getInitInfo(),
                walls: walls,
                camera: lightsCamera.getCameraInitInfo(),
                light: lightsCamera.getLightInitInfo()
            }
        }
	}
}
