
import BABYLON, { NullEngine } from "babylonjs";
import LOADERS from "babylonjs-loaders";

var engine = new BABYLON.NullEngine({
	renderWidth: 512,
	renderHeight: 256,
	textureSize: 512
})

var scene = new BABYLON.Scene(engine);
