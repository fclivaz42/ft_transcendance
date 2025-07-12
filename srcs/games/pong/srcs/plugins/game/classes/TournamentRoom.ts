import GameRoom from "./GameRoom.ts";
import PlayerSession from "./PlayerSession.ts";


export default class TournamentRoom extends GameRoom {
    constructor(
        id: string,
        vsAI: boolean = false,
        onGameOver?: (roomId: string) => void
    ) {
        super(id, vsAI, onGameOver);
    }
}