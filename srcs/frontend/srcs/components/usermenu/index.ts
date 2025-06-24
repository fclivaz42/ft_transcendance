import UserHandler from "../../handlers/UserHandler";
import { userMenuManager } from "../../managers/UserMenuManager";
import { createLogoutButton } from "../buttons";
import { createDialog } from "../backdropDialog";
import createTextbox from "../input/textbox";
import createUserAvatar from "./userAvatar";
import NotificationManager from "../../managers/NotificationManager";
import { i18nHandler } from "../../handlers/i18nHandler";

export function createUserDialog(): HTMLDialogElement {
	const dialog = createDialog({allowClose: true});
	dialog.className += " w-[500px] max-w-[90vw]";

	const profilePicture = createUserAvatar({
		sizeClass: "w-32 h-32 mb-2",
		editable: true,
	});

	const userNameElement = document.createElement("span");
	userNameElement.className = "text-xl font-semibold text-gray-800 dark:text-gray-200";
	userNameElement.textContent = UserHandler.displayName || "User Name";
	userNameElement.setAttribute("data-user", "username");

	const logoutButton = document.createElement("button");
	logoutButton.textContent = "Logout";
	logoutButton.className = "w-2/3 p-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50";
	logoutButton.onclick = () => {
		// Handle logout logic here
		fetch("/api/users/logout", {
			method: "GET",
		}).then(() => {
			UserHandler.fetchUser();
			dialog.remove();
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
		fetch("/api/users/update", {
			method: "PUT",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				DisplayName: displayNameTextbox.value || undefined,
				EmailAddress: emailTextbox.value || undefined,
				Password: passwordTextbox.value || undefined,
				Avatar: userMenuManager.uploadFile.files?.[0] ? userMenuManager.uploadFile.files[0] : undefined
			})
		}).then(response => {
			if (response.ok) {
				UserHandler.fetchUser();
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
	dialog.appendChild(userNameElement);
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
