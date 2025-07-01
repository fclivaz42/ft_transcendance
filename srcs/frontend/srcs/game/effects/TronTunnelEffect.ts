import { Scene } from "@babylonjs/core/scene.js";
import { Mesh } from "@babylonjs/core/Meshes/mesh.js";
import { CreateBox } from "@babylonjs/core/Meshes/Builders/boxBuilder.js";
import { Vector3 } from "@babylonjs/core/Maths/math.vector.js";
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial.js";
import { Color3, Color4 } from "@babylonjs/core/Maths/math.color.js";
import { Animation } from "@babylonjs/core/Animations/animation.js";
import { GlowLayer } from "@babylonjs/core/Layers/glowLayer.js";

export interface TunnelConfig {
    segmentCount: number;
    maxDepth: number;
    segmentSpacing: number;
    initialSize: number;
    shrinkFactor: number;
    speed: number;
    glowIntensity: number;
}

export class TronTunnelEffect {
    private tunnelSegments: Mesh[] = [];
    private glowLayer: GlowLayer;
    private animationSpeed: number = 1.0;
    private config: TunnelConfig;

    constructor(private scene: Scene, config?: Partial<TunnelConfig>) {
        // Configuration par défaut
        this.config = {
            segmentCount: 25,
            maxDepth: 50,
            segmentSpacing: 2,
            initialSize: 18,
            shrinkFactor: 0.95,
            speed: 0.1,
            glowIntensity: 1.2,
            ...config
        };

        // Créer la couche de glow pour l'effet Tron
        this.glowLayer = new GlowLayer("tunnelGlow", this.scene);
        this.glowLayer.intensity = this.config.glowIntensity;
        
        this.createTunnelSegments();
        this.startAnimation();
    }

    private createTunnelSegments(): void {
        for (let i = 0; i < this.config.segmentCount; i++) {
            this.createTunnelSegment(i);
        }
    }

    private createTunnelSegment(index: number): void {
        const z = -index * this.config.segmentSpacing;
        const size = this.config.initialSize * Math.pow(this.config.shrinkFactor, index);
        
        // Créer les 4 bordures du rectangle
        const segments = this.createRectangleBorders(index, size, z);
        this.tunnelSegments.push(...segments);
    }

    private createRectangleBorders(index: number, size: number, z: number): Mesh[] {
        const segments: Mesh[] = [];
        const thickness = 0.1;
        const height = size * 0.6; // Ratio d'aspect du terrain de jeu
        const width = size;

        // Couleurs Tron cycliques
        const colors = [
            new Color3(0, 1, 1),    // Cyan
            new Color3(1, 0, 1),    // Magenta  
            new Color3(0, 1, 0),    // Vert
            new Color3(1, 0.5, 0),  // Orange
        ];
        const color = colors[index % colors.length];

        // Bordure haute
        const topBorder = CreateBox(`tunnel_top_${index}`, {
            width: width,
            height: thickness,
            depth: thickness
        }, this.scene);
        topBorder.position = new Vector3(0, height / 2, z);
        
        // Bordure basse
        const bottomBorder = CreateBox(`tunnel_bottom_${index}`, {
            width: width,
            height: thickness,
            depth: thickness
        }, this.scene);
        bottomBorder.position = new Vector3(0, -height / 2, z);
        
        // Bordure gauche
        const leftBorder = CreateBox(`tunnel_left_${index}`, {
            width: thickness,
            height: height,
            depth: thickness
        }, this.scene);
        leftBorder.position = new Vector3(-width / 2, 0, z);
        
        // Bordure droite
        const rightBorder = CreateBox(`tunnel_right_${index}`, {
            width: thickness,
            height: height,
            depth: thickness
        }, this.scene);
        rightBorder.position = new Vector3(width / 2, 0, z);

        const borders = [topBorder, bottomBorder, leftBorder, rightBorder];

        // Appliquer le matériau Tron à chaque bordure
        borders.forEach(border => {
            const material = this.createTronMaterial(`tunnel_mat_${index}`, color);
            border.material = material;
            
            // Activer les contours lumineux
            border.enableEdgesRendering();
            border.edgesWidth = 3.0;
            border.edgesColor = new Color4(color.r, color.g, color.b, 1);
            
            // Ajouter au glow layer
            this.glowLayer.addIncludedOnlyMesh(border);
            
            segments.push(border);
        });

        return segments;
    }

    private createTronMaterial(name: string, color: Color3): StandardMaterial {
        const material = new StandardMaterial(name, this.scene);
        
        // Configuration Tron : émissif brillant, pas de diffusion
        material.emissiveColor = color;
        material.diffuseColor = new Color3(0, 0, 0);
        material.specularColor = new Color3(0, 0, 0);
        material.ambientColor = color.scale(0.3);
        
        // Transparence pour l'effet de glow
        material.alpha = 0.8;
        
        return material;
    }

    private startAnimation(): void {
        // Animation en boucle qui fait avancer les segments
        this.scene.registerBeforeRender(() => {
            this.updateTunnelMovement();
        });
    }

    private updateTunnelMovement(): void {
        // Faire avancer tous les segments vers la caméra
        this.tunnelSegments.forEach((segment, index) => {
            segment.position.z += this.config.speed * this.animationSpeed;
            
            // Recycler les segments qui dépassent
            if (segment.position.z > 5) {
                // Replacer le segment au fond
                const segmentIndex = Math.floor(index / 4); // 4 bordures par segment
                const newZ = -this.config.segmentCount * this.config.segmentSpacing;
                segment.position.z = newZ;
                
                // Recalculer la taille
                const newSize = this.config.initialSize * Math.pow(this.config.shrinkFactor, this.config.segmentCount);
                this.updateSegmentSize(segment, newSize, segmentIndex);
            }
        });
    }

    private updateSegmentSize(segment: Mesh, size: number, segmentIndex: number): void {
        const height = size * 0.6;
        const width = size;
        const name = segment.name;
        
        if (name.includes('top') || name.includes('bottom')) {
            segment.scaling = new Vector3(width / this.config.initialSize, 1, 1);
        } else {
            segment.scaling = new Vector3(1, height / (this.config.initialSize * 0.6), 1);
        }
    }

    // Méthodes publiques pour contrôler l'effet
    public setSpeed(speed: number): void {
        this.animationSpeed = speed;
    }

    public setGlowIntensity(intensity: number): void {
        this.glowLayer.intensity = intensity;
    }

    public dispose(): void {
        this.tunnelSegments.forEach(segment => segment.dispose());
        this.glowLayer.dispose();
        this.tunnelSegments = [];
    }

    // Synchroniser avec l'angle de la caméra
    public updateCameraSync(alpha: number, beta: number): void {
        // Ajuster l'orientation du tunnel selon la caméra
        const rotationY = alpha * 0.1; // Facteur d'atténuation
        const rotationX = (beta - Math.PI / 2) * 0.1;
        
        this.tunnelSegments.forEach(segment => {
            segment.rotation.y = rotationY;
            segment.rotation.x = rotationX;
        });
    }
}
