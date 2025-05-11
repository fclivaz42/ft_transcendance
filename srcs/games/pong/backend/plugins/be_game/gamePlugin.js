
import GameClass from "./be_classes/be_GameClass.js";

export default async function gamePlugin(fastify, options) {
    const game = new GameClass();

    fastify.decorate("game", game);
    fastify.get("/game/state", async (request, reply) => {
        const Ball = game.getBall();
        const p1 = game.getPaddles().at(0);
        const p2 = game.getPaddles().at(1);
        const walls = game.getWalls();
        return {
            "ball": {
                speed: Ball.getSpeed(),
                position: Ball.getPosition().asArray()
            },
            "p1": {
                speed: p1.getSpeed(),
                position: p1.getPosition().asArray()
            },
            "p2": {
                speed: p1.getSpeed(),
                position: p1.getPosition().asArray()
            },
            "walls": "placeholder"
        }; 
    });

}