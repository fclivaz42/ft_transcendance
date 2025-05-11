
import { MeshBuilder, Vector3, Color3, StandardMaterial, BoundingBox } from "@babylonjs/core";

export default class Paddle {
    constructor(
        scene,
        name,
        position = new Vector3(0, 0, 0),
        options = {} 
    ) {
        const {
            color = Color3.White(),
            size = 0.5,
            width = 0.5,
            depth = 0.5,
            speed = 0.05, // can remove and replace with setter
            controls = { "up" : "w", "down" : "s"}, // can remove and replace with setter
            isAi = false // can remove and replace with setter
    } = options;
        
        this.scene = scene;
        this.name = name;
        this._position = position;
        this._speed = speed;
        this._direction = new Vector3(0, 0, 0);
        this._controls = controls;
        this._passThrough = false;
        this._isAi = isAi;
        
        this.mesh = MeshBuilder.CreateBox(name, { size, width, depth }, scene);
        this.mesh.position = position.clone();
        
        const material = new StandardMaterial(`${name}-mat`, scene);
        material.diffuseColor = color;
        this.mesh.material = material;
        
        this._keys = {};
        this._colliders = [];
        this._setupInput();
    }
    
    _setupInput() {
        window.addEventListener("keydown", (e) => {
            this._keys[e.key] = true;
        });
        window.addEventListener("keyup", (e) => {
            this._keys[e.key] = false;
        });
    }

    _touchingWall() {
        for (let i of this._colliders) {
            let boxA = this.getCollisionBox();
            let boxB = i.getCollisionBox();
            if (BoundingBox.Intersects(boxA, boxB, true)) {
                return i.mesh.name;
            }
        }
    }

    getMesh() 				{ return this.mesh; }
    getPosition()			{ return this._position; }
    getSpeed()				{ return this._speed; }
    getDirection()			{ return this._direction; }
    getControls()			{ return this._controls; }
    getCollisionBox()		{ return this.mesh.getBoundingInfo().boundingBox; }

    setSpeed(speed)			{ this._speed = speed; }
    setControls(obj)		{ this._controls = obj; }
    setColliders(colliders) { this._colliders = colliders; }
    setAI(io)				{ this._isAi = io; }
    setPassThrough(io)		{ this._passThrough = io; }


    calculateBounce(ball)	{
        if (ball.getLastHit() === this.name) return;
        if (ball.getLastHit() && ball.getLastHit().startsWith("player")) {
            ball.incrPlayerBounce();
            if (ball.getPlayerBounces() % 6 === 0) ball.incrSpeed(0.005);
            console.log(ball.getSpeed());
        }
        ball.setLastHit(this.name);
        const collisionBox = this.mesh.getBoundingInfo().boundingBox;
        const collisionCenter = collisionBox.centerWorld;
        const collisionHeight = collisionBox.extendSizeWorld.z * 2;
        let impact = (ball.mesh.position.z - collisionCenter.z) / (collisionHeight / 2);
        impact = Math.max(-1, Math.min(impact, 1));
        ball._direction.x *= -1;
        ball._direction.z = (impact * 0.8 + ball._direction.z * 0.2); //weighted average for bounce
        /* To prevent too much of a vertical bounce */
        if (impact !== 0 && Math.abs(ball._direction.z) < 0.1) {
            ball._direction.z = 0.1 * Math.sign(ball._direction.z || 1);
        }
        /* **************************************** */
        ball._direction.normalize();
    }

    update() {
        this._direction.set(0, 0, 0);

        if (this._keys[this._controls.up] &&
            this._touchingWall() !== "wallNorth"
        ) 
            this._direction.z += 1;
        if (this._keys[this._controls.down] &&
            this._touchingWall() !== "wallSouth"
        ) 
            this._direction.z -= 1;

        this.mesh.position.addInPlace(this._direction.scale(this._speed));
    }
}