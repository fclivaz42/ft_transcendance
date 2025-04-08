
import { MeshBuilder, Vector3, Color3, StandardMaterial } from "@babylonjs/core";

export class Paddle {
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
			speed = 0.05,
			controls = { "up" : "w", "down" : "s"},
			isAi = false
	} = options;
		
		this.scene = scene;
		this.name = name;
		this._position = position;
		this._speed = speed;
		this._direction = new Vector3(0, 0, 0);
		this._controls = controls;
		this._isAi = isAi;
		
		this.mesh = MeshBuilder.CreateBox(name, { size, width, depth }, scene);
		this.mesh.position = position.clone();
		
		const material = new StandardMaterial(`${name}-mat`, scene);
		material.diffuseColor = color;
		this.mesh.material = material;
		
		this._keys = {};
		this._setupInput();
	}
	
	_setupInput() {
		window.addEventListener("keydown", (e) => {
			this._keys[e.key.toLowerCase()] = true;
		});
		window.addEventListener("keyup", (e) => {
			this._keys[e.key.toLowerCase()] = false;
		});
	}

	getMesh() 			{ return this.mesh; }
	getPosition()		{ return this._position; }
	getSpeed()			{ return this._speed; }
	getDirection()		{ return this._direction; }
	getControls()		{ return this._controls; } 

	setPosition(vect)	{ this._position = vect; }
	setSpeed(speed)		{ this._speed = speed; }
	setDirection(vect)	{ this._direction = vect; }
	setControls(obj)	{ this._controls = obj; }
	setAI(io)			{ this._isAi = io; }


	update() {
		this._direction.set(0, 0, 0);

		if (this._keys[this._controls.up]) this._direction.z += 1;
		if (this._keys[this._controls.down]) this._direction.z -= 1;

		this.mesh.position.addInPlace(this._direction.scale(this._speed));
	}
}