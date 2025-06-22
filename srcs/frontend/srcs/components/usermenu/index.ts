import UserHandler from "../../handlers/UserHandler";
import { createLogoutButton } from "../buttons";
import { createDialog } from "../dialog";

export function createUserDialog(): HTMLDialogElement {
	const dialog = createDialog({allowClose: true});
	dialog.className += " w-[500px] max-w-[90vw] z-50";

	const profilePicture = document.createElement("img");
	profilePicture.src = `${UserHandler.avatarUrl}`;
	profilePicture.alt = "Profile Picture";
	profilePicture.className = "rounded-full object-cover w-32 h-32 mb-2";

	const userNameElement = document.createElement("span");
	userNameElement.className = "text-xl font-semibold text-gray-800 dark:text-gray-200";
	userNameElement.textContent = UserHandler.displayName || "User Name";

	const logoutButton = document.createElement("button");
	logoutButton.textContent = "Logout";
	logoutButton.className = "w-2/3 p-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50";
	logoutButton.onclick = () => {
		// Handle logout logic here
		console.log("User logged out");
		window.location.href = "/users/logout";
	};

	const hr = document.createElement("hr");
	hr.className = "w-full border-gray-600 my-4";

	const editProfileTitle = document.createElement("h2");
	editProfileTitle.className = "text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2";
	editProfileTitle.textContent = "Edit Profile";

	const displayNameTextbox = document.createElement("input");
	displayNameTextbox.type = "text";
	displayNameTextbox.placeholder = "Display Name";
	displayNameTextbox.className = "w-full px-4 py-2 mt-2 text-gray-600 dark:text-white bg-white dark:bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 pr-10 transition-all duration-300 ease-in-out border-blue-500 focus:ring-blue-500 focus:border-blue-500";

	const emailTextbox = document.createElement("input");
	emailTextbox.type = "email";
	emailTextbox.placeholder = "Email";
	emailTextbox.className = "w-full px-4 py-2 mt-2 text-gray-600 dark:text-white bg-white dark:bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 pr-10 transition-all duration-300 ease-in-out border-blue-500 focus:ring-blue-500 focus:border-blue-500";

	const passwordTextbox = document.createElement("input");
	passwordTextbox.type = "password";
	passwordTextbox.placeholder = "New Password";
	passwordTextbox.className = "w-full px-4 py-2 mt-2 text-gray-600 dark:text-white bg-white dark:bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 pr-10 transition-all duration-300 ease-in-out border-blue-500 focus:ring-blue-500 focus:border-blue-500";
	const confirmPasswordTextbox = document.createElement("input");
	confirmPasswordTextbox.type = "password";
	confirmPasswordTextbox.placeholder = "Confirm New Password";
	confirmPasswordTextbox.className = "w-full px-4 py-2 mt-2 text-gray-600 dark:text-white bg-white dark:bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 pr-10 transition-all duration-300 ease-in-out border-blue-500 focus:ring-blue-500 focus:border-blue-500";

	const cancelButton = document.createElement("button");
	cancelButton.textContent = "Cancel";
	cancelButton.className = "w-full p-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50";
	cancelButton.onclick = () => {
		console.log("Edit cancelled");
		dialog.remove();
	};

	const saveButton = document.createElement("button");
	saveButton.textContent = "Save Changes";
	saveButton.className = "w-full p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50";
	saveButton.onclick = () => {
		// Handle save logic here
		console.log("Changes saved");
		fetch("/users/update", {
			method: "PUT",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				DisplayName: displayNameTextbox.value,
				EmailAddress: emailTextbox.value,
				Password: passwordTextbox.value,
			})
		}).then(response => {
			if (response.ok) {
				console.log("Profile updated successfully");
				window.location.reload();
			} else {
				console.error("Failed to update profile");
				alert("Failed to update profile. Please try again.");
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

export default function createUserContext(): HTMLDivElement {
	const userMenuContainer = document.createElement("div");
	userMenuContainer.className = "flex gap-x-2 items-center justify-center cursor-pointer";
	userMenuContainer.innerHTML = `
		<span class="text-lg font-semibold text-gray-800 dark:text-gray-200">${UserHandler.displayName || "User Name"}</span>
		<img src=${UserHandler.avatarUrl} alt="Avatar" class="rounded-full object-cover w-10 h-10">
	`;
	userMenuContainer.onclick = () => {
		document.body.appendChild(createUserDialog());
	};
	return userMenuContainer;
}
