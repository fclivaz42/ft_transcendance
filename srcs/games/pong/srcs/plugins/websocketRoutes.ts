
import { type FastifyInstance, type FastifyPluginAsync } from "fastify";
import fastifyPlugin from "fastify-plugin";
import RoomManager from "./game/classes/RoomManager.ts";
import wsHandlers from "./wsHandlers/routeHandlers.ts";


const manager = new RoomManager();

const websocketRoutes: FastifyPluginAsync = async (
    fastify: FastifyInstance
) => {
    fastify.get('/game/remote', { websocket: true}, wsHandlers.remote(manager));
    fastify.get('/game/friend_host', { websocket: true}, wsHandlers.friend_host(manager));
    fastify.get('/game/friend_join', { websocket: true}, wsHandlers.friend_join(manager));
    fastify.get('/game/local', { websocket: true}, wsHandlers.local(manager));
    fastify.get('/game/computer', { websocket: true}, wsHandlers.computer(manager));
};

export default fastifyPlugin(websocketRoutes);
