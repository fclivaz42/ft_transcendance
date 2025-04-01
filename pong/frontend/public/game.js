
import { Engine, Color3, Scene, Vector3, MeshBuilder, StandardMaterial, FreeCamera, HemisphericLight } from "@babylonjs/core";
import { Paddle } from "./classes/paddle.js";

const canvas = document.getElementById("renderCanvas");
const engine = new Engine(canvas, true);

let player1Paddle;
let player2Paddle;

const createScene = function () {
    const scene = new Scene(engine);

    const camera = new FreeCamera("camera1", new Vector3(0, 20, 0), scene);
    camera.setTarget(new Vector3(0, 1, 0));
	camera.upVector = (new Vector3(0, -1, 0));
    // camera.attachControl(canvas, true);

    const light = new HemisphericLight("light", new Vector3(0, 20, 0), scene);
    light.intensity = 0.5;

    const ground = MeshBuilder.CreateGround("ground", {width: 20, height: 20}, scene);
	const groundMaterial = new StandardMaterial("groundMat", scene);
	groundMaterial.diffuseColor = Color3.Blue();
	ground.material = groundMaterial;

	player1Paddle = new Paddle(scene, "Player1", new Vector3(-7, 0, 0), {
		color: Color3.Red(),
		speed: 0.2,
		depth: 2
	});
	
	player2Paddle = new Paddle(scene, "Player2", new Vector3(7, 0, 0), {
		color: Color3.Green(),
		speed: 0.2,
		controls: "ik",
		depth: 2
	});

    return scene;
};


const scene = createScene();

engine.runRenderLoop( () => {
	scene.render();
	player1Paddle.update();
	player2Paddle.update();
});

window.addEventListener("resize", function () {
	engine.resize();
});