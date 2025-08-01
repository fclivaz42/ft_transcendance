import { createButton } from "../../buttons";
import { createDialog } from "../../backdropDialog";
import { i18nHandler } from "../../../handlers/i18nHandler";
import BackdropDialog from "../../../class/BackdropDialog";
import { sanitizer } from "../../../helpers/sanitizer";

function createGdprNoticeContent(dialogRef: BackdropDialog): HTMLDivElement {
	const template = document.createElement("template");
	template.innerHTML = `
		<div class="flex flex-col items-center p-4 gap-4 max-w-[600px] w-full justify-center text-center select-none">
			<h2 class="font-semibold text-2xl" data-i18n="panel.gdpr.title" class="text-xl">${sanitizer(i18nHandler.getValue("panel.gdpr.title"))}</h2>
			<div class="flex flex-col items-start gap-y-8 my-8 w-full">
				<div>
					<h3 class="text-left text-lg font-semibold">${sanitizer(i18nHandler.getValue("panel.gdpr.data.title"))}</h3>
					<p class="text-left text-sm">${sanitizer(i18nHandler.getValue("panel.gdpr.data.message"))}</p>
				</div>
				<div>
					<h3 class="text-left text-lg font-semibold">${sanitizer(i18nHandler.getValue("panel.gdpr.rights.title"))}</h3>
					<p class="text-left text-sm">${sanitizer(i18nHandler.getValue("panel.gdpr.rights.message"))}</p>
				</div>
				<div>
					<h3 class="text-left text-lg font-semibold">${sanitizer(i18nHandler.getValue("panel.gdpr.cookies.title"))}</h3>
					<p class="text-left text-sm">${sanitizer(i18nHandler.getValue("panel.gdpr.cookies.message"))}</p>
				</div>
				<div>
					<h3 class="text-left text-lg font-semibold">${sanitizer(i18nHandler.getValue("panel.gdpr.thirdParty.title"))}</h3>
					<p class="text-left text-sm">${sanitizer(i18nHandler.getValue("panel.gdpr.thirdParty.message"))}</p>
				</div>
			</div>
			<div class="flex gap-2 w-2/3 justify-between">
				${createButton({
					i18n: "panel.gdpr.button.accept",
					addClasses: "w-full text-center justify-center",
					color: "bg-blue-400 hover:bg-blue-500",
					darkColor: "dark:bg-blue-600 dark:hover:bg-blue-700",
				}).outerHTML}
				${createButton({
					i18n: "panel.gdpr.button.decline",
					addClasses: "w-full text-center justify-center",
					color: "bg-red-400 hover:bg-red-500",
					darkColor: "dark:bg-red-600 dark:hover:bg-red-700",
				}).outerHTML}
			</div>
		</div>
	`;
	const element = template.content.firstElementChild as HTMLDivElement;
	const sumbitButton = element.querySelector("button:first-of-type") as HTMLButtonElement;
	sumbitButton.onclick = async () => {
		localStorage.setItem("gdprAcceptedVersion", i18nHandler.getValue("panel.gdpr.version"));
		dialogRef.close();
	};
	const cancelButton = element.querySelector("button:last-of-type") as HTMLButtonElement;
	cancelButton.onclick = () => {
		window.close();
	};
	return element;
}

export function createGdprNotice(): HTMLDialogElement {
	const dialog = createDialog({ allowClose: false });

	const dialogContent = createGdprNoticeContent(dialog);
	dialog.appendChild(dialogContent);
	dialog.show();

	return dialog;
}
