import UserHandler from "../../handlers/UserHandler";
import { userMenuManager } from "../../managers/UserMenuManager";
import { createLogoutButton } from "../buttons";
import { createDialog } from "../backdropDialog";
import createUserAvatar from "./userAvatar";
import NotificationManager from "../../managers/NotificationManager";
import { i18nHandler } from "../../handlers/i18nHandler";


import { createInfoInput, CustomInputContainer } from "../input/infoInput";
import { validateDisplayName, validateEmail, validatePassword, validateConfirmPassword } from "../input/checkValidation.ts";
import { updateFieldAppearance } from '../input/utils.js';
import { createPasswordInput, CustomPasswordInputContainer, checkPasswordStrength } from '../input/createPasswordInput.js';
import { createPasswordStrengthList } from "../input/passwordStrengh.js";


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
	userIdentifier.className = "flex flex-col items-center"; 
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
		});
	};

	const hr = document.createElement("hr");
	hr.className = "w-full border-gray-600 my-4";

	const editProfileTitle = document.createElement("h2");
	editProfileTitle.className = "text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2";
	editProfileTitle.textContent = "Edit Profile";

	// --- Display Name ---
	// Remplacement de createTextbox par createInfoInput
	const displayNameTextbox: CustomInputContainer = createInfoInput(i18nHandler.getValue("panel.usernameLabel"), "displayName");
	displayNameTextbox.inputElement.value = UserHandler.displayName || ""; // Pré-remplir
	const displayNameErrorFeedback = document.createElement("div");
	displayNameErrorFeedback.className = "text-sm text-red-400 ml-2 mt-1 hidden";
	displayNameTextbox.appendChild(displayNameErrorFeedback);

	// --- Email ---
	// Remplacement de createTextbox par createInfoInput
	const emailTextbox: CustomInputContainer = createInfoInput(i18nHandler.getValue("panel.emailLabel"), "email");
	// emailTextbox.inputElement.value = UserHandler.emailAddress || ""; // Pré-remplir
	emailTextbox.inputElement.type = "email"; 
	const emailErrorFeedback = document.createElement("div");
	emailErrorFeedback.className = "text-sm text-red-400 ml-2 mt-1 hidden";
	emailTextbox.appendChild(emailErrorFeedback);

	// --- New Password ---
	// Remplacement de createTextbox par createPasswordInput
	const passwordTextbox: CustomPasswordInputContainer = createPasswordInput(i18nHandler.getValue("panel.passwordLabel"), "newPassword", true);
	const passwordErrorFeedback = document.createElement("div");
	passwordErrorFeedback.className = "text-sm text-red-400 ml-2 mt-1 hidden";
	passwordTextbox.appendChild(passwordErrorFeedback);

	// ** Ajout de la liste de force du mot de passe **
	const passwordStrengthHelper = createPasswordStrengthList();
	passwordTextbox.appendChild(passwordStrengthHelper.element);

	// --- Confirm New Password ---
	// Remplacement de createTextbox par createPasswordInput
	const confirmPasswordTextbox: CustomPasswordInputContainer = createPasswordInput(i18nHandler.getValue("panel.registerPanel.confirmPasswordLabel"), "confirmNewPassword", false);
	const confirmPasswordErrorFeedback = document.createElement("div");
	confirmPasswordErrorFeedback.className = "text-sm text-red-400 ml-2 mt-1 hidden";
	confirmPasswordTextbox.appendChild(confirmPasswordErrorFeedback);


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
		displayNameTextbox._touched = true;
		emailTextbox._touched = true;
		passwordTextbox._touched = true;
		confirmPasswordTextbox._touched = true;

		// Validation finale de tous les champs.
		const isDisplayNameValid = updateFieldAppearance(displayNameTextbox, displayNameErrorFeedback, validateDisplayName, false, true);
		const isEmailValid = updateFieldAppearance(emailTextbox, emailErrorFeedback, validateEmail, false, true);
		const isPasswordValid = updateFieldAppearance(passwordTextbox, passwordErrorFeedback, validatePassword, false, true);
		const isConfirmPasswordValid = updateFieldAppearance(
			confirmPasswordTextbox,
			confirmPasswordErrorFeedback,
			(value: string) => validateConfirmPassword(value, passwordTextbox.inputElement.value.trim()),
			false,
			true
		);

		const isFormValid = isDisplayNameValid && isEmailValid && isPasswordValid && isConfirmPasswordValid;

		if (!isFormValid) {
			NotificationManager.notify({
				"level": "error",
				"title": i18nHandler.getValue("panel.updateProfile.notification.validationErrorTitle"),
				"message": i18nHandler.getValue("panel.updateProfile.notification.validationErrorMessage")
			});
			return;
		}

		// Si le formulaire est valide, procéder à la soumission
		const multipartFormData = new FormData();
		if (userMenuManager.uploadFile.files?.[0]) {
			multipartFormData.append("avatar", userMenuManager.uploadFile.files[0], userMenuManager.uploadFile.files[0].name);
		}
		if (passwordTextbox.inputElement.value) { 
			multipartFormData.append("Password", passwordTextbox.inputElement.value);
		}
		if (emailTextbox.inputElement.value && emailTextbox.inputElement.value !== UserHandler.emailAddress) { 
			multipartFormData.append("EmailAddress", emailTextbox.inputElement.value);
		}
		if (displayNameTextbox.inputElement.value && displayNameTextbox.inputElement.value !== UserHandler.displayName) { 
			multipartFormData.append("DisplayName", displayNameTextbox.inputElement.value);
		}
		
		if (!multipartFormData.entries().next().done) {
			fetch("/api/users/update", {
				method: "PUT",
				body: multipartFormData
			}).then(response => {
				if (response.ok) {
					UserHandler.fetchUser();
					NotificationManager.notify({
						"level": "success",
						"title": i18nHandler.getValue("panel.updateProfile.notification.updateSuccessTitle"),
						"message": i18nHandler.getValue("panel.updateProfile.notification.updateSuccessMessage")
					});
					dialog.remove();
				} else {
					console.error("Failed to update profile");
					NotificationManager.notify({
						"level": "error",
						"title": i18nHandler.getValue("panel.updateProfile.notification.updateErrorTitle"),
						"message": i18nHandler.getValue("panel.updateProfile.notification.updateErrorMessage")
					});
				}
			}).catch(error => {
				console.error("Network error during profile update:", error);
				NotificationManager.notify({
					"level": "error",
					"title": i18nHandler.getValue("panel.updateProfile.notification.networkErrorTitle"),
					"message": i18nHandler.getValue("panel.updateProfile.notification.networkErrorMessage")
				});
			});
		} else {
			NotificationManager.notify({
				"level": "info",
				"title": i18nHandler.getValue("panel.updateProfile.notification.noChangesTitle"),
				"message": i18nHandler.getValue("panel.updateProfile.notification.noChangesMessage")
			});
			dialog.remove();
		}
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


	// --- Display Name ---
	displayNameTextbox.inputElement.addEventListener('input', () => {
		displayNameTextbox._touched = true;
		updateFieldAppearance(displayNameTextbox, displayNameErrorFeedback, validateDisplayName, true, false);
	});
	displayNameTextbox.inputElement.addEventListener('focus', () => {
		updateFieldAppearance(displayNameTextbox, displayNameErrorFeedback, validateDisplayName, true, false);
	});
	displayNameTextbox.inputElement.addEventListener('blur', () => {
		displayNameTextbox._touched = true;
		updateFieldAppearance(displayNameTextbox, displayNameErrorFeedback, validateDisplayName, false, false);
	});

	// --- Email ---
	emailTextbox.inputElement.addEventListener('input', () => {
		emailTextbox._touched = true;
        const validateIllegalCharsOnly = (val: string) => {
            const illegalCharRegex = /[^a-zA-Z0-9._%+-@.]/;
            if (val === '') {
                return { isValid: true, errorMessage: null };
            }
            if (illegalCharRegex.test(val)) {
                return { isValid: false, errorMessage: i18nHandler.getValue("panel.registerPanel.validation.emailIllegalCharacters") };
            }
            return { isValid: true, errorMessage: null };
        };
        updateFieldAppearance(emailTextbox, emailErrorFeedback, validateIllegalCharsOnly, true, false);
	});
	emailTextbox.inputElement.addEventListener('focus', () => {
		updateFieldAppearance(emailTextbox, emailErrorFeedback, validateEmail, true, false);
	});
	emailTextbox.inputElement.addEventListener('blur', () => {
		emailTextbox._touched = true;
		updateFieldAppearance(emailTextbox, emailErrorFeedback, validateEmail, false, true);
	});

	// --- New Password ---
	passwordTextbox.inputElement.addEventListener('input', () => {
		passwordTextbox._touched = true;
		updateFieldAppearance(passwordTextbox, passwordErrorFeedback, validatePassword, true, false);
		
		// ** Mise à jour de la liste de force **
		const strengthResult = checkPasswordStrength(passwordTextbox.inputElement.value);
		passwordStrengthHelper.update(strengthResult); // Met à jour l'apparence des critères

		// Revalider le champ de confirmation au cas où le mot de passe principal change
		confirmPasswordTextbox._touched = true;
		updateFieldAppearance(
			confirmPasswordTextbox,
			confirmPasswordErrorFeedback,
			(value: string) => validateConfirmPassword(value, passwordTextbox.inputElement.value.trim()),
			true,
			false
		);
	});
	passwordTextbox.inputElement.addEventListener('focus', () => {
		updateFieldAppearance(passwordTextbox, passwordErrorFeedback, validatePassword, true, false);
		// ** Afficher la liste de force quand le champ prend le focus **
		passwordStrengthHelper.element.classList.remove('hidden');
		const strengthResult = checkPasswordStrength(passwordTextbox.inputElement.value);
		passwordStrengthHelper.update(strengthResult);
	});
	passwordTextbox.inputElement.addEventListener('blur', () => {
		passwordTextbox._touched = true;
		updateFieldAppearance(passwordTextbox, passwordErrorFeedback, validatePassword, false, false);
		// ** Masquer la liste de force quand le champ perd le focus **
		passwordStrengthHelper.element.classList.add('hidden');
	});

	// --- Confirm New Password ---
	confirmPasswordTextbox.inputElement.addEventListener('input', () => {
		confirmPasswordTextbox._touched = true;
		updateFieldAppearance(
			confirmPasswordTextbox,
			confirmPasswordErrorFeedback,
			(value: string) => validateConfirmPassword(value, passwordTextbox.inputElement.value.trim()),
			true,
			false
		);
	});
	confirmPasswordTextbox.inputElement.addEventListener('focus', () => {
		updateFieldAppearance(
			confirmPasswordTextbox,
			confirmPasswordErrorFeedback,
			(value: string) => validateConfirmPassword(value, passwordTextbox.inputElement.value.trim()),
			true,
			false
		);
	});
	confirmPasswordTextbox.inputElement.addEventListener('blur', () => {
		confirmPasswordTextbox._touched = true;
		updateFieldAppearance(
			confirmPasswordTextbox,
			confirmPasswordErrorFeedback,
			(value: string) => validateConfirmPassword(value, passwordTextbox.inputElement.value.trim()),
			false,
			false
		);
	});

	updateFieldAppearance(displayNameTextbox, displayNameErrorFeedback, validateDisplayName, false, false);
	updateFieldAppearance(emailTextbox, emailErrorFeedback, validateEmail, false, false);
	updateFieldAppearance(passwordTextbox, passwordErrorFeedback, validatePassword, false, false);
	passwordStrengthHelper.element.classList.add('hidden'); // S'assurer que la liste est cachée au démarrage
	updateFieldAppearance(
		confirmPasswordTextbox,
		confirmPasswordErrorFeedback,
		(value: string) => validateConfirmPassword(value, passwordTextbox.inputElement.value.trim()),
		false,
		false
	);


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