import GameRoom from "../classes/GameRoom.ts";
import PlayerSession from "../classes/PlayerSession.ts";
import type { PingResponse } from "../classes/types.ts";

export function pingResponse(player: PlayerSession, mode: string, pingValue: number | undefined) {

	const room: GameRoom | null = player.getRoom();

	const pingResponse: PingResponse = {
		type: "pingResponse",
		payload: {
			value: pingValue
		}
	};

	if (room) {
		const recepients = room.players.filter(p => p !== player);
		room.selectiveSend(pingResponse, recepients);
	}
	
	
	return;
}