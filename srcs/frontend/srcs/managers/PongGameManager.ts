// // WebSocketManager est configuré pour renvoyer les informations de collision à PongGameManager, qui, à son tour, utilise l'audioManager pour jouer le son approprié.
// import { Engine } from "@babylonjs/core/Engines/engine.js";

// import { InitHandler, WebSocketManager } from "../game/WebSocketManager.js";
// import { GameField } from "../game/GameField.js";
// import { createPongCanvas } from "../components/frame/framePong.js";
// import { frameManager } from "./FrameManager.js";
// import { InitPayload, CollisionPayload } from "../game/types.js";
// import UserHandler from "../handlers/UserHandler.js";
// import { i18nHandler } from "../handlers/i18nHandler.js";
// import createUserAvatar from "../components/usermenu/userAvatar.js";

// import AudioManager from "./audioManager.js";

// function enforceDefined<T>(value: T | undefined, message: string): T {
// 	if (!value)
// 		throw new Error(message);
// 	return value;
// }

// interface frontElements {
// 	canvasContainer: HTMLDivElement;
// 	canvas: HTMLCanvasElement;
// 	scoreElement: HTMLSpanElement;
// }

// class PongGameManager {
// 	private engine: Engine | undefined;
// 	private field: GameField | undefined;
// 	private started: boolean = false;
// 	private frontElements: frontElements | undefined;
// 	private websocketManager: WebSocketManager | undefined;
// 	private audioManager: AudioManager | undefined;
// 	private pingInterval: {
// 		lastCheck: number | undefined;
// 		ping: number | undefined;
// 		sentPing: number | undefined;
// 	} = {ping: undefined, sentPing: undefined, lastCheck: undefined};

// 	public calculatePing() {
// 		if (this.pingInterval.sentPing === undefined) {
// 			if (!this.websocketManager || !this.websocketManager.socketInstance)
// 				throw new Error("WebSocketManager or socket is not initialized.");
// 			this.pingInterval.sentPing = Date.now();
// 			this.websocketManager.socketInstance.send("ping!");
// 			return;
// 		}
// 		this.pingInterval.ping = Date.now() - this.pingInterval.sentPing;
// 		// TODO: send ping to server
// 		/*this.websocketManager?.socketInstance.send(JSON.stringify({
// 			type: "ping",
// 			payload: {
// 				ping: this.pingInterval.ping
// 			}
// 		}));*/
// 		this.pingInterval.sentPing = undefined;
// 		const pingElemens = document.querySelectorAll<HTMLSpanElement>("[data-pong-ping]");
// 		for (const element of pingElemens) {
// 			// TODO: differentiate between players
// 			element.textContent = `${this.pingInterval.ping}ms`;
// 		}
// 	}

// 	public reset() {
// 		if (this.started) {
// 			this.started = false;
// 			this.cleanupGame();
// 			this.websocketManager?.close();
// 			this.engine?.dispose();
// 		}
// 	}

// 	// private async initializeFrontElements(payload: InitPayload["payload"]) {
// 	// 	this.getFrontElements.canvasContainer.querySelectorAll("[data-pong-displayname]").forEach((element) => {
// 	// 		const identifier = element.getAttribute("data-pong-displayname");
// 	// 		if (!identifier || !(identifier in payload)) throw new Error(`Identifier ${identifier} not found in payload.`);
// 	// 		const playerData = identifier === "p1" ? payload.connectedPlayers.p1 : payload.connectedPlayers.p2;
// 	// 		const avatarElement = this.getFrontElements.canvasContainer.querySelector<HTMLImageElement>(`[data-pong-avatar="${identifier}"]`);
// 	// 		if (playerData === undefined) {
// 	// 			avatarElement?.replaceWith(await createUserAvatar({isComputer: true, sizeClass: "lg:w-20 lg:h-20 w-14 h-14"}));
// 	// 			element.textContent = i18nHandler.getValue("pong.computer") || "Computer";
// 	// 			return;
// 	// 		}
// 	// 		const user = UserHandler.fetchUser(playerData);
// 	// 		user.then(async (userData) => {
// 	// 			if (!userData) throw new Error(`User data for ${identifier} not found.`);
// 	// 			element.textContent = userData.DisplayName;
// 	// 			avatarElement?.replaceWith(await createUserAvatar({playerId: userData.PlayerID, sizeClass: "lg:w-20 lg:h-20 w-14 h-14"}));
// 	// 		}).catch((error) => {
// 	// 			console.error(`Error fetching user data for ${identifier}:`, error);
// 	// 			element.textContent = "Unknown User";
// 	// 		});
// 	// 	});
// 	// }


// 	private async initializeFrontElements(payload: InitPayload["payload"]) {
// 		const displaynameElements = this.getFrontElements.canvasContainer.querySelectorAll("[data-pong-displayname]");
// 		for (const element of displaynameElements) {
// 			const identifier = element.getAttribute("data-pong-displayname");
// 			if (!identifier || !(identifier in payload)) throw new Error(`Identifier ${identifier} not found in payload.`);
// 			const playerData = identifier === "p1" ? payload.connectedPlayers.p1 : payload.connectedPlayers.p2;
// 			const avatarElement = this.getFrontElements.canvasContainer.querySelector<HTMLImageElement>(`[data-pong-avatar="${identifier}"]`);
// 			if (playerData === undefined) {
// 				avatarElement?.replaceWith(await createUserAvatar({isComputer: true, sizeClass: "lg:w-20 lg:h-20 w-14 h-14"}));
// 				element.textContent = i18nHandler.getValue("pong.computer") || "Computer";
// 				continue; 
// 			}
// 			try {
// 				const userData = await UserHandler.fetchUser(playerData);
// 				if (!userData) {
// 					// Si userData est null/undefined, lancez une erreur ou gérez-le gracieusement
// 					throw new Error(`User data for ${identifier} not found.`);
// 				}
// 				element.textContent = userData.DisplayName;
// 				avatarElement?.replaceWith(await createUserAvatar({playerId: userData.PlayerID, sizeClass: "lg:w-20 lg:h-20 w-14 h-14"}));
// 			} catch (error) {
// 				// Gestion des erreurs si la récupération des données utilisateur échoue
// 				console.error(`Error fetching user data for ${identifier}:`, error);
// 				element.textContent = "Unknown User";
// 			}
// 		}
// 	}

// 	public async initialize(addr: string) {
// 		this.reset();
// 		const canvasContainer = await createPongCanvas(addr.includes("computer"));
// 		this.frontElements = {
// 			canvasContainer: canvasContainer,
// 			canvas: enforceDefined(canvasContainer.querySelector<HTMLCanvasElement>("canvas"), "Canvas element not found in the container.") as HTMLCanvasElement,
// 			scoreElement: enforceDefined(canvasContainer.querySelector<HTMLSpanElement>("#score"), "Score element not found in the container.") as HTMLSpanElement
// 		}
// 		this.engine = new Engine(this.getFrontElements.canvas, true);
// 		this.field = new GameField(this.engine);
		

// 		// 🎵 1. RÉCUPÉRER L'INSTANCE PRÉCHARGÉE
// 		this.audioManager = AudioManager.getInstance();
// 		if (!this.audioManager) {
// 			console.warn("⚠️ AudioManager non préchargé - sons désactivés");
// 		}

// 		// 🔓 2. DÉBLOQUER L'AUDIO (restrictions navigateur)
// 		const enableAudio = () => {
// 			this.audioManager?.unmuteAll();
// 			document.removeEventListener('click', enableAudio);
// 		};
// 		document.addEventListener('click', enableAudio, { once: true });

// 		// 🌐 3. WEBSOCKET AVEC SONS SIMPLIFIÉS
// 		this.websocketManager = new WebSocketManager(
// 			(payload) => {
// 				// Init du jeu
// 				this.initializeFrontElements(payload);
// 				this.getField.init(payload);
// 				if (!this.started) {
// 					// 🎵 Son de début de partie
// 					this.audioManager?.playSound("gamestart");
// 					this.started = true;
// 					// ... reste de l'init
// 				}
// 			},
// 			(payload) => this.getField.update(payload),
// 			(payload) => {
// 				// 🎵 SONS DE COLLISION SIMPLIFIÉS
// 				if (payload.collider.includes("player") || payload.collider.includes("p")) {
// 					// Son de raquette avec intensité basée sur la collision
// 					this.audioManager?.playPaddleHit(1.0);
// 				} else {
// 					// Son de mur avec vélocité
// 					this.audioManager?.playWallBounce(0.8);
// 				}
// 			},
// 			 addr
// 		);
		
// 		// Passer l'AudioManager au WebSocketManager 
// 		if (this.audioManager) {
// 			this.websocketManager.setAudioManager(this.audioManager);
// 		}

// 		window.addEventListener("resize", () => {
// 			this.getEngine.resize();
// 		});
// 	}

// 	private cleanupGame() {
// 		// 🔇 Arrêter tous les sons lors du nettoyage
// 		this.audioManager?.stopAllSounds();
		
// 		if (this.frontElements)
// 				for (const element of Object.values(this.frontElements))
// 					if (element) element.remove();
// 		this.frontElements = undefined;
// 		// this.audioManager = undefined; c'est singleton-> arreter le son avec audiomanager
// 		this.pingInterval = {
// 			ping: undefined,
// 			sentPing: undefined,
// 			lastCheck: undefined
// 		}
// 	}

// 	// // Méthode pour jouer un fichier audio directement avec HTML5
// 	// private playDirectAudioFile(url: string, name: string): void {
// 	// 	try {
			
// 	// 		// Supprimer l'ancien audio s'il existe
// 	// 		const existingAudio = document.getElementById(`direct-audio-${name}`) as HTMLAudioElement;
// 	// 		if (existingAudio) {
// 	// 			existingAudio.remove();
// 	// 		}

// 	// 		// Créer un nouvel élément audio HTML5
// 	// 		const audio = document.createElement('audio');
// 	// 		audio.id = `direct-audio-${name}`;
// 	// 		audio.src = url;
// 	// 		audio.volume = 0.7;
// 	// 		audio.preload = 'auto';

// 	// 		// Ajouter les listeners d'événements
// 	// 		audio.onloadstart = () => console.log(`📥 Début du chargement: ${name}`);
// 	// 		audio.onloadeddata = () => console.log(`✅ Données chargées: ${name}`);
// 	// 		audio.oncanplay = () => console.log(`▶️ Prêt à jouer: ${name}`);
// 	// 		audio.onplay = () => console.log(`🎵 Lecture démarrée: ${name}`);
// 	// 		audio.onended = () => console.log(`🏁 Lecture terminée: ${name}`);
// 	// 		audio.onerror = (e) => console.error(`❌ Erreur audio pour ${name}:`, e);

// 	// 		// Ajouter à la page et jouer
// 	// 		document.body.appendChild(audio);
			
// 	// 		audio.play()
// 	// 			.then(() => console.log(`✅ Audio joué avec succès: ${name}`))
// 	// 			.catch(error => console.error(`❌ Erreur lors de la lecture de ${name}:`, error));

// 	// 	} catch (error) {
// 	// 		console.error(`❌ Erreur création audio ${name}:`, error);
// 	// 	}
// 	// }

	

// 	private get getEngine(): Engine {
// 		if (!this.engine)
// 			throw new Error("Engine is not initialized.");
// 		return this.engine;
// 	}

// 	private get getField(): GameField {
// 		if (!this.field)
// 			throw new Error("GameField is not initialized.");
// 		return this.field;
// 	}

// 	private get getFrontElements(): frontElements{
// 		if (!this.frontElements)
// 			throw new Error("Front elements are not initialized.");
// 		return this.frontElements;
// 	}

// 	public onScoreUpdate(score: Record<string, number>) {
// 		for (const element of this.getFrontElements.scoreElement.children) {
// 			const identifier = element.getAttribute("data-score");
// 			if (!identifier || !(identifier in score)) continue;
// 			const updatedScore = score[identifier].toString();
// 			if (element.textContent === updatedScore) continue;
// 			window.requestAnimationFrame(() => {
// 					element.classList.add("animate-slide-up-fade");
// 					element.textContent = updatedScore;
// 					setTimeout(() => {
// 							element.classList.remove("animate-slide-up-fade");
// 					}, 1000);
// 			});
// 		}
// 	}
// }

// export default new PongGameManager();
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

		// 🔊 Activer l'audio après première interaction utilisateur
		const enableAudio = () => {
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
		

				if (payload.collider === "player1" || payload.collider === "player2" || 
					payload.collider === "p1" || payload.collider === "p2") {
					// 🏓 Son de raquette
					this.playPaddleCollisionSound();
				} else {
					// 🧱 Son de mur
					this.playWallCollisionSound();
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
		
		this.pingInterval = {
			ping: undefined,
			sentPing: undefined,
			lastCheck: undefined
		}
	}

	// Méthode pour jouer un fichier audio directement avec HTML5
	private playDirectAudioFile(url: string, name: string): void {
		try {
			
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

	// Fonction pour jouer le son de collision raquette
	private playPaddleCollisionSound(): void {

		this.playDirectAudioFile("/assets/sounds/punch.mp3", "paddle-collision");
	}

	// 🧱 Fonction pour jouer le son de collision mur  
	private playWallCollisionSound(): void {

		this.playDirectAudioFile("/assets/sounds/bounce.mp3", "wall-collision");
	}

	// // 🎵 Fonction pour test manuel du son raquette (équivalent triggerPaddleWitness sans visuel)
	// private testPaddleSound(): void {
	// 	this.playDirectAudioFile("/assets/sounds/punch.mp3", "paddle-test");
	// }

	// // 🎵 Fonction pour test manuel du son mur (équivalent triggerWallWitness sans visuel)
	// private testWallSound(): void {
	// 	this.playDirectAudioFile("/assets/sounds/bounce.mp3", "wall-test");
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