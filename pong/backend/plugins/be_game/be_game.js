
/* IMPORTING NECESSARY THINGS FROM BABYLONJS AND CLASSES */
import {
	Color3,
	Vector3
} from "@babylonjs/core";
import { Paddle } from "./be_classes/be_paddle.js";
import { Wall } from "./be_classes/be_wall.js";
import { PlayField } from "./be_classes/be_playfield.js";
import { Ball } from "./be_classes/be_ball.js";

/* SETTING UP FIELD ******************************************************** */
const field = new PlayField();
const scene = field.getScene();
// let camera = field.getCamera();

/* CHANGEABLE VARS ********************************************************* */
const frames = 60;
const frameLimiter = frames / 100;

const player1Color = Color3.White();
const player2Color = Color3.White();
const wallsColor = Color3.White();
const ballColor = Color3.White();
const playerSpeed = 0.4 * frameLimiter;
const ballBaseSpeed = 0.4 * frameLimiter;
const boxes = false;


/* CREATING PLAYER 1 PADDLE ************************************************ */
let player1Paddle = new Paddle(
	scene,
	"player1",
	new Vector3(-14.5, 0, 0), {
		color: player1Color,
		speed: playerSpeed,
		depth: 2.8,
		width: 0.3
});
player1Paddle.mesh.showBoundingBox = boxes;

/* CREATING PLAYER 2 PADDLE ************************************************ */
let player2Paddle = new Paddle(
	scene,
	"player2",
	new Vector3(14.5, 0, 0), {
		color: player2Color,
		speed: playerSpeed,
		controls: {"up": "ArrowUp", "down": "ArrowDown"},
		depth: 2.8,
		width: 0.3
	});
	player2Paddle.mesh.showBoundingBox = boxes;
	
/* CREATING BALL MESH ****************************************************** */
let ball = new Ball(
	scene,
	"ball",
	new Vector3(0, 0, 0), {
		color: ballColor,
		diameter: 0.6
	});
	ball.setBaseSpeed(ballBaseSpeed);
	ball.mesh.showBoundingBox = boxes;
	
/* CREATING WALL OBJECTS *************************************************** */
let northWall = new Wall(
	scene,
	"wallNorth",
	new Vector3(0,0,8.05), {
		color: wallsColor,
		width: 30
	}
);
northWall.mesh.showBoundingBox = boxes;
let southWall = new Wall(
	scene,
	"wallSouth",
	new Vector3(0,0,-8.05), {
		color: wallsColor,
		width: 30
	}
);
southWall.mesh.showBoundingBox = boxes;
let eastWall = new Wall(
	scene,
	"wallEast",
	new Vector3(15.2, 0, 0), {
		color: wallsColor,
		depth: 16.6,
	}
);
eastWall.setPassThrough(true);
let westWall = new Wall(
	scene,
	"wallWest",
	new Vector3(-15.2, 0, 0), {
		color: wallsColor,
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

