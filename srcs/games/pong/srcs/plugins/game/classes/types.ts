import { type CameraInitInfo, type LightInitInfo } from "./Playfield.ts";

/* GAME */

export interface BallUpdate {
	// used for game, tournament
	curr_speed: number;
	curr_position: number[];
}

export interface PaddleUpdate {
	// used for game, tournament
	max_speed: number;
	position: number[];
}

export interface RoomScore {
	// used for game
	p1: number;
	p2: number;
}

export interface BallInit extends BallUpdate {
	// used for game, tournament
	size: number[];
}

export interface PaddleInit extends PaddleUpdate {} // used for game, tournament

export interface WallsInit {
	// used for game, tournament
	[key: string]: {
		position: number[];
		size: number[];
		passThrough?: boolean;
	};
}

export interface UpdatePayload {
	// used for game, tournament
	type: "update";
	payload: {
		ball: BallUpdate;
		p1: PaddleUpdate;
		p2: PaddleUpdate;
	};
}

export interface InitPayload {
	// used for game
	type: "init";
	payload: {
		ball: BallInit;
		p1: PaddleInit;
		p2: PaddleInit;
		walls: WallsInit;
		camera: CameraInitInfo;
		light: LightInitInfo;
		roomID: string;
		connectedPlayers: ConnectedPlayers;
	};
}

export interface PlayerConnectedPayload {
	// used for game
	type: "connect";
	payload: {
		playerID: string;
		roomID: string;
	};
}

export interface PlayerDisconnectedPayload {
	// used for game
	type: "disconnect";
	payload: {
		playerID: string;
	};
}

export interface CollisionPayload {
	// used for game, tournament
	type: "collision";
	payload: {
		collider: string;
	};
}

export interface ScoreUpdatePayload {
	// used for game
	type: "score";
	payload: {
		score: RoomScore;
	};
}

export interface GameOverPayload {
	// used for game
	type: "gameover";
	payload: {
		winner: string;
		loser: string;
		final_score: RoomScore;
	};
}

export interface ConnectedPlayers {
	// used for game, tournament
	p1: string | undefined;
	p2: string | undefined;
}

export type GameMessage = // used for game

		| InitPayload
		| UpdatePayload
		| PlayerConnectedPayload
		| PlayerDisconnectedPayload
		| CollisionPayload
		| ScoreUpdatePayload
		| GameOverPayload;

/* TOURNAMENT */

export interface TournamentScore {
	// used for tournament
	p1: number;
	p2: number;
	round: number;
}

export interface TournamentInitPayload {
	// used for tournament
	type: "tournament-init";
	payload: {
		ball: BallInit;
		p1: PaddleInit;
		p2: PaddleInit;
		walls: WallsInit;
		camera: CameraInitInfo;
		light: LightInitInfo;
		roomID: string;
		connectedPlayers: ConnectedPlayers;
	};
}

export interface TournamentPlayerConnected {
	// used for tournament
	type: "tournament-connect";
	payload: {
		playerID: string;
		roomID: string;
		lobbyID: string;
	};
}

export interface TournamentPlayerDisconnected {
	// used for tournament
	type: "tournament-disconnect";
	payload: {
		playerID: string;
		lobbyID: string;
	};
}

export interface TournamentScoreUpdatePayload {
	// used for tournament
	type: "tournament-score";
	payload: {
		score: TournamentScore;
	};
}

export interface TournamentMatchOverPayload {
	// used for tournament
	type: "tournament-match-over";
	payload: {
		winner: string;
		loser: string;
		final_score: TournamentScore;
	};
}

export interface TournamentOverPayload {
	// used for tournament
	type: "tournament-over";
	payload: {
		winner: string;
		lobbyID: string;
	};
}

export interface TournamentMatchStatus {
	round: number;
	matchIndex: number;
	p1: string; //replace by sdk object
	p2: string; //replace by sdk object
	scoreP1: number;
	scoreP2: number;
}

export interface TournamentBracketStatus {
	type: "tournament-status";
	data: TournamentMatchStatus[][];
}

export type TournamentMessage = // used for tournament

		| TournamentInitPayload
		| UpdatePayload
		| TournamentPlayerConnected
		| TournamentPlayerDisconnected
		| CollisionPayload
		| TournamentScoreUpdatePayload
		| TournamentMatchOverPayload
		| TournamentOverPayload
		| TournamentBracketStatus;

export type LobbyBroadcastPayload =
	| { type: "timer"; payload: { secondsRemaining: number } }
	| {
			type: "match_result";
			payload: {
				roomID: string;
				winner: string;
				score: { p1: number; p2: number };
			};
	  };
