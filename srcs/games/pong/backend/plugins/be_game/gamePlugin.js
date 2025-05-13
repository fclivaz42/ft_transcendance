
import { SimplexPerlin3DBlock } from "@babylonjs/core";
import GameClass from "./be_classes/be_GameClass.js";

export default async function gamePlugin(fastify, options) {
    const game = new GameClass();
    fastify.decorate("game", game);

    game.gameStart(60);
    game.getBall().launch();
    fastify.get("/game/state", async (request, reply) => {
        const Ball = game.getBall();
        const [p1, p2] = game.getPaddles();
        // const walls = game.getWalls();
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
    });

}