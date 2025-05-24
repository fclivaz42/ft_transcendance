
import fastifyPlugin from "fastify-plugin";
import GameClass from "./be_classes/be_GameClass.js";

export default fastifyPlugin(async function gamePlugin(fastify, options) {
    const game = new GameClass();

    fastify.decorate("game", game);
    // this will only start when both players are ready
    game.gameStart(30);

    // once full websocket, will not need, comment for testing
    /* fastify.get("/game/state", async (request, reply) => {
        const Ball = game.getBall();
        const [p1, p2] = game.getPaddles();
        return {
            ball: {
                speed: Ball.getSpeed(),
                position: Ball.getPosition().asArray()
            },
            p1: {
                speed: p1.getSpeed(),
                position: p1.getPosition().asArray()
            },
            p2: {
                speed: p2.getSpeed(),
                position: p2.getPosition().asArray()
            }
        }; 
    }); */
});