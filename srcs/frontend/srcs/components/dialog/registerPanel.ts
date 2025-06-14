// // displayNameContainer et emailContainer. Chacun est un div avec des classes flex flex-col gap-1 pour empiler l'input et son message d'erreur.
// //
// import { createInfoInput, CustomInputContainer } from '../input/infoInput.js';
// // If createPasswordInput returns a specific type (e.g., CustomPasswordInput), import it here.
// // Otherwise, createInfoInput is used for password fields.
// // import { createPasswordInput } from '../input/createPasswordInput.js';

// import { LoginDialogOptions } from './index.js'; // Import from your new index.ts

// export function createRegisterPanel(options: LoginDialogOptions) {
//   const registerPanel = document.createElement("div");
//   registerPanel.className = `
//     absolute inset-0
//     flex flex-col gap-3 
//     transition-transform duration-500 ease-in-out transform opacity-0
//     w-full
//     items-center
//   `.replace(/\s+/g, " ");

//   const registerForm = document.createElement("form");
//   registerForm.className = "flex flex-col gap-3 w-full max-w-xs px-2 mx-auto";

//   // --- CONTENEUR POUR LE NOM D'UTILISATEUR ET SON MESSAGE D'ERREUR ---
//   const displayNameContainer = document.createElement("div");
//   displayNameContainer.className = "flex flex-col gap-1"; // Organise label, input, error en colonne

//   const registerDisplayNameInput = createInfoInput("Nom d'utilisateur", "displayName"); // Renommé pour plus de clarté
//   // Si createInfoInput gère déjà le label, sinon ajoutez-le ici:
//   // const displayNameLabel = document.createElement("label");
//   // displayNameLabel.textContent = "Nom d'utilisateur";
//   // displayNameLabel.htmlFor = "displayName"; // Assurez-vous que createInfoInput donne un ID à l'input
//   // displayNameContainer.appendChild(displayNameLabel);

//   displayNameContainer.appendChild(registerDisplayNameInput);

//   const displayNameErrorFeedback = document.createElement("div");
//   displayNameErrorFeedback.className = "text-sm text-red-400 ml-2 hidden";
//   displayNameContainer.appendChild(displayNameErrorFeedback);
//   // --- FIN CONTENEUR DISPLAY NAME ---


//   // --- CONTENEUR POUR L'EMAIL ET SON MESSAGE D'ERREUR ---
//   const emailContainer = document.createElement("div");
//   emailContainer.className = "flex flex-col gap-1";

//   const registerEmailInput = createInfoInput("Adresse e-mail", "email");
//   emailContainer.appendChild(registerEmailInput);

//   const emailErrorFeedback = document.createElement("div");
//   emailErrorFeedback.className = "text-sm text-red-400 ml-2 hidden";
//   emailContainer.appendChild(emailErrorFeedback);
//   // --- FIN CONTENEUR EMAIL ---


//   // --- CONTENEUR POUR LE MOT DE PASSE ET SON MESSAGE D'ERREUR (si CustomPasswordInput ne le gère pas déjà) ---
//   // Note: Votre CustomPasswordInput semble déjà gérer cela avec passwordMatchFeedback,
//   // donc nous ne créons pas de conteneur ici si CustomPasswordInput est déjà un div parent.
//   const registerPasswordInput = createPasswordInput("Mot de passe", "password", true) as CustomPasswordInput;
//   const registerConfirmPasswordInput = createPasswordInput("Confirmer mot de passe", "confirmPassword", false) as CustomPasswordInput;
  
//   const passwordMatchFeedback = document.createElement("div");
//   passwordMatchFeedback.className = "text-sm text-red-400 ml-2 hidden items-center justify-end gap-1 font-semibold";
//   // L'ajout à registerConfirmPasswordInput suggère qu'il est déjà un conteneur.
//   registerConfirmPasswordInput.appendChild(passwordMatchFeedback);


//   const registerButton = document.createElement("button");
//   registerButton.textContent = "S'inscrire";
//   registerButton.type = "submit";
//   registerButton.className = `
//     font-semibold py-2 px-4 rounded
//     bg-transparent border border-green-700/[.3] 
//     shadow-[0_0_15px_rgba(0,255,0,0.1),_inset_0_0_10px_rgba(0,255,0,0.05)]
//     text-green-300/[.7] 
//     cursor-not-allowed
//     transition-all duration-500 ease-in-out
//   `.replace(/\s+/g, " ");
  
//   registerButton.disabled = true;

//   // --- AJOUT DES CONTENEURS AU FORMULAIRE ---
//   registerForm.appendChild(displayNameContainer); // Ajout du conteneur
//   registerForm.appendChild(emailContainer);       // Ajout du conteneur
//   registerForm.appendChild(registerPasswordInput); // Ces deux sont déjà des conteneurs grâce à createPasswordInput
//   registerForm.appendChild(registerConfirmPasswordInput);
//   registerForm.appendChild(registerButton);
//   registerPanel.appendChild(registerForm);

//   const switchToLoginLink = document.createElement("a");
//   switchToLoginLink.href = "#";
//   switchToLoginLink.textContent = "Déjà un compte ? Se connecter";
//   switchToLoginLink.className = "text-center text-blue-400 hover:text-blue-200 text-sm mt-1 cursor-pointer";
//   registerPanel.appendChild(switchToLoginLink);

//   // --- Fonction de validation du formulaire d'inscription ---
//   const validateRegisterForm = () => {
//       // Utilisez les inputs directs, car createInfoInput retourne l'input
//       const displayNameValue = registerDisplayNameInput.value.trim();
//       const emailValue = registerEmailInput.value.trim();
//       const passwordValue = registerPasswordInput.value.trim();
//       const confirmPasswordValue = registerConfirmPasswordInput.value.trim();

//       // ==========================================================
//       // --- VALIDATION DU DISPLAY NAME ---
//       // ==========================================================
//       // Regex pour lettres (a-z, A-Z), chiffres (0-9), tiret (-), point (.)
//       // Pas de tiret/point au début/fin, pas de tiret/point consécutifs, pas d'espaces, pas d'autres caractères spéciaux
//       const displayNameRegex = /^[a-zA-Z0-9]+([.-][a-zA-Z0-9]+)*[a-zA-Z0-9]?$/;
//       const isDisplayNameFilled = displayNameValue !== '';
//       const isDisplayNameValidFormat = displayNameRegex.test(displayNameValue);
//       const containsSpace = displayNameValue.includes(' ');
      
//       let isDisplayNameValid = isDisplayNameFilled && isDisplayNameValidFormat && !containsSpace;

//       if (!isDisplayNameFilled) {
//         //   displayNameErrorFeedback.textContent = "Le nom d'utilisateur est requis.";
//         //   displayNameErrorFeedback.classList.remove('hidden');
//       } else if (containsSpace) {
//           displayNameErrorFeedback.textContent = "Essayez sans espaces ou avec  _ . -";
//           displayNameErrorFeedback.classList.remove('hidden');
//           isDisplayNameValid = false;
//       } else if (!isDisplayNameValidFormat) {
//           displayNameErrorFeedback.textContent = "! Essayez avec uniquement des lettres, des chiffres et ces signes : _ . -";
//           displayNameErrorFeedback.classList.remove('hidden');
//       } else {
//           displayNameErrorFeedback.classList.add('hidden');
//       }
//       // ==========================================================


//       // ==========================================================
//       // --- VALIDATION DE L'EMAIL ---
//       // ==========================================================
//       // Regex plus précise pour l'email selon vos critères :
//       // - ^[a-zA-Z0-9._%+-]+ : Partie locale (avant le @) - lettres, chiffres, ., _, %, +, -
//       // - @                 : Un seul @
//       // - [a-zA-Z0-9.-]+    : Partie domaine (après le @, avant le TLD) - lettres, chiffres, ., - (pas de points ou tirets consécutifs)
//       // - \.                : Un point pour séparer le domaine du TLD
//       // - [a-zA-Z]{2,}$     : TLD (extension) - au moins 2 lettres
//       const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      
//       const isEmailFilled = emailValue !== '';
//       // Vérifications supplémentaires pour les points consécutifs et début/fin de la partie locale
//       const localPart = emailValue.split('@')[0];
//       const hasConsecutiveDotsInLocal = localPart?.includes('..');
//       const hasDotAtStartOfLocal = localPart?.startsWith('.');
//       const hasDotAtEndOfLocal = localPart?.endsWith('.');

//       const domainPart = emailValue.split('@')[1];
//       const hasConsecutiveDotsInDomain = domainPart?.includes('..');
//       const hasConsecutiveHyphensInDomain = domainPart?.includes('--'); // Si vous voulez aussi empêcher les tirets consécutifs dans le domaine


//       let isEmailValid = isEmailFilled && 
//                          emailRegex.test(emailValue) && 
//                          !hasConsecutiveDotsInLocal &&
//                          !hasDotAtStartOfLocal &&
//                          !hasDotAtEndOfLocal &&
//                          !hasConsecutiveDotsInDomain &&
//                          !hasConsecutiveHyphensInDomain; // Si pertinent


//       if (!isEmailFilled) {
//         //   emailErrorFeedback.textContent = "L'adresse e-mail est requise.";
//         //   emailErrorFeedback.classList.remove('hidden');
//       } else if (!isEmailValid) {
//           // Message d'erreur plus détaillé pour l'email
//           if (!emailValue.includes('@') || emailValue.split('@').length > 2) {
//              emailErrorFeedback.textContent = "Vous êtes sûr?Essayez avec seul '@'.";
//           } else if (hasDotAtStartOfLocal || hasDotAtEndOfLocal) {
//              emailErrorFeedback.textContent = "Le nom d'utilisateur doit se terminer par une lettre ou un chiffre";
//           } else if (hasConsecutiveDotsInLocal || hasConsecutiveDotsInDomain) {
//              emailErrorFeedback.textContent = "Vous êtes sûr? pour les double '.' ";
//           } else { // Si aucune des conditions spécifiques ci-dessus n'e.st remplie, c'est un problème de format général
//              emailErrorFeedback.textContent = "Format d'adresse e-mail invalide (ex: user@domaine.com).";
//           }
//           emailErrorFeedback.classList.remove('hidden');
//       } else {
//           emailErrorFeedback.classList.add('hidden');
//       }
//       // ==========================================================


//       // ==========================================================
//       // --- VALIDATION DES MOTS DE PASSE (inchangée) ---
//       // ==========================================================
//       const isPasswordFilled = passwordValue !== '';
//       const isConfirmPasswordFilled = confirmPasswordValue !== '';
//       const doPasswordsMatch = passwordValue === confirmPasswordValue;
//       // ==========================================================

//       // --- Validation globale pour activer/désactiver le bouton ---
//       const isFormValid = isDisplayNameValid &&
//                           isEmailValid &&
//                           isPasswordFilled && 
//                           isConfirmPasswordFilled && 
//                           doPasswordsMatch; 

//       registerButton.disabled = !isFormValid; 

//       // --- Gestion de l'apparence du bouton ---
//       if (isFormValid) {
//           registerButton.classList.remove(
//               'bg-transparent', 'border', 'border-green-700/[.3]', 
//               'shadow-[0_0_15px_rgba(0,255,0,0.1),_inset_0_0_10px_rgba(0,255,0,0.05)]', 
//               'text-green-300/[.7]', 
//               'cursor-not-allowed'
//           );
//           registerButton.classList.add(
//               'bg-green-600', 
//               'hover:bg-green-700', 
//               'text-white', 
//               'cursor-pointer'
//           );
//       } else {
//           registerButton.classList.add(
//               'bg-transparent', 'border', 'border-green-700/[.3]', 
//               'shadow-[0_0_15px_rgba(0,255,0,0.1),_inset_0_0_10px_rgba(0,255,0,0.05)]', 
//               'text-green-300/[.7]', 
//               'cursor-not-allowed'
//           );
//           registerButton.classList.remove(
//               'bg-green-600', 
//               'hover:bg-green-700', 
//               'text-white', 
//               'cursor-pointer'
//           );
//       }
//   };

//   // --- Écouteurs d'événements input/blur et gestionnaire de soumission ---
//   // Puisque createInfoInput retourne l'input directement, écoutez sur l'input directement.
//   registerDisplayNameInput.addEventListener('input', validateRegisterForm); // ICI CHANGEMENT !
//   registerEmailInput.addEventListener('input', validateRegisterForm);       // ICI CHANGEMENT !
//   registerPasswordInput.inputElement.addEventListener('input', validateRegisterForm);
//   registerConfirmPasswordInput.inputElement.addEventListener('input', validateRegisterForm);

//   registerPasswordInput.inputElement.addEventListener('blur', validateRegisterForm);
//   registerConfirmPasswordInput.inputElement.addEventListener('blur', validateRegisterForm);


//   registerForm.addEventListener("submit", (event) => {
//     event.preventDefault();
//     validateRegisterForm(); 
//     if (registerButton.disabled) { 
//         return; 
//     }

//     const displayName = registerDisplayNameInput.value; // UTILISE LE NOM RENOMMÉ
//     const email = registerEmailInput.value; 
//     const password = registerPasswordInput.value;
//     const confirmPassword = registerConfirmPasswordInput.value;

//     options.onSubmit('register', { displayName, email, password, confirmPassword }); 
//   });

//   validateRegisterForm();

//   return {
//     panel: registerPanel,
//     form: registerForm,
//     displayNameInput: registerDisplayNameInput, // EXPORTE LE NOM RENOMMÉ
//     emailInput: registerEmailInput,           // EXPORTE LE NOM RENOMMÉ
//     passwordInput: registerPasswordInput,
//     confirmPasswordInput: registerConfirmPasswordInput,
//     passwordMatchFeedback: passwordMatchFeedback,
//     switchToLoginLink: switchToLoginLink,
//     displayNameErrorFeedback: displayNameErrorFeedback,
//     emailErrorFeedback: emailErrorFeedback
//   };
// }
// srcs/components/dialog/registerPanel.ts

import { createInfoInput, CustomInputContainer } from '../input/infoInput.js';
// Assurez-vous que cette ligne est correcte et importe le nouveau type
import { createPasswordInput, CustomPasswordInputContainer, checkPasswordStrength, PasswordStrengthResult } from '../input/createPasswordInput.js'; 
import { LoginDialogOptions } from './index.js'; 


export function createRegisterPanel(options: LoginDialogOptions) {
  const registerPanel = document.createElement("div");
  registerPanel.className = `
    absolute inset-0
    flex flex-col gap-3
    transition-transform duration-500 ease-in-out transform opacity-0
    w-full
    items-center
    pb-6
  `.replace(/\s+/g, " ");

  const registerForm = document.createElement("form");
  registerForm.className = `
    flex flex-col gap-3 w-full max-w-xs px-2
    max-h-[60vh] overflow-y-auto
  `.replace(/\s+/g, " ");

  // --- CONTAINER FOR DISPLAY NAME ---
  const registerDisplayNameContainer = createInfoInput("Nom d'utilisateur", "displayName");
  const registerDisplayNameErrorFeedback = document.createElement("div");
  registerDisplayNameErrorFeedback.className = "text-sm text-red-400 ml-2 mt-1 hidden";
  registerDisplayNameContainer.appendChild(registerDisplayNameErrorFeedback);
  // --- END DISPLAY NAME CONTAINER ---

  // --- CONTAINER FOR EMAIL ---
  const registerEmailContainer = createInfoInput("Adresse e-mail", "email");
  const registerEmailErrorFeedback = document.createElement("div");
  registerEmailErrorFeedback.className = "text-sm text-red-400 ml-2 mt-1 hidden";
  registerEmailContainer.appendChild(registerEmailErrorFeedback);
  // --- END EMAIL CONTAINER ---

  // --- CONTAINER FOR PASSWORD ---
  // CORRECTION ICI : Utilisez CustomPasswordInputContainer
  const registerPasswordContainer: CustomPasswordInputContainer = createPasswordInput("Mot de passe", "password", true); 
  const registerPasswordErrorFeedback = document.createElement("div");
  registerPasswordErrorFeedback.className = "text-sm text-red-400 ml-2 mt-1 hidden";
  registerPasswordContainer.appendChild(registerPasswordErrorFeedback);
  // --- END PASSWORD CONTAINER ---

  // --- CONTAINER FOR CONFIRM PASSWORD ---
  // CORRECTION ICI : Utilisez CustomPasswordInputContainer
  const registerConfirmPasswordContainer: CustomPasswordInputContainer = createPasswordInput("Confirmer le mot de passe", "confirmPassword", false);
  const registerConfirmPasswordErrorFeedback = document.createElement("div");
  registerConfirmPasswordErrorFeedback.className = "text-sm text-red-400 ml-2 mt-1 hidden";
  registerConfirmPasswordContainer.appendChild(registerConfirmPasswordErrorFeedback);
  // --- END CONFIRM PASSWORD CONTAINER ---

  const registerButton = document.createElement("button");
  registerButton.textContent = "S'inscrire";
  registerButton.type = "submit";
  registerButton.className = `
    bg-green-600 font-semibold py-2 px-4 rounded
    cursor-not-allowed
    opacity-50
    transition-all duration-300
  `.replace(/\s+/g, " ");
  registerButton.disabled = true;


  registerForm.appendChild(registerDisplayNameContainer);
  registerForm.appendChild(registerEmailContainer);
  registerForm.appendChild(registerPasswordContainer);
  registerForm.appendChild(registerConfirmPasswordContainer);
  registerForm.appendChild(registerButton);
  registerPanel.appendChild(registerForm);

  const switchToLoginLink = document.createElement("a");
  switchToLoginLink.href = "#";
  switchToLoginLink.textContent = "Déjà un compte ? Se connecter";
  switchToLoginLink.className = "text-center text-blue-400 hover:text-blue-200 text-sm mt-1 cursor-pointer";
  registerPanel.appendChild(switchToLoginLink);

  // --- GENERIC VALIDATION FUNCTION FOR APPEARANCE ---
  const updateFieldAppearance = (
    inputContainer: CustomInputContainer | CustomPasswordInputContainer,
    errorFeedbackElement: HTMLDivElement,
    validationFunction: (value: string) => { isValid: boolean; errorMessage: string | null },
    showFullMessage: boolean
  ) => {
    const value = inputContainer.inputElement.value.trim();
    const { isValid, errorMessage } = validationFunction(value);

    if (isValid) {
      inputContainer.inputElement.classList.remove('border-red-500');
      inputContainer.inputElement.classList.add('border-gray-600');
      if ('errorIconElement' in inputContainer) {
          (inputContainer as CustomInputContainer).errorIconElement.classList.add('hidden');
      }
    } else {
      inputContainer.inputElement.classList.add('border-red-500');
      inputContainer.inputElement.classList.remove('border-gray-600');
      if ('errorIconElement' in inputContainer) {
          (inputContainer as CustomInputContainer).errorIconElement.classList.remove('hidden');
      }
    }

    if (showFullMessage && errorMessage) {
      errorFeedbackElement.textContent = errorMessage;
      errorFeedbackElement.classList.remove('hidden');
    } else {
      errorFeedbackElement.classList.add('hidden');
    }

    return isValid;
  };

  // --- Specific Register Validation Functions ---
  const validateRegisterDisplayName = (value: string) => {
    let isValid = true;
    let errorMessage: string | null = null;
    if (value === '') {
      isValid = false;
      errorMessage = "Le nom d'utilisateur est requis.";
    } else if (value.length < 3) {
      isValid = false;
      errorMessage = "Le nom d'utilisateur doit contenir au moins 3 caractères.";
    } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
      isValid = false;
      errorMessage = "Le nom d'utilisateur ne peut contenir que des lettres, chiffres et underscores.";
    }
    return { isValid, errorMessage };
  };

  const validateRegisterEmail = (value: string) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    let isValid = true;
    let errorMessage: string | null = null;
    if (value === '') {
      isValid = false;
      errorMessage = "L'adresse e-mail est requise.";
    } else if (!emailRegex.test(value)) {
      isValid = false;
      errorMessage = "Format d'adresse e-mail invalide.";
    }
    return { isValid, errorMessage };
  };

  const validateRegisterPassword = (value: string) => {
    let isValid = true;
    let errorMessage: string | null = null;
    const strength = checkPasswordStrength(value); // Utilisez votre fonction de vérification de force

    if (value === '') {
        isValid = false;
        errorMessage = "Le mot de passe est requis.";
    } else if (!strength.minLength) {
        isValid = false;
        errorMessage = "Le mot de passe doit contenir au moins 8 caractères.";
    } else if (!strength.hasUppercase) {
        isValid = false;
        errorMessage = "Le mot de passe doit contenir au moins une majuscule.";
    } else if (!strength.hasLowercase) {
        isValid = false;
        errorMessage = "Le mot de passe doit contenir au moins une minuscule.";
    } else if (!strength.hasNumber) {
        isValid = false;
        errorMessage = "Le mot de passe doit contenir au moins un chiffre.";
    } else if (!strength.hasSpecialChar) {
        isValid = false;
        errorMessage = "Le mot de passe doit contenir au moins un caractère spécial.";
    }
    return { isValid, errorMessage };
  };

  const validateRegisterConfirmPassword = (value: string) => {
    let isValid = true;
    let errorMessage: string | null = null;
    if (value === '') {
      isValid = false;
      errorMessage = "La confirmation du mot de passe est requise.";
    } else if (value !== registerPasswordContainer.value) { // Compare to actual password input value
      isValid = false;
      errorMessage = "Les mots de passe ne correspondent pas.";
    }
    return { isValid, errorMessage };
  };

  // --- Overall Form Validation Function for the Button ---
  const validateRegisterForm = () => {
    const isDisplayNameValid = validateRegisterDisplayName(registerDisplayNameContainer.inputElement.value.trim()).isValid;
    const isEmailValid = validateRegisterEmail(registerEmailContainer.inputElement.value.trim()).isValid;
    const isPasswordValid = validateRegisterPassword(registerPasswordContainer.inputElement.value.trim()).isValid;
    const isConfirmPasswordValid = validateRegisterConfirmPassword(registerConfirmPasswordContainer.inputElement.value.trim()).isValid;

    const isFormValid = isDisplayNameValid && isEmailValid && isPasswordValid && isConfirmPasswordValid;

    registerButton.disabled = !isFormValid;

    if (isFormValid) {
      registerButton.classList.remove('cursor-not-allowed', 'opacity-50');
      registerButton.classList.add('hover:bg-green-700', 'cursor-pointer', 'opacity-100');
    } else {
      registerButton.classList.add('cursor-not-allowed', 'opacity-50');
      registerButton.classList.remove('hover:bg-green-700', 'cursor-pointer', 'opacity-100');
    }
    return isFormValid;
  };

  // --- Event Listeners ---
  registerDisplayNameContainer.inputElement.addEventListener('input', () => {
    updateFieldAppearance(registerDisplayNameContainer, registerDisplayNameErrorFeedback, validateRegisterDisplayName, true);
    validateRegisterForm();
  });
  registerDisplayNameContainer.inputElement.addEventListener('blur', () => {
    updateFieldAppearance(registerDisplayNameContainer, registerDisplayNameErrorFeedback, validateRegisterDisplayName, false);
    validateRegisterForm();
  });

  registerEmailContainer.inputElement.addEventListener('input', () => {
    updateFieldAppearance(registerEmailContainer, registerEmailErrorFeedback, validateRegisterEmail, true);
    validateRegisterForm();
  });
  registerEmailContainer.inputElement.addEventListener('blur', () => {
    updateFieldAppearance(registerEmailContainer, registerEmailErrorFeedback, validateRegisterEmail, false);
    validateRegisterForm();
  });

  registerPasswordContainer.inputElement.addEventListener('input', () => {
    updateFieldAppearance(registerPasswordContainer, registerPasswordErrorFeedback, validateRegisterPassword, true);
    validateRegisterForm();
    // Also re-validate confirm password if password changes
    updateFieldAppearance(registerConfirmPasswordContainer, registerConfirmPasswordErrorFeedback, validateRegisterConfirmPassword, true);
  });
  registerPasswordContainer.inputElement.addEventListener('blur', () => {
    updateFieldAppearance(registerPasswordContainer, registerPasswordErrorFeedback, validateRegisterPassword, false);
    validateRegisterForm();
  });

  registerConfirmPasswordContainer.inputElement.addEventListener('input', () => {
    updateFieldAppearance(registerConfirmPasswordContainer, registerConfirmPasswordErrorFeedback, validateRegisterConfirmPassword, true);
    validateRegisterForm();
  });
  registerConfirmPasswordContainer.inputElement.addEventListener('blur', () => {
    updateFieldAppearance(registerConfirmPasswordContainer, registerConfirmPasswordErrorFeedback, validateRegisterConfirmPassword, false);
    validateRegisterForm();
  });


  registerForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const isFormValid = validateRegisterForm();

    if (!isFormValid) {
      updateFieldAppearance(registerDisplayNameContainer, registerDisplayNameErrorFeedback, validateRegisterDisplayName, true);
      updateFieldAppearance(registerEmailContainer, registerEmailErrorFeedback, validateRegisterEmail, true);
      updateFieldAppearance(registerPasswordContainer, registerPasswordErrorFeedback, validateRegisterPassword, true);
      updateFieldAppearance(registerConfirmPasswordContainer, registerConfirmPasswordErrorFeedback, validateRegisterConfirmPassword, true);
      return;
    }

    const displayName = registerDisplayNameContainer.value;
    const email = registerEmailContainer.value;
    const password = registerPasswordContainer.value;
    const confirmPassword = registerConfirmPasswordContainer.value;

    options.onSubmit('register', { displayName, email, password, confirmPassword });
  });

  // Initial setup
  validateRegisterForm();
  updateFieldAppearance(registerDisplayNameContainer, registerDisplayNameErrorFeedback, validateRegisterDisplayName, false);
  updateFieldAppearance(registerEmailContainer, registerEmailErrorFeedback, validateRegisterEmail, false);
  updateFieldAppearance(registerPasswordContainer, registerPasswordErrorFeedback, validateRegisterPassword, false);
  updateFieldAppearance(registerConfirmPasswordContainer, registerConfirmPasswordErrorFeedback, validateRegisterConfirmPassword, false);


  return {
    panel: registerPanel,
    form: registerForm,
    displayNameInput: registerDisplayNameContainer,
    emailInput: registerEmailContainer,
    passwordInput: registerPasswordContainer,
    confirmPasswordInput: registerConfirmPasswordContainer,
    switchToLoginLink: switchToLoginLink,
    displayNameErrorFeedback: registerDisplayNameErrorFeedback,
    emailErrorFeedback: registerEmailErrorFeedback,
    passwordErrorFeedback: registerPasswordErrorFeedback,
    confirmPasswordErrorFeedback: registerConfirmPasswordErrorFeedback,
  };
}