
import {
	Engine,
	Color3,
	Scene,
	Vector3,
	MeshBuilder,
	StandardMaterial,
	FreeCamera,
	HemisphericLight,
} from "@babylonjs/core";
import { Paddle } from "./classes/paddle.js";
import { Wall } from "./classes/wall.js";
import { PlayField } from "./classes/playfield.js";
import { Ball } from "./classes/ball.js";

const field = new PlayField();
const scene = field.getScene();
// let camera = field.getCamera(); < --- allows camera methods to be called simply


// Create left Paddle and add it to scene
let player1Paddle = new Paddle(
	scene,
	"player1",
	new Vector3(-14.5, 0, 0), {
		color: Color3.Red(),
		speed: 0.25,
		depth: 2.8,
		width: 0.2
});
// player1Paddle.mesh.showBoundingBox = true;

// Create right Paddle and add it to scene
let player2Paddle = new Paddle(
	scene,
	"player2",
	new Vector3(14.5, 0, 0), {
		color: Color3.Green(),
		speed: 0.25,
		controls: {"up": "ArrowUp", "down": "ArrowDown"},
		depth: 2.8,
		width: 0.2
	});
	// player2Paddle.mesh.showBoundingBox = true;
	
	// Create ball and add it to scene
	let ball = new Ball(
	scene,
	"ball",
	new Vector3(0, 0, 0), {
		diameter: 0.6
	});
	ball.setBaseSpeed(0.3);
	// ball.mesh.showBoundingBox = false;
	
	// Create top and bottom walls
	let northWall = new Wall(
	scene,
	"wallNorth",
	new Vector3(0,0,8), {
		color: Color3.Black(),
		width: 30,
		directionalBounce: false
	}
);
// northWall.mesh.showBoundingBox = true;

let southWall = new Wall(
	scene,
	"wallSouth",
	new Vector3(0,0,-8), {
		color: Color3.Black(),
		width: 30,
		directionalBounce: false
	}
);
// southWall.mesh.showBoundingBox = true;

let eastWall = new Wall(
	scene,
	"wallEast",
	new Vector3(15.2, 0, 0), {
		color: Color3.Magenta(),
		depth: 16.6,
	}
);
eastWall.setPassThrough(true);

let westWall = new Wall(
	scene,
	"wallWest",
	new Vector3(-15.2, 0, 0), {
		color: Color3.Magenta(),
		depth: 16.6,
	}
);
westWall.setPassThrough(true);

// Add colliders to the ball
player1Paddle.setColliders([northWall, southWall]);
player2Paddle.setColliders([northWall, southWall]);
ball.setColliders([
	player1Paddle, 
	player2Paddle,
	northWall,
	southWall,
	eastWall,
	westWall
]);

field.addUpdatable(player1Paddle);
field.addUpdatable(player2Paddle);
field.addUpdatable(ball);

field.start();
