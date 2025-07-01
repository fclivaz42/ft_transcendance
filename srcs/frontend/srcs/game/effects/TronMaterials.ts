import { Scene } from "@babylonjs/core/scene.js";
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial.js";
import { Color3, Color4 } from "@babylonjs/core/Maths/math.color.js";
import { Texture } from "@babylonjs/core/Materials/Textures/texture.js";
import { GlowLayer } from "@babylonjs/core/Layers/glowLayer.js";
import { Mesh } from "@babylonjs/core/Meshes/mesh.js";

export class TronMaterials {
    private static instance: TronMaterials;
    private glowLayer: GlowLayer;
    
    // Palettes de couleurs Tron
    public static readonly COLORS = {
        CYAN: new Color3(0, 1, 1),
        MAGENTA: new Color3(1, 0, 1), 
        GREEN: new Color3(0, 1, 0),
        ORANGE: new Color3(1, 0.5, 0),
        BLUE: new Color3(0, 0.5, 1),
        YELLOW: new Color3(1, 1, 0),
        WHITE: new Color3(1, 1, 1),
        RED: new Color3(1, 0, 0)
    };

    constructor(private scene: Scene) {
        TronMaterials.instance = this;
        
        // Créer ou récupérer la couche de glow
        this.glowLayer = this.scene.getGlowLayerByName("gameGlow") || 
                        new GlowLayer("gameGlow", this.scene);
        this.glowLayer.intensity = 1.5;
    }

    public static getInstance(scene?: Scene): TronMaterials {
        if (!TronMaterials.instance && scene) {
            return new TronMaterials(scene);
        }
        return TronMaterials.instance;
    }

    /**
     * Crée un matériau Tron avec effet de glow
     */
    public createTronMaterial(name: string, color: Color3, options?: {
        emissiveIntensity?: number;
        alpha?: number;
        addToGlow?: boolean;
    }): StandardMaterial {
        const opts = {
            emissiveIntensity: 1.0,
            alpha: 1.0,
            addToGlow: true,
            ...options
        };

        const material = new StandardMaterial(name, this.scene);
        
        // Configuration Tron
        material.emissiveColor = color.scale(opts.emissiveIntensity);
        material.diffuseColor = new Color3(0, 0, 0); // Pas de diffusion
        material.specularColor = color.scale(0.3); // Légère spécularité
        material.ambientColor = color.scale(0.1);
        material.alpha = opts.alpha;
        
        // Désactiver le backface culling pour voir les faces intérieures
        material.backFaceCulling = false;
        
        return material;
    }

    /**
     * Applique un style Tron à un mesh avec contours lumineux
     */
    public applyTronStyle(mesh: Mesh, color: Color3, options?: {
        edgeWidth?: number;
        emissiveIntensity?: number;
        alpha?: number;
        addToGlow?: boolean;
    }): void {
        const opts = {
            edgeWidth: 5.0,
            emissiveIntensity: 1.0,
            alpha: 0.3,
            addToGlow: true,
            ...options
        };

        // Créer le matériau
        const material = this.createTronMaterial(`${mesh.name}_tron`, color, {
            emissiveIntensity: opts.emissiveIntensity,
            alpha: opts.alpha
        });
        mesh.material = material;

        // Activer les contours
        mesh.enableEdgesRendering();
        mesh.edgesWidth = opts.edgeWidth;
        mesh.edgesColor = new Color4(color.r, color.g, color.b, 1);

        // Ajouter au glow
        if (opts.addToGlow) {
            this.glowLayer.addIncludedOnlyMesh(mesh);
        }
    }

    /**
     * Style spécial pour la balle
     */
    public applyBallStyle(mesh: Mesh): void {
        this.applyTronStyle(mesh, TronMaterials.COLORS.WHITE, {
            edgeWidth: 8.0,
            emissiveIntensity: 1.5,
            alpha: 0.7
        });

        // Animation de pulsation pour la balle
        this.addPulseAnimation(mesh);
    }

    /**
     * Style pour les paddles avec couleurs différentes
     */
    public applyPaddleStyle(mesh: Mesh, playerNumber: 1 | 2): void {
        const color = playerNumber === 1 ? TronMaterials.COLORS.CYAN : TronMaterials.COLORS.MAGENTA;
        
        this.applyTronStyle(mesh, color, {
            edgeWidth: 6.0,
            emissiveIntensity: 1.2,
            alpha: 0.2
        });
    }

    /**
     * Style pour les murs
     */
    public applyWallStyle(mesh: Mesh): void {
        this.applyTronStyle(mesh, TronMaterials.COLORS.GREEN, {
            edgeWidth: 4.0,
            emissiveIntensity: 0.8,
            alpha: 0.1
        });
    }

    /**
     * Ajoute une animation de pulsation
     */
    private addPulseAnimation(mesh: Mesh): void {
        this.scene.registerBeforeRender(() => {
            const time = this.scene.getEngine().getTimeInFrames() * 0.05;
            const pulse = Math.sin(time) * 0.3 + 1.0;
            
            if (mesh.material && mesh.material instanceof StandardMaterial) {
                mesh.material.emissiveColor = TronMaterials.COLORS.WHITE.scale(pulse);
            }
            
            // Varier la largeur des contours
            mesh.edgesWidth = 8.0 + Math.sin(time) * 2.0;
        });
    }

    /**
     * Crée un matériau de grille Tron pour le sol
     */
    public createGridMaterial(name: string): StandardMaterial {
        const material = new StandardMaterial(name, this.scene);
        
        // Créer une texture de grille procédurale
        const gridTexture = this.createGridTexture(`${name}_grid`);
        material.diffuseTexture = gridTexture;
        material.emissiveTexture = gridTexture;
        
        material.emissiveColor = TronMaterials.COLORS.CYAN.scale(0.5);
        material.alpha = 0.3;
        
        return material;
    }

    /**
     * Crée une texture de grille procédurale
     */
    private createGridTexture(name: string): Texture {
        // Pour l'instant, on retourne une texture basique
        // TODO: Implémenter une texture de grille procédurale
        const texture = new Texture("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==", this.scene);
        texture.name = name;
        return texture;
    }

    /**
     * Met à jour l'intensité du glow
     */
    public setGlowIntensity(intensity: number): void {
        this.glowLayer.intensity = intensity;
    }

    /**
     * Active/désactive l'effet de glow
     */
    public setGlowEnabled(enabled: boolean): void {
        this.glowLayer.setEnabled(enabled);
    }

    /**
     * Nettoie les ressources
     */
    public dispose(): void {
        this.glowLayer.dispose();
    }
}
