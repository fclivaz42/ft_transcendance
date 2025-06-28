import UserHandler from "../../handlers/UserHandler";
import { userMenuManager } from "../../managers/UserMenuManager";
import { createDialog } from "../backdropDialog";
import createTextbox from "../input/textbox";
import createUserAvatar from "./userAvatar";
import NotificationManager from "../../managers/NotificationManager";
import { i18nHandler } from "../../handlers/i18nHandler";
import RoutingHandler from "../../handlers/RoutingHandler";

function maskEmail(email: string): string {
	const [user, domain] = email.split("@");
	const maskedUser = user.slice(0, 3) + "*".repeat(Math.max(1, user.length - 3));
	const [domainName, domainExt] = domain.split(".");
	const maskedDomain = "*".repeat(domainName.length) + "." + domainExt;
	return `${maskedUser}@${maskedDomain}`;
}

export function createUserDialog(): HTMLDialogElement {
	const dialog = createDialog({ allowClose: true });
	dialog.className += " w-[500px] max-w-[90vw]";

	const profilePicture = createUserAvatar({
		sizeClass: "w-32 h-32 mb-2",
		editable: true,
	});

	const userIdentifier = document.createElement("div");
	userIdentifier.className = "flex  flex-col items-center";
	const userNameElement = document.createElement("p");
	userNameElement.className = "text-xl font-semibold text-gray-800 dark:text-gray-200";
	userNameElement.textContent = UserHandler.displayName || "User Name";
	userNameElement.setAttribute("data-user", "username");

	const emailElement = document.createElement("p");
	emailElement.className = "text-sm text-gray-600 dark:text-gray-400";
	emailElement.textContent = UserHandler.emailAddress ? maskEmail(UserHandler.emailAddress) : "Email Address";
	emailElement.setAttribute("data-user", "email");

	userIdentifier.appendChild(userNameElement);
	userIdentifier.appendChild(emailElement);

	const logoutButton = document.createElement("button");
	logoutButton.textContent = "Logout";
	logoutButton.className = "w-2/3 p-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50";
	logoutButton.onclick = () => {
		fetch("/api/users/logout", {
			method: "GET",
		}).then(() => {
			UserHandler.fetchUser();
			dialog.remove();
			RoutingHandler.setRoute("/");
		});
	};

	const hr = document.createElement("hr");
	hr.className = "w-full border-gray-600 my-4";

	const editProfileTitle = document.createElement("h2");
	editProfileTitle.className = "text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2";
	editProfileTitle.textContent = "Edit Profile";

	const displayNameTextbox = createTextbox({
		placeholder: "Display Name",
		type: "text",
	});

	const emailTextbox = createTextbox({
		placeholder: "Email",
		type: "email",
	});

	const passwordTextbox = createTextbox({
		placeholder: "New Password",
		type: "password",
	});

	const confirmPasswordTextbox = createTextbox({
		placeholder: "Confirm New Password",
		type: "password",
	});

	const cancelButton = document.createElement("button");
	cancelButton.textContent = "Cancel";
	cancelButton.className = "w-full p-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50";
	cancelButton.onclick = () => {
		dialog.remove();
	};

	const saveButton = document.createElement("button");
	saveButton.textContent = "Save Changes";
	saveButton.className = "w-full p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50";
	saveButton.onclick = () => {
		const multipartFormData = new FormData();
		if (userMenuManager.uploadFile.files?.[0])
			multipartFormData.append("avatar", userMenuManager.uploadFile.files[0], userMenuManager.uploadFile.files[0].name);
		if (passwordTextbox.value)
			multipartFormData.append("Password", passwordTextbox.value);
		if (emailTextbox.value)
			multipartFormData.append("EmailAddress", emailTextbox.value);
		if (displayNameTextbox.value)
			multipartFormData.append("DisplayName", displayNameTextbox.value);
		fetch("/api/users/update", {
			method: "PUT",
			body: multipartFormData
		}).then(response => {
			if (response.ok) {
				dialog.remove();
				UserHandler.fetchUser();
				dialog.remove();
			} else {
				console.error("Failed to update profile");
				NotificationManager.notify({
					"level": "error",
					"title": i18nHandler.getValue("panel.updateProfile.notification.updateErrorTitle"),
					"message": i18nHandler.getValue("panel.updateProfile.notification.updateErrorMessage")
				});
			}
		});
	};

	const buttonsContainer = document.createElement("div");
	buttonsContainer.className = "flex gap-x-2 mt-4 w-2/3 justify-between";
	buttonsContainer.appendChild(cancelButton);
	buttonsContainer.appendChild(saveButton);

	dialog.appendChild(profilePicture);
	dialog.appendChild(userIdentifier);
	dialog.appendChild(logoutButton);
	dialog.appendChild(hr);
	dialog.appendChild(editProfileTitle);
	dialog.appendChild(displayNameTextbox);
	dialog.appendChild(emailTextbox);
	dialog.appendChild(passwordTextbox);
	dialog.appendChild(confirmPasswordTextbox);
	dialog.appendChild(buttonsContainer);

	return dialog;
}

export function createUserMenuSettings(): HTMLDivElement {
	const template = document.createElement("template");
	template.innerHTML = `
		<div id="userMenuSettings" class="flex gap-x-2 items-center justify-center cursor-pointer">
			<span data-user="username" class="text-lg font-semibold text-gray-800 dark:text-gray-200">${UserHandler.displayName || "User Name"}</span>
		</div>
	`;
	const userMenuSettings = template.content.firstElementChild as HTMLDivElement;
	userMenuSettings.appendChild(createUserAvatar());
	userMenuSettings.onclick = () => {
		const dialog = createUserDialog();
		dialog.showModal();
	};
	return userMenuSettings;
}

export default function createUserMenu(): HTMLDivElement {
	const template = document.createElement("template");
	template.innerHTML = `
		<div id="userMenu" class="flex items-center justify-center">
		</div>
	`;
	return template.content.firstElementChild as HTMLDivElement;
}
