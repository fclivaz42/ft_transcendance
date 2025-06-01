import Game from "./GameClass.js"

export default class GameRoom {
	constructor(id) {
		this.id = id;
		this.players = [];
		this.game = new Game();
		this.score = {"p1": null, "p2": null};
	}

	isFull() {
		console.log(`current players in room: ${this.players.length}`)
		return this.players.length >= 2;
	}

	addPlayer(playerSession) {
		this.players.push(playerSession);
		playerSession.room = this;

		if (this.players.length === 1) {
			playerSession.paddleId = 'p1';
		} else if (this.players.length === 2) {
			playerSession.paddleId = 'p2';
		}

		if (this.isFull()) {
			console.log(`Room ${this.id} full with players: [${this.players[0].userId}, ${this.players[1].userId}]`);
			console.log("GAME READY TO BE STARTED.");
			this.startGame();
		}
	}

	startGame() {
		
		this.game.setBroadcastFunction(() => {
			this.broadcast(this.buildUpdatePayload());
		});

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
		return initPayload;
	}

	buildUpdatePayload() {
		const game = this.game;
        const ball = game.getBall();
        const [p1, p2] = game.getPaddles();

		const updatePayload = {
			type: 'update',
			payload: {
				ball: {
					speed: ball.getSpeed(),
					position: ball.getPosition().asArray(),
				},
				p1: {
					max_speed: p1.getSpeed(),
					position: p1.getPosition().asArray()
				},
				p2: {
					max_speed: p2.getSpeed(),
					position: p2.getPosition().asArray()
				}
			}
		}
		return updatePayload;
	}
}
