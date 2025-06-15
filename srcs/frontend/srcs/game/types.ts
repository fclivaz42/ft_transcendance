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
	type: "init";
	payload: {
		ball: BallInit;
		p1: PaddleInit;
		p2: PaddleInit;
		walls: WallsInit;
		camera: CameraInitInfo;
		light: LightInitInfo;
	}
}

export type ServerMessage = InitPayload | UpdatePayload;