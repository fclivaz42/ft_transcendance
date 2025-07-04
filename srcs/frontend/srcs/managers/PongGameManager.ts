import { Engine } from "@babylonjs/core/Engines/engine.js";

import { InitHandler, WebSocketManager } from "../game/WebSocketManager.js";
import { GameField } from "../game/GameField.js";
import { createPongCanvas } from "../components/frame/framePong.js";
import { frameManager } from "./FrameManager.js";
import { InitPayload, CollisionPayload } from "../game/types.js";
import UserHandler from "../handlers/UserHandler.js";
import { i18nHandler } from "../handlers/i18nHandler.js";
import AudioManager from "./audioManager.js";

function enforceDefined<T>(value: T | undefined, message: string): T {
	if (!value)
		throw new Error(message);
	return value;
}

interface frontElements {
	canvasContainer: HTMLDivElement;
	canvas: HTMLCanvasElement;
	scoreElement: HTMLSpanElement;
}

class PongGameManager {
	private engine: Engine | undefined;
	private field: GameField | undefined;
	private started: boolean = false;
	private frontElements: frontElements | undefined;
	private websocketManager: WebSocketManager | undefined;
	private audioManager: AudioManager | undefined;
	private pingInterval: {
		lastCheck: number | undefined;
		ping: number | undefined;
		sentPing: number | undefined;
	} = {ping: undefined, sentPing: undefined, lastCheck: undefined};

	public calculatePing() {
		if (this.pingInterval.sentPing === undefined) {
			if (!this.websocketManager || !this.websocketManager.socketInstance)
				throw new Error("WebSocketManager or socket is not initialized.");
			this.pingInterval.sentPing = Date.now();
			this.websocketManager.socketInstance.send("ping!");
			return;
		}
		this.pingInterval.ping = Date.now() - this.pingInterval.sentPing;
		// TODO: send ping to server
		/*this.websocketManager?.socketInstance.send(JSON.stringify({
			type: "ping",
			payload: {
				ping: this.pingInterval.ping
			}
		}));*/
		this.pingInterval.sentPing = undefined;
		const pingElemens = document.querySelectorAll<HTMLSpanElement>("[data-pong-ping]");
		for (const element of pingElemens) {
			// TODO: differentiate between players
			element.textContent = `${this.pingInterval.ping}ms`;
		}
	}

	public reset() {
		if (this.started) {
			this.started = false;
			this.cleanupGame();
			if (this.engine)
				this.engine.dispose();
		}
	}

	private async initializeFrontElements(payload: InitPayload["payload"]) {
		this.getFrontElements.canvasContainer.querySelectorAll("[data-pong-displayname]").forEach((element) => {
			const identifier = element.getAttribute("data-pong-displayname");
			if (!identifier || !(identifier in payload)) throw new Error(`Identifier ${identifier} not found in payload.`);
			const playerData = identifier === "p1" ? payload.connectedPlayers.p1 : payload.connectedPlayers.p2;
			const avatarElement = this.getFrontElements.canvasContainer.querySelector<HTMLImageElement>(`[data-pong-avatar="${identifier}"]`);
			if (playerData === undefined) {
				element.textContent = i18nHandler.getValue("pong.computer") || "Computer";
				if (avatarElement)
					avatarElement.src = "/assets/images/computer-virus-1-svgrepo-com.svg";
				return;
			}
			const user = UserHandler.fetchUser(playerData);
			user.then(async (userData) => {
				if (!userData) throw new Error(`User data for ${identifier} not found.`);
				element.textContent = userData.DisplayName;
				if (avatarElement)
					avatarElement.src = await UserHandler.fetchUserPicture(userData.PlayerID, userData.DisplayName, userData.Avatar);
			}).catch((error) => {
				console.error(`Error fetching user data for ${identifier}:`, error);
				element.textContent = "Unknown User";
			});
		});
	}

	public initialize(addr: string) {
		this.reset();
		const canvasContainer = createPongCanvas(addr.includes("computer"));
		this.frontElements = {
			canvasContainer: canvasContainer,
			canvas: enforceDefined(canvasContainer.querySelector<HTMLCanvasElement>("canvas"), "Canvas element not found in the container.") as HTMLCanvasElement,
			scoreElement: enforceDefined(canvasContainer.querySelector<HTMLSpanElement>("#score"), "Score element not found in the container.") as HTMLSpanElement
		}
		this.engine = new Engine(this.getFrontElements.canvas, true);
		this.field = new GameField(this.engine);
		
		// Initialiser AudioManager (sans scene Babylon pour les sons)
		this.audioManager = AudioManager.getInstance() || new AudioManager();

		// 🔊 Bouton de test audio pour diagnostiquer
		this.addAudioTestButton();

		// 🔊 Activer l'audio après première interaction utilisateur
		const enableAudio = () => {
			console.log("🎵 Audio activé après interaction utilisateur");
			document.removeEventListener('click', enableAudio);
			document.removeEventListener('keydown', enableAudio);
		};
		document.addEventListener('click', enableAudio, { once: true });
		document.addEventListener('keydown', enableAudio, { once: true });

		if (this.websocketManager)
			this.websocketManager.close();
		this.websocketManager = new WebSocketManager(
			(payload) => {
				console.log("WebSocket payload received:", payload);
				this.initializeFrontElements(payload);
				this.getField.init(payload);
				if (!this.started) {
					frameManager.frameChild = this.getFrontElements.canvasContainer;
					this.getEngine.resize();
					this.started = true;
					
					// 🎵 Pas de musique automatique pour l'instant (on teste d'abord les collisions)
					console.log("� Jeu démarré - sons de collision activés");
					
					this.getEngine.runRenderLoop(() => {
						if (!this.pingInterval.sentPing && (!this.pingInterval.lastCheck || Date.now() - this.pingInterval.lastCheck > 3000)) {
							this.calculatePing();
							this.pingInterval.lastCheck = Date.now();
						}
						if (!this.getField)
							throw new Error("GameField is not initialized.");
						this.getField.scene.render();
					});
				}
			},
			(payload) => this.getField.update(payload),
			(payload) => {
				// 🎯 Handler pour les collisions - PADDLE ET MURS
				console.log("🎾 Collision détectée:", payload.collider);
				if (payload.collider === "player1" || payload.collider === "player2" || payload.collider === "p1" || payload.collider === "p2") {
					// 👁️ Activer le témoin visuel paddle (qui joue aussi le son)
					this.activatePaddleWitness();
				} else {
					// 👁️ Activer le témoin visuel mur (qui joue aussi le son)
					this.activateWallWitness();
				}
			},
			addr
		);
		
		// Passer l'AudioManager au WebSocketManager 
		if (this.audioManager) {
			this.websocketManager.setAudioManager(this.audioManager);
		}

		window.addEventListener("resize", () => {
			this.getEngine.resize();
		});
	}

	private cleanupGame() {
		if (this.frontElements)
				for (const element of Object.values(this.frontElements))
					if (element) element.remove();
		this.frontElements = undefined;
		this.audioManager = undefined;
		this.removeAudioTestButton();
		this.pingInterval = {
			ping: undefined,
			sentPing: undefined,
			lastCheck: undefined
		}
	}

	private addAudioTestButton() {
		// Créer un conteneur pour tous les boutons de test
		const testContainer = document.createElement('div');
		testContainer.id = 'audio-test-container';
		testContainer.style.cssText = `
	 		position: fixed;
            top: 5px; /* Déplace un peu plus haut */
            right: 5px; /* Déplace un peu plus à droite */
            z-index: 9999;
            display: flex;
            flex-direction: column;
            gap: 3px; /* Réduit l'espace entre les boutons */
            max-height: 95vh; /* Peut être augmenté si besoin */
            overflow-y: auto;
            padding: 5px; /* Ajoute un petit padding autour du conteneur */
            background-color: rgba(0, 0, 0, 0.5); /* Pour rendre le conteneur visible et ne pas masquer le contenu derrière */
            border-radius: 5px;
		`;

		// Bouton de test général (beep) - celui qui fonctionne
		const generalTestButton = document.createElement('button');
		generalTestButton.innerHTML = '🔊 Test Beep ✅';
		generalTestButton.style.cssText = this.getButtonStyle('#4CAF50');
		generalTestButton.onclick = () => {
			console.log("🧪 Test beep déclenché");
			// this.playTestBeep();
		};
		// testContainer.appendChild(generalTestButton);

		// Boutons pour tester chaque fichier MP3 individuellement FONCTIONNE
		const audioFiles = [
			{ name: 'bounce', file: 'bounce.mp3', emoji: '🏓' },
			{ name: 'punch', file: 'punch.mp3', emoji: '👊' },
			{ name: 'trailer', file: 'trailer.mp3', emoji: '🎬' },
			{ name: 'background', file: 'background.mp3', emoji: '🎶' },
			{ name: 'gamestart', file: 'gamestart.mp3', emoji: '🎮' },
			{ name: 'cinematic-boom', file: 'cinematic-boom.mp3', emoji: '💥' }
		];

		audioFiles.forEach(audio => {
			const button = document.createElement('button');
			button.innerHTML = `${audio.emoji} ${audio.name}`;
			button.style.cssText = this.getButtonStyle('#2196F3');
			button.onclick = () => {
				console.log(`🧪 Test direct du fichier: ${audio.file}`);
				this.playDirectAudioFile(`/assets/sounds/${audio.file}`, audio.name);
			};
			// testContainer.appendChild(button);
		});

		// Séparateur
		const separator = document.createElement('div');
		separator.style.cssText = 'height: 1px; background: #666; margin: 10px 0; width: 100%;';
		// testContainer.appendChild(separator);

		// Titre pour les tests HTML5 Audio via AudioManager
		const html5Title = document.createElement('div');
		html5Title.innerHTML = '� Tests AudioManager HTML5';
		html5Title.style.cssText = 'color: white; font-weight: bold; text-align: center; margin: 5px 0;';
		// testContainer.appendChild(html5Title);

		// Boutons pour tester les sons via AudioManager HTML5
		// const audioManagerSounds = [
		// 	{ name: 'paddleHit', emoji: '🏓', description: 'Paddle Hit' },
		// 	{ name: 'wallBounce', emoji: '🧱', description: 'Wall Bounce' },
		// 	{ name: 'gameStart', emoji: '🎮', description: 'Game Start' },
		// 	{ name: 'backgroundMusic', emoji: '🎶', description: 'Background' },
		// 	{ name: 'punch', emoji: '👊', description: 'Punch' },
		// 	{ name: 'trailer', emoji: '🎬', description: 'Trailer' },
		// 	{ name: 'cinematicBoom', emoji: '💥', description: 'Cinematic Boom' }
		// ];

		// audioManagerSounds.forEach(sound => {
		// 	const button = document.createElement('button');
		// 	button.innerHTML = `${sound.emoji} ${sound.description}`;
		// 	button.style.cssText = this.getButtonStyle('#4CAF50');
		// 	button.onclick = async () => {
		// 		console.log(`🧪 Test AudioManager HTML5: ${sound.name}`);
		// 		const result = await this.audioManager?.testHtml5Sound(sound.name);
		// 		console.log(`Résultat: ${result}`);
				
		// 		// Afficher le résultat temporairement sur le bouton
		// 		const originalText = button.innerHTML;
		// 		button.innerHTML = result?.includes('✅') ? '✅ OK' : '❌ Fail';
		// 		setTimeout(() => {
		// 			button.innerHTML = originalText;
		// 		}, 1500);
		// 	};
		// 	testContainer.appendChild(button);
		// });

		// Bouton pour arrêter tous les sons
		const stopButton = document.createElement('button');
		stopButton.innerHTML = '⏹️ Stop All';
		stopButton.style.cssText = this.getButtonStyle('#f44336');
		stopButton.onclick = () => {
			console.log("🧪 Arrêt de tous les sons");
			this.audioManager?.stopAllSounds();
			// Arrêter aussi les sons HTML5 directs
			document.querySelectorAll('audio').forEach(audio => {
				audio.pause();
				audio.remove();
			});
		};
		// testContainer.appendChild(stopButton);

		// Bouton pour afficher les infos des pools
		const infoButton = document.createElement('button');
		infoButton.innerHTML = '📊 Pool Info';
		infoButton.style.cssText = this.getButtonStyle('#9C27B0');
		infoButton.onclick = () => {
			console.log("🧪 Informations des pools:");
			const info = this.audioManager?.getPoolInfo();
			console.log(info);
		};
		// testContainer.appendChild(infoButton);

		// Séparateur pour les boutons témoins
		const witnessSeperator = document.createElement('div');
		witnessSeperator.style.cssText = 'height: 1px; background: #666; margin: 10px 0; width: 100%;';
		// testContainer.appendChild(witnessSeperator);

		// Titre pour les boutons témoins
		const witnessTitle = document.createElement('div');
		witnessTitle.innerHTML = '👁️ Témoins Collisions';
		witnessTitle.style.cssText = 'color: white; font-weight: bold; text-align: center; margin: 5px 0;';
		// testContainer.appendChild(witnessTitle);

		// Explication des témoins
		const witnessExplanation = document.createElement('div');
		witnessExplanation.innerHTML = 'Ces boutons s\'activent automatiquement lors des collisions WebSocket et jouent le son correspondant. Vous pouvez aussi les cliquer pour tester.';
		witnessExplanation.style.cssText = 'color: #ccc; font-size: 11px; text-align: center; margin: 5px 0; padding: 0 10px; line-height: 1.3;';
		// testContainer.appendChild(witnessExplanation);

		// Bouton témoin pour collisions paddle
		const paddleWitnessButton = document.createElement('button');
		paddleWitnessButton.id = 'paddle-collision-witness';
		paddleWitnessButton.innerHTML = '🏓 Paddle (click to test)';
		paddleWitnessButton.style.cssText = this.getWitnessButtonStyle('#666', false);
		paddleWitnessButton.onclick = () => {
			// Test manuel pour voir l'effet visuel ET auditif
			this.triggerPaddleWitness();
		};
		// testContainer.appendChild(paddleWitnessButton);

		// Bouton témoin pour collisions mur
		const wallWitnessButton = document.createElement('button');
		wallWitnessButton.id = 'wall-collision-witness';
		wallWitnessButton.innerHTML = '🧱 Wall (click to test)';
		wallWitnessButton.style.cssText = this.getWitnessButtonStyle('#666', false);
		wallWitnessButton.onclick = () => {
			// Test manuel pour voir l'effet visuel ET auditif
			this.triggerWallWitness();
		};
		// testContainer.appendChild(wallWitnessButton);
		
		document.body.appendChild(testContainer);
	}

	// Méthode pour jouer un fichier audio directement avec HTML5
	private playDirectAudioFile(url: string, name: string): void {
		try {
			console.log(`🎵 Tentative de lecture directe: ${url}`);
			
			// Supprimer l'ancien audio s'il existe
			const existingAudio = document.getElementById(`direct-audio-${name}`) as HTMLAudioElement;
			if (existingAudio) {
				existingAudio.remove();
			}

			// Créer un nouvel élément audio HTML5
			const audio = document.createElement('audio');
			audio.id = `direct-audio-${name}`;
			audio.src = url;
			audio.volume = 0.7;
			audio.preload = 'auto';

			// Ajouter les listeners d'événements
			audio.onloadstart = () => console.log(`📥 Début du chargement: ${name}`);
			audio.onloadeddata = () => console.log(`✅ Données chargées: ${name}`);
			audio.oncanplay = () => console.log(`▶️ Prêt à jouer: ${name}`);
			audio.onplay = () => console.log(`🎵 Lecture démarrée: ${name}`);
			audio.onended = () => console.log(`🏁 Lecture terminée: ${name}`);
			audio.onerror = (e) => console.error(`❌ Erreur audio pour ${name}:`, e);

			// Ajouter à la page et jouer
			document.body.appendChild(audio);
			
			audio.play()
				.then(() => console.log(`✅ Audio joué avec succès: ${name}`))
				.catch(error => console.error(`❌ Erreur lors de la lecture de ${name}:`, error));

		} catch (error) {
			console.error(`❌ Erreur création audio ${name}:`, error);
		}
	}

	private getButtonStyle(color: string): string {
		return `
			padding: 4px 6px;
			background: ${color};
			color: white;
			border: none;
			border-radius: 3px;
			cursor: pointer;
			font-size: 9px;
			min-width: 30px;
			text-align: center;
		`;
	}

	private getWitnessButtonStyle(color: string, isActive: boolean): string {
		return `
			padding: 5px 8px;
			background: ${color};
			color: white;
			border: ${isActive ? '2px solid #fff' : '1px solid #444'};
			border-radius: 4px;
			cursor: pointer;
			font-size: ${isActive ? '10px' : '9px'};
			font-weight: ${isActive ? 'bold' : 'normal'};
			min-width: 40px;
			text-align: center;
			box-shadow: ${isActive ? '0 0 15px rgba(255,255,255,0.6), inset 0 0 8px rgba(255,255,255,0.2)' : '0 1px 2px rgba(0,0,0,0.3)'};
			transition: all 0.2s ease;
			transform: ${isActive ? 'scale(1.05)' : 'scale(1.0)'};
			text-shadow: ${isActive ? '0 0 5px rgba(255,255,255,0.6)' : 'none'};
		`;
	}

	// Méthode pour déclencher visuellement le témoin paddle (pour test manuel)
	private triggerPaddleWitness(): void {
		const button = document.getElementById('paddle-collision-witness');
		if (button) {
			console.log("🧪 Test manuel du témoin paddle");
			// 🎨 Effet visuel plus évident
			button.style.cssText = this.getWitnessButtonStyle('#00FF00', true); // Vert brillant
			button.innerHTML = '🏓 PADDLE HIT! 💥';
			
			// 🎵 Jouer le son punch avec la méthode qui fonctionne
			console.log("🎵 🏓 Test manuel paddle - jouer punch.mp3");
			this.playDirectAudioFile("/assets/sounds/punch.mp3", "paddle-test");
			
			setTimeout(() => {
				button.style.cssText = this.getWitnessButtonStyle('#666', false);
				button.innerHTML = '🏓 Paddle (click to test)';
			}, 800);
		}
	}

	// Méthode pour déclencher visuellement le témoin mur (pour test manuel)
	private triggerWallWitness(): void {
		const button = document.getElementById('wall-collision-witness');
		if (button) {
			console.log("🧪 Test manuel du témoin mur");
			// 🎨 Effet visuel plus évident
			button.style.cssText = this.getWitnessButtonStyle('#FF4500', true); // Orange brillant
			button.innerHTML = '🧱 WALL HIT! 💥';
			
			// 🎵 Jouer le son bounce avec la méthode qui fonctionne
			console.log("🎵 🧱 Test manuel mur - jouer bounce.mp3");
			this.playDirectAudioFile("/assets/sounds/bounce.mp3", "wall-test");
			
			setTimeout(() => {
				button.style.cssText = this.getWitnessButtonStyle('#666', false);
				button.innerHTML = '🧱 Wall (click to test)';
			}, 800);
		}
	}

	// Méthode pour déclencher le témoin paddle lors d'une vraie collision
	private activatePaddleWitness(): void {
		const button = document.getElementById('paddle-collision-witness');
		if (button) {
			console.log("👁️ 🏓 Témoin paddle activé par collision WebSocket");
			// 🎨 Effet visuel plus évident pour les vraies collisions
			button.style.cssText = this.getWitnessButtonStyle('#00FF00', true); // Vert brillant
			button.innerHTML = '🏓 PADDLE HIT! 💥';
			
			// 🎵 Jouer le son punch avec la méthode qui fonctionne
			console.log("🎵 🏓 COLLISION PADDLE RÉELLE - jouer punch.mp3");
			this.playDirectAudioFile("/assets/sounds/punch.mp3", "paddle-collision");
			
			setTimeout(() => {
				button.style.cssText = this.getWitnessButtonStyle('#666', false);
				button.innerHTML = '🏓 Paddle (click to test)';
			}, 600);
		}
	}

	// Méthode pour déclencher le témoin mur lors d'une vraie collision
	private activateWallWitness(): void {
		const button = document.getElementById('wall-collision-witness');
		if (button) {
			console.log("👁️ 🧱 Témoin mur activé par collision WebSocket");
			// 🎨 Effet visuel plus évident pour les vraies collisions
			button.style.cssText = this.getWitnessButtonStyle('#FF4500', true); // Orange brillant
			button.innerHTML = '🧱 WALL HIT! 💥';
			
			// 🎵 Jouer le son bounce avec la méthode qui fonctionne
			console.log("🎵 🧱 COLLISION MUR RÉELLE - jouer bounce.mp3");
			this.playDirectAudioFile("/assets/sounds/bounce.mp3", "wall-collision");
			
			setTimeout(() => {
				button.style.cssText = this.getWitnessButtonStyle('#666', false);
				button.innerHTML = '🧱 Wall (click to test)';
			}, 600);
		}
	}

	private removeAudioTestButton() {
		const testContainer = document.getElementById('audio-test-container');
		if (testContainer) {
			testContainer.remove();
		}
	}

	// private playTestBeep() {
	// 	// Créer un son simple avec Web Audio API pour tester
	// 	try {
	// 		const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
	// 		const oscillator = audioContext.createOscillator();
	// 		const gainNode = audioContext.createGain();
			
	// 		oscillator.connect(gainNode);
	// 		gainNode.connect(audioContext.destination);
			
	// 		oscillator.frequency.value = 800; // 800 Hz
	// 		oscillator.type = 'sine';
			
	// 		gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
	// 		gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
			
	// 		oscillator.start(audioContext.currentTime);
	// 		oscillator.stop(audioContext.currentTime + 0.2);
			
	// 		console.log("🎵 Beep généré programmatiquement");
	// 	} catch (error) {
	// 		console.error("❌ Erreur lors de la génération du beep:", error);
	// 	}
	// }

	private get getEngine(): Engine {
		if (!this.engine)
			throw new Error("Engine is not initialized.");
		return this.engine;
	}

	private get getField(): GameField {
		if (!this.field)
			throw new Error("GameField is not initialized.");
		return this.field;
	}

	private get getFrontElements(): frontElements{
		if (!this.frontElements)
			throw new Error("Front elements are not initialized.");
		return this.frontElements;
	}

	public onScoreUpdate(score: Record<string, number>) {
		for (const element of this.getFrontElements.scoreElement.children) {
			const identifier = element.getAttribute("data-score");
			if (!identifier || !(identifier in score)) continue;
			const updatedScore = score[identifier].toString();
			if (element.textContent === updatedScore) continue;
			window.requestAnimationFrame(() => {
					element.classList.add("animate-slide-up-fade");
					element.textContent = updatedScore;
					setTimeout(() => {
							element.classList.remove("animate-slide-up-fade");
					}, 1000);
			});
		}
	}
}

export default new PongGameManager();
