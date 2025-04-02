
import { Engine, Color3, Scene, Vector3, MeshBuilder, StandardMaterial, FreeCamera, HemisphericLight } from "@babylonjs/core";
import { Paddle } from "./classes/paddle.js";
import { PlayField } from "./classes/playfield.js";
import { Ball } from "./classes/ball.js";

const field = new PlayField();
const scene = field.getScene();
// let camera = field.getCamera(); < --- allows camera methods to be called simply
let player1Paddle = new Paddle(
	scene,
	"player",
	new Vector3(-14, 0, 0), {
		color: Color3.Red(),
		speed: 0.2,
		depth: 3
});
player1Paddle.mesh.showBoundingBox = true;
let player2Paddle = new Paddle(
	scene,
	"player",
	new Vector3(14, 0, 0), {
		color: Color3.Green(),
		speed: 0.2,
		controls: "ik",
		depth: 3
});
player2Paddle.mesh.showBoundingBox = true;
let ball = new Ball(
	scene,
	"ball",
	new Vector3(0, 0, 0),
	{ diameter: 0.8, speed: 0.2}
);
player1Paddle.mesh.getBoundingInfo().boundingBox
ball.setColliders([player1Paddle, player2Paddle]);
ball.mesh.showBoundingBox = true;
field.addUpdatable(player1Paddle);
field.addUpdatable(player2Paddle);
field.addUpdatable(ball);
field.start();

/* Defining crucial elements */

// const canvas = document.getElementById("renderCanvas");
// const engine = new Engine(canvas, true);
// let player1Paddle;
// let player2Paddle;

// const createScene = function () {
//     const scene = new Scene(engine);

//     const camera = new FreeCamera("camera1", new Vector3(0, 20, 0), scene);
//     camera.setTarget(new Vector3(0, 1, 0));
// 	camera.upVector = (new Vector3(0, -1, 0));
//     /* camera.attachControl(canvas, true); <--- activates mouse camera controls*/ 

//     const light = new HemisphericLight("light", new Vector3(0, 20, 0), scene);
//     light.intensity = 0.5;

//     const ground = MeshBuilder.CreateGround("ground", {width: 20, height: 20}, scene);
// 	const groundMaterial = new StandardMaterial("groundMat", scene);
// 	groundMaterial.diffuseColor = Color3.Blue();
// 	ground.material = groundMaterial;

// 	player1Paddle = new Paddle(scene, "Player1", new Vector3(-7, 0, 0), {
// 		color: Color3.Red(),
// 		speed: 0.2,
// 		depth: 2
// 	});
	
// 	player2Paddle = new Paddle(scene, "Player2", new Vector3(7, 0, 0), {
// 		color: Color3.Green(),
// 		speed: 0.2,
// 		controls: "ik",
// 		depth: 2
// 	});

//     return scene;
// };


// const scene = createScene();

// engine.runRenderLoop( () => {
// 	scene.render();
// 	player1Paddle.update();
// 	player2Paddle.update();
// });

// window.addEventListener("resize", function () {
// 	engine.resize();
// });