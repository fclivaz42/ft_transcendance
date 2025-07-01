import { Scene } from "@babylonjs/core/scene.js";
import { Vector3 } from "@babylonjs/core/Maths/math.vector.js";
import { Mesh } from "@babylonjs/core/Meshes/mesh.js";
import { MeshBuilder } from "@babylonjs/core/Meshes/meshBuilder.js";
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial.js";
import { Color3 } from "@babylonjs/core/Maths/math.color.js";
import { BallUpdate } from "../types.js";

export class Ball {
    private mesh: Mesh;
    private material: StandardMaterial;
    private scene: Scene;
    private updateCounter: number = 0;
    
    // SYSTÈME DE TRAÎNÉE ÉTOILE FILANTE
    private trailMeshes: Mesh[] = [];
    private trailPositions: Vector3[] = [];
    private maxTrailLength: number = 8;

    constructor(scene: Scene, ballUpdate: BallUpdate) {
        console.log("🔥🔥🔥 BALL CONSTRUCTOR APPELÉ 🔥🔥🔥");
        console.log("📦 BallUpdate reçu:", ballUpdate);
        console.log("📍 Position à créer:", ballUpdate.curr_position);
        
        this.scene = scene;
        
        // Créer une balle ÉNORME et BLEUE
        console.log("⚽ Création sphere...");
        this.mesh = MeshBuilder.CreateSphere("ball", { diameter: 2.0 }, scene);
        console.log("⚽ Sphere créée");
        
        // Matériau BLEU ÉBLOUISSANT
        console.log("🎨 Création matériau...");
        this.material = new StandardMaterial("ballMaterial", scene);
        this.material.emissiveColor = new Color3(0, 3, 10); // BLEU ÉBLOUISSANT
        this.material.diffuseColor = new Color3(0, 2, 8);
        this.mesh.material = this.material;
        console.log("🎨 Matériau bleu appliqué");
        
        // Position initiale
        this.mesh.position = new Vector3(
            ballUpdate.curr_position[0],
            ballUpdate.curr_position[1],
            ballUpdate.curr_position[2]
        );
        
        console.log("📍 Position finale de la balle:", this.mesh.position.asArray());
        console.log("✅✅✅ BALLE BLEUE ÉNORME CRÉÉE ! ✅✅✅");
    }

    public update(ballUpdate: BallUpdate): void {
        this.updateCounter++;
        
        console.log(`🔄🔄 BALL UPDATE #${this.updateCounter} 🔄🔄`);
        console.log("📍 Ancienne position:", this.mesh.position.asArray());
        console.log("📍 Nouvelle position:", ballUpdate.curr_position);
        
        // AJOUTER LA POSITION ACTUELLE À LA TRAÎNÉE
        this.trailPositions.push(this.mesh.position.clone());
        
        // Limiter la longueur de la traînée
        if (this.trailPositions.length > this.maxTrailLength) {
            this.trailPositions.shift(); // Supprimer la plus ancienne
        }
        
        console.log(`🌟 Traînée: ${this.trailPositions.length} positions sauvegardées`);
        
        // CRÉER LA TRAÎNÉE TRANSPARENTE
        this.createTrail();
        
        // Mettre à jour la position
        this.mesh.position = new Vector3(
            ballUpdate.curr_position[0],
            ballUpdate.curr_position[1],
            ballUpdate.curr_position[2]
        );
        
        console.log("📍 Position mise à jour:", this.mesh.position.asArray());
        console.log("✅ UPDATE TERMINÉ");
    }

    private createTrail(): void {
        console.log("🌟 CRÉATION TRAÎNÉE BLEU → BLANC...");
        
        // Supprimer l'ancienne traînée
        this.trailMeshes.forEach((mesh, index) => {
            if (mesh.material) mesh.material.dispose();
            mesh.dispose();
        });
        this.trailMeshes = [];
        
        // Créer une sphère pour chaque position de la traînée
        this.trailPositions.forEach((position, index) => {
            const ageRatio = index / (this.trailPositions.length - 1); // 0 = plus ancien, 1 = plus récent
            
            // Taille qui diminue vers l'arrière
            const size = 1.8 - (1 - ageRatio) * 0.8; // De 1.0 à 1.8
            
            // Transparence qui diminue vers l'arrière (plus ancien = plus transparent)
            const alpha = ageRatio * 0.8; // De 0 à 0.8
            
            if (alpha > 0.05) { // Seulement si assez visible
                // Créer la sphère de traînée
                const trailSphere = MeshBuilder.CreateSphere(
                    `ballTrail_${index}_${this.updateCounter}`, 
                    { diameter: size }, 
                    this.scene
                );
                
                trailSphere.position = position.clone();
                
                // Matériau BLEU CLAIR → BLANC pour la traînée
                const trailMaterial = new StandardMaterial(`trailMat_${index}_${this.updateCounter}`, this.scene);
                
                // Dégradé de bleu clair vers blanc
                // ageRatio 0 = ancien (blanc), ageRatio 1 = récent (bleu clair)
                const blueIntensity = ageRatio; // Plus récent = plus bleu
                const whiteIntensity = 1 - ageRatio; // Plus ancien = plus blanc
                
                const red = whiteIntensity + blueIntensity * 0.3;   // De 1 (blanc) à 0.3 (bleu)
                const green = whiteIntensity + blueIntensity * 0.7; // De 1 (blanc) à 0.7 (bleu)
                const blue = 1.0; // Toujours bleu/blanc
                
                trailMaterial.emissiveColor = new Color3(red, green, blue).scale(alpha * 3);
                trailMaterial.diffuseColor = new Color3(red, green, blue).scale(alpha * 2);
                trailMaterial.alpha = alpha;
                
                trailSphere.material = trailMaterial;
                this.trailMeshes.push(trailSphere);
                
                console.log(`✨ Traînée ${index}: taille=${size.toFixed(2)}, alpha=${alpha.toFixed(2)}, couleur=rgb(${red.toFixed(2)},${green.toFixed(2)},${blue.toFixed(2)})`);
            }
        });
        
        console.log(`🌟 TRAÎNÉE CRÉÉE: ${this.trailMeshes.length} sphères bleu→blanc ! 🌟`);
    }

    public dispose(): void {
        console.log("🧹 BALL DISPOSE");
        
        // Nettoyer la traînée
        this.trailMeshes.forEach(mesh => {
            if (mesh.material) mesh.material.dispose();
            mesh.dispose();
        });
        this.trailMeshes = [];
        this.trailPositions = [];
        
        // Nettoyer la balle
        if (this.material) {
            this.material.dispose();
        }
        if (this.mesh) {
            this.mesh.dispose();
        }
        
        console.log("✅ BALL DISPOSE TERMINÉ");
    }
}