import GameRoom from "./GameRoom.ts";
import PlayerSession from "./PlayerSession.ts";
import RoomManager from "./RoomManager.ts";

type GameMode = "tournament";

export default class TournamentManager extends RoomManager {
	private _waitingSessions: PlayerSession[] = [];
	private _tournamentStarted: boolean = false;
	private _tournamentTimer: NodeJS.Timeout | null = null;
	private _launchCountdown: NodeJS.Timeout | null = null;

	private readonly MAX_PLAYERS = 8;
	private readonly WAIT_TIME_MS = 60000;
	private readonly LAUNCH_COUNTDOWN_MS = 5000;

	public assignTournamentPlayer(session: PlayerSession) {
        
        if (this._tournamentStarted) {
            session.getSocket()?.close();
            // set up full Tournament logic, I guess it's ok if it's like a live event?
            // Maybe a message in front end Tournament started by a player X let's goo!
            return;
        }

        this._waitingSessions.push(session);
        this.addSession(session);

        console.log(`Player ${session.getUserId()} joined tournament (${this._waitingSessions.length}/8)`);


        if (this._waitingSessions.length === 1) {
            this._startWaitTimer();
        }

        if (this._waitingSessions.length === this.MAX_PLAYERS) {
            this._clearWaitTimer();
            this._startCountdownToLaunch();
        }
    }

    private _fillAI(count: number = 0) {
        if (count === this.MAX_PLAYERS) return;

        const aiSession = new PlayerSession(null, `AI_${count}`);
        this._waitingSessions.push(aiSession);
        this._fillAI(count + 1);
    }

    private _startWaitTimer() {
        if (this._tournamentTimer) return;

        console.log(`Starting ${this.WAIT_TIME_MS / 1000}s tournament fill timer`);
        this._tournamentTimer = setTimeout(() => {
            if (this._waitingSessions.length !== this.MAX_PLAYERS) {
                console.log("Filling with AI");
                this._fillAI();
                this._startCountdownToLaunch();
            }
        }, this.WAIT_TIME_MS);
    }

    private _startCountdownToLaunch() {
        if (this._launchCountdown) return;

        console.log(`Starting matches in ${this.LAUNCH_COUNTDOWN_MS / 1000}s.`);
        this._launchCountdown = setTimeout(() => {
            this._launchTournament();
        }, this.LAUNCH_COUNTDOWN_MS);
    }

    private _simulate(p1: PlayerSession, p2: PlayerSession) {
        if (!(p1.isAI && p2.isAI)) return;

        // pick random winner, set score 6 to winner
        // set score 1 - 5 for loser
        // return JSON with score
    }

    private _handleAIRoom(p1: PlayerSession, p2: PlayerSession) {

        const room = this.createRoom(true)

        if (!p1.isAI) {
            room.addPlayer(p1);
        } else if (!p2.isAI) {
            room.addPlayer(p2, true);
        } else {
            console.warn("Unexpected: both players are AI in _handleAIRoom");
        }
    }

    private _launchTournament() {
        this._tournamentStarted = true;
        this._clearLaunchCountdown();

        console.log("Launching tournament with players:", this._waitingSessions.map(s => s.getUserId()));
        const shuffled = this._shuffle(this._waitingSessions);

        for (let i = 0; i < shuffled.length; i += 2) {
            const player1 = shuffled[i];
            const player2 = shuffled[i + 1];
            
            if (player1.isAI && player2.isAI)
                this._simulate(player1, player2);
            else if (player1.isAI || player2.isAI)
                this._handleAIRoom(player1, player2);
            else {
                const room = this.createRoom();
                room.lock = true;
                room.addPlayer(player1);
                room.addPlayer(player2);
            }
        }

    }

    private _clearWaitTimer() {
        if (this._tournamentTimer) {
            clearTimeout(this._tournamentTimer);
            this._tournamentTimer = null;
        }
    }

    private _clearLaunchCountdown() {
        if (this._launchCountdown) {
            clearTimeout(this._launchCountdown);
            this._launchCountdown= null;
        }
    }

}
