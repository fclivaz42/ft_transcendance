import UserHandler from "../../../handlers/UserHandler";
import { createButton } from "../../buttons";
import { createDialog } from "../../backdropDialog";
import createTextbox from "../../input/textbox";
import NotificationManager from "../../../managers/NotificationManager";
import { i18nHandler } from "../../../handlers/i18nHandler";
import BackdropDialog from "../../../class/BackdropDialog";
import { sanitizer } from "../../../helpers/sanitizer";

function createUserDeleteContent(dialogRef: BackdropDialog): HTMLDivElement {
	const template = document.createElement("template");
	template.innerHTML = `
		<form class="flex flex-col items-center p-4 gap-4 w-72 justify-center text-center select-none" onsubmit="event.preventDefault();">
			<div class="flex flex-col items-center gap-2">
				<img src="/assets/ui/delete-2-svgrepo-com.svg" alt="Delete icon" class="w-16 h-16 dark:invert">
				<p data-i18n="panel.updateProfile.delete.title" class="text-xl">${sanitizer(i18nHandler.getValue("panel.updateProfile.delete.title"))}</p>
			</div>
			<!-- Hidden input for accessibility, not used in the form -->
			<input name="username" type="text" class="hidden" autocomplete="username" value="${sanitizer(UserHandler.displayName) || ""}"/>
			${createTextbox({
				type: "password",
				placeholder: i18nHandler.getValue("panel.updateProfile.delete.passwordPlaceholder"),
				autoComplete: "current-password",
			}).outerHTML}
			<div class="flex gap-2 w-2/3 justify-between">
				${createButton({
					i18n: "panel.updateProfile.delete.confirmButton",
					addClasses: "w-full text-center justify-center",
					color: "bg-red-400 hover:bg-red-500",
					darkColor: "dark:bg-red-600 dark:hover:bg-red-700",
				}).outerHTML}
				${createButton({
					i18n: "panel.updateProfile.buttons.cancel",
					addClasses: "w-full text-center justify-center",
					color: "bg-gray-300 hover:bg-gray-400",
					darkColor: "dark:bg-gray-700 dark:hover:bg-gray-800",
				}).outerHTML}
			</div>
			<p>${sanitizer(i18nHandler.getValue("panel.updateProfile.delete.info"))}</p>
		</form>
	`;
	const element = template.content.firstElementChild as HTMLDivElement;
	const sumbitButton = element.querySelector("button:first-of-type") as HTMLButtonElement;
	const cancelButton = element.querySelector("button:last-of-type") as HTMLButtonElement;
	const passwordInput = element.querySelector("input[type='password']") as HTMLInputElement;
	sumbitButton.onclick = async () => {
		if (!passwordInput.value.trim())
			return;
		try {
			if (!UserHandler.clientId)
				throw new Error("error.missingClientId");
			const response = await fetch("/api/users/delete", {
				method: "delete",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({
					password: passwordInput.value.trim(),
				}),
			});
			if (!response.ok) {
				const res = await response.json();
				if (res.message === "No password is set due to Oauth2.") {
					NotificationManager.notify({
						level: "warning",
						title: i18nHandler.getValue("notification.generic.warningTitle"),
						message: i18nHandler.getValue("panel.updateProfile.notification.oauthNoPassword"),
					});
				} else if (res.message === "Wrong password.") {
					throw new Error("panel.updateProfile.notification.badPassword");
				} else
					throw new Error("generic.error");
			} else {
				UserHandler.logout().then(() => dialogRef.close());
			}
		} catch (error) {
			const err = error as Error;
			NotificationManager.notify({
				level: "error",
				message: i18nHandler.getValue(err.message) ||  i18nHandler.getValue("notification.generic.errorMessage"),
				title: i18nHandler.getValue("notification.generic.errorTitle"),
			});
		}
	};
	passwordInput.onsubmit = (event: Event) => {
		event.preventDefault();
		sumbitButton.click();
	};
	cancelButton.onclick = () => {
		dialogRef.remove();
	};
	return element;
}

export function createUserDelete(): HTMLDialogElement {
	const dialog = createDialog({ allowClose: true });

	const dialogContent = createUserDeleteContent(dialog);
	dialog.appendChild(dialogContent);
	dialog.show();

	return dialog;
}
