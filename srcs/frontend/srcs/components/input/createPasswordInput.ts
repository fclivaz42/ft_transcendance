// createPasswordInput() crée l'élément HTML de l'input de mot de passe contient la logique de VÉRIFICATION
//checkPasswordStrength(password: string) qui calcule si un mot de passe respecte les critères (majuscule, minuscule, chiffre, etc.)

import createTextbox from "./textbox";

// -----> (passwordStrengthChange, passwordInputFocus, passwordInputBlur).
export interface PasswordStrengthResult { 
    minLength: boolean;
    hasUppercase: boolean;
    hasLowercase: boolean;
    hasNumber: boolean;
    hasSpecialChar: boolean;
}

declare global {
    interface HTMLElementEventMap {
        'passwordStrengthChange': CustomEvent<{ strengthResult: PasswordStrengthResult }>;
        'passwordInputFocus': CustomEvent<{ inputName: string }>;
        'passwordInputBlur': CustomEvent<{ inputName: string }>;
    }
}
//srcs/components/input/createPasswordInput.ts
export interface PasswordStrengthResult { 
    minLength: boolean;
    hasUppercase: boolean;
    hasLowercase: boolean;
    hasNumber: boolean;
    hasSpecialChar: boolean;
}
export function checkPasswordStrength(password: string): PasswordStrengthResult { 
    const minLength = 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`€]/.test(password);
    return {
        minLength: password.length >= minLength,
        hasUppercase: hasUppercase,
        hasLowercase: hasLowercase,
        hasNumber: hasNumber,
        hasSpecialChar: hasSpecialChar,
    };
}
// Définition de l'interface pour le type de retour de createPasswordInput
// C'est ce type qui inclura `value`, `inputElement` et `_enableStrengthCheck`
export interface CustomPasswordInputContainer extends HTMLDivElement {
    value: string;
    inputElement: HTMLInputElement;
    _enableStrengthCheck: boolean; // Ajout de la propriété au type
      _touched: boolean; // Indique si l'input a été touché (focus/blur)
}


export function createPasswordInput(
    placeholder: string,
    name: string,
    enableStrengthCheck: boolean = true, // Ce paramètre sera stocké mais la logique de liste est gérée à l'extérieur
	autoComplete?: string
): CustomPasswordInputContainer {
    const container = document.createElement("div") as CustomPasswordInputContainer;
    container.className = "relative w-full"; // Ces classes sont bonnes

	const input = createTextbox({
		type: "password",
		placeholder: placeholder,
		name: name,
		id: name, // Important pour associer le label
		autoComplete: autoComplete,
	});

    const toggleButton = document.createElement("button");
    toggleButton.type = "button";
    toggleButton.tabIndex = -1;
    toggleButton.className = `
		absolute inset-y-1 right-2 
		flex items-center justify-center
		w-8 h-8 // UNE LARGEUR ET HAUTEUR FIXES
		p-1 // PADDING
		text-gray-500 hover:text-gray-700
		dark:text-gray-400 dark:hover:text-gray-200
		focus:outline-none 
		z-10 cursor-pointer
    `.replace(/\s+/g, " ");

    const eyeIcon = document.createElement("img");
    eyeIcon.src = "/assets/ui/eye-open.svg"; // <--- Chemin vers votre SVG pour l'œil ouvert
    eyeIcon.alt = "Afficher le mot de passe"; // Texte alternatif pour l'accessibilité
    eyeIcon.className = "w-5 h-5"; // Taille de l'icône, ajustez si besoin

    // Icône "œil barré" (cachée par défaut)
    const eyeSlashIcon = document.createElement("img");
    eyeSlashIcon.src = "/assets/ui/eye-closed.svg"; // <--- Chemin vers votre SVG pour l'œil fermé
    eyeSlashIcon.alt = "Cacher le mot de passe"; // Texte alternatif pour l'accessibilité
    eyeSlashIcon.className = "w-5 h-5 hidden"; // Taille et 'hidden' pour qu'elle soit cachée au départ

    toggleButton.appendChild(eyeIcon);
    toggleButton.appendChild(eyeSlashIcon);

    toggleButton.addEventListener("click", () => {
        if (input.type === "password") {
            input.type = "text";
            eyeIcon.classList.add("hidden");        // Cache l'œil ouvert
            eyeSlashIcon.classList.remove("hidden"); // Affiche l'œil barré
        } else {
            input.type = "password";
            eyeIcon.classList.remove("hidden");     // Affiche l'œil ouvert
            eyeSlashIcon.classList.add("hidden");   // Cache l'œil barré
        }
    });

    // --- Écouteurs d'événements pour le parent (loginDialog.ts) ---
    // Ces événements sont dispatchés pour que le parent puisse gérer la liste de force externe
    input.addEventListener("input", () => {
        if (enableStrengthCheck) { // Ne dispatch l'événement que si la vérification de force est activée pour cet input
            const strengthResult = checkPasswordStrength(input.value);
            const event = new CustomEvent('passwordStrengthChange', {
                detail: { strengthResult: strengthResult }
            });
            input.dispatchEvent(event);
        }
    });

    input.addEventListener("focus", () => {
        if (enableStrengthCheck) { // Ne dispatch l'événement que si la vérification de force est activée
            const event = new CustomEvent('passwordInputFocus', {
                detail: { inputName: name }
            });
            input.dispatchEvent(event);
        }
    });

    input.addEventListener("blur", () => {
        if (enableStrengthCheck) { // Ne dispatch l'événement que si la vérification de force est activée
            const event = new CustomEvent('passwordInputBlur', {
                detail: { inputName: name }
            });
            input.dispatchEvent(event);
        }
    });
    // --- FIN des écouteurs d'événements pour le parent ---

    container.appendChild(input);
    container.appendChild(toggleButton);

    // Définition des propriétés directement sur le container typé
    container.value = input.value; // Initialisation
    Object.defineProperty(container, 'value', {
        get: () => input.value,
        set: (val: string) => {
            input.value = val;
            input.dispatchEvent(new Event('input')); // Déclenche l'événement 'input' si la valeur est modifiée par programme
        },
        enumerable: true,
        configurable: true
    });
    container.inputElement = input;
    container._enableStrengthCheck = enableStrengthCheck; // Stocke la valeur du paramètre
    container._touched = false; // Initialiser à false
    return container;
}

// Pour le typage des événements personnalisés
declare global {
    interface HTMLElementEventMap {
        'passwordStrengthChange': CustomEvent<{ strengthResult: PasswordStrengthResult }>;
        'passwordInputFocus': CustomEvent<{ inputName: string }>;
        'passwordInputBlur': CustomEvent<{ inputName: string }>;
    }
}
