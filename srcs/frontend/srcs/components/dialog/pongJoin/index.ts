import UserHandler from "../../../handlers/UserHandler";
import { userMenuManager } from "../../../managers/UserMenuManager";
import { createLogoutButton } from "../../buttons";
import { createDialog } from "../../backdropDialog";
import createTextbox from "../../input/textbox";
import NotificationManager from "../../../managers/NotificationManager";
import { i18nHandler } from "../../../handlers/i18nHandler";
import RoutingHandler from "../../../handlers/RoutingHandler";
import BackdropDialog from "../../../class/BackdropDialog";
import { sanitizer } from "../../../helpers/sanitizer";

function maskEmail(email: string): string {
	const [user, domain] = email.split("@");
	const maskedUser = user.slice(0, 3) + "*".repeat(Math.max(1, user.length - 3));
	const [domainName, domainExt] = domain.split(".");
	const maskedDomain = "*".repeat(domainName.length) + "." + domainExt;
	return `${maskedUser}@${maskedDomain}`;
}

export function createPongJoinDialogContent(dialogRef: BackdropDialog): HTMLDivElement {
	const template = document.createElement("template");
	template.innerHTML = `
		<div class="flex flex-col items-center p-4">
			<h2 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">${sanitizer(i18nHandler.getValue("pong.join.title"))}</h2>
			<p class="text-sm text-gray-600 dark:text-gray-400 mb-4">${sanitizer(i18nHandler.getValue("pong.join.description"))}</p>
			${createTextbox({
				id: "pongRoomCode",
				placeholder: i18nHandler.getValue("pong.join.placeholder"),
				type: "text",
				name: "pongRoomCode",
			}).outerHTML}
			<button id="joinPongRoom" class="mt-8 w-full p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
				${i18nHandler.getValue("pong.join.button")}
			</button>
		</div>
	`;
	const joinButton = template.content.querySelector("#joinPongRoom") as HTMLButtonElement;
	joinButton.onclick = () => {
		console.log("Join Pong Room button clicked");
		const roomCode = (document.querySelector("#pongRoomCode") as HTMLInputElement).value.trim();
		if (!roomCode)
			return NotificationManager.notify({
				level: "error",
				message: i18nHandler.getValue("pong.join.error.emptyRoomCode"),
				title: i18nHandler.getValue("pong.join.error.title"),
			});
		RoutingHandler.setRoute(`/pong?room=${roomCode}`);
		dialogRef.remove();
	}
	return template.content.firstElementChild as HTMLDivElement;
}

export function createPongJoinDialog(): HTMLDialogElement {
	const dialog = createDialog({ allowClose: true });
	//dialog.className += " w-[500px] max-w-[90vw]";

	const dialogContent = createPongJoinDialogContent(dialog);
	dialog.appendChild(dialogContent);
	dialog.show();

	return dialog;
}
