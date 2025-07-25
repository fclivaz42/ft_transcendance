import PlayerSession from "./PlayerSession";

export default class Matchup {
    constructor(
        public round: number,
        public matchIndex: number,
        public p1: PlayerSession | null,
        public p2: PlayerSession | null,
        public scoreP1: number = 0,
        public scoreP2: number = 0
    ) {}

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