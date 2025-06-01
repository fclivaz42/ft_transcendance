
import { MeshBuilder, Scene, Vector3, Color3, StandardMaterial, BoundingBox, Mesh } from "@babylonjs/core";
import Ball from "./Ball.ts";

interface PaddleOptions {
    color: Color3;
    width: number;
    height: number;
    depth: number;
    speed: number;
    isAi: boolean;
};

interface InitInfo {
    max_speed: number;
    position: number[];
    size: number[];
}

export default class Paddle {

    protected _scene: Scene;
    protected _mesh: Mesh;
    protected _name: string;
    protected _speed: number;
    protected _direction: Vector3;
    protected _isAi: boolean;
    protected _position: Vector3;
    protected _colliders: any[] = [];

    constructor(
        scene: Scene,
        name: string,
        position: Vector3 = new Vector3(0, 0, 0),
        options: Partial<PaddleOptions> = {}
    ) {
        const {
            color = Color3.White(),
            width = 0.5,
            height = 0.5,
            depth = 0.5,
            speed = 0.05, // can remove and replace with setter
            isAi = false // can remove and replace with setter
        } = options;

        this._scene = scene;
        this._name = name;
        this._position = position;
        this._speed = speed;
        this._isAi = isAi;
        this._direction = new Vector3(0, 0, 0);
        this._mesh = MeshBuilder.CreateBox(name, { width, height, depth }, scene);
        this._mesh.position = position.clone();
        
        const material = new StandardMaterial(`${name}-mat`, scene);
        material.diffuseColor = color;
        this._mesh.material = material;
    }
    

    protected _touchingWall(): boolean {
        for (let i of this._colliders) {
            let boxA = this.getCollisionBox();
            let boxB = i.getCollisionBox();
            if (BoundingBox.Intersects(boxA, boxB)) {
                return true;
            }
        }
        return false;
    }

    public getMesh(): Mesh                      { return this._mesh; }
    public getPosition(): Vector3	            { return this._position; }
    public getSpeed(): number			        { return this._speed; }
    public getDirection(): Vector3		        { return this._direction; }
    public getCollisionBox(): BoundingBox       { return this._mesh.getBoundingInfo().boundingBox; }
    public getSize(): Vector3                   { return this.getCollisionBox().extendSize.scale(2); }
    public getInitInfo(): InitInfo {
        return {
            max_speed: this.getSpeed(),
            position: this.getPosition().asArray(),
            size: this.getSize().asArray(),
        };
    }

    public setSpeed(speed: number): void         { this._speed = speed; }
    public setColliders(colliders: any): void    { this._colliders = colliders; }
    public setAI(io: boolean): void              { this._isAi = io; }


    public calculateBounce(ball: Ball): void {
        const lastHit = ball.getLastHit();
        if (lastHit === this._name) return;
        if (lastHit && lastHit.startsWith("player")) {
            ball.incrPlayerBounce();
        }
        ball.setLastHit(this._name);
        const collisionBox = this.getCollisionBox();
        const collisionCenter = collisionBox.centerWorld;
        const collisionHeight = collisionBox.extendSizeWorld.z * 2;
        let impact = (ball.getMesh().position.z - collisionCenter.z) / (collisionHeight / 2);
        impact = Math.max(-1, Math.min(impact, 1));
        ball.direction.x *= -1;
        ball.direction.z = (impact * 0.8 + ball.direction.z * 0.2); //weighted average for bounce
        /* To prevent too much of a vertical bounce */
        if (impact !== 0 && Math.abs(ball.direction.z) < 0.1) {
            ball.direction.z = 0.1 * Math.sign(ball.direction.z || 1);
        }
        /* **************************************** */
        ball.direction.normalize();
    }

    public update(): void {
        this._direction.set(0, 0, 0);

        // add control logic

        this._mesh.position.addInPlace(this._direction.scale(this._speed));
    }
}