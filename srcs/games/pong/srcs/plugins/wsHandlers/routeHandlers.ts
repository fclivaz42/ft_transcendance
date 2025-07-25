import RoomManager from "../game/classes/RoomManager.ts";
import TournamentManager from "../game/classes/TournamentManager.ts";
import { createWsHandler } from "./baseWsHandler.ts";

const remote = (manager: RoomManager) =>
	createWsHandler({ mode: "remote", manager });
const friend_host = (manager: RoomManager) =>
	createWsHandler({ mode: "friend_host", manager });
const friend_join = (manager: RoomManager) =>
	createWsHandler({ mode: "friend_join", manager });
const local = (manager: RoomManager) =>
	createWsHandler({ mode: "local", manager });
const computer = (manager: RoomManager) =>
	createWsHandler({ mode: "computer", manager });
const tournament = (manager: TournamentManager) =>
	createWsHandler({ mode: "tournament", manager });

export default {
	remote,
	friend_host,
	friend_join,
	local,
	computer,
	tournament,
};
