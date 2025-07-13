import GameRoom from "./GameRoom.ts";
import PlayerSession from "./PlayerSession.ts";
import TournamentLobby from "./TournamentLobby.ts";
import {
	BallUpdate,
	PaddleUpdate,
	PaddleInit,
	UpdatePayload,
	InitPayload,
	CollisionPayload,
	ConnectedPlayers,
} from "./GameRoom.ts";

interface TournamentScore {
	p1: number;
	p2: number;
	round: number;
}
// TournamentPlayerConnected
interface TournamentPlayerConnected {
	type: "tournament-connect";
	payload: {
		playerID: string;
		roomID: string;
		lobbyID: string;
	};
}

interface TournamentPlayerDisconnected {
	type: "tournament-disconnect";
	payload: {
		playerID: string;
		lobbyID: string;
	};
}

// TournamentScoreUpdatePayload
interface TournamentScoreUpdatePayload {
	type: "tournament-score";
	payload: {
		score: TournamentScore;
	};
}

interface TournamentMatchOverPayload {
	type: "tournament-match-over";
	payload: {
		winner: string;
		loser: string;
		final_score: TournamentScore;
	};
}

interface TournamentOverPayload {
	type: "tournament-over";
	payload: {
		winner: string;
		lobbyID: string;
	};
}

type TournamentMessage =
	| InitPayload
	| UpdatePayload
	| TournamentPlayerConnected
	| TournamentPlayerDisconnected
	| CollisionPayload
	| TournamentScoreUpdatePayload
	| TournamentMatchOverPayload
	| TournamentOverPayload;

export default class TournamentRoom extends GameRoom {
	private lobby: TournamentLobby;
	constructor(
		id: string,
		lobby: TournamentLobby,
		vsAI: boolean = false,
		onGameOver?: (roomId: string) => void
	) {
		super(id, vsAI, onGameOver);
		this.lobby = lobby;
	}

	public getScore
}


