
import UserHandler, { updateUserData } from "../../handlers/UserHandler";
import { userMenuManager } from "../../managers/UserMenuManager";
import { createDialog } from "../backdropDialog";
import createUserAvatar from "./userAvatar";
import NotificationManager from "../../managers/NotificationManager";
import { i18nHandler } from "../../handlers/i18nHandler";


import { createInfoInput, CustomInputContainer } from "../input/infoInput";
import { validateDisplayName, validateEmail, validatePassword, validateConfirmPassword } from "../input/checkValidation.js";
import { simpleupdateFieldAppearance } from '../input/utils.js';
import { createPasswordInput, CustomPasswordInputContainer, checkPasswordStrength } from '../input/createPasswordInput.js';
import { createPasswordStrengthList } from "../input/passwordStrengh.js";
import { sanitizer } from "../../helpers/sanitizer";
import { createButton } from "../buttons";
import { removeClassStartingWith } from "../../utilities/selectors";
import { createUserDelete } from "../dialog/userDelete";

function updatePrivateButton(button: HTMLButtonElement): void {
	if (UserHandler.isPrivate) {
		button.textContent = i18nHandler.getValue("panel.updateProfile.buttons.public");
		removeClassStartingWith("bg-", button.classList);
		removeClassStartingWith("dark:bg-", button.classList);
		removeClassStartingWith("hover:bg-", button.classList);
		removeClassStartingWith("hover:dark:bg-", button.classList);
		button.classList.add("bg-green-600", "hover:bg-green-700", "dark:bg-green-600", "hover:dark:bg-green-700");
	} else {
		button.textContent = i18nHandler.getValue("panel.updateProfile.buttons.private");
		removeClassStartingWith("bg-", button.classList);
		removeClassStartingWith("dark:bg-", button.classList);
		removeClassStartingWith("hover:bg-", button.classList);
		removeClassStartingWith("hover:dark:bg-", button.classList);
		button.classList.add("bg-yellow-600", "hover:bg-yellow-700", "dark:bg-yellow-600", "hover:dark:bg-yellow-700");
	}
}

export async function createUserDialog(): Promise<HTMLDialogElement> {
	const dialog = createDialog({ allowClose: true });
	userMenuManager.uploadFile.value = "";
	dialog.className += " w-[500px] max-w-[90vw]";

	const userIdentifier = document.createElement("div");
	userIdentifier.className = "flex flex-col items-center";
	const userNameElement = document.createElement("p");
	userNameElement.className = "text-xl font-semibold text-gray-800 dark:text-gray-200";
	userNameElement.textContent = UserHandler.displayName || "User Name";
	userNameElement.setAttribute("data-user", "username");

	const emailElement = document.createElement("p");
	emailElement.className = "text-sm text-gray-600 dark:text-gray-400";
	emailElement.textContent = UserHandler.emailAddress ? UserHandler.maskEmail(UserHandler.emailAddress) : "Email Address";
	emailElement.setAttribute("data-user", "email");

	userIdentifier.appendChild(userNameElement);
	userIdentifier.appendChild(emailElement);

	const privateButton = createButton({
		i18n: UserHandler.isPrivate ? "panel.updateProfile.buttons.public" : "panel.updateProfile.buttons.private",
		addClasses: "w-2/3",
		color: `${UserHandler.isPrivate ? "bg-green-600 hover:bg-green-700" : "bg-yellow-600 hover:bg-yellow-700"} text-white`,
		darkColor: `${UserHandler.isPrivate ? "dark:bg-green-600 hover:dark:bg-green-700" : "dark:bg-yellow-600 hover:dark:bg-yellow-700"} text-white`,
		id: "privateButton",
		f: () => {
			UserHandler.togglePrivacy().then(response => {
				updatePrivateButton(privateButton);
				NotificationManager.notify({
					"level": "success",
					"title": i18nHandler.getValue("panel.updateProfile.notification.updateSuccessTitle"),
					"message": i18nHandler.getValue("panel.updateProfile.notification.updateSuccessMessage")
				});
			}).catch(error => {
				console.error("Network error during profile update:", error);
				NotificationManager.notify({
					"level": "error",
					"title": i18nHandler.getValue("panel.updateProfile.notification.networkErrorTitle"),
					"message": i18nHandler.getValue("panel.updateProfile.notification.networkErrorMessage")
				});
			});
		}
	});

	const logoutButton = createButton({
		i18n: "panel.updateProfile.buttons.logout",
		addClasses: "w-2/3",
		color: "bg-red-600 hover:bg-red-700 text-white",
		darkColor: "dark:bg-red-600 hover:dark:bg-red-700 text-white",
		f: () => { UserHandler.logout().then(() => dialog.close()) }
	});

	const deleteButton = createButton({
		i18n: "panel.updateProfile.buttons.delete",
		addClasses: "w-2/3",
		color: "bg-red-800 hover:bg-red-900 text-white",
		darkColor: "dark:bg-red-800 hover:dark:bg-red-900 text-white",
		f: () => {
			dialog.close();
			createUserDelete();
		}
	});

	const hr = document.createElement("hr");
	hr.className = "w-full border-gray-600 my-4";

	const editProfileTitle = document.createElement("h2");
	editProfileTitle.className = "text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2";
	editProfileTitle.textContent = i18nHandler.getValue("panel.updateProfile.title");

	// --- Display Name ---
	const displayNameTextbox: CustomInputContainer = createInfoInput(i18nHandler.getValue("panel.updateProfile.fields.usernameLabel"), "displayName");
	// displayNameTextbox.inputElement.value = UserHandler.displayName || ""; // Pré-remplir
	const displayNameErrorFeedback = document.createElement("div");
	displayNameErrorFeedback.className = "text-sm text-red-400 ml-2 mt-1 hidden";
	displayNameTextbox.appendChild(displayNameErrorFeedback);

	// --- Email ---
	const emailTextbox: CustomInputContainer = createInfoInput(i18nHandler.getValue("panel.updateProfile.fields.emailLabel"), "email");
	emailTextbox.inputElement.type = "email"
	const emailErrorFeedback = document.createElement("div");
	emailErrorFeedback.className = "text-sm text-red-400 ml-2 mt-1 hidden";
	emailTextbox.appendChild(emailErrorFeedback);

	// --- New Password ---
	const passwordTextbox: CustomPasswordInputContainer = createPasswordInput(i18nHandler.getValue("panel.updateProfile.fields.passwordLabel"), "newPassword", true);
	const passwordErrorFeedback = document.createElement("div");
	passwordErrorFeedback.className = "text-sm text-red-400 ml-2 mt-1 hidden";
	passwordTextbox.appendChild(passwordErrorFeedback);

	// ** Ajout de la liste de force du mot de passe **
	const passwordStrengthHelper = createPasswordStrengthList();
	passwordTextbox.appendChild(passwordStrengthHelper.element);

	// --- Confirm New Password ---
	const confirmPasswordTextbox: CustomPasswordInputContainer = createPasswordInput(i18nHandler.getValue("panel.updateProfile.fields.confirmPasswordLabel"), "confirmNewPassword", false);
	const confirmPasswordErrorFeedback = document.createElement("div");
	confirmPasswordErrorFeedback.className = "text-sm text-red-400 ml-2 mt-1 hidden";
	confirmPasswordTextbox.appendChild(confirmPasswordErrorFeedback);

	const cancelButton = createButton({
		i18n: "panel.updateProfile.buttons.cancel",
		addClasses: "w-full",
		color: "bg-gray-600 hover:bg-gray-700 text-white",
		darkColor: "dark:bg-gray-600 hover:dark:bg-gray-700 text-white",
		f: () => dialog.remove()
	});

	const saveButton = createButton({
		f: () => {
			// Récupérer les valeurs des champs (nettoyées des espaces)
			const displayNameValue = displayNameTextbox.inputElement.value.trim();
			const emailValue = emailTextbox.inputElement.value.trim();
			const passwordValue = passwordTextbox.inputElement.value.trim();
			const confirmPasswordValue = confirmPasswordTextbox.inputElement.value.trim();

			// Variable pour suivre si le formulaire est globalement valide pour la soumission
			let isFormValidForSubmission = true;

			// Validation du Display Name : valide si vide, invalide si rempli et KO
			const isDisplayNameActuallyValid = simpleupdateFieldAppearance(displayNameTextbox, displayNameErrorFeedback, validateDisplayName, true, false);
			if (displayNameValue !== '' && !isDisplayNameActuallyValid) {
				isFormValidForSubmission = false;
			}

			// Validation de l'Email : valide si vide, invalide si rempli et KO
			const isEmailActuallyValid = simpleupdateFieldAppearance(emailTextbox, emailErrorFeedback, validateEmail, true, false);
			if (emailValue !== '' && !isEmailActuallyValid) {
				isFormValidForSubmission = false;
			}

			// --- Logique Spécifique pour les Mots de Passe ---
			const isPasswordActuallyValid = simpleupdateFieldAppearance(passwordTextbox, passwordErrorFeedback, validatePassword, true, false);
			const isConfirmPasswordActuallyValid = simpleupdateFieldAppearance(
				confirmPasswordTextbox,
				confirmPasswordErrorFeedback,
				(value: string) => validateConfirmPassword(value, passwordValue),
				true,
				false
			);

			if (passwordValue !== '' || confirmPasswordValue !== '') { // Si au moins un des champs de mot de passe est rempli
				if (passwordValue === '') { // Si le nouveau mot de passe est vide mais la confirmation est remplie
					NotificationManager.notify({
						"level": "error",
						"title": i18nHandler.getValue("panel.updateProfile.notification.validationErrorTitle"),
						"message": i18nHandler.getValue("panel.registerPanel.confirmPasswordLabel")
					});
					isFormValidForSubmission = false;
				} else if (!isPasswordActuallyValid) { // Si le nouveau mot de passe est rempli mais invalide
					isFormValidForSubmission = false;
				} else if (confirmPasswordValue === '') { // Si le nouveau mot de passe est valide mais la confirmation est vide
					NotificationManager.notify({
						"level": "error",
						"title": i18nHandler.getValue("panel.updateProfile.notification.validationErrorTitle"),
						"message": i18nHandler.getValue("panel.registerPanel.validation.passwordRequired")
					});
					isFormValidForSubmission = false;
				} else if (!isConfirmPasswordActuallyValid) { // Si les deux sont remplis mais la confirmation est invalide
					isFormValidForSubmission = false;
				}
			}


			if (!isFormValidForSubmission) {
				NotificationManager.notify({
					"level": "error",
					"title": i18nHandler.getValue("panel.updateProfile.notification.validationErrorTitle"),
					"message": i18nHandler.getValue("panel.updateProfile.notification.validationErrorMessage")
				});
				return;
			}

			// --- PRÉPARATION DES DONNÉES POUR LE BACKEND (LOGIQUE RESTAURÉE) ---
			const updateData: Partial<updateUserData> = {};
			let changesMade = false;

			// Si l'utilisateur a sélectionné un nouvel avatar
			if (userMenuManager.uploadFile.files?.[0]) {
				updateData.Avatar = userMenuManager.uploadFile.files[0];
				userMenuManager.uploadFile.value = "";
				changesMade = true;
			}

			// Si le champ mot de passe a été rempli (et qu'il est valide)
			// La validation frontend a déjà mis à jour isPasswordActuallyValid
			if (passwordValue) { // On ajoute au FormData s'il y a une valeur, la validation aura géré l'isValidité
				updateData.Password = passwordValue;
				changesMade = true;
			}

			// Si l'email a été rempli ET modifié (et qu'il est valide)
			if (emailValue && emailValue !== UserHandler.emailAddress) {
				updateData.EmailAddress = emailValue;
				changesMade = true;
			}

			// Si le nom d'affichage a été rempli ET modifié (et qu'il est valide)
			if (displayNameValue && displayNameValue !== UserHandler.displayName) {
				updateData.DisplayName = displayNameValue;
				changesMade = true;
			}

			// --- ENVOI AU BACKEND OU MESSAGE 'NO CHANGES' ---
			// La soumission se fait si des changements ont été détectés dans les champs À ENVOYER
			// ET que le formulaire est valide (selon `isFormValidForSubmission`)
			if (changesMade) {
				UserHandler.updateUser(updateData).then(response => {
					UserHandler.fetchUser();
					NotificationManager.notify({
						"level": "success",
						"title": i18nHandler.getValue("panel.updateProfile.notification.updateSuccessTitle"),
						"message": i18nHandler.getValue("panel.updateProfile.notification.updateSuccessMessage")
					});
					dialog.remove();
				}).catch(error => {
					console.error("Failed to update profile");
					NotificationManager.notify({
						"level": "error",
						"title": i18nHandler.getValue("panel.updateProfile.notification.updateErrorTitle"),
						"message": i18nHandler.getValue("panel.updateProfile.notification.updateErrorMessage")
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
		},
		addClasses: "w-full",
		color: "bg-blue-600 hover:bg-blue-700 text-white",
		darkColor: "dark:bg-blue-600 hover:dark:bg-blue-700 text-white",
		i18n: "panel.updateProfile.buttons.save",
	});


	const buttonsContainer = document.createElement("div");
	buttonsContainer.className = "flex gap-x-2 mt-4 w-2/3 justify-between";
	buttonsContainer.appendChild(cancelButton);
	buttonsContainer.appendChild(saveButton);

	dialog.appendChild(createUserAvatar({
		sizeClass: "min-h-32 min-h-32 w-32 h-32",
		editable: true,
		playerId: UserHandler.user?.PlayerID,
	}));
	dialog.appendChild(userIdentifier);
	dialog.appendChild(privateButton);
	dialog.appendChild(logoutButton);
	dialog.appendChild(deleteButton);
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
		simpleupdateFieldAppearance(displayNameTextbox, displayNameErrorFeedback, validateDisplayName, true, false);
	});
	displayNameTextbox.inputElement.addEventListener('focus', () => {
		simpleupdateFieldAppearance(displayNameTextbox, displayNameErrorFeedback, validateDisplayName, true, false);
	});
	displayNameTextbox.inputElement.addEventListener('blur', () => {
		displayNameTextbox._touched = true;
		simpleupdateFieldAppearance(displayNameTextbox, displayNameErrorFeedback, validateDisplayName, false, false);
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
		simpleupdateFieldAppearance(emailTextbox, emailErrorFeedback, validateIllegalCharsOnly, true, false);
	});
	emailTextbox.inputElement.addEventListener('focus', () => {
		simpleupdateFieldAppearance(emailTextbox, emailErrorFeedback, validateEmail, true, false);
	});
	emailTextbox.inputElement.addEventListener('blur', () => {
		emailTextbox._touched = true;
		simpleupdateFieldAppearance(emailTextbox, emailErrorFeedback, validateEmail, false, false);
	});

	// --- New Password ---
	passwordTextbox.inputElement.addEventListener('input', () => {
		passwordTextbox._touched = true;
		simpleupdateFieldAppearance(passwordTextbox, passwordErrorFeedback, validatePassword, true, false);

		const strengthResult = checkPasswordStrength(passwordTextbox.inputElement.value);
		passwordStrengthHelper.update(strengthResult);

		confirmPasswordTextbox._touched = true;
		simpleupdateFieldAppearance(
			confirmPasswordTextbox,
			confirmPasswordErrorFeedback,
			(value: string) => validateConfirmPassword(value, passwordTextbox.inputElement.value.trim()),
			true,
			false
		);
	});
	passwordTextbox.inputElement.addEventListener('focus', () => {
		simpleupdateFieldAppearance(passwordTextbox, passwordErrorFeedback, validatePassword, true, false);
		passwordStrengthHelper.element.classList.remove('hidden');
		const strengthResult = checkPasswordStrength(passwordTextbox.inputElement.value);
		passwordStrengthHelper.update(strengthResult);
	});
	passwordTextbox.inputElement.addEventListener('blur', () => {
		passwordTextbox._touched = true;
		simpleupdateFieldAppearance(passwordTextbox, passwordErrorFeedback, validatePassword, false, false);
		passwordStrengthHelper.element.classList.add('hidden');
	});

	// --- Confirm New Password ---
	confirmPasswordTextbox.inputElement.addEventListener('input', () => {
		confirmPasswordTextbox._touched = true;
		simpleupdateFieldAppearance(
			confirmPasswordTextbox,
			confirmPasswordErrorFeedback,
			(value: string) => validateConfirmPassword(value, passwordTextbox.inputElement.value.trim()),
			true,
			false
		);
	});
	confirmPasswordTextbox.inputElement.addEventListener('focus', () => {
		simpleupdateFieldAppearance(
			confirmPasswordTextbox,
			confirmPasswordErrorFeedback,
			(value: string) => validateConfirmPassword(value, passwordTextbox.inputElement.value.trim()),
			true,
			false
		);
	});
	confirmPasswordTextbox.inputElement.addEventListener('blur', () => {
		confirmPasswordTextbox._touched = true;
		simpleupdateFieldAppearance(
			confirmPasswordTextbox,
			confirmPasswordErrorFeedback,
			(value: string) => validateConfirmPassword(value, passwordTextbox.inputElement.value.trim()),
			false,
			false
		);
	});

	// Initialisation des états au démarrage
	simpleupdateFieldAppearance(displayNameTextbox, displayNameErrorFeedback, validateDisplayName, false, false);
	simpleupdateFieldAppearance(emailTextbox, emailErrorFeedback, validateEmail, false, false);
	simpleupdateFieldAppearance(passwordTextbox, passwordErrorFeedback, validatePassword, false, false);
	passwordStrengthHelper.element.classList.add('hidden');
	simpleupdateFieldAppearance(
		confirmPasswordTextbox,
		confirmPasswordErrorFeedback,
		(value: string) => validateConfirmPassword(value, passwordTextbox.inputElement.value.trim()),
		false,
		false
	);


	return dialog;
}


export async function createUserMenuSettings(): Promise<HTMLDivElement> {
	const template = document.createElement("template");
	template.innerHTML = `
        <div id="userMenuSettings" class="flex gap-x-2 items-center justify-center cursor-pointer">
            <span data-user="username" class="text-lg font-semibold text-gray-800 dark:text-gray-200">${sanitizer(UserHandler.displayName || "User Name")}</span>
        </div>
    `;
	const userMenuSettings = template.content.firstElementChild as HTMLDivElement;
	userMenuSettings.appendChild(createUserAvatar({ disableClick: true, playerId: UserHandler.user?.PlayerID }));
	userMenuSettings.onclick = async () => (await createUserDialog()).showModal();
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
