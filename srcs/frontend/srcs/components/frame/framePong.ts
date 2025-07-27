import { startGame } from "../../game/GameLaunch";
import { PONG_HOST } from "../../game/WebSocketManager";
import { i18nHandler } from "../../handlers/i18nHandler";
import RoutingHandler from "../../handlers/RoutingHandler";
import UserHandler from "../../handlers/UserHandler";
import { sanitizer } from "../../helpers/sanitizer";
import { createButtonIcon } from "../buttons";
import createUserAvatar, { UserAvatarType } from "../usermenu/userAvatar";

export async function createPongCanvas(): Promise<HTMLDivElement> {
	const template = document.createElement("template");

	const playerAvatar: (UserAvatarType)[] = [
		createUserAvatar({ sizeClass: "lg:w-20 lg:h-20 w-14 h-14" }),
		createUserAvatar({ sizeClass: "lg:w-20 lg:h-20 w-14 h-14" })
	];
	playerAvatar[0].setAttribute("data-pong-avatar", "p1");
	playerAvatar[1].setAttribute("data-pong-avatar", "p2");

	template.innerHTML = `
		<div class="h-full gap-4 flex items-start justify-center select-none">
				<div class="aspect-[3/2] min-w-[606px] w-full max-h-full">
					<div class="aspect-[3/2] max-w-full h-full mx-auto flex flex-col min-h-0 gap-8">
						<div class="flex justify-between items-center min-h-0">
							<div data-pong-player="p1" class="flex items-center justify-center gap-4">
								<div class="flex flex-col items-start justify-center w-0">
									<p data-pong-displayname="p1" class="text-xl lg:text-3xl font-bold text-center select-text text-nowrap">Username</p>
									<div class="flex gap-x-4 items-start justify-center">
										<p data-i18n="pong.computer" data-pong-bot="p1" class="hidden bg-gray-800 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-lg text-sm">
											${sanitizer(i18nHandler.getValue("pong.computer"))}
										</p>
										<p data-pong-ping="p1" class="text-base lg:text-lg">calculating...</p>
									</div>
								</div>
							</div>
							<div id="score" class="text-3xl lg:text-6xl font-bold text-center flex items-center justify-center flex-nowrap gap-x-2 lg:gap-x-4">
								<p data-score="p1" class="text-right w-16 lg:w-32">0</p>
								<span>:</span>
								<p data-score="p2" class="text-left w-16 lg:w-32">0</p>
							</div>
							<div data-pong-player="p2" class="flex flex-row-reverse items-center justify-center gap-4">
								<div class="flex flex-col items-end justify-center w-0">
									<p data-pong-displayname="p2" class="text-xl lg:text-3xl font-bold text-center select-text text-nowrap">Username</p>
									<div class="flex gap-x-4 items-start justify-center">
										<p data-pong-ping="p2" class="text-base lg:text-lg">calculating...</p>
										<p data-i18n="pong.computer" data-pong-bot="p2" class="hidden bg-gray-800 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-lg text-sm">
											${sanitizer(i18nHandler.getValue("pong.computer"))}
										</p>
									</div>
								</div>
							</div>
						</div>
						<canvas id="game" class="rounded-xl flex-grow bg-panel dark:bg-panel_dark w-full h-full"></canvas>
					</div>
				</div>
		</div>
	`;

	const playerContainers = template.content.querySelectorAll("[data-pong-player]");
	for (const container of playerContainers) {
		const idx = container.getAttribute("data-pong-player") === "p1" ? 0 : 1;
		container.insertAdjacentElement("afterbegin", playerAvatar[idx]);
	}

	const pongCanvasContainer = template.content.firstElementChild as HTMLDivElement;
	return pongCanvasContainer;
}

export function createPongLoading(message: string): HTMLDivElement {
	const template = document.createElement("template");
	template.innerHTML = `
		<div class="w-full h-full">
			<div class="w-full h-full flex flex-col justify-start items-center gap-4">
				<span class="text-3xl font-bold pt-32"
				>${sanitizer(i18nHandler.getValue(message))}</span>
				<div role="status">
					<svg aria-hidden="true" class="w-14 h-14 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
							<path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
					</svg>
					<span class="sr-only">Loading...</span>
				</div>
				<div id="pong-room-code" class="hidden justify-center items-center gap-2 mt-12">
					<p class="text-lg text-gray-700 dark:text-gray-300" data-i18n="pong.roomCode">${sanitizer(i18nHandler.getValue("pong.privateJoin.roomCode"))}</p>
					<input type="text" id="pong-room-code-input" class="w-16 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" readonly>
					${createButtonIcon({
		id: "pong-room-code-copy",
		i18n: "pong.privateJoin.copyUrl",
		color: "bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded",
		darkColor: "dark:bg-blue-700 dark:hover:bg-blue-800",
	}).outerHTML}
				</div>
			</div>
		</div>
	`;
	const loadingContainer = template.content.firstElementChild as HTMLDivElement;
	if (!UserHandler.isLogged) {
		throw new Error("notification.user.notLogged");
	}

	let url: URL | undefined;
	const room = RoutingHandler.searchParams.get("room");
	switch (room) {
		case "computer":
			url = new URL("computer", PONG_HOST);
			break;
		case "local":
			url = new URL("local", PONG_HOST);
		case "tournament":
			url = new URL("tournament", PONG_HOST);
			break;
		default:
			if (!room)
				url = new URL("remote", PONG_HOST);
			else if (room === "host")
				url = new URL("friend_host", PONG_HOST);
			else {
				url = new URL("friend_join", PONG_HOST);
				url.searchParams.set("roomId", room);
			}
			break;
	}
	startGame(url.toString());

	return loadingContainer;
}

export default function createPongFrame() {
	const url = RoutingHandler.url;
	const searchParams = RoutingHandler.searchParams;
	let pongFrame: HTMLDivElement;
	const room = searchParams.get("room");
	if (room === "host")
		pongFrame = createPongLoading("pong.waitingFriend");
	else if (room === "computer")
		pongFrame = createPongLoading("generic.loading");
	else
		pongFrame = createPongLoading("pong.waitingPlayer");
	const button = pongFrame.querySelector("#pong-room-code-copy");
	const input = pongFrame.querySelector<HTMLInputElement>("#pong-room-code-input");
	button?.addEventListener("click", () => {
		if (!input)
			return;
		const url = new URL(window.location.origin);
		url.pathname = "/pong";
		url.searchParams.set("room", "join");
		url.searchParams.set("room", input.value);
		window.navigator.clipboard.writeText(url.toString());
	});
	return pongFrame;
}
