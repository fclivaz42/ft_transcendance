/**
 * @typedef {import('fastify').FastifyInstance & {
 *   game: import('./be_game/be_classes/be_GameClass.js').default
 * }} GameFastifyInstance
 */

import fastifyPlugin from "fastify-plugin";

/** 
 * @param {GameFastifyInstance} fastify 
 */
export default fastifyPlugin(async function (fastify) {
    fastify.get('/game/ws', {websocket: true}, (conn, req) => {

        console.log("client connected.");

        const game = fastify.game;
        const ball = game.getBall();
        const [p1, p2] = game.getPaddles();
        const walls = game.getWallsForWs();
        const lightsCamera = game.getPlayFieldForWs();
        
        /* Here the game state is grabbed from the game object
            it is then once sent to all the clients to initialize the game
            I think after it makes sense to launch the game from here
        
        */
        const initPayload = {
            type: 'init',
            payload: {
                ball: {
                    speed: ball.getSpeed(),
                    position: ball.getPosition().asArray()
                },
                p1: {
                    speed: p1.getSpeed(),
                    position: p1.getPosition().asArray()
                },
                p2: {
                    speed: p2.getSpeed(),
                    position: p2.getPosition().asArray()
                },
                walls: walls,
                fieldInfo: lightsCamera
            }
        }

        conn.send(JSON.stringify(initPayload));

        conn.on('message', (message) => {
            try {
                const { type, payload } = JSON.parse(message);
                if (type === 'move') {
                    console.log("Player wants to move!")
                }
            } catch (err) {
                console.error("Invalid message:", message);
            }
        });

        conn.on('close', (stream) => {
            console.log("Player disconnected!")
        })
    })
})