import PlayerSession from "./PlayerSession";
import TournamentBracket from "./TournamentBracket";
import TournamentRoom from "./TournamentRoom";
import { MAX_SCORE, TournamentMessage } from "./types";

export default class NewTournamentLobby {
	public lobbyID: string;
	private _players: PlayerSession[] = [];
	private _matchingOpen: boolean = true;
	private _bracket: TournamentBracket | null = null;
	private _tournamentStarted: boolean = false;
	private _waitTimer: NodeJS.Timeout | null = null;
	private _roundTimer: NodeJS.Timeout | null = null;

	private readonly MAX_PLAYERS = 8;
	private readonly WAIT_TIME_MS = 10_000;
	private readonly MATCH_START_COUNTDOWN_MS = 5_000;

	constructor(id: string) {
		this.lobbyID = id;
		this._startWaitTimer();
	}

	private _shuffle<T>(arr: T[]): T[] {
		const copy = [...arr];
		let currentIndex: number = copy.length;

		while (currentIndex !== 0) {
			let randomIndex: number = Math.floor(Math.random() * currentIndex);
			currentIndex--;
			[copy[currentIndex], copy[randomIndex]] = [
				copy[randomIndex],
				copy[currentIndex],
			];
		}
		return copy;
	}

	private _fillAI() {
		const aiNeeded: number = this.MAX_PLAYERS - this._players.length;
		for (var i = 0; i < aiNeeded; i++) {
			const aiSession = new PlayerSession(null, `AI_${i}`);
			aiSession.isAI = true;
			this.addPlayer(aiSession);
		}
	}

	private _startWaitTimer(): void {
		if (this._waitTimer) return;

		console.log(`Starting ${this.WAIT_TIME_MS / 1000}s tournament fill timer`);
		this._waitTimer = setTimeout(() => {
			if (this._players.length !== this.MAX_PLAYERS) {
				console.log("Filling with AI");
				this._fillAI(); // implement
			}
			this._startRoundTimer();
		}, this.WAIT_TIME_MS);
	}

	private _startRoundTimer(): void {
		if (this._roundTimer) return;
		if (!this._bracket) {
			const shuffled = this._shuffle([...this._players]);
			this._bracket = new TournamentBracket(shuffled, this.MAX_PLAYERS);
		}
		this._bracket.broadcastBracket(this); // fix
		console.log(
			`Starting round ${this._bracket.getCurrentRound() + 1} in ${
				this.MATCH_START_COUNTDOWN_MS / 1000
			}s`
		);
		this._roundTimer = setTimeout(() => {
			this._launchTournament(); // implement
		}, this.MATCH_START_COUNTDOWN_MS);
	}

	public isFull(): boolean {
		console.log(`current players in the lobby: ${this._players.length}`);
		return this._players.length >= this.MAX_PLAYERS;
	}

	public isEmpty(): boolean {
		return this._players.length === 0;
	}

	public getMatchingOpen(): boolean {
		return this._matchingOpen;
	}

	public setMatchingOpen(val: boolean): void {
		this._matchingOpen = val;
	}

	public getPlayers(): PlayerSession[] {
		return this._players;
	}

	public addPlayer(playerSession: PlayerSession): void {
		this._players.push(playerSession);
		this.broadcast(this.buildTournamentPlayerConnected(playerSession)); // implement
		console.log(`Player ${playerSession.getUserId()} joined ${this.lobbyID}`);
		console.log(
			`Current Players: ${this._players.length} / ${this.MAX_PLAYERS}`
		);
	}

    public lobbyBroadcast(msg: TournamentMessage) {
        
    }
}
