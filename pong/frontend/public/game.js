/* IMPORTING NECESSARY THINGS FROM BABYLONJS AND CLASSES */
import {
	Color3,
	Vector3
} from "@babylonjs/core";
import { Paddle } from "./classes/paddle.js";
import { Wall } from "./classes/wall.js";
import { PlayField } from "./classes/playfield.js";
import { Ball } from "./classes/ball.js";

/* SETTING UP FIELD ******************************************************** */
const field = new PlayField();
const scene = field.getScene();
// let camera = field.getCamera();

/* CREATING PLAYER 1 PADDLE ************************************************ */
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

/* CREATING PLAYER 2 PADDLE ************************************************ */
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
	
/* CREATING BALL MESH ****************************************************** */
let ball = new Ball(
	scene,
	"ball",
	new Vector3(0, 0, 0), {
		diameter: 0.6
	});
	ball.setBaseSpeed(0.3);
	// ball.mesh.showBoundingBox = false;
	
/* CREATING WALL OBJECTS *************************************************** */
let northWall = new Wall(
	scene,
	"wallNorth",
	new Vector3(0,0,8.1), {
		color: Color3.Black(),
		width: 30,
		directionalBounce: false
	}
);
// northWall.mesh.showBoundingBox = true;
let southWall = new Wall(
	scene,
	"wallSouth",
	new Vector3(0,0,-8.1), {
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
		color: Color3.Black(),
		depth: 16.6,
	}
);
eastWall.setPassThrough(true);
let westWall = new Wall(
	scene,
	"wallWest",
	new Vector3(-15.2, 0, 0), {
		color: Color3.Black(),
		depth: 16.6,
	}
);
westWall.setPassThrough(true);

/* SETTING COLLIDERS ******************************************************* */
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

/* ADDING UPDATABLE OBJECTS TO FIELD *************************************** */
field.addUpdatable(player1Paddle);
field.addUpdatable(player2Paddle);
field.addUpdatable(ball);

field.start();
