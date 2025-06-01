
import { Vector3, Scene, Color3 } from "@babylonjs/core";
import Paddle from "./Paddle";
import Ball from "./Ball";


export default class Wall extends Paddle {
    private _passThrough: boolean = false;

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

    public calculateBounce(ball: Ball): void {
        if (!this._passThrough) {
            if (ball.getLastHit() === this._name) return ;
            ball.setLastHit(this._mesh.name)
            ball.direction.z *= -1;
            ball.direction.normalize();
        } else {
            ball.getMesh().position.set(0, 0, 0);
            ball.setCurrSpeed(0);
            ball.setLastHit("");
        }
    }
}