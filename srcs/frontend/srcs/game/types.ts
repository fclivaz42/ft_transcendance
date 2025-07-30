import { Users } from "../interfaces/Users";

export interface CameraInitInfo {
	name: string;
	position: number[];
	target: number[];
	mode: number;
}

export interface LightInitInfo {
	name: string;
	direction: number[];
}

export interface BallUpdate {
	curr_speed: number;
	curr_position: number[];
}

export interface PaddleUpdate {
	max_speed: number;
	position: number[];
}

export interface UpdatePayload {
	type: "update";
	payload: {
		ball: BallUpdate;
		p1: PaddleUpdate;
		p2: PaddleUpdate;
	}
}

export interface PlayerConnectedPayload {
	type: "connect";
	payload: {
		playerID: string;
		roomID: string;
	}
};

export interface PlayerDisconnectedPayload {
	type: "disconnect";
	payload: {
		playerID: string;
	}
};

export interface CollisionPayload {
	type: "collision";
	payload: {
		collider: string;
	}
};

export interface ScoreUpdatePayload {
	type: "score" | "tournament-score";
	payload: {
		score: {
			p1: number,
			p2: number
		}
	}
}

export interface GameOverPayload {
	type: "gameover";
	payload: {
		winner: string;
		final_score: {
			p1: number,
			p2: number
		}
	}
}

export interface ConnectedPlayers {
	p1: string | undefined;
	p2: string | undefined;
}

export interface BallInit extends BallUpdate {
	size: number[];
}

export interface PaddleInit extends PaddleUpdate {
	size: number[];
}

export interface WallsInit {
	[key: string]: {
		position: number[];
		size: number[];
		passThrough?: boolean;
	};
}

export interface InitPayload {
	type: "init" | "tournament-init";
	payload: {
		ball: BallInit;
		p1: PaddleInit;
		p2: PaddleInit;
		walls: WallsInit;
		camera: CameraInitInfo;
		light: LightInitInfo;
		roomID: string;
		connectedPlayers: ConnectedPlayers;
	}
}

export interface TournamentMatchStatus {
	round: number;
	matchIndex: number;
	p1: string | null;
	p2: string | null;
	scoreP1: number;
	scoreP2: number;
}

export interface TournamentBracketStatusPayload {
	type: "tournament-status";
	payload: TournamentMatchStatus[];
}

export interface TournamentScore {
	// used for tournament
	p1: number;
	p2: number;
	round: number;
}

export interface TournamentMatchOverPayload {
	// used for tournament
	type: "tournament-match-over";
	payload: {
		winner: string;
		loser: string;
		final_score: TournamentScore;
		bracket: TournamentMatchStatus[];
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

export interface PingResponsePayload {
    type: "pingResponse",
    payload: {
        value: number;
    }
}

export interface PingRequestPayload {
    type: "pingRequest",
    payload: {
        value: number;
    }
}

export type ServerMessage = InitPayload
							| UpdatePayload
							| PlayerConnectedPayload
							| PlayerDisconnectedPayload
							| CollisionPayload
							| ScoreUpdatePayload
							| GameOverPayload
							| TournamentBracketStatusPayload
							| TournamentMatchOverPayload
							| TournamentOverPayload
							| PingResponsePayload
							| PingRequestPayload;
