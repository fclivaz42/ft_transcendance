
export function createWsHandler({ mode, manager }) {
	return (socket, req) => {
		const query = req.query;

		if (!query.userid) {
            conn.send(JSON.stringify({ type: '403', message: 'Unauthorized user'}));
            conn.close();
            return;
        }

		let session;

		if (mode === 'friend_join') {
			if (!query.roomId) {
				conn.send(JSON.stringify({ type: '400', message: 'Missing roomId'}));
            	conn.close();
            	return;
			}

			session = manager.assignPlayer(socket, { userid: query.userid, mode, roomId: query.roomId });
		} else {
			session = manager.assignPlayer(socket, { userid: query.userid, mode });
		}

		console.log(`Player connected to room ${session.room.id} as ${query.userid}`);

		socket.on('message', (msg) => {
			try {
				const { type, payload } = JSON.parse(msg);
				if (type === 'move') {
					console.log(`Move command from ${session.paddleId} | user: ${session.id}`);
				}
			} catch (err) {
				console.error('Invalid message from client:', err);
			}
		});

		socket.on('close', (stream) => {
			console.log(`User: ${query.userid} disconnected.`);
		})
	};
}