
import { FastifyInstance, FastifyPluginAsync } from "fastify";
import fastifyPlugin from "fastify-plugin";
import GameClass from "./classes/GameClass.js";

declare module "fastify" {
    interface FastifyInstance {
        game: GameClass;
    }
}

const gamePlugin: FastifyPluginAsync = async (
    fastify: FastifyInstance
) => {
    const game: GameClass = new GameClass();
    fastify.decorate("game", game);
    game.gameStart(30);
}

export default fastifyPlugin(gamePlugin);