
import { Vector3 } from "@babylonjs/core";
import { Paddle } from "./be_paddle.js";

export class Wall extends Paddle {
    constructor(scene, name, position = new Vector3(0, 0, 0), options = {}) {
        super(scene, name, position, options);
        this._keys = {};
    }

    _setupInput() {
        // Do nothing
    }

    calculateBounce(ball)	{
        if (!this._passThrough) {
            if (ball.getLastHit() === this.name) return ;
            ball.setLastHit(this.mesh.name)
            ball._direction.z *= -1;
            ball._direction.normalize();
        }
        else {
            ball.mesh.position.set(0, 0, 0);
            ball.setSpeed(0);
            ball.setLastHit("");
        }
    }
}