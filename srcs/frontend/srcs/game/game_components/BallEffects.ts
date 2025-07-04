// ballEffects.ts
import { Scene } from "@babylonjs/core/scene.js";
import { Mesh } from "@babylonjs/core/Meshes/mesh.js";
import { MeshBuilder, StandardMaterial, Color3, Vector3} from "@babylonjs/core";

export class BallEffects {
    private scene: Scene;
    private ballMesh: Mesh;
    private updateCounter: number = 0;

    private trailMeshes: Mesh[] = [];
    private trailPositions: Vector3[] = [];
    private maxTrailLength: number = 8;

    constructor(scene: Scene, ballMesh: Mesh) 
    {
        this.scene = scene;
        this.ballMesh = ballMesh;
    }

    updateEffects()
    {
         this.updateCounter++;
        //position actuel de la balle -> traine
        this.trailPositions.push(this.ballMesh.position.clone());

        if (this.trailPositions.length > this.maxTrailLength) {
            this.trailPositions.shift(); // Supprimer la plus ancienne valeur
        }
        this.createTrail();
    }

    private createTrail(): void {

        this.trailMeshes.forEach((mesh) => {
            if (mesh.material) (mesh.material as StandardMaterial).dispose();
            mesh.dispose();
        });
        this.trailMeshes = [];
        
       //(blanc/gris )
        const baseTrailColor = new Color3(0.8, 0.9, 1.0);
        const ballRadius = this.ballMesh.getBoundingInfo().boundingSphere.radius;
        this.trailPositions.forEach((position, index) => {
            const ageRatio = index / (this.trailPositions.length - 1); // 0 = plus ancien, 1 = plus récent
            const trailSphereRadius = ballRadius - (1 - ageRatio) * (ballRadius * 0.4);
            
            
            // Transparence de 0  a 0.8
            const alpha = ageRatio * 0.8;

            if (alpha > 0.05) { 
                const trailSphereDiameter = trailSphereRadius * 2; 
                const trailSphere = MeshBuilder.CreateSphere(
                    `ballTrail_${index}_${this.updateCounter}`, 
                    {diameter: trailSphereDiameter }, 
                    this.scene
                );
                
                trailSphere.position = position.clone();
                
                // Matériau pour la traînée (dégradé de la couleur de base vers le blanc)
                const trailMaterial = new StandardMaterial(`trailMat_${index}_${this.updateCounter}`, this.scene);
                
                // Dégradé de la couleur de base vers le blanc
                const colorIntensity = ageRatio;
                const whiteIntensity = 1 - ageRatio;
                
                const red = whiteIntensity + colorIntensity * baseTrailColor.r;
                const green = whiteIntensity + colorIntensity * baseTrailColor.g;
                const blue = whiteIntensity + colorIntensity * baseTrailColor.b;
                
                // Intensité lumineuse et transparence
                trailMaterial.emissiveColor = new Color3(red, green, blue).scale(alpha * 1.5);
                trailMaterial.diffuseColor = new Color3(red, green, blue).scale(alpha * 1.0);
                trailMaterial.alpha = alpha;
                
                trailSphere.material = trailMaterial;
                this.trailMeshes.push(trailSphere);
                
            }
        });

    }

    public dispose(): void {
        this.trailMeshes.forEach(mesh => {
            if (mesh.material) (mesh.material as StandardMaterial).dispose();
            mesh.dispose();
        });
        this.trailMeshes = [];
        this.trailPositions = [];
    }
}