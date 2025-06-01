
import fastifyPlugin from "fastify-plugin";
import GameClass from "./classes/be_GameClass.js";

export default fastifyPlugin(async function gamePlugin(fastify, options) {
    const game = new GameClass();

    fastify.decorate("game", game);

    // this will only start when both players are ready
    game.gameStart(30);

});