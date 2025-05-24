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
        
        const game = fastify.game;
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

        const updatePayload = {
            type: 'update',
            payload: {
                ball: {
                    speed: ball.getSpeed(),
                    position: ball.getPosition().asArray(),
                },
                p1: {
                    max_speed: p1.getSpeed(),
                    position: p1.getPosition().asArray(),
                },
                p2: {
                    max_speed: p1.getSpeed(),
                    position: p1.getPosition().asArray(),
                }
            }
        }

        console.log(`Player connected to room {PLACEHOLDER} with ID: {PLACEHOLDER}`);
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


// GETTERS FOR:
//      WALLS: position, size, is passthrough
//      LIGHTS and CAMERA

//      BALL: position, size, speed
//      PADDLES: position, size, speed