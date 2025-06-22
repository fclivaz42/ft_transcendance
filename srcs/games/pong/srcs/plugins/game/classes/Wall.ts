
import { Vector3, Scene, Color3 } from "@babylonjs/core";
import Paddle from "./Paddle.ts";
import Ball from "./Ball.ts";
import Game from "./GameClass.ts";


export default class Wall extends Paddle {
    private _passThrough: boolean = false;
    private _game: Game | null = null;

    constructor(
        scene: Scene,
        name: string,
        position: Vector3 = new Vector3(0, 0, 0),
        options: Partial<{
            color: Color3;
            width: number;
            height: number;
            depth: number;
        }> = {}
    ) {
        super(scene, name, position, options);
    }

    // need to implement movement function in Paddle and make it empty here

    public getPassThrough(): boolean {
        return this._passThrough;
    }

    public setPassThrough(io: boolean): void {
        this._passThrough = io;
    }

    public setGame(game: Game) {
        this._game = game;
    }

    public calculateBounce(ball: Ball): void {
        if (!this._passThrough) {
            if (ball.getLastHit() === this._name) return ;
            ball.setLastHit(this._mesh.name)
            ball.direction.y *= -1;
            ball.direction.normalize();
        } else {
            this._name === "eastWall" ? this._game?.score(1) : this._game?.score(2);
            ball.getHitbox().position.set(0, 0, 0);
            ball.setIsLaunched(false);
            ball.setCurrSpeed(0);
            ball.setLastHit("");
        }
    }
}