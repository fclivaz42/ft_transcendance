// // components/input/passwordInput.ts

// //critere de force du mot de passe
// interface PasswordStrengthResult 
// {
//     minLength: boolean;
//     hasUppercase: boolean;
//     hasLowercase: boolean;
//     hasNumber: boolean;
//     hasSpecialChar: boolean;
// }
// function checkPasswordStrength(password: string): PasswordStrengthResult 
// {
//     const minLength = 8; // Longueur minimale requise
//     const hasUppercase = /[A-Z]/.test(password);
//     const hasLowercase = /[a-z]/.test(password);
//     const hasNumber = /[0-9]/.test(password);
//     const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`€]/.test(password); // Ajoutez ou retirez des caractères spéciaux au besoin

//     return {
//         minLength: password.length >= minLength,
//         hasUppercase: hasUppercase,
//         hasLowercase: hasLowercase,
//         hasNumber: hasNumber,
//         hasSpecialChar: hasSpecialChar,
//     };
// }



// export function createPasswordInput(placeholder: string, name: string): HTMLDivElement {
//     // Conteneur principal pour l'input et le bouton d'œil
//     const container = document.createElement("div");
//     container.className = "relative w-full"; // `relative` pour positionner l'icône de l'œil
  
//     // L'input de mot de passe
//     const input = document.createElement("input");
//     input.type = "password"; // C'est crucial pour masquer le texte
//     input.name = name;
//     input.placeholder = placeholder;
  
//     // Classes pour l'input (similaires à votre createInfoInput)
//     input.className = `
//       w-full
//       px-4
//       py-2
//       mt-2
//       text-white
//       bg-gray-800
//       border
//       border-gray-700
//       rounded-lg
//       focus:outline-none
//       focus:ring-2
//       focus:ring-blue-500
//       dark:bg-white
//       dark:text-black
//       pr-10 // Ajoutez un padding à droite pour laisser de la place au bouton œil
//     `.replace(/\s+/g, " ");
  
//     // Bouton pour afficher/masquer le mot de passe (l'icône de l'œil)
//     const toggleButton = document.createElement("button");
//     toggleButton.type = "button"; // Important: ne pas soumettre le formulaire
//     toggleButton.className = `
//       absolute
//       right-3
//       top-1/2
//       -translate-y-1/2
//       text-gray-400
//       hover:text-gray-200
//       focus:outline-none
//       dark:text-gray-600
//       dark:hover:text-gray-800
//     `.replace(/\s+/g, " ");
  
//     // Icônes de l'œil (vous pouvez utiliser des SVG, Font Awesome, ou simplement du texte)
//     // Pour la simplicité, utilisons des symboles Unicode ou du texte pour le moment.
//     // Idéalement, utilisez des icônes SVG pour plus de flexibilité.
//     const eyeIcon = document.createElement("span");
//     eyeIcon.className = "icon"; // Pourrait être utilisé pour styliser si vous utilisez des librairies d'icônes
//     eyeIcon.textContent = "👁️"; // Icône "œil" par défaut (visible)
  
//     const eyeSlashIcon = document.createElement("span");
//     eyeSlashIcon.className = "icon hidden"; // Icône "œil barré" (cachée par défaut)
//     eyeSlashIcon.textContent = "🙈"; // Ou "👁️‍🗨️" ou autre
  
//     toggleButton.appendChild(eyeIcon);
//     toggleButton.appendChild(eyeSlashIcon);
  
//     // Logique de bascule
//     toggleButton.addEventListener("click", () => {
//       if (input.type === "password") {
//         input.type = "text";
//         eyeIcon.classList.add("hidden");
//         eyeSlashIcon.classList.remove("hidden");
//       } else {
//         input.type = "password";
//         eyeIcon.classList.remove("hidden");
//         eyeSlashIcon.classList.add("hidden");
//       }
//     });
  
//     ///////////////////////strenght display/////////////////////
//     const strengthList = document.createElement("ul");
//     strengthList.className = "mt-2 text-sm text-gray-400 dark:text-gray-600";

//     const criteria = [
//         { key: 'minLength', text: 'Au moins 8 caractères' },
//         { key: 'hasUppercase', text: 'Au moins une majuscule' },
//         { key: 'hasLowercase', text: 'Au moins une minuscule' },
//         { key: 'hasNumber', text: 'Au moins un chiffre' },
//         { key: 'hasSpecialChar', text: 'Au moins un caractère spécial (!@#$%)' },
//     ];

//     const strengthItems: { [key: string]: HTMLLIElement } = {}; // Pour stocker les éléments li

//     criteria.forEach(c => {
//         const li = document.createElement("li");
//         li.textContent = c.text;
//         li.className = "flex items-center gap-2"; // Pour aligner le texte et l'icône/marqueur
        
//         // Ajouter un marqueur visuel pour l'état (par exemple, un cercle vide ou une croix/coche)
//         const marker = document.createElement("span");
//         marker.className = "w-3 h-3 rounded-full border border-gray-500 flex-shrink-0"; // Marqueur initial
//         li.prepend(marker); // Ajoute le marqueur avant le texte

//         strengthList.appendChild(li);
//         strengthItems[c.key] = li; // Stocke la référence au li
//     });

//     // Fonction pour mettre à jour l'affichage de la force
//     const updateStrengthDisplay = () => {
//         const password = input.value;
//         const result = checkPasswordStrength(password);

//         criteria.forEach(c => {
//             const li = strengthItems[c.key];
//             if (li) {
//                 const marker = li.querySelector('span'); // Sélectionne le marqueur
//                 if (result[c.key as keyof PasswordStrengthResult]) {
//                     // Validé: texte vert, icône de coche (ou cercle plein vert)
//                     li.classList.remove("text-gray-400", "dark:text-gray-600");
//                     li.classList.add("text-green-500", "dark:text-green-400");
//                     if (marker) {
//                         marker.classList.remove("border-gray-500");
//                         marker.classList.add("bg-green-500", "border-green-500");
//                     }
//                 } else {
//                     // Non validé: texte rouge (ou reste gris), icône de croix (ou cercle vide)
//                     li.classList.remove("text-green-500", "dark:text-green-400");
//                     li.classList.add("text-gray-400", "dark:text-gray-600"); // Revenir au gris si non valide
//                     if (marker) {
//                         marker.classList.remove("bg-green-500", "border-green-500");
//                         marker.classList.add("border-gray-500"); // Revenir au cercle vide
//                     }
//                 }
//             }
//         });
//     };
//      // Écouter les saisies sur l'input pour déclencher la vérification
//     input.addEventListener("input", updateStrengthDisplay);


//     // Assembler les éléments
//     container.appendChild(input);
//     container.appendChild(toggleButton);
//     container.appendChild(strengthList);
  
//     // Ajouter une propriété `value` pour un accès facile
//     // Ceci est un accesseur pour rendre l'accès à `input.value` plus propre
//     Object.defineProperty(container, 'value', {
//       get: () => input.value,
//       set: (val) => { input.value = val; },
//       enumerable: true,
//       configurable: true
//     });
  
//     return container; // Retourne le conteneur, pas seulement l'input
//   }

// components/input/createPasswordInput.ts

// Interface pour le résultat de la vérification de la force du mot de passe




// ///////////////////////////////////en cours
// // Définit la structure des résultats de la vérification.//////fenetre dialogue + true false en cours
// export interface PasswordStrengthResult {
//     minLength: boolean;
//     hasUppercase: boolean;
//     hasLowercase: boolean;
//     hasNumber: boolean;
//     hasSpecialChar: boolean;
// }

// /**
//  * Vérifie la force d'un mot de passe en fonction de critères prédéfinis.
//  * @param password Le mot de passe à vérifier.
//  * @returns Un objet contenant le résultat de chaque critère.
//  */
// // calcule la force du mot de passe et renvoie un objet PasswordStrengthResult
// export function checkPasswordStrength(password: string): PasswordStrengthResult { // <-- AJOUTER 'export' ICI
//     const minLength = 8; // Longueur minimale requise
//     const hasUppercase = /[A-Z]/.test(password);
//     const hasLowercase = /[a-z]/.test(password);
//     const hasNumber = /[0-9]/.test(password);
//     const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`€]/.test(password); // Ajoutez ou retirez des caractères spéciaux au besoin

//     return {
//         minLength: password.length >= minLength,
//         hasUppercase: hasUppercase,
//         hasLowercase: hasLowercase,
//         hasNumber: hasNumber,
//         hasSpecialChar: hasSpecialChar,
//     };
// }
// //crée <input type="password">
// //gere + bouton pour afficher/masquer le mot de passe
// //appelle checkPasswordStrength 
// export function createPasswordInput(placeholder: string, name: string, enableStrengthCheck: boolean = true): HTMLDivElement {
//     // ... (le reste de votre code de createPasswordInput.ts, inchangé)
//     const container = document.createElement("div");
//     container.className = "relative w-full"; 

//     const input = document.createElement("input");
//     input.type = "password";
//     input.name = name;
//     input.placeholder = placeholder;

//     input.className = `
//       w-full
//       px-4
//       py-2
//       mt-2
//       text-white
//       bg-gray-800
//       border
//       border-gray-700
//       rounded-lg
//       focus:outline-none
//       focus:ring-2
//       focus:ring-blue-500
//       dark:bg-white
//       dark:text-black
//       pr-10
//     `.replace(/\s+/g, " ");

//     const toggleButton = document.createElement("button");
//     toggleButton.type = "button";
//     toggleButton.className = `
//       absolute
//       right-3
//       top-1/2
//       -translate-y-1/2
//       text-gray-400
//       hover:text-gray-200
//       focus:outline-none
//       dark:text-gray-600
//       dark:hover:text-gray-800
//     `.replace(/\s+/g, " ");

//     const eyeIcon = document.createElement("span");
//     eyeIcon.className = "icon";
//     eyeIcon.textContent = "👁️";

//     const eyeSlashIcon = document.createElement("span");
//     eyeSlashIcon.className = "icon hidden";
//     eyeSlashIcon.textContent = "🙈";

//     toggleButton.appendChild(eyeIcon);
//     toggleButton.appendChild(eyeSlashIcon);

//     toggleButton.addEventListener("click", () => {
//         if (input.type === "password") {
//             input.type = "text";
//             eyeIcon.classList.add("hidden");
//             eyeSlashIcon.classList.remove("hidden");
//         } else {
//             input.type = "password";
//             eyeIcon.classList.remove("hidden");
//             eyeSlashIcon.classList.add("hidden");
//         }
//     });

//     input.addEventListener("input", () => {
//         const strengthResult = checkPasswordStrength(input.value);
//         const event = new CustomEvent('passwordStrengthChange', {
//             detail: { strengthResult: strengthResult }
//         });
//         input.dispatchEvent(event);
//     });

//     input.addEventListener("focus", () => {
//         const event = new CustomEvent('passwordInputFocus', {
//             detail: { inputName: name }
//         });
//         input.dispatchEvent(event);
//     });

//     input.addEventListener("blur", () => {
//         const event = new CustomEvent('passwordInputBlur', {
//             detail: { inputName: name }
//         });
//         input.dispatchEvent(event);
//     });

//     container.appendChild(input);
//     container.appendChild(toggleButton);

//     Object.defineProperty(container, 'value', {
//         get: () => input.value,
//         set: (val) => { 
//             input.value = val;
//             input.dispatchEvent(new Event('input')); 
//         },
//         enumerable: true,
//         configurable: true
//     });

//     (container as any).inputElement = input;

//     return container;
// }

// // Pour le typage des événements personnalisés
// declare global {
//     interface HTMLElementEventMap {
//         'passwordStrengthChange': CustomEvent<{ strengthResult: PasswordStrengthResult }>;
//         'passwordInputFocus': CustomEvent<{ inputName: string }>;
//         'passwordInputBlur': CustomEvent<{ inputName: string }>;
//     }
// }

// srcs/components/input/createPasswordInput.ts

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
}

// Pour le typage des événements personnalisés
declare global {
    interface HTMLElementEventMap {
        'passwordStrengthChange': CustomEvent<{ strengthResult: PasswordStrengthResult }>;
        'passwordInputFocus': CustomEvent<{ inputName: string }>;
        'passwordInputBlur': CustomEvent<{ inputName: string }>;
    }
}