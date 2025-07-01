import { GameField } from "../GameField.js";

/**
 * Contrôleur pour les effets visuels Tron du jeu
 * Permet d'ajuster les paramètres en temps réel
 */
export class TronEffectsController {
    private gameField: GameField;
    private controlPanel: HTMLDivElement | null = null;

    constructor(gameField: GameField) {
        this.gameField = gameField;
        this.createControlPanel();
    }

    private createControlPanel(): void {
        // Créer un panneau de contrôle compact
        this.controlPanel = document.createElement('div');
        this.controlPanel.id = 'tron-effects-panel';
        this.controlPanel.style.cssText = `
            position: fixed;
            bottom: 10px;
            right: 10px;
            z-index: 9998;
            background: rgba(0, 20, 40, 0.9);
            border: 1px solid #00ffff;
            border-radius: 8px;
            padding: 10px;
            display: flex;
            flex-direction: column;
            gap: 8px;
            min-width: 200px;
            font-family: 'Courier New', monospace;
            font-size: 11px;
            color: #00ffff;
            box-shadow: 0 0 20px rgba(0, 255, 255, 0.3);
        `;

        // Titre
        const title = document.createElement('div');
        title.innerHTML = '⚡ TRON EFFECTS';
        title.style.cssText = `
            font-weight: bold;
            text-align: center;
            margin-bottom: 5px;
            color: #00ffff;
            text-shadow: 0 0 10px #00ffff;
        `;
        this.controlPanel.appendChild(title);

        // Contrôle de vitesse du tunnel
        this.addSliderControl('Tunnel Speed', 'tunnel-speed', 0, 0.5, 0.08, (value) => {
            this.gameField.setTunnelSpeed(value);
        });

        // Contrôle d'intensité du glow
        this.addSliderControl('Glow Intensity', 'glow-intensity', 0, 3, 1.5, (value) => {
            this.gameField.setGlowIntensity(value);
        });

        // Bouton toggle glow
        this.addToggleControl('Enable Glow', 'glow-toggle', true, (enabled) => {
            this.gameField.toggleGlow(enabled);
        });

        // Bouton pour masquer/afficher le panneau
        const toggleButton = document.createElement('button');
        toggleButton.innerHTML = '👁️ Hide';
        toggleButton.style.cssText = `
            background: #004466;
            color: #00ffff;
            border: 1px solid #00ffff;
            border-radius: 4px;
            padding: 4px 8px;
            cursor: pointer;
            font-size: 10px;
            margin-top: 5px;
        `;
        toggleButton.onclick = () => this.togglePanel();
        this.controlPanel.appendChild(toggleButton);

        document.body.appendChild(this.controlPanel);
    }

    private addSliderControl(
        label: string, 
        id: string, 
        min: number, 
        max: number, 
        defaultValue: number, 
        callback: (value: number) => void
    ): void {
        if (!this.controlPanel) return;

        const container = document.createElement('div');
        container.style.cssText = 'display: flex; flex-direction: column; gap: 3px;';

        const labelEl = document.createElement('label');
        labelEl.innerHTML = label;
        labelEl.style.cssText = 'font-size: 10px; color: #00cccc;';

        const slider = document.createElement('input');
        slider.type = 'range';
        slider.id = id;
        slider.min = min.toString();
        slider.max = max.toString();
        slider.step = '0.01';
        slider.value = defaultValue.toString();
        slider.style.cssText = `
            width: 100%;
            height: 4px;
            background: #003366;
            outline: none;
            border-radius: 2px;
        `;

        const valueDisplay = document.createElement('span');
        valueDisplay.innerHTML = defaultValue.toFixed(2);
        valueDisplay.style.cssText = 'font-size: 9px; color: #66ffff; text-align: right;';

        slider.oninput = () => {
            const value = parseFloat(slider.value);
            valueDisplay.innerHTML = value.toFixed(2);
            callback(value);
        };

        container.appendChild(labelEl);
        container.appendChild(slider);
        container.appendChild(valueDisplay);
        this.controlPanel.appendChild(container);
    }

    private addToggleControl(
        label: string, 
        id: string, 
        defaultValue: boolean, 
        callback: (enabled: boolean) => void
    ): void {
        if (!this.controlPanel) return;

        const container = document.createElement('div');
        container.style.cssText = 'display: flex; justify-content: space-between; align-items: center;';

        const labelEl = document.createElement('label');
        labelEl.innerHTML = label;
        labelEl.style.cssText = 'font-size: 10px; color: #00cccc;';

        const toggle = document.createElement('input');
        toggle.type = 'checkbox';
        toggle.id = id;
        toggle.checked = defaultValue;
        toggle.style.cssText = `
            transform: scale(0.8);
            accent-color: #00ffff;
        `;

        toggle.onchange = () => {
            callback(toggle.checked);
        };

        container.appendChild(labelEl);
        container.appendChild(toggle);
        this.controlPanel.appendChild(container);
    }

    private togglePanel(): void {
        if (!this.controlPanel) return;

        const isHidden = this.controlPanel.style.transform === 'translateX(180px)';
        if (isHidden) {
            this.controlPanel.style.transform = 'translateX(0)';
            this.controlPanel.querySelector('button')!.innerHTML = '👁️ Hide';
        } else {
            this.controlPanel.style.transform = 'translateX(180px)';
            this.controlPanel.querySelector('button')!.innerHTML = '👁️ Show';
        }
    }

    public dispose(): void {
        if (this.controlPanel) {
            this.controlPanel.remove();
            this.controlPanel = null;
        }
    }
}
