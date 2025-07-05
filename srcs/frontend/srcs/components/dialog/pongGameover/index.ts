import UserHandler from "../../../handlers/UserHandler";
import { userMenuManager } from "../../../managers/UserMenuManager";
import { createButton, createLogoutButton } from "../../buttons";
import { createDialog } from "../../backdropDialog";
import createTextbox from "../../input/textbox";
import NotificationManager from "../../../managers/NotificationManager";
import { i18nHandler } from "../../../handlers/i18nHandler";
import RoutingHandler from "../../../handlers/RoutingHandler";
import BackdropDialog from "../../../class/BackdropDialog";
import { sanitizer } from "../../../helpers/sanitizer";
import { Users } from "../../../interfaces/Users";
import createUserAvatar from "../../usermenu/userAvatar";
import { GameOverPayload } from "../../../game/types";

function maskEmail(email: string): string {
	const [user, domain] = email.split("@");
	const maskedUser = user.slice(0, 3) + "*".repeat(Math.max(1, user.length - 3));
	const [domainName, domainExt] = domain.split(".");
	const maskedDomain = "*".repeat(domainName.length) + "." + domainExt;
	return `${maskedUser}@${maskedDomain}`;
}

async function createPongGameoverDialogContent(dialogRef: BackdropDialog, users: Record<"p1" | "p2", Users | undefined>, payload: GameOverPayload["payload"]): Promise<HTMLDivElement> {
	const winnerLabel = `
		<span class="absolute -top-4 text-lg font-bold text-green-600 dark:text-green-400">
			${sanitizer(i18nHandler.getValue(`pong.gameover.winner`))}
		</span>
	`

	const loserLabel = `
		<span class="absolute -top-4 text-lg font-bold text-red-600 dark:text-red-400">
			${sanitizer(i18nHandler.getValue(`pong.gameover.loser`))}
		</span>
	`;

	const template = document.createElement("template");
	const userAvatar: HTMLDivElement[] = [];
	for (const user of Object.values(users)) {
		if (!user || user.PlayerID === "bot")
			userAvatar.push(await createUserAvatar({isComputer: true, sizeClass: "w-16 h-16"}));
		else
			userAvatar.push(await createUserAvatar({playerId: user.PlayerID, sizeClass: "w-16 h-16"}));
	}
	template.innerHTML = `
		<div class="flex flex-col items-center p-4">
			<h2 class="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-2">${sanitizer(i18nHandler.getValue("pong.gameover.title"))}</h2>
			<br>
			<div class="flex items-center gap-8 mb-4">
				<div class="flex items-center gap-4 relative justify-center">
					${payload.winner === "p1" ? winnerLabel : loserLabel}
					${userAvatar[0].outerHTML}
					<span class="text-left w-32 truncate text-lg text-gray-800 dark:text-gray-200">${sanitizer(users.p1?.DisplayName || i18nHandler.getValue("pong.gameover.player1"))}</span>
				</div>
				<div class="text-3xl font-bold text-center flex items-center justify-center flex-nowrap gap-x-2 lg:gap-x-4">
					<p>${payload.final_score.p1}</p>
					<span>:</span>
					<p>${payload.final_score.p2}</p>
				</div>
				<div class="flex flex-row-reverse items-center gap-4 relative justify-center">
					${payload.winner === "p2" ? winnerLabel : loserLabel}
					${userAvatar[1].outerHTML}
					<span class="text-right w-32 truncate text-lg text-gray-800 dark:text-gray-200">${sanitizer(users.p2?.DisplayName || i18nHandler.getValue("pong.gameover.player2"))}</span>
				</div>
			</div>
			<div class="flex gap-16">
				${createButton({
					id: "pong-gameover-play-again",
					i18n: "pong.gameover.playagain",
					color: "text-white bg-blue-500 hover:bg-blue-600",
					darkColor: "dark:bg-blue-700 dark:hover:bg-blue-800",
				}).outerHTML}
				${createButton({
					id: "pong-gameover-leave",
					i18n: "pong.gameover.leave",
					color: "text-white bg-red-500 hover:bg-red-600",
					darkColor: "dark:bg-red-700 dark:hover:bg-red-800",
				}).outerHTML}
			</div>
		</div>
	`;
	return template.content.firstElementChild as HTMLDivElement;
}

export function createPongGameoverDialog(payload: GameOverPayload["payload"], players: Record<"p1" | "p2", Users | undefined>): HTMLDialogElement {
	const dialog = createDialog({ allowClose: false });

	const dialogContent = createPongGameoverDialogContent(dialog, players, payload);
	dialogContent.then(content => {
		dialog.appendChild(content);
		const playAgainButton = dialog.querySelector<HTMLAnchorElement>("#pong-gameover-play-again");
		const leaveButton = dialog.querySelector<HTMLAnchorElement>("#pong-gameover-leave");
		if (!playAgainButton || !leaveButton) {
			throw new Error("Pong Gameover dialog buttons not found.");
		}
		playAgainButton.onclick = async () => {
			dialog.close();
			const currentRoute = RoutingHandler.url;
			if (currentRoute.pathname !== "/pong" || !currentRoute.searchParams.has("room")) {
				RoutingHandler.setRoute("/pong");
				return;
			}
			const room = currentRoute.searchParams.get("room");
			let route: string;
			switch (room) {
				case "computer":
					route = "/pong?room=computer";
					break;
				case "tournament":
					route = "/pong?room=tournament";
					break;
				default:
					route = `/pong?room=${currentRoute.searchParams.get("room")}`;
					break;
			}
			RoutingHandler.setRoute(route, false);
		};
		leaveButton.onclick = async () => {
			dialog.close();
			RoutingHandler.setRoute("/");
		};

		dialog.show();
	});

	return dialog;
}
