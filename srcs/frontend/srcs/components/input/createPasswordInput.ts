// srcs/components/input/createPasswordInput.ts
export interface PasswordStrengthResult { 
    minLength: boolean;
    hasUppercase: boolean;
    hasLowercase: boolean;
    hasNumber: boolean;
    hasSpecialChar: boolean;
}
/*export function checkPasswordStrength(password: string): PasswordStrengthResult { 
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
}*/
/*
export function createPasswordInput(
    placeholder: string, 
    name: string, 
    enableStrengthCheck: boolean = true // Ce paramètre sera stocké
): HTMLDivElement & { value: string, inputElement: HTMLInputElement, _enableStrengthCheck: boolean } { // <-- Ajout de la propriété au type retourné
    const container = document.createElement("div");
    container.className = "relative w-full"; 
    const input = document.createElement("input");
    input.type = "password";
    input.name = name;
    input.placeholder = placeholder;
    input.className = `
      w-full
      px-4
      py-2
      mt-2
      text-white
      bg-gray-800
      border
      border-gray-700
      rounded-lg
      focus:outline-none
      focus:ring-2
      focus:ring-blue-500
      dark:bg-white
      dark:text-black
      pr-10
    `.replace(/\s+/g, " ");
    const toggleButton = document.createElement("button");
    toggleButton.type = "button";
    toggleButton.className = `
      absolute
      right-3
      top-1/2
      -translate-y-1/2
      text-gray-400
      hover:text-gray-200
      focus:outline-none
      dark:text-gray-600
      dark:hover:text-gray-800
    `.replace(/\s+/g, " ");
    const eyeIcon = document.createElement("span");
    eyeIcon.className = "icon";
    eyeIcon.textContent = "👁️";
    const eyeSlashIcon = document.createElement("span");
    eyeSlashIcon.className = "icon hidden";
    eyeSlashIcon.textContent = "🙈";
    toggleButton.appendChild(eyeIcon);
    toggleButton.appendChild(eyeSlashIcon);
    toggleButton.addEventListener("click", () => {
        if (input.type === "password") {
            input.type = "text";
            eyeIcon.classList.add("hidden");
            eyeSlashIcon.classList.remove("hidden");
        } else {
            input.type = "password";
            eyeIcon.classList.remove("hidden");
            eyeSlashIcon.classList.add("hidden");
        }
    });
    // Ces événements sont toujours dispatchés, c'est au parent de décider d'y réagir.
    input.addEventListener("input", () => {
        const strengthResult = checkPasswordStrength(input.value);
        const event = new CustomEvent('passwordStrengthChange', {
            detail: { strengthResult: strengthResult }
        });
        input.dispatchEvent(event);
    });
    input.addEventListener("focus", () => {
        const event = new CustomEvent('passwordInputFocus', {
            detail: { inputName: name }
        });
        input.dispatchEvent(event);
    });
    input.addEventListener("blur", () => {
        const event = new CustomEvent('passwordInputBlur', {
            detail: { inputName: name }
        });
        input.dispatchEvent(event);
    });
    container.appendChild(input);
    container.appendChild(toggleButton);
    Object.defineProperty(container, 'value', {
        get: () => input.value,
        set: (val) => { 
            input.value = val;
            input.dispatchEvent(new Event('input')); 
        },
        enumerable: true,
        configurable: true
    });
    (container as any).inputElement = input;
    // <-- NOUVEAU : Stocke le booléen enableStrengthCheck sur l'élément retourné
    (container as any)._enableStrengthCheck = enableStrengthCheck; 
    return container as HTMLDivElement & { value: string, inputElement: HTMLInputElement, _enableStrengthCheck: boolean };
}*/
// Pour le typage des événements personnalisés
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
}
export function createPasswordInput(
    placeholder: string, 
    name: string, 
    enableStrengthCheck: boolean = true // Ce paramètre sera stocké
): CustomPasswordInputContainer { // <-- Utilisation de la nouvelle interface CustomPasswordInputContainer
    const container = document.createElement("div") as CustomPasswordInputContainer; // Cast initial
    container.className = "relative w-full"; 
    const input = document.createElement("input");
    input.type = "password";
    input.name = name;
    input.placeholder = placeholder;
    input.className = `
      w-full
      px-4
      py-2
      mt-2
      text-white
      bg-gray-800
      border
      border-gray-700
      rounded-lg
      focus:outline-none
      focus:ring-2
      focus:ring-blue-500
      dark:bg-white
      dark:text-black
      pr-10
    `.replace(/\s+/g, " ");
    const toggleButton = document.createElement("button");
    toggleButton.type = "button";
    toggleButton.className = `
      absolute
      right-3
      top-1/2
      -translate-y-1/2
      text-gray-400
      hover:text-gray-200
      focus:outline-none
      dark:text-gray-600
      dark:hover:text-gray-800
    `.replace(/\s+/g, " ");
    const eyeIcon = document.createElement("span");
    eyeIcon.className = "icon";
    eyeIcon.textContent = "👁️";
    const eyeSlashIcon = document.createElement("span");
    eyeSlashIcon.className = "icon hidden";
    eyeSlashIcon.textContent = "🙈";
    toggleButton.appendChild(eyeIcon);
    toggleButton.appendChild(eyeSlashIcon);
    toggleButton.addEventListener("click", () => {
        if (input.type === "password") {
            input.type = "text";
            eyeIcon.classList.add("hidden");
            eyeSlashIcon.classList.remove("hidden");
        } else {
            input.type = "password";
            eyeIcon.classList.remove("hidden");
            eyeSlashIcon.classList.add("hidden");
        }
    });
    // --- LOGIQUE DE VÉRIFICATION DE FORCE DU MOT DE PASSE ---
    const strengthList = document.createElement("ul");
    strengthList.className = "mt-2 text-sm text-gray-400 dark:text-gray-600";
    const criteria = [
        { key: 'minLength', text: 'Au moins 8 caractères' },
        { key: 'hasUppercase', text: 'Au moins une majuscule' },
        { key: 'hasLowercase', text: 'Au moins une minuscule' },
        { key: 'hasNumber', text: 'Au moins un chiffre' },
        { key: 'hasSpecialChar', text: 'Au moins un caractère spécial (!@#$%)' },
    ];
    const strengthItems: { [key: string]: HTMLLIElement } = {}; 
    criteria.forEach(c => {
        const li = document.createElement("li");
        li.textContent = c.text;
        li.className = "flex items-center gap-2";
     
        const marker = document.createElement("span");
        marker.className = "w-3 h-3 rounded-full border border-gray-500 flex-shrink-0"; 
        li.prepend(marker);
        strengthList.appendChild(li);
        strengthItems[c.key] = li;
    });
    const updateStrengthDisplay = () => {
        const password = input.value;
        const result = checkPasswordStrength(password);
        criteria.forEach(c => {
            const li = strengthItems[c.key];
            if (li) {
                const marker = li.querySelector('span');
                if (result[c.key as keyof PasswordStrengthResult]) {
                    li.classList.remove("text-gray-400", "dark:text-gray-600");
                    li.classList.add("text-green-500", "dark:text-green-400");
                    if (marker) {
                        marker.classList.remove("border-gray-500");
                        marker.classList.add("bg-green-500", "border-green-500");
                    }
                } else {
                    li.classList.remove("text-green-500", "dark:text-green-400");
                    li.classList.add("text-gray-400", "dark:text-gray-600");
                    if (marker) {
                        marker.classList.remove("bg-green-500", "border-green-500");
                        marker.classList.add("border-gray-500");
                    }
                }
            }
        });
    };
    // Écouter les saisies sur l'input pour déclencher la vérification
    input.addEventListener("input", () => {
        if (enableStrengthCheck) { // NOUVEAU : Afficher la force seulement si activé
            updateStrengthDisplay();
        }
        // Dispatcher les événements personnalisés (toujours, peu importe enableStrengthCheck)
        const strengthResult = checkPasswordStrength(input.value);
        const event = new CustomEvent('passwordStrengthChange', {
            detail: { strengthResult: strengthResult }
        });
        input.dispatchEvent(event);
    });
    // Cacher la liste de force si la case n'est pas cochée au focus
    input.addEventListener("focus", () => {
        if (enableStrengthCheck) {
            strengthList.classList.remove("hidden");
        }
        const event = new CustomEvent('passwordInputFocus', {
            detail: { inputName: name }
        });
        input.dispatchEvent(event);
    });
    input.addEventListener("blur", () => {
        if (enableStrengthCheck) {
            strengthList.classList.add("hidden");
        }
        const event = new CustomEvent('passwordInputBlur', {
            detail: { inputName: name }
        });
        input.dispatchEvent(event);
    });
    // Ajoute la liste de force seulement si enableStrengthCheck est vrai
    if (enableStrengthCheck) {
        container.appendChild(strengthList);
        strengthList.classList.add("hidden"); // Cacher par défaut et montrer au focus
    }
    // --- FIN LOGIQUE DE VÉRIFICATION DE FORCE DU MOT DE PASSE ---
    container.appendChild(input);
    container.appendChild(toggleButton);
    // Définition des propriétés directement sur le container typé
    container.value = input.value; // Initialisation
    Object.defineProperty(container, 'value', {
        get: () => input.value,
        set: (val: string) => { // Type 'val' explicitement
            input.value = val;
            input.dispatchEvent(new Event('input')); 
        },
        enumerable: true,
        configurable: true
    });
    container.inputElement = input;
    container._enableStrengthCheck = enableStrengthCheck; // Stocke la valeur du paramètre
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