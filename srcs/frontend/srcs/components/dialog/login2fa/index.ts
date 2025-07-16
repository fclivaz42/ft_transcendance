import UserHandler from "../../../handlers/UserHandler";
import { userMenuManager } from "../../../managers/UserMenuManager";
import { createButtonIcon } from "../../buttons";
import { createDialog } from "../../backdropDialog";
import createTextbox from "../../input/textbox";
import NotificationManager from "../../../managers/NotificationManager";
import { i18nHandler } from "../../../handlers/i18nHandler";
import RoutingHandler from "../../../handlers/RoutingHandler";
import BackdropDialog from "../../../class/BackdropDialog";
import { sanitizer } from "../../../helpers/sanitizer";
import { createInfoInput } from "../../input/infoInput";

function createLogin2faContent(dialogRef: BackdropDialog): HTMLDivElement {
	const template = document.createElement("template");
	template.innerHTML = `
		<div class="flex flex-col items-center p-4 gap-4 w-72 justify-center text-center select-none">
			<div class="flex flex-col items-center gap-2">
				<img src="/assets/ui/two-factor-authentication-svgrepo-com.svg" alt="2FA Icon" class="w-16 h-16 invert">
				<p class="text-xl">${sanitizer(i18nHandler.getValue("panel.2faPanel.title"))}</p>
			</div>
			${createTextbox({
				id: "login-2fa-code",
				name: "login-2fa-code",
				type: "text",
				placeholder: "XXXXXX"
			}).outerHTML}
			${createButtonIcon({
				id: "login-2fa-button",
				i18n: "panel.2faPanel.verify",
				addClasses: "w-full text-center justify-center",
				color: "bg-green-500 hover:bg-green-600",
				darkColor: "dark:bg-green-600 dark:hover:bg-green-700",
			}).outerHTML}
			<p>${sanitizer(i18nHandler.getValue("panel.2faPanel.info"))}</p>
		</div>
	`;
	const sumbitButton = template.content.querySelector("#login-2fa-button") as HTMLButtonElement;
	const codeInput = template.content.querySelector("#login-2fa-code") as HTMLInputElement;
	sumbitButton.onclick = async () => {
		const Code = codeInput.value.trim();
		if (!Code) {
			return NotificationManager.notify({
				level: "error",
				message: i18nHandler.getValue("panel.2faPanel.error.emptyCode"),
				title: i18nHandler.getValue("notification.generic.errorTitle"),
			});
		}
		try {
			if (!UserHandler.clientId)
				throw new Error("error.missingClientId");
			const response = await fetch("/api/users/2fa", {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({
					ClientId: UserHandler.clientId,
					Code
				}),
			});
			if (!response.ok)
				throw new Error("error.invalidCode");
			dialogRef.remove(); 
			UserHandler.fetchUser();
		} catch (error) {
			console.error(error);
			NotificationManager.notify({
				level: "error",
				message: i18nHandler.getValue("panel.2faPanel.error.invalidCode"),
				title: i18nHandler.getValue("notification.generic.errorTitle"),
			});
		}
	};
	return template.content.firstElementChild as HTMLDivElement;
}

export function createLogin2fa(): HTMLDialogElement {
	const dialog = createDialog({ allowClose: true });

	const dialogContent = createLogin2faContent(dialog);
	dialog.appendChild(dialogContent);
	dialog.show();

	return dialog;
}
