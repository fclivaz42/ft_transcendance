import PlayerSession from "./PlayerSession.ts";

export default class Matchup {
    public round: number;
    public matchIndex: number;
    public p1: PlayerSession | null;
    public p2: PlayerSession | null;
    public scoreP1: number = 0;
    public scoreP2: number = 0;
    constructor(
        round: number,
        matchIndex: number,
        p1: PlayerSession | null,
        p2: PlayerSession | null,
        scoreP1: number = 0,
        scoreP2: number = 0
    ) {
        this.round = round;
        this.matchIndex = matchIndex;
        this.p1 = p1;
        this.p2 = p2;
        this.scoreP1 = scoreP1;
        this.scoreP2 = scoreP2;
    }

    public isComplete(): boolean {
        return this.scoreP1 > 0 || this.scoreP2 > 0;
    }

    public getWinner(): PlayerSession | null {
        if (this.scoreP1 > this.scoreP2) return this.p1;
        if (this.scoreP2 > this.scoreP1) return this.p2;
        return null;
    }

    public getLoser(): PlayerSession | null {
        if (this.scoreP1 < this.scoreP2) return this.p1;
        if (this.scoreP2 < this.scoreP1) return this.p2;
        return null;
    }
}