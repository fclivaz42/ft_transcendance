
import { Scene } from "@babylonjs/core/scene.js";
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial.js";
import { Color3 } from "@babylonjs/core/Maths/math.color.js";
import { CreateBox } from "@babylonjs/core/Meshes/Builders/boxBuilder.js";
import { Mesh } from "@babylonjs/core/Meshes/mesh.js";
import { TransformNode } from "@babylonjs/core/Meshes/transformNode.js";

export interface GridTronConfig 
{
    gameWidth: number;
    gameHeight: number;
    gameReferenceZ: number;
    gridTotalDepth: number;
    gridSize: number;
    lineWidth: number;
    emissiveColor: Color3;
}

// --- Classe pour créer les lignes de la grille, sur les axes X, Y et Z ---

class GridLineCreator 
{
    private scene: Scene;
    private material: StandardMaterial;
    private parent: TransformNode;
    private lineWidth: number;
    private meshes: Mesh[] = [];

    constructor(scene: Scene, material: StandardMaterial, parent: TransformNode, lineWidth: number)
    {
        this.scene = scene;
        this.material = material;
        this.parent = parent;
        this.lineWidth = lineWidth;
    }

    public createLineX(name: string, width: number, y: number, z: number, overrideMaterial?: StandardMaterial): void 
    {
        const line = CreateBox(name, {
            width: width,
            height: this.lineWidth,
            depth: this.lineWidth
        }, this.scene);
        line.position.set(0, y, z);
        line.material = overrideMaterial || this.material;
        line.parent = this.parent;
        this.meshes.push(line);
    }

    public createLineY(name: string, height: number, x: number, z: number, overrideMaterial?: StandardMaterial): void 
    {
        const line = CreateBox(name, {
            width: this.lineWidth,
            height: height,
            depth: this.lineWidth
        }, this.scene);
        line.position.set(x, 0, z);
        line.material = overrideMaterial || this.material;
        line.parent = this.parent;
        this.meshes.push(line);
    }

    public createLineZ(name: string, depth: number, x: number, y: number, overrideMaterial?: StandardMaterial): void {
        const line = CreateBox(name, {
            width: this.lineWidth,
            height: this.lineWidth,
            depth: depth
        }, this.scene);
        line.position.set(x, y, 0);
        line.material = overrideMaterial || this.material;
        line.parent = this.parent;
        this.meshes.push(line);
    }

    public getMeshes(): Mesh[] {
        return this.meshes;
    }
}

// --- Grille ---
export class GridTron 
{
    private gridMeshes: Mesh[] = [];
    private gridParent: TransformNode | null = null;
    private gridMaterial!: StandardMaterial;

    constructor(private scene: Scene, private config: GridTronConfig) 
    {
        this.setupMaterial();
    }

    private setupMaterial(): void 
    {
        this.gridMaterial = new StandardMaterial("gridMaterial", this.scene);
        this.gridMaterial.disableLighting = true;
        this.gridMaterial.emissiveColor = this.config.emissiveColor;
    }


    public create(): void 
    {
        this.gridParent = new TransformNode("gridParent", this.scene);
        this.gridParent.position.set(0, 0, this.config.gameReferenceZ);

        const floorYPos = -this.config.gameHeight / 2;
        const ceilingYPos = this.config.gameHeight / 2;
        const leftWallXPos = -this.config.gameWidth / 2;
        const rightWallXPos = this.config.gameWidth / 2;

        const xPositions = this.generateAlignedPositions(this.config.gameWidth, this.config.gridSize, -this.config.gameWidth / 2);
        const yPositions = this.generateAlignedPositions(this.config.gameHeight, this.config.gridSize, -this.config.gameHeight / 2);
        const zPositions = this.generateAlignedPositions(this.config.gridTotalDepth, this.config.gridSize, -this.config.gridTotalDepth / 2);

        const lineCreator = new GridLineCreator(this.scene, this.gridMaterial, this.gridParent, this.config.lineWidth);

        this.createFloorGrid(floorYPos, xPositions, zPositions, lineCreator);
        this.createCeilingGrid(ceilingYPos, xPositions, zPositions, lineCreator);
        this.createLeftWallGrid(leftWallXPos, yPositions, zPositions, lineCreator); 
        this.createRightWallGrid(rightWallXPos, yPositions, zPositions, lineCreator);

        this.gridMeshes = lineCreator.getMeshes();
    }

    ////////////////////utils

    /**
     * Génère des positions régulièrement espacées pour une longueur donnée.
     * @param totalLength Longueur totale de l'axe (ex: gameWidth, gameHeight, gridTotalDepth).
     * @param step Taille de l'espacement entre chaque ligne (gridSize).
     * @param startOffset Décalage de départ (ex: -gameWidth/2 pour centrer à 0).
     * @returns Un tableau de positions.
     */
    private generateAlignedPositions(totalLength: number, step: number, startOffset: number): number[] 
    {
        const positions: number[] = [];
        const numSegments = Math.floor(totalLength / step + Math.min(1, totalLength / step) * 1e-6);
        const effectiveStep = totalLength / numSegments;

        for (let i = 0; i <= numSegments; i++) {
            const pos = startOffset + i * effectiveStep;
            positions.push(pos);
        }
        return positions;
    }

    private createFloorGrid(floorYPos: number, xPositions: number[], zPositions: number[], lineCreator: GridLineCreator): void 
    {
        for (const z of zPositions) {
            lineCreator.createLineX(`gridFloorLineX_${z}`, this.config.gameWidth, floorYPos, z);
        }
        for (const x of xPositions) {
            lineCreator.createLineZ(`gridFloorLineZ_${x}`, this.config.gridTotalDepth, x, floorYPos);
        }
    }

    private createCeilingGrid(ceilingYPos: number, xPositions: number[], zPositions: number[], lineCreator: GridLineCreator): void {
        for (const z of zPositions) {
            lineCreator.createLineX(`gridCeilingLineX_${z}`, this.config.gameWidth, ceilingYPos, z);
        }
        for (const x of xPositions) {
            lineCreator.createLineZ(`gridCeilingLineZ_${x}`, this.config.gridTotalDepth, x, ceilingYPos);
        }
    }

    // Retour à la version originale sans coloration de débogage
    private createLeftWallGrid(leftWallXPos: number, yPositions: number[], zPositions: number[], lineCreator: GridLineCreator): void 
    {
        // Lignes horizontales (parallèles à Z)
        for (const y of yPositions) {
            lineCreator.createLineZ(`gridWallLeftLineZ_H_${y}`, this.config.gridTotalDepth, leftWallXPos, y);
        }

        // Lignes verticales (parallèles à Y)
        for (const z of zPositions) {
            lineCreator.createLineY(`gridWallLeftLineY_V_${z}`, this.config.gameHeight, leftWallXPos, z);
        }
    }

    private createRightWallGrid(rightWallXPos: number, yPositions: number[], zPositions: number[], lineCreator: GridLineCreator): void 
    {
        for (const y of yPositions) {
            lineCreator.createLineZ(`gridWallRightLineZ_H_${y}`, this.config.gridTotalDepth, rightWallXPos, y);
        }
        for (const z of zPositions) {
            lineCreator.createLineY(`gridWallRightLineY_V_${z}`, this.config.gameHeight, rightWallXPos, z);
        }
    }


    public dispose(): void {
        if (this.gridParent) {
            this.gridParent.dispose();
            this.gridParent = null;
        }
        this.gridMeshes = [];
        if (this.gridMaterial) {
            this.gridMaterial.dispose();
        }

    }

    public show(): void {
        if (this.gridParent) {
            this.gridParent.setEnabled(true);
        }
    }

    public hide(): void {
        if (this.gridParent) {
            this.gridParent.setEnabled(false);
        }
    }

    public setOpacity(opacity: number): void {
        if (this.gridMaterial) {
            this.gridMaterial.alpha = opacity;
            this.gridMaterial.transparencyMode = StandardMaterial.MATERIAL_ALPHABLEND;
        }
    }

    public setColor(color: Color3): void {
        if (this.gridMaterial) {
            this.gridMaterial.emissiveColor = color;
        }
    }

    public setColorRGB(r: number, g: number, b: number): void {
        this.setColor(new Color3(r, g, b));
    }
}