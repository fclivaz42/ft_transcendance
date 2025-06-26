import { startGame } from "../../game/GameLaunch";
import { PONG_HOST } from "../../game/WebSocketManager";
import { i18nHandler } from "../../handlers/i18nHandler";
import RoutingHandler from "../../handlers/RoutingHandler";
import UserHandler from "../../handlers/UserHandler";
import createUserAvatar from "../usermenu/userAvatar";

export function createPongCanvas(): HTMLDivElement {
	const template = document.createElement("template");
	template.innerHTML = `
		<div class="pb-12 h-full gap-4 flex items-start justify-center select-none">
				<div class="aspect-[3/2] min-w-[606px] w-full max-h-full">
					<div class="aspect-[3/2] max-w-full h-full mx-auto flex flex-col min-h-0 gap-8">
						<div class="flex justify-between items-center min-h-0">
							<div class="flex items-center justify-center gap-4">
								${createUserAvatar({sizeClass: "lg:w-20 lg:h-20 w-14 h-14"}).outerHTML}
								<p data-user="username" class="text-xl lg:text-3xl font-bold text-center select-text">${UserHandler.displayName}</p>
							</div>
							<div id="score" class="text-3xl lg:text-6xl font-bold text-center flex items-center justify-center flex-nowrap gap-x-2 lg:gap-x-4">
								<p data-score="p1" class="text-right w-16 lg:w-32">0</p>
								<span>:</span>
								<p data-score="p2" class="text-left w-16 lg:w-32">0</p>
							</div>
							<div class="flex flex-row-reverse items-center justify-center gap-4">
								${createUserAvatar({sizeClass: "lg:w-20 lg:h-20 w-14 h-14"}).outerHTML}
								<p data-user="username" class="text-xl lg:text-3xl font-bold text-center select-text">${UserHandler.displayName}</p>
							</div>
						</div>
						<canvas id="game" class="rounded-xl flex-grow bg-panel dark:bg-panel_dark w-full h-full"></canvas>
					</div>
				</div>
		</div>
	`;
	const pongCanvasContainer = template.content.firstElementChild as HTMLDivElement;
	return pongCanvasContainer;
}

export function createPongLoading(): HTMLDivElement {
	const template = document.createElement("template");
	template.innerHTML = `
		<div class="w-full h-full">
			<div class="w-full h-full flex flex-col justify-start items-center gap-4">
				<span class="text-3xl font-bold pt-32"
				>${i18nHandler.getValue("pong.waitingPlayer")}</span>
				<div role="status">
					<svg aria-hidden="true" class="w-14 h-14 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
							<path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
					</svg>
					<span class="sr-only">Loading...</span>
				</div>
			</div>
		</div>
	`;
	const loadingContainer = template.content.firstElementChild as HTMLDivElement;
		if (!UserHandler.isLogged) {
			throw new Error("notification.user.notLogged");
		}

		let url: URL | undefined;
		switch (RoutingHandler.searchParams.get("mode")) {
			case "solo":
				url = new URL("computer", PONG_HOST);
				break;
			default:
				url = new URL("remote", PONG_HOST);
				break;
		}
		url.searchParams.set("userId", UserHandler.userId as string);
		startGame(url.toString());

	return loadingContainer;
}

export default function createPongFrame() {
	const url = RoutingHandler.url;
	const searchParams = RoutingHandler.searchParams;
	let pongFrame: HTMLDivElement;
	pongFrame = createPongLoading();
	return pongFrame;
}
