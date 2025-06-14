
import fastify, { type FastifyRequest } from "fastify";
import fastifyWebsocket, {type WebSocket} from "@fastify/websocket";
import RoomManager from "../game/classes/RoomManager.ts";
import PlayerSession from "../game/classes/PlayerSession.ts";

interface GameWsQuery {
	userId: string;
	roomId?: string;
}

interface ClientMessage {
	type: string;
	payload?: any;
}

interface CreateWsHandlerParams {
	mode: "remote" | "friend_host" | "friend_join" | "local" | "computer";
	manager: RoomManager;
}

export function createWsHandler({ mode, manager }: CreateWsHandlerParams) {
	return (socket: WebSocket, req: FastifyRequest<{ Querystring: GameWsQuery }>) => {
		const query = req.query;

		if (!query.userId) {
            socket.send(JSON.stringify({ type: '403', message: 'Unauthorized user'}));
            socket.close();
            return;
        }

		let session: PlayerSession;

		if (mode === 'friend_join') {
			if (!query.roomId) {
				socket.send(JSON.stringify({ type: '400', message: 'Missing roomId'}));
            	socket.close();
            	return;
			}

			session = manager.assignPlayer( socket, {
				userId: query.userId,
				mode,
				roomId: query.roomId
			});
		} else {
			session = manager.assignPlayer(socket, {
				userId: query.userId,
				mode
			});
		}

		console.log(`Player connected to room ${session.getRoom()?.id} as ${query.userId}`);

		socket.on('message', (msg) => {
			try {
				const { type, payload }: ClientMessage = JSON.parse(msg.toString());
				if (type === 'move' && payload?.direction) {
					console.log(`Move command from ${session.getPaddleId()} | user: ${session.getUserId()}`);
					const paddle = session.getPaddle();

					if (paddle) {
						if (payload.direction === 'up' || payload.direction === 'down') {
							paddle.setMoveDirection(payload.direction);
						} else if (payload.direction === 'stop') {
							paddle.setMoveDirection(null);
						}
					}
				}
			} catch (err) {
				console.error('Invalid message from client:', err);
			}
		});

		socket.on('close', () => {
			console.log(`User: ${query.userId} disconnected.`);
		})
	};
}