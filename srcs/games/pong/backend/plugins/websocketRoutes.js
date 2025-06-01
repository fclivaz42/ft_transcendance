/**
 * @typedef {import('fastify').FastifyInstance & {
 *   game: import('./game/classes/be_GameClass.js').default
 * }} GameFastifyInstance
 */

import fastifyPlugin from "fastify-plugin";
import RoomManager from "./game/classes/be_RoomManager.js";
import wsHandlers from "./wsHandlers/routeHandlers.js"

const manager = new RoomManager();

/** 
 * @param {GameFastifyInstance} fastify 
 */
export default fastifyPlugin(async function (fastify) {
    fastify.get('/game/remote', { websocket: true}, wsHandlers.remote(manager));
    fastify.get('/game/friend_host', { websocket: true}, wsHandlers.friend_host(manager));
    fastify.get('/game/friend_join', { websocket: true}, wsHandlers.friend_join(manager));
    fastify.get('/game/local', { websocket: true}, wsHandlers.local(manager));
    fastify.get('/game/computer', { websocket: true}, wsHandlers.computer(manager));
});
