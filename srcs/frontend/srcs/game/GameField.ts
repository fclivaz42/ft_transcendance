// // // import { Scene } from "@babylonjs/core/scene.js";
// // // import { Vector3 } from "@babylonjs/core/Maths/math.vector.js";
// // // import { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera.js";
// // // import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight.js";
// // // import { Engine } from "@babylonjs/core/Engines/engine.js";

// // // import { Ball } from "./game_components/Ball.js";
// // // import { Paddle } from "./game_components/Paddle.js";
// // // import { Wall } from "./game_components/Wall.js";

// // // import { InitPayload, UpdatePayload, CameraInitInfo, LightInitInfo } from "./types.js";
// // // import { GlowLayer } from "@babylonjs/core";

// // // // Temp values, overriding WebSocket info
// // // const ALPHA: number = Math.PI / 2;
// // // const BETA: number = Math.PI / 2;
// // // const RADIUS: number = -26;

// // // export class GameField {
// // //     public scene: Scene;
// // //     private ball: Ball | null = null;
// // //     private p1: Paddle | null = null;
// // //     private p2: Paddle | null = null;
// // //     private walls: Wall[] = [];
// // //     private glowLayer: GlowLayer;

// // //     constructor(private engine: Engine) {
// // //         this.scene = new Scene(this.engine);
        
// // //         // GLOW LAYER AVEC FORTE INTENSITÉ
// // //         this.glowLayer = new GlowLayer("glow", this.scene);
// // //         this.glowLayer.intensity = 2.0;
// // //         console.log("🔥 GLOW LAYER ACTIVÉ - Intensité 2.0");
// // //     }

// // //     public init(payload: InitPayload["payload"]) {
// // //         console.log("🎮 DÉBUT INIT GAMEFIELD");
// // //         console.log("📦 Payload reçu:", payload);
        
// // //         this.setupCameraAndLight(payload.camera, payload.light);

// // //         console.log("⚽ CRÉATION BALLE...");
// // //         console.log("📍 Position balle dans payload:", payload.ball.curr_position);
        
// // //         this.ball = new Ball(this.scene, payload.ball);
// // //         console.log("⚽ BALLE CRÉÉE:", this.ball ? "✅ SUCCÈS" : "❌ ÉCHEC");
        
// // //         this.p1 = new Paddle(this.scene, "p1", payload.p1);
// // //         this.p2 = new Paddle(this.scene, "p2", payload.p2);

// // //         for (const [name, wall] of Object.entries(payload.walls)) {
// // //             this.walls.push(new Wall(this.scene, name, wall));
// // //         }
        
// // //         console.log("🎮 INIT GAMEFIELD TERMINÉ");
// // //     }

// // //     public update(payload: UpdatePayload["payload"]) {
// // //         console.log("🔄 UPDATE GAMEFIELD");
// // //         console.log("📍 Position balle reçue:", payload.ball.curr_position);
        
// // //         if (this.ball) {
// // //             console.log("⚽ Mise à jour balle...");
// // //             this.ball.update(payload.ball);
// // //         } else {
// // //             console.log("❌ PAS DE BALLE À METTRE À JOUR");
// // //         }
        
// // //         this.p1?.update(payload.p1);
// // //         this.p2?.update(payload.p2);
// // //     }

// // //     private setupCameraAndLight(cameraInfo: CameraInitInfo, lightInfo: LightInitInfo) {
// // //         const camera = new ArcRotateCamera(
// // //             "camera",
// // //             ALPHA,
// // //             BETA,
// // //             RADIUS,
// // //             Vector3.Zero(),
// // //             this.scene
// // //         );
// // //         camera.attachControl(this.engine.getRenderingCanvas(), false);
// // //         this.scene.activeCamera = camera;
// // //         console.log("📷 Camera position:", camera.position.asArray());

// // //         new HemisphericLight("light", new Vector3(...lightInfo.direction), this.scene);
// // //     }

// // //     public dispose(): void {
// // //         console.log("🧹 Nettoyage du GameField");
        
// // //         if (this.ball) {
// // //             this.ball.dispose();
// // //             this.ball = null;
// // //         }
        
// // //         if (this.p1) {
// // //             this.p1.dispose();
// // //             this.p1 = null;
// // //         }
        
// // //         if (this.p2) {
// // //             this.p2.dispose();
// // //             this.p2 = null;
// // //         }
        
// // //         this.walls.forEach(wall => wall.dispose());
// // //         this.walls = [];
        
// // //         if (this.glowLayer) {
// // //             this.glowLayer.dispose();
// // //         }
        
// // //         if (this.scene) {
// // //             this.scene.dispose();
// // //         }
// // //     }
// // // }
// // import { Scene } from "@babylonjs/core/scene.js";
// // import { Vector3 } from "@babylonjs/core/Maths/math.vector.js";
// // import { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera.js";
// // import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight.js";
// // import { Engine } from "@babylonjs/core/Engines/engine.js";
// // import { GlowLayer } from "@babylonjs/core/Layers/glowLayer.js";
// // import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial.js";
// // import { Color3 } from "@babylonjs/core/Maths/math.color.js";
// // import { CreateBox } from "@babylonjs/core/Meshes/Builders/boxBuilder.js";
// // import { Mesh } from "@babylonjs/core/Meshes/mesh.js";
// // // NOUVEL IMPORT pour un nœud parent si vous décalez toute la grille
// // import { TransformNode } from "@babylonjs/core/Meshes/transformNode.js";


// // import { Ball } from "./game_components/Ball.js";
// // import { Paddle } from "./game_components/Paddle.js";
// // import { Wall } from "./game_components/Wall.js";

// // import { InitPayload, UpdatePayload, CameraInitInfo, LightInitInfo } from "./types.js";

// // // Temp values, overriding WebSocket info
// // const ALPHA: number = Math.PI / 2;
// // const BETA: number = Math.PI / 2;
// // const RADIUS: number = -26;

// // export class GameField {
// //     public scene: Scene;
// //     private ball: Ball | null = null;
// //     private p1: Paddle | null = null;
// //     private p2: Paddle | null = null;
// //     private walls: Wall[] = [];
// //     private glowLayer: GlowLayer;
// //     private gridMeshes: Mesh[] = [];
// //     private gridParent: TransformNode | null = null; // Ajout d'un nœud parent pour la grille

// //     constructor(private engine: Engine) {
// //         this.scene = new Scene(this.engine);
        
// //         // GLOW LAYER AVEC INTENSITÉ RÉDUITE
// //         this.glowLayer = new GlowLayer("glow", this.scene);
// //         this.glowLayer.intensity = 0.8; // Réduit l'intensité du glow (était 2.0)
// //         console.log("🔥 GLOW LAYER ACTIVÉ - Intensité 0.8");
// //     }

// //     public init(payload: InitPayload["payload"]) {
// //         console.log("🎮 DÉBUT INIT GAMEFIELD");
// //         console.log("📦 Payload reçu:", payload);
        
// //         this.setupCameraAndLight(payload.camera, payload.light);

// //         // --- NOUVEAU : Création de l'effet de grille ---
// //         this.create3DGridEffect();
// //         console.log("🌐 EFFET DE GRILLE 3D CRÉÉ");
// //         // ---------------------------------------------

// //         console.log("⚽ CRÉATION BALLE...");
// //         console.log("📍 Position balle dans payload:", payload.ball.curr_position);
        
// //         this.ball = new Ball(this.scene, payload.ball);
// //         console.log("⚽ BALLE CRÉÉE:", this.ball ? "✅ SUCCÈS" : "❌ ÉCHEC");
        
// //         this.p1 = new Paddle(this.scene, "p1", payload.p1);
// //         this.p2 = new Paddle(this.scene, "p2", payload.p2);

// //         for (const [name, wall] of Object.entries(payload.walls)) {
// //             this.walls.push(new Wall(this.scene, name, wall));
// //         }
        
// //         console.log("🎮 INIT GAMEFIELD TERMINÉ");
// //     }

// //     public update(payload: UpdatePayload["payload"]) {
// //         console.log("🔄 UPDATE GAMEFIELD");
// //         console.log("📍 Position balle reçue:", payload.ball.curr_position);
        
// //         if (this.ball) {
// //             console.log("⚽ Mise à jour balle...");
// //             this.ball.update(payload.ball);
// //         } else {
// //             console.log("❌ PAS DE BALLE À METTRE À JOUR");
// //         }
        
// //         this.p1?.update(payload.p1);
// //         this.p2?.update(payload.p2);
// //     }

// //     private setupCameraAndLight(cameraInfo: CameraInitInfo, lightInfo: LightInitInfo) {
// //         const camera = new ArcRotateCamera(
// //             "camera",
// //             ALPHA,
// //             BETA,
// //             RADIUS,
// //             Vector3.Zero(),
// //             this.scene
// //         );
// //         camera.attachControl(this.engine.getRenderingCanvas(), false);
// //         this.scene.activeCamera = camera;
// //         console.log("📷 Camera position:", camera.position.asArray());

// //         new HemisphericLight("light", new Vector3(...lightInfo.direction), this.scene);
// //     }

// //     private create3DGridEffect() {
// //         // --- Dimensions du cadre de jeu ---
// //         // Ces valeurs sont des estimations basées sur un jeu de Pong classique.
// //         // Vous DEVEZ les ajuster pour qu'elles correspondent EXACTEMENT aux dimensions de votre jeu.
// //         // Par exemple, si vos murs s'étendent de X=-10 à X=10, alors arenaWidth = 20.
// //         // Si vos murs s'étendent de Y=-5 à Y=5, alors arenaHeight = 10.
// //         // Si votre jeu se déroule de Z=0 à Z=20, alors la grille devrait commencer après Z=20.
// //         const gameWidth = 20; // Largeur de votre zone de jeu (ex: de -10 à 10 en X)
// //         const gameHeight = 10; // Hauteur de votre zone de jeu (ex: de -5 à 5 en Y)
// //         const gameDepth = 20; // Profondeur de votre zone de jeu (ex: de 0 à 20 en Z)

// //         // --- Dimensions de la grille ---
// //         // La grille sera plus grande que le jeu pour créer un effet de tunnel derrière.
// //         const gridExtensionDepth = 40; // Profondeur supplémentaire de la grille derrière le jeu
// //         const gridTotalDepth = gameDepth + gridExtensionDepth; // Profondeur totale de la grille

// //         const gridSize = 2; // Taille des carrés de la grille (augmenté pour des formes plus grandes)
// //         const lineWidth = 0.08; // Épaisseur des lignes de la grille (légèrement augmenté pour visibilité)

// //         // Matériau pour les lignes de la grille (lumineuses)
// //         const gridMaterial = new StandardMaterial("gridMaterial", this.scene);
// //         gridMaterial.disableLighting = true; // Ignorer l'éclairage
// //         // Couleur bleu foncé turquoise (ajuster les valeurs RGB)
// //         gridMaterial.emissiveColor = new Color3(0.1, 0.4, 0.6); // Exemple de bleu-turquoise foncé
// //         // Autres options:
// //         // gridMaterial.emissiveColor = new Color3(0.0, 0.3, 0.5); // Encore plus foncé
// //         // gridMaterial.emissiveColor = new Color3(0.0, 0.5, 0.7); // Plus clair mais toujours turquoise

// //         // Créer un nœud parent pour la grille afin de pouvoir la positionner facilement
// //         this.gridParent = new TransformNode("gridParent", this.scene);
// //         // Positionner le parent de la grille. Si votre jeu est de Z=0 à Z=20,
// //         // et que la grille doit commencer après Z=20, alors le centre de la grille
// //         // (qui a une profondeur de gridTotalDepth) devrait être à Z = gameDepth + (gridExtensionDepth / 2)
// //         this.gridParent.position.z = gameDepth + (gridExtensionDepth / 2);
// //         // Si votre jeu est centré autour de Z=0 (ex: de -10 à 10), alors le parent pourrait être à Z=0.
// //         // Pour l'exemple, je suppose que votre jeu commence à Z=0 et s'étend en Z positif.
// //         this.gridParent.position.x = 0; // Centré sur X
// //         this.gridParent.position.y = 0; // Centré sur Y

// //         // --- Création de la grille du sol ---
// //         // La grille s'étend de -gameWidth/2 à +gameWidth/2 en X, et de -gameHeight/2 à +gameHeight/2 en Y
// //         // et de -gridTotalDepth/2 à +gridTotalDepth/2 en Z (relatif au gridParent)

// //         // Lignes horizontales du sol (le long de X)
// //         for (let z = -gridTotalDepth / 2; z <= gridTotalDepth / 2; z += gridSize) {
// //             const lineX = CreateBox("gridLineX_" + z, { width: gameWidth, height: lineWidth, depth: lineWidth }, this.scene);
// //             lineX.position.set(0, -gameHeight / 2, z); // Au sol, le long de X
// //             lineX.material = gridMaterial;
// //             lineX.parent = this.gridParent; // Attacher au parent
// //             this.gridMeshes.push(lineX);
// //         }
// //         // Lignes verticales du sol (le long de Z)
// //         for (let x = -gameWidth / 2; x <= gameWidth / 2; x += gridSize) {
// //             const lineZ = CreateBox("gridLineZ_" + x, { width: lineWidth, height: lineWidth, depth: gridTotalDepth }, this.scene);
// //             lineZ.position.set(x, -gameHeight / 2, 0); // Au sol, le long de Z
// //             lineZ.material = gridMaterial;
// //             lineZ.parent = this.gridParent; // Attacher au parent
// //             this.gridMeshes.push(lineZ);
// //         }
        
// //         // --- Création des grilles des murs latéraux et du plafond ---

// //         // Mur Gauche (-X)
// //         // Lignes verticales (le long de Y)
// //         for (let y = -gameHeight / 2; y <= gameHeight / 2; y += gridSize) {
// //             const lineY = CreateBox("gridLineWallLeftY_" + y, { width: lineWidth, height: lineWidth, depth: gridTotalDepth }, this.scene);
// //             lineY.position.set(-gameWidth / 2, y, 0);
// //             lineY.material = gridMaterial;
// //             lineY.parent = this.gridParent;
// //             this.gridMeshes.push(lineY);
// //         }
// //         // Lignes horizontales (le long de Z)
// //         for (let z = -gridTotalDepth / 2; z <= gridTotalDepth / 2; z += gridSize) {
// //              const lineZ = CreateBox("gridLineWallLeftZ_" + z, { width: lineWidth, height: gameHeight, depth: lineWidth }, this.scene);
// //              lineZ.position.set(-gameWidth / 2, 0, z);
// //              lineZ.material = gridMaterial;
// //              lineZ.parent = this.gridParent;
// //              this.gridMeshes.push(lineZ);
// //         }

// //         // Mur Droit (+X)
// //         // Lignes verticales (le long de Y)
// //         for (let y = -gameHeight / 2; y <= gameHeight / 2; y += gridSize) {
// //             const lineY = CreateBox("gridLineWallRightY_" + y, { width: lineWidth, height: lineWidth, depth: gridTotalDepth }, this.scene);
// //             lineY.position.set(gameWidth / 2, y, 0);
// //             lineY.material = gridMaterial;
// //             lineY.parent = this.gridParent;
// //             this.gridMeshes.push(lineY);
// //         }
// //         // Lignes horizontales (le long de Z)
// //         for (let z = -gridTotalDepth / 2; z <= gridTotalDepth / 2; z += gridSize) {
// //             const lineZ = CreateBox("gridLineWallRightZ_" + z, { width: lineWidth, height: gameHeight, depth: lineWidth }, this.scene);
// //             lineZ.position.set(gameWidth / 2, 0, z);
// //             lineZ.material = gridMaterial;
// //             lineZ.parent = this.gridParent;
// //             this.gridMeshes.push(lineZ);
// //         }

// //         // Plafond (+Y)
// //         // Lignes horizontales (le long de X)
// //         for (let z = -gridTotalDepth / 2; z <= gridTotalDepth / 2; z += gridSize) {
// //             const lineZ = CreateBox("gridLineCeilingZ_" + z, { width: gameWidth, height: lineWidth, depth: lineWidth }, this.scene);
// //             lineZ.position.set(0, gameHeight / 2, z);
// //             lineZ.material = gridMaterial;
// //             lineZ.parent = this.gridParent;
// //             this.gridMeshes.push(lineZ);
// //         }
// //         // Lignes verticales (le long de Z)
// //         for (let x = -gameWidth / 2; x <= gameWidth / 2; x += gridSize) {
// //             const lineX = CreateBox("gridLineCeilingX_" + x, { width: lineWidth, height: lineWidth, depth: gridTotalDepth }, this.scene);
// //             lineX.position.set(x, gameHeight / 2, 0);
// //             lineX.material = gridMaterial;
// //             lineX.parent = this.gridParent;
// //             this.gridMeshes.push(lineX);
// //         }
// //     }

// //     public dispose(): void {
// //         console.log("🧹 Nettoyage du GameField");
        
// //         if (this.ball) {
// //             this.ball.dispose();
// //             this.ball = null;
// //         }
        
// //         if (this.p1) {
// //             this.p1.dispose();
// //             this.p1 = null;
// //         }
        
// //         if (this.p2) {
// //             this.p2.dispose();
// //             this.p2 = null;
// //         }
        
// //         this.walls.forEach(wall => wall.dispose());
// //         this.walls = [];
        
// //         // --- Nettoyage de la grille ---
// //         if (this.gridParent) {
// //             this.gridParent.dispose(); // Disposer le parent dispose aussi ses enfants
// //             this.gridParent = null;
// //         }
// //         this.gridMeshes = []; // Vider le tableau
// //         // -------------------------------------

// //         if (this.glowLayer) {
// //             this.glowLayer.dispose();
// //         }
        
// //         if (this.scene) {
// //             this.scene.dispose();
// //         }
// //     }
// // }
// import { Scene } from "@babylonjs/core/scene.js";
// import { Vector3 } from "@babylonjs/core/Maths/math.vector.js";
// import { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera.js";
// import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight.js";
// import { Engine } from "@babylonjs/core/Engines/engine.js";
// import { GlowLayer } from "@babylonjs/core/Layers/glowLayer.js";
// import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial.js";
// import { Color3 } from "@babylonjs/core/Maths/math.color.js";
// import { CreateBox } from "@babylonjs/core/Meshes/Builders/boxBuilder.js";
// import { Mesh } from "@babylonjs/core/Meshes/mesh.js";
// import { TransformNode } from "@babylonjs/core/Meshes/transformNode.js";


// import { Ball } from "./game_components/Ball.js";
// import { Paddle } from "./game_components/Paddle.js";
// import { Wall } from "./game_components/Wall.js";

// import { InitPayload, UpdatePayload, CameraInitInfo, LightInitInfo } from "./types.js";

// // Temp values, overriding WebSocket info
// const ALPHA: number = Math.PI / 2;
// const BETA: number = Math.PI / 2;
// const RADIUS: number = -26;

// export class GameField {
//     public scene: Scene;
//     private ball: Ball | null = null;
//     private p1: Paddle | null = null;
//     private p2: Paddle | null = null;
//     private walls: Wall[] = [];
//     private glowLayer: GlowLayer;
//     private gridMeshes: Mesh[] = [];
//     private gridParent: TransformNode | null = null; // Ajout d'un nœud parent pour la grille

//     constructor(private engine: Engine) {
//         this.scene = new Scene(this.engine);
        
//         // GLOW LAYER AVEC INTENSITÉ RÉDUITE
//         this.glowLayer = new GlowLayer("glow", this.scene);
//         this.glowLayer.intensity = 0.8; // Réduit l'intensité du glow (était 2.0)
//         console.log("🔥 GLOW LAYER ACTIVÉ - Intensité 0.8");
//     }

//     public init(payload: InitPayload["payload"]) {
//         console.log("🎮 DÉBUT INIT GAMEFIELD");
//         console.log("📦 Payload reçu:", payload);
        
//         this.setupCameraAndLight(payload.camera, payload.light);

//         // --- NOUVEAU : Création de l'effet de grille ---
//         // Appel à la fonction sans arguments, elle utilisera les constantes internes
//         this.create3DGridEffect();
//         console.log("🌐 EFFET DE GRILLE 3D CRÉÉ");
//         // ---------------------------------------------

//         console.log("⚽ CRÉATION BALLE...");
//         console.log("📍 Position balle dans payload:", payload.ball.curr_position);
        
//         this.ball = new Ball(this.scene, payload.ball);
//         console.log("⚽ BALLE CRÉÉE:", this.ball ? "✅ SUCCÈS" : "❌ ÉCHEC");
        
//         this.p1 = new Paddle(this.scene, "p1", payload.p1);
//         this.p2 = new Paddle(this.scene, "p2", payload.p2);

//         for (const [name, wall] of Object.entries(payload.walls)) {
//             this.walls.push(new Wall(this.scene, name, wall));
//         }
        
//         console.log("🎮 INIT GAMEFIELD TERMINÉ");
//     }

//     public update(payload: UpdatePayload["payload"]) {
//         // console.log("🔄 UPDATE GAMEFIELD"); // Désactivé pour réduire le spam console
//         // console.log("📍 Position balle reçue:", payload.ball.curr_position); // Désactivé
        
//         if (this.ball) {
//             // console.log("⚽ Mise à jour balle..."); // Désactivé
//             this.ball.update(payload.ball);
//         } else {
//             console.log("❌ PAS DE BALLE À METTRE À JOUR");
//         }
        
//         this.p1?.update(payload.p1);
//         this.p2?.update(payload.p2);
//     }

//     private setupCameraAndLight(cameraInfo: CameraInitInfo, lightInfo: LightInitInfo) {
//         const camera = new ArcRotateCamera(
//             "camera",
//             ALPHA,
//             BETA,
//             RADIUS,
//             Vector3.Zero(),
//             this.scene
//         );
//         camera.attachControl(this.engine.getRenderingCanvas(), false);
//         this.scene.activeCamera = camera;
//         console.log("📷 Camera position:", camera.position.asArray());

//         new HemisphericLight("light", new Vector3(...lightInfo.direction), this.scene);
//     }

//     private create3DGridEffect() {
//         // --- Dimensions du cadre de jeu déduites de votre Game.ts ---
//         // Basé sur les positions des murs Est/Ouest (13.7 et -13.7)
//         const gameWidth = 13.7 * 2; // = 27.4
//         // Basé sur GOAL_HEIGHT (16.6)
//         const gameHeight = 16.6; 
//         // Le jeu est centré sur Z=0
//         const gameReferenceZ = 0; 

//         // --- Dimensions de la grille ---
//         // La grille sera plus grande que le jeu pour créer un effet de tunnel derrière.
//         // La profondeur totale que le tunnel doit couvrir en Z (s'étendra de Z=0 vers Z négatif)
//         const gridTotalDepth = 40; // Par exemple, pour un tunnel de 40 unités de long

//         const gridSize = 2; // Taille des carrés de la grille
//         const lineWidth = 0.08; // Épaisseur des lignes de la grille

//         // Matériau pour les lignes de la grille (lumineuses)
//         const gridMaterial = new StandardMaterial("gridMaterial", this.scene);
//         gridMaterial.disableLighting = true; // Ignorer l'éclairage pour un glow uniforme
//         gridMaterial.emissiveColor = new Color3(0.1, 0.4, 0.6); // Bleu-turquoise foncé

//         // Créer un nœud parent pour la grille afin de pouvoir la positionner facilement
//         this.gridParent = new TransformNode("gridParent", this.scene);
        
//         // Positionner le parent de la grille.
//         // Le début de votre jeu est à Z = gameReferenceZ (qui est 0).
//         // La grille s'étendra de ce point (Z=0) vers l'arrière (Z négatif).
//         // Donc, le centre en Z du parent doit être à `gameReferenceZ - (gridTotalDepth / 2)`.
//         this.gridParent.position.x = 0; // Centré sur X
//         this.gridParent.position.y = 0; // Centré sur Y
//         this.gridParent.position.z = gameReferenceZ - (gridTotalDepth / 2); // Ex: 0 - (40 / 2) = -20
//         // Cela signifie que la grille s'étendra de Z = -gridTotalDepth à Z = gameReferenceZ (de -40 à 0)

//         console.log(`🎯 Grille créée avec: Largeur=${gameWidth}, Hauteur=${gameHeight}`);
//         console.log(`🌐 Grille parent positionnée au centre Z: ${this.gridParent.position.z} (début à Z=${gameReferenceZ})`);

//         // --- Création de la grille du sol (-Y) ---
//         // Position Y du sol (moitié de la hauteur du jeu vers le bas)
//         const floorYPos = -gameHeight / 2; 

//         // Lignes parallèles à X (de gauche à droite, le long du sol)
//         for (let z = -gridTotalDepth / 2; z <= gridTotalDepth / 2; z += gridSize) {
//             const lineX = CreateBox("gridFloorLineX_" + z, { width: gameWidth, height: lineWidth, depth: lineWidth }, this.scene);
//             lineX.position.set(0, floorYPos, z); // Au sol, à la position Z relative au parent
//             lineX.material = gridMaterial;
//             lineX.parent = this.gridParent; // Attacher au parent
//             this.gridMeshes.push(lineX);
//         }
//         // Lignes parallèles à Z (de l'avant vers l'arrière, le long du sol)
//         for (let x = -gameWidth / 2; x <= gameWidth / 2; x += gridSize) {
//             const lineZ = CreateBox("gridFloorLineZ_" + x, { width: lineWidth, height: lineWidth, depth: gridTotalDepth }, this.scene);
//             lineZ.position.set(x, floorYPos, 0); // Au sol, centre en Z (0 relatif au parent)
//             lineZ.material = gridMaterial;
//             lineZ.parent = this.gridParent; // Attacher au parent
//             this.gridMeshes.push(lineZ);
//         }
        
//         // --- Création des grilles des murs latéraux et du plafond ---

//         // Mur Gauche (-X)
//         const leftWallXPos = -gameWidth / 2; // Position X du mur gauche

//         // Lignes parallèles à Y (de bas en haut, sur le mur gauche)
//         for (let y = -gameHeight / 2; y <= gameHeight / 2; y += gridSize) {
//             const lineY = CreateBox("gridWallLeftLineY_" + y, { width: lineWidth, height: lineWidth, depth: gridTotalDepth }, this.scene);
//             lineY.position.set(leftWallXPos, y, 0);
//             lineY.material = gridMaterial;
//             lineY.parent = this.gridParent;
//             this.gridMeshes.push(lineY);
//         }
//         // Lignes parallèles à Z (de l'avant vers l'arrière, sur le mur gauche)
//         for (let z = -gridTotalDepth / 2; z <= gridTotalDepth / 2; z += gridSize) {
//              const lineZ = CreateBox("gridWallLeftLineZ_" + z, { width: lineWidth, height: gameHeight, depth: lineWidth }, this.scene);
//              lineZ.position.set(leftWallXPos, 0, z); // Centre en Y du segment est 0
//              lineZ.material = gridMaterial;
//              lineZ.parent = this.gridParent;
//              this.gridMeshes.push(lineZ);
//         }

//         // Mur Droit (+X)
//         const rightWallXPos = gameWidth / 2; // Position X du mur droit

//         // Lignes parallèles à Y (de bas en haut, sur le mur droit)
//         for (let y = -gameHeight / 2; y <= gameHeight / 2; y += gridSize) {
//             const lineY = CreateBox("gridWallRightLineY_" + y, { width: lineWidth, height: lineWidth, depth: gridTotalDepth }, this.scene);
//             lineY.position.set(rightWallXPos, y, 0);
//             lineY.material = gridMaterial;
//             lineY.parent = this.gridParent;
//             this.gridMeshes.push(lineY);
//         }
//         // Lignes parallèles à Z (de l'avant vers l'arrière, sur le mur droit)
//         for (let z = -gridTotalDepth / 2; z <= gridTotalDepth / 2; z += gridSize) {
//             const lineZ = CreateBox("gridWallRightLineZ_" + z, { width: lineWidth, height: gameHeight, depth: lineWidth }, this.scene);
//             lineZ.position.set(rightWallXPos, 0, z);
//             lineZ.material = gridMaterial;
//             lineZ.parent = this.gridParent;
//             this.gridMeshes.push(lineZ);
//         }

//         // Plafond (+Y)
//         const ceilingYPos = gameHeight / 2; // Position Y du plafond

//         // Lignes parallèles à X (de gauche à droite, au plafond)
//         for (let z = -gridTotalDepth / 2; z <= gridTotalDepth / 2; z += gridSize) {
//             const lineZ = CreateBox("gridCeilingLineX_" + z, { width: gameWidth, height: lineWidth, depth: lineWidth }, this.scene);
//             lineZ.position.set(0, ceilingYPos, z);
//             lineZ.material = gridMaterial;
//             lineZ.parent = this.gridParent;
//             this.gridMeshes.push(lineZ);
//         }
//         // Lignes parallèles à Z (de l'avant vers l'arrière, au plafond)
//         for (let x = -gameWidth / 2; x <= gameWidth / 2; x += gridSize) {
//             const lineX = CreateBox("gridCeilingLineZ_" + x, { width: lineWidth, height: lineWidth, depth: gridTotalDepth }, this.scene);
//             lineX.position.set(x, ceilingYPos, 0);
//             lineX.material = gridMaterial;
//             lineX.parent = this.gridParent;
//             this.gridMeshes.push(lineX);
//         }
//     }

//     public dispose(): void {
//         console.log("🧹 Nettoyage du GameField");
        
//         if (this.ball) {
//             this.ball.dispose();
//             this.ball = null;
//         }
        
//         if (this.p1) {
//             this.p1.dispose();
//             this.p1 = null;
//         }
        
//         if (this.p2) {
//             this.p2.dispose();
//             this.p2 = null;
//         }
        
//         this.walls.forEach(wall => wall.dispose());
//         this.walls = [];
        
//         // --- Nettoyage de la grille ---
//         if (this.gridParent) {
//             this.gridParent.dispose(); // Disposer le parent dispose aussi ses enfants
//             this.gridParent = null;
//         }
//         this.gridMeshes = []; // Vider le tableau
//         // -------------------------------------

//         if (this.glowLayer) {
//             this.glowLayer.dispose();
//         }
        
//         if (this.scene) {
//             this.scene.dispose();
//         }
//     }
// }

import { Scene } from "@babylonjs/core/scene.js";
import { Vector3 } from "@babylonjs/core/Maths/math.vector.js";
import { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera.js";
import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight.js";
import { Engine } from "@babylonjs/core/Engines/engine.js";
import { GlowLayer } from "@babylonjs/core/Layers/glowLayer.js";
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial.js";
import { Color3 } from "@babylonjs/core/Maths/math.color.js";
import { CreateBox } from "@babylonjs/core/Meshes/Builders/boxBuilder.js";
import { Mesh } from "@babylonjs/core/Meshes/mesh.js";
import { TransformNode } from "@babylonjs/core/Meshes/transformNode.js";


import { Ball } from "./game_components/Ball.js";
import { Paddle } from "./game_components/Paddle.js";
import { Wall } from "./game_components/Wall.js";

import { InitPayload, UpdatePayload, CameraInitInfo, LightInitInfo } from "./types.js";

// Temp values, overriding WebSocket info
const ALPHA: number = Math.PI / 2;
const BETA: number = Math.PI / 2;
const RADIUS: number = -26;

export class GameField {
    public scene: Scene;
    private ball: Ball | null = null;
    private p1: Paddle | null = null;
    private p2: Paddle | null = null;
    private walls: Wall[] = [];
    private glowLayer: GlowLayer;
    private gridMeshes: Mesh[] = [];
    private gridParent: TransformNode | null = null; // Ajout d'un nœud parent pour la grille

    constructor(private engine: Engine) {
        this.scene = new Scene(this.engine);
        
        // GLOW LAYER AVEC INTENSITÉ RÉDUITE
        this.glowLayer = new GlowLayer("glow", this.scene);
        this.glowLayer.intensity = 0.8; // Réduit l'intensité du glow (était 2.0)
        console.log("🔥 GLOW LAYER ACTIVÉ - Intensité 0.8");
    }

    public init(payload: InitPayload["payload"]) {
        console.log("🎮 DÉBUT INIT GAMEFIELD");
        console.log("📦 Payload reçu:", payload);
        
        this.setupCameraAndLight(payload.camera, payload.light);

        // --- NOUVEAU : Création de l'effet de grille ---
        // Appel à la fonction sans arguments, elle utilisera les constantes internes
        this.create3DGridEffect();
        console.log("🌐 EFFET DE GRILLE 3D CRÉÉ");
        // ---------------------------------------------

        console.log("⚽ CRÉATION BALLE...");
        console.log("📍 Position balle dans payload:", payload.ball.curr_position);
        
        this.ball = new Ball(this.scene, payload.ball);
        console.log("⚽ BALLE CRÉÉE:", this.ball ? "✅ SUCCÈS" : "❌ ÉCHEC");
        
        this.p1 = new Paddle(this.scene, "p1", payload.p1);
        this.p2 = new Paddle(this.scene, "p2", payload.p2);

        for (const [name, wall] of Object.entries(payload.walls)) {
            this.walls.push(new Wall(this.scene, name, wall));
        }
        
        console.log("🎮 INIT GAMEFIELD TERMINÉ");
    }

    public update(payload: UpdatePayload["payload"]) {
        // console.log("🔄 UPDATE GAMEFIELD"); // Désactivé pour réduire le spam console
        // console.log("📍 Position balle reçue:", payload.ball.curr_position); // Désactivé
        
        if (this.ball) {
            // console.log("⚽ Mise à jour balle..."); // Désactivé
            this.ball.update(payload.ball);
        } else {
            console.log("❌ PAS DE BALLE À METTRE À JOUR");
        }
        
        this.p1?.update(payload.p1);
        this.p2?.update(payload.p2);
    }

    private setupCameraAndLight(cameraInfo: CameraInitInfo, lightInfo: LightInitInfo) {
        const camera = new ArcRotateCamera(
            "camera",
            ALPHA,
            BETA,
            RADIUS,
            Vector3.Zero(),
            this.scene
        );
        camera.attachControl(this.engine.getRenderingCanvas(), false);
        this.scene.activeCamera = camera;
        console.log("📷 Camera position:", camera.position.asArray());

        new HemisphericLight("light", new Vector3(...lightInfo.direction), this.scene);
    }

    private create3DGridEffect() {
        // --- Dimensions du cadre de jeu déduites de votre Game.ts ---
        // Basé sur les positions des murs Est/Ouest (13.7 et -13.7)
        const gameWidth = 13.7 * 2; // = 27.4
        // Basé sur GOAL_HEIGHT (16.6)
        const gameHeight = 16.6; 
        // Le jeu est centré sur Z=0
        const gameReferenceZ = 0; 

        // --- Dimensions de la grille ---
        // La grille s'étendra de manière égale des deux côtés du plan de jeu (Z=0).
        // La profondeur totale que le tunnel doit couvrir en Z.
        const gridTotalDepth = 40; // Ex: 20 unités en Z positif et 20 unités en Z négatif

        const gridSize = 2; // Taille des carrés de la grille
        const lineWidth = 0.08; // Épaisseur des lignes de la grille

        // Matériau pour les lignes de la grille (lumineuses)
        const gridMaterial = new StandardMaterial("gridMaterial", this.scene);
        gridMaterial.disableLighting = true; // Ignorer l'éclairage pour un glow uniforme
        gridMaterial.emissiveColor = new Color3(0.1, 0.4, 0.6); // Bleu-turquoise foncé

        // Créer un nœud parent pour la grille afin de pouvoir la positionner facilement
        this.gridParent = new TransformNode("gridParent", this.scene);
        
        // Positionner le parent de la grille directement au plan de jeu (Z=0).
        // Les lignes seront ensuite positionnées relativement à ce parent.
        this.gridParent.position.x = 0; // Centré sur X
        this.gridParent.position.y = 0; // Centré sur Y
        this.gridParent.position.z = gameReferenceZ; // Le parent est à Z=0

        console.log(`🎯 Grille créée avec: Largeur=${gameWidth}, Hauteur=${gameHeight}`);
        console.log(`🌐 Grille parent positionnée au centre Z: ${this.gridParent.position.z}`);

        // --- Création de la grille du sol (-Y) ---
        // Position Y du sol (moitié de la hauteur du jeu vers le bas)
        const floorYPos = -gameHeight / 2; 

        // Lignes parallèles à X (de gauche à droite, le long du sol)
        // Les boucles Z vont maintenant de -gridTotalDepth/2 à +gridTotalDepth/2
        for (let z = -gridTotalDepth / 2; z <= gridTotalDepth / 2; z += gridSize) {
            const lineX = CreateBox("gridFloorLineX_" + z, { width: gameWidth, height: lineWidth, depth: lineWidth }, this.scene);
            lineX.position.set(0, floorYPos, z); // Au sol, à la position Z relative au parent
            lineX.material = gridMaterial;
            lineX.parent = this.gridParent; // Attacher au parent
            this.gridMeshes.push(lineX);
        }
        // Lignes parallèles à Z (de l'avant vers l'arrière, le long du sol)
        for (let x = -gameWidth / 2; x <= gameWidth / 2; x += gridSize) {
            const lineZ = CreateBox("gridFloorLineZ_" + x, { width: lineWidth, height: lineWidth, depth: gridTotalDepth }, this.scene);
            lineZ.position.set(x, floorYPos, 0); // Au sol, centre en Z (0 relatif au parent)
            lineZ.material = gridMaterial;
            lineZ.parent = this.gridParent; // Attacher au parent
            this.gridMeshes.push(lineZ);
        }
        
        // --- Création des grilles des murs latéraux et du plafond ---

        // Mur Gauche (-X)
        const leftWallXPos = -gameWidth / 2; // Position X du mur gauche

        // Lignes parallèles à Y (de bas en haut, sur le mur gauche)
        for (let y = -gameHeight / 2; y <= gameHeight / 2; y += gridSize) {
            const lineY = CreateBox("gridWallLeftLineY_" + y, { width: lineWidth, height: lineWidth, depth: gridTotalDepth }, this.scene);
            lineY.position.set(leftWallXPos, y, 0);
            lineY.material = gridMaterial;
            lineY.parent = this.gridParent;
            this.gridMeshes.push(lineY);
        }
        // Lignes parallèles à Z (de l'avant vers l'arrière, sur le mur gauche)
        for (let z = -gridTotalDepth / 2; z <= gridTotalDepth / 2; z += gridSize) {
             const lineZ = CreateBox("gridWallLeftLineZ_" + z, { width: lineWidth, height: gameHeight, depth: lineWidth }, this.scene);
             lineZ.position.set(leftWallXPos, 0, z); // Centre en Y du segment est 0
             lineZ.material = gridMaterial;
             lineZ.parent = this.gridParent;
             this.gridMeshes.push(lineZ);
        }

        // Mur Droit (+X)
        const rightWallXPos = gameWidth / 2; // Position X du mur droit

        // Lignes parallèles à Y (de bas en haut, sur le mur droit)
        for (let y = -gameHeight / 2; y <= gameHeight / 2; y += gridSize) {
            const lineY = CreateBox("gridWallRightLineY_" + y, { width: lineWidth, height: lineWidth, depth: gridTotalDepth }, this.scene);
            lineY.position.set(rightWallXPos, y, 0);
            lineY.material = gridMaterial;
            lineY.parent = this.gridParent;
            this.gridMeshes.push(lineY);
        }
        // Lignes parallèles à Z (de l'avant vers l'arrière, sur le mur droit)
        for (let z = -gridTotalDepth / 2; z <= gridTotalDepth / 2; z += gridSize) {
            const lineZ = CreateBox("gridWallRightLineZ_" + z, { width: lineWidth, height: gameHeight, depth: lineWidth }, this.scene);
            lineZ.position.set(rightWallXPos, 0, z);
            lineZ.material = gridMaterial;
            lineZ.parent = this.gridParent;
            this.gridMeshes.push(lineZ);
        }

        // Plafond (+Y)
        const ceilingYPos = gameHeight / 2; // Position Y du plafond

        // Lignes parallèles à X (de gauche à droite, au plafond)
        for (let z = -gridTotalDepth / 2; z <= gridTotalDepth / 2; z += gridSize) {
            const lineZ = CreateBox("gridCeilingLineX_" + z, { width: gameWidth, height: lineWidth, depth: lineWidth }, this.scene);
            lineZ.position.set(0, ceilingYPos, z);
            lineZ.material = gridMaterial;
            lineZ.parent = this.gridParent;
            this.gridMeshes.push(lineZ);
        }
        // Lignes parallèles à Z (de l'avant vers l'arrière, au plafond)
        for (let x = -gameWidth / 2; x <= gameWidth / 2; x += gridSize) {
            const lineX = CreateBox("gridCeilingLineZ_" + x, { width: lineWidth, height: lineWidth, depth: gridTotalDepth }, this.scene);
            lineX.position.set(x, ceilingYPos, 0);
            lineX.material = gridMaterial;
            lineX.parent = this.gridParent;
            this.gridMeshes.push(lineX);
        }
    }

    public dispose(): void {
        console.log("🧹 Nettoyage du GameField");
        
        if (this.ball) {
            this.ball.dispose();
            this.ball = null;
        }
        
        if (this.p1) {
            this.p1.dispose();
            this.p1 = null;
        }
        
        if (this.p2) {
            this.p2.dispose();
            this.p2 = null;
        }
        
        this.walls.forEach(wall => wall.dispose());
        this.walls = [];
        
        // --- Nettoyage de la grille ---
        if (this.gridParent) {
            this.gridParent.dispose(); // Disposer le parent dispose aussi ses enfants
            this.gridParent = null;
        }
        this.gridMeshes = []; // Vider le tableau
        // -------------------------------------

        if (this.glowLayer) {
            this.glowLayer.dispose();
        }
        
        if (this.scene) {
            this.scene.dispose();
        }
    }
}