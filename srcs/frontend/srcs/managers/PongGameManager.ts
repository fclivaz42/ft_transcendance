
import { Engine } from "@babylonjs/core/Engines/engine.js";

import { WebSocketManager } from "../game/WebSocketManager.js";
import { GameField } from "../game/GameField.js";
import { createPongCanvas } from "../components/frame/framePong.js";
import { frameManager } from "./FrameManager.js";
import { CloseSocket, GameOverPayload, IgnoreSocket, InitPayload, PingRequestPayload, PingResponsePayload, PlayerConnectedPayload, PlayerDisconnectedPayload, TournamentBracketStatusPayload, TournamentMatchOverPayload, TournamentMatchStatus, TournamentOverPayload } from "../game/types.js";
import UserHandler from "../handlers/UserHandler.js";
import createUserAvatar from "../components/usermenu/userAvatar.js";
import { Users } from "../interfaces/Users.js";
import { createPongGameoverDialog } from "../components/dialog/pongGameover/index.js";
import RoutingHandler from "../handlers/RoutingHandler.js";
import { createBracketComponent, createBracketDialog } from "../components/backdropDialog/bracketDialog.js";
import BackdropDialog from "../class/BackdropDialog.js";

import AudioManager from "./AudioManager.js";
import NotificationManager from "./NotificationManager.js";
import { i18nHandler } from "../handlers/i18nHandler.js";

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
	private audioManager: AudioManager | null | undefined;
	private engine: Engine | undefined;
	private field: GameField | undefined;
	private started: boolean = false;
	private frontElements: frontElements | undefined;
	private websocketManager: WebSocketManager | undefined;
	private pingInterval: {
		lastCheck: number | undefined;
		ping: number | undefined;
		sentPing: number | undefined;
	} = { ping: undefined, sentPing: undefined, lastCheck: undefined };
	private users: Record<"p1" | "p2", Users | undefined> = {
		p1: undefined,
		p2: undefined
	}
	private dialogRef: BackdropDialog | undefined;

	private bracket: TournamentMatchStatus[] | undefined;

	public calculatePing() {
		if (this.pingInterval.sentPing === undefined) {
			if (!this.websocketManager || !this.websocketManager.socketInstance)
				throw new Error("WebSocketManager or socket is not initialized.");
			this.pingInterval.sentPing = Date.now();
			this.websocketManager.socketInstance.send("ping!");
			return;
		}
		this.pingInterval.ping = Date.now() - this.pingInterval.sentPing;
		const pingRequest: PingRequestPayload = {
			type: "pingRequest",
			payload: { value: this.pingInterval.ping }
		}
		this.websocketManager?.socketInstance.send(JSON.stringify(pingRequest));
		this.pingInterval.sentPing = undefined;
		const pingElements = document.querySelectorAll<HTMLSpanElement>("[data-pong-ping]");
		for (const element of pingElements) {
			const identifier = element.getAttribute("data-pong-ping");
			if (this.getPlayers[identifier! as "p1" | "p2"]?.PlayerID! === UserHandler.userId)
				element.textContent = `${this.pingInterval.ping}ms`;
		}
	}

	public onPingResponse(update: PingResponsePayload["payload"]) {
		this.pingInterval.ping = update.value;
		const pingElements = document.querySelectorAll<HTMLSpanElement>("[data-pong-ping]");
		for (const element of pingElements) {
			const identifier = element.getAttribute("data-pong-ping");
			if (this.getPlayers[identifier! as "p1" | "p2"]?.PlayerID !== UserHandler.userId)
				element.textContent = `${this.pingInterval.ping}ms`;
		}
	}

	public reset() {
		this.started = false;
		this.cleanupGame();
		this.websocketManager?.close();
		this.engine?.dispose();
	}

	public resetGameField() {
		if (!this.engine)
			throw new Error("Engine is not initialized.");
		for (const scene of this.engine.scenes)
			scene.dispose();
		this.engine.scenes.length = 0;
		this.field?.grid?.dispose(); // Nettoyage spécifique du GridTron
		this.field?.scene.dispose();
		this.field = new GameField(this.engine);
	}

	private async initializeFrontElements(payload: InitPayload["payload"]) {
		this.resetGameField();
		let botIdx = 0;
		this.getFrontElements.canvasContainer.querySelectorAll("[data-pong-displayname]").forEach(async (element) => {
			const identifier = element.getAttribute("data-pong-displayname");
			if (!identifier || !(identifier in payload)) throw new Error(`Identifier ${identifier} not found in payload.`);
			const playerData = identifier === "p1" ? payload.connectedPlayers.p1 : payload.connectedPlayers.p2;
			const avatarElement = this.getFrontElements.canvasContainer.querySelector<HTMLImageElement>(`[data-pong-avatar="${identifier}"]`);
			avatarElement?.setAttribute("data-pong-avatar", identifier);
			const aiElement = this.getFrontElements.canvasContainer.querySelector(`[data-pong-bot="${identifier}"]`);
			for (const score of this.getFrontElements.scoreElement.children) {
				if (score instanceof HTMLSpanElement) continue;
				score.textContent = "0";
			}
			const user = UserHandler.fetchUser(playerData);
			user.then(async (userData) => {
				this.users[identifier as "p1" | "p2"] = userData;
				if (!userData) throw new Error(`User data for ${identifier} not found.`);
				element.textContent = userData.DisplayName;
				const newAvatar = createUserAvatar({ playerId: userData.PlayerID, sizeClass: "lg:w-20 lg:h-20 w-14 h-14" });
				newAvatar.setAttribute("data-pong-avatar", identifier);
				avatarElement?.replaceWith(newAvatar);
				if (userData.isBot) {
					aiElement?.classList.remove("hidden");
				} else {
					aiElement?.classList.add("hidden");
				}
			}).catch((error) => {
				console.error(`Error fetching user data for ${identifier}:`, error);
				element.textContent = "Unknown User";
			});
		});
	}

	public async initialize(addr: string) {
		this.reset();
		const canvasContainer = await createPongCanvas();
		this.frontElements = {
			canvasContainer: canvasContainer,
			canvas: enforceDefined(canvasContainer.querySelector<HTMLCanvasElement>("canvas"), "Canvas element not found in the container.") as HTMLCanvasElement,
			scoreElement: enforceDefined(canvasContainer.querySelector<HTMLSpanElement>("#score"), "Score element not found in the container.") as HTMLSpanElement
		}
		this.engine = new Engine(this.getFrontElements.canvas, true);
		this.field = new GameField(this.engine);

		this.audioManager = AudioManager.getInstance();
		if (!this.audioManager) {
			this.audioManager = new AudioManager();
		}
		const resumeAudioOnInteraction = async () => {
			document.removeEventListener('click', resumeAudioOnInteraction);
			document.removeEventListener('keypress', resumeAudioOnInteraction);
			await this.audioManager?.unmuteAll();
			if (this.audioManager) {
				this.audioManager.playBackgroundMusic();
			}
		};
		document.addEventListener('click', resumeAudioOnInteraction, { once: true });
		document.addEventListener('keypress', resumeAudioOnInteraction, { once: true });



		this.websocketManager = new WebSocketManager(
			(payload) => {
				this.dialogRef?.close();
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
			(payload) => this.getField.update(payload), (payload) => {
				if (payload.collider === "player1" || payload.collider === "player2") {
					this.audioManager?.playPaddleHit();
				}
				else if (payload.collider === "westWall" || payload.collider === "eastWall") {
					this.audioManager?.playMissedSound();
				}
				else {
					this.audioManager?.playWallBounce();
				}
			}, addr
		);
		window.addEventListener("resize", () => {
			this.getEngine.resize();
		});
	}

	private cleanupGame() {
		this.bracket = undefined;
		this.dialogRef?.close();
		if (this.frontElements)
			for (const element of Object.values(this.frontElements))
				if (element) element.remove();
		this.frontElements = undefined;
		if (this.audioManager) {
			this.audioManager.dispose();
			this.audioManager = undefined;
		}
		this.pingInterval = {
			ping: undefined,
			sentPing: undefined,
			lastCheck: undefined
		}
	}

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

	private get getFrontElements(): frontElements {
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

	public onSocketClose(message: CloseSocket["message"]) {
		let notificationMessage: string;
		switch (message) {
			case "RoomID not found":
				notificationMessage = "pong.join.error.roomNotFound";
				break;
			default:
				notificationMessage = "notification.pong.socketClose";
				break;
		}
		RoutingHandler.setRoute("/", false);
		NotificationManager.notify({
			message: i18nHandler.getValue(notificationMessage || "notification.generic.errorMessage"),
			level: "error",
		});
	}

	public async onUserDisconnect(payload: PlayerDisconnectedPayload["payload"]) {
		const player = await UserHandler.fetchUser(payload.playerID);
		if (!player) return;

		NotificationManager.notify({
			message: i18nHandler.getValue("notification.pong.userDisconnected").replace("{user}", player.DisplayName),
			level: "info",
		});
	}

	public get getPlayers(): Record<"p1" | "p2", Users | undefined> {
		if (!this.users)
			throw new Error("Users are not initialized.");
		return this.users;
	}

	public get getBracket(): TournamentMatchStatus[] {
		if (!this.bracket)
			throw new Error("Bracket is not initialized.");
		return this.bracket;
	}

	public onGameOver(payload: GameOverPayload["payload"]) {
		const winner = this.users[payload.winner as "p1" | "p2"];
		if (!winner) {
			console.error("Winner not found in users:", payload.winner);
			return;
		}
		this.dialogRef = createPongGameoverDialog(payload, this.users);
	}

	public onBracketUpdate(update: TournamentBracketStatusPayload["payload"]) {
		if (!this.bracket)
			this.dialogRef = createBracketDialog(update);
		else {
			const bracketElement = document.getElementById("pong-tournament-bracket");
			if (bracketElement)
				bracketElement.replaceWith(createBracketComponent(update));
		}
		this.bracket = update;

	}

	public onTournamentMatchOver(update: TournamentMatchOverPayload["payload"]) {
		this.bracket = update.bracket;
		this.dialogRef = createBracketDialog(update.bracket, update.winner === UserHandler.userId ? "waitingnext" : "lost", update.winner);
	}

	public onConnect(payload: PlayerConnectedPayload["payload"]) {
		if (RoutingHandler.searchParams.get("room") !== "host")
			return;
		RoutingHandler.url.searchParams.set("room", payload.roomID);
		RoutingHandler.updateUrl();
		const pongRoomCode = document.querySelector<HTMLInputElement>("#pong-room-code");
		if (!pongRoomCode)
			throw new Error("Pong room code input not found.");
		const input = pongRoomCode.querySelector("#pong-room-code-input") as HTMLInputElement;
		if (!input)
			throw new Error("Pong room code input element not found.");
		input.value = payload.roomID;
		pongRoomCode.classList.replace("hidden", "flex");
	}

	public onTournamentOver(payload: TournamentOverPayload["payload"]) {
		this.dialogRef = createBracketDialog(this.getBracket, "final", payload.winner);
	};

	public onIgnored(message: IgnoreSocket["message"]) {
		RoutingHandler.setRoute("/", false);
		NotificationManager.notify({
			message: i18nHandler.getValue("notification.pong.ignored"),
			level: "warning",
		});
	}
}

export default new PongGameManager();
