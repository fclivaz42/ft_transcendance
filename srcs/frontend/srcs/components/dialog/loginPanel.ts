// srcs/components/dialog/loginPanel.ts

import { createInfoInput, CustomInputContainer } from '../input/infoInput.js';
// Assurez-vous que cette ligne est correcte et importe le nouveau type
import { createPasswordInput, CustomPasswordInputContainer } from '../input/createPasswordInput.js'; 
import { LoginDialogOptions } from './index.js'; 


export function createLoginPanel(options: LoginDialogOptions) {
  const loginPanel = document.createElement("div");
  loginPanel.className = `
    absolute inset-0
    flex flex-col gap-3
    transition-transform duration-500 ease-in-out transform opacity-0
    w-full
    items-center
    pb-6
  `.replace(/\s+/g, " ");

  const loginForm = document.createElement("form");
  loginForm.className = `
    flex flex-col gap-3 w-full max-w-xs px-2
  `.replace(/\s+/g, " ");

  // --- CONTAINER FOR DISPLAY NAME AND ITS ERROR MESSAGE ---
  const loginDisplayNameContainer = createInfoInput("Nom d'utilisateur", "displayName");
  const displayNameErrorFeedback = document.createElement("div");
  displayNameErrorFeedback.className = "text-sm text-red-400 ml-2 mt-1 hidden";
  loginDisplayNameContainer.appendChild(displayNameErrorFeedback);
  // --- END DISPLAY NAME CONTAINER ---

  // --- CONTAINER FOR PASSWORD AND ITS ERROR MESSAGE ---
  // CORRECTION ICI : Utilisez CustomPasswordInputContainer
  const loginPasswordContainer: CustomPasswordInputContainer = createPasswordInput("Mot de passe", "password", false); // Force à false pour ne pas montrer la force ici
  const passwordErrorFeedback = document.createElement("div");
  passwordErrorFeedback.className = "text-sm text-red-400 ml-2 mt-1 hidden";
  loginPasswordContainer.appendChild(passwordErrorFeedback);
  // --- END PASSWORD CONTAINER ---

  const rememberMeContainer = document.createElement("div");
  rememberMeContainer.className = "flex items-center mt-2"; 
  
  const rememberMeCheckbox = document.createElement("input");
  rememberMeCheckbox.type = "checkbox";
  rememberMeCheckbox.id = "rememberMe";
  rememberMeCheckbox.className = `
    mr-2 h-4 w-4 text-blue-600 bg-gray-800 border-gray-600 
    rounded focus:ring-blue-500 dark:focus:ring-600 dark:ring-offset-gray-700 
    focus:ring-2 dark:bg-gray-600 dark:border-gray-500 cursor-pointer
  `.replace(/\s+/g, " ");

  const rememberMeLabel = document.createElement("label");
  rememberMeLabel.htmlFor = "rememberMe";
  rememberMeLabel.textContent = "Se souvenir de moi";
  rememberMeLabel.className = "text-gray-300 text-sm cursor-pointer";

  rememberMeContainer.appendChild(rememberMeCheckbox);
  rememberMeContainer.appendChild(rememberMeLabel);

  const loginButton = document.createElement("button");
  loginButton.textContent = "Connexion";
  loginButton.type = "submit";
  loginButton.className = `
    bg-blue-600 font-semibold py-2 px-4 rounded
    cursor-not-allowed
    opacity-50
    transition-all duration-300
  `.replace(/\s+/g, " ");
  loginButton.disabled = true;

  loginForm.appendChild(loginDisplayNameContainer);
  loginForm.appendChild(loginPasswordContainer);
  loginForm.appendChild(rememberMeContainer); 
  loginForm.appendChild(loginButton);
  loginPanel.appendChild(loginForm);

  const switchToForgotPasswordLink = document.createElement("a");
  switchToForgotPasswordLink.href = "#";
  switchToForgotPasswordLink.textContent = "Mot de passe oublié ?";
  switchToForgotPasswordLink.className = "text-center text-blue-400 hover:text-blue-200 text-sm mt-1 cursor-pointer";
  loginPanel.appendChild(switchToForgotPasswordLink);

  const switchToRegisterLink = document.createElement("a");
  switchToRegisterLink.href = "#";
  switchToRegisterLink.textContent = "Pas encore de compte ? S'inscrire";
  switchToRegisterLink.className = "text-center text-blue-400 hover:text-blue-200 text-sm mt-1 cursor-pointer";
  loginPanel.appendChild(switchToRegisterLink);


  // --- GENERIC VALIDATION FUNCTION FOR APPEARANCE ---
  const updateFieldAppearance = (
      inputContainer: CustomInputContainer | CustomPasswordInputContainer, // Peut être l'un ou l'autre
      errorFeedbackElement: HTMLDivElement,
      validationFunction: (value: string) => { isValid: boolean; errorMessage: string | null },
      showFullMessage: boolean
  ) => {
      const value = inputContainer.inputElement.value.trim();
      const { isValid, errorMessage } = validationFunction(value);

      if (isValid) {
          inputContainer.inputElement.classList.remove('border-red-500');
          inputContainer.inputElement.classList.add('border-gray-600');
          // Les icônes d'erreur sont spécifiques à createInfoInput, pas nécessairement createPasswordInput
          // Ajoutez une vérification si inputContainer est bien un CustomInputContainer
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

  // --- Specific Login Validation Functions ---
  const validateLoginDisplayName = (value: string) => {
      let isValid = true;
      let errorMessage: string | null = null;
      if (value === '') {
          isValid = false;
          errorMessage = "Le nom d'utilisateur est requis.";
      }
      return { isValid, errorMessage };
  };

  const validateLoginPassword = (value: string) => {
    let isValid = true;
    let errorMessage: string | null = null;
    if (value === '') {
        isValid = false;
        errorMessage = "Le mot de passe est requis.";
    }
    return { isValid, errorMessage };
  };

  // --- Overall Form Validation Function for the Button ---
  const validateLoginForm = () => {
      const isDisplayNameValid = validateLoginDisplayName(loginDisplayNameContainer.inputElement.value.trim()).isValid;
      const isPasswordValid = validateLoginPassword(loginPasswordContainer.inputElement.value.trim()).isValid;

      const isFormValid = isDisplayNameValid && isPasswordValid;

      loginButton.disabled = !isFormValid;

      if (isFormValid) {
          loginButton.classList.remove('cursor-not-allowed', 'opacity-50');
          loginButton.classList.add('hover:bg-blue-700', 'cursor-pointer', 'opacity-100');
      } else {
          loginButton.classList.add('cursor-not-allowed', 'opacity-50');
          loginButton.classList.remove('hover:bg-blue-700', 'cursor-pointer', 'opacity-100');
      }
      return isFormValid;
  };

  // --- Event Listeners ---
  loginDisplayNameContainer.inputElement.addEventListener('input', () => {
      updateFieldAppearance(loginDisplayNameContainer, displayNameErrorFeedback, validateLoginDisplayName, true);
      validateLoginForm();
  });
  loginDisplayNameContainer.inputElement.addEventListener('blur', () => {
      updateFieldAppearance(loginDisplayNameContainer, displayNameErrorFeedback, validateLoginDisplayName, false);
      validateLoginForm();
  });

  loginPasswordContainer.inputElement.addEventListener('input', () => {
      updateFieldAppearance(loginPasswordContainer, passwordErrorFeedback, validateLoginPassword, true);
      validateLoginForm();
  });
  loginPasswordContainer.inputElement.addEventListener('blur', () => {
      updateFieldAppearance(loginPasswordContainer, passwordErrorFeedback, validateLoginPassword, false);
      validateLoginForm();
  });


  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const isFormValid = validateLoginForm(); 

    if (!isFormValid) {
        updateFieldAppearance(loginDisplayNameContainer, displayNameErrorFeedback, validateLoginDisplayName, true);
        updateFieldAppearance(loginPasswordContainer, passwordErrorFeedback, validateLoginPassword, true);
        return;
    }

    const displayName = loginDisplayNameContainer.value;
    const password = loginPasswordContainer.value;
    const rememberMe = rememberMeCheckbox.checked; 
    
    options.onSubmit('login', { displayName, password, rememberMe });
  });

  // Initial setup
  validateLoginForm();
  updateFieldAppearance(loginDisplayNameContainer, displayNameErrorFeedback, validateLoginDisplayName, false);
  updateFieldAppearance(loginPasswordContainer, passwordErrorFeedback, validateLoginPassword, false);


  return {
    panel: loginPanel,
    form: loginForm,
    displayNameInput: loginDisplayNameContainer,
    passwordInput: loginPasswordContainer,
    rememberMeCheckbox: rememberMeCheckbox,
    switchToForgotPasswordLink: switchToForgotPasswordLink,
    switchToRegisterLink: switchToRegisterLink,
    displayNameErrorFeedback: displayNameErrorFeedback,
    passwordErrorFeedback: passwordErrorFeedback,
  };
}

// // Fonction pour créer le panneau de mot de passe oublié
// export function createForgotPasswordPanel(options: LoginDialogOptions) {
//   const forgotPasswordPanel = document.createElement("div");
//   forgotPasswordPanel.className = `
//     absolute inset-0
//     flex flex-col gap-3 
//     transition-transform duration-500 ease-in-out transform opacity-0
//     w-full
//     justify-center items-center pb-6
//   `.replace(/\s+/g, " ");

//   const forgotPasswordForm = document.createElement("form");
//   forgotPasswordForm.className = "flex flex-col gap-3 w-full max-w-xs px-2";

//   const forgotPasswordEmailInput = createInfoInput("Votre adresse e-mail", "forgotEmail");
//   const forgotPasswordCodeInput = createInfoInput("Code reçu par e-mail", "forgotCode");
  
//   const forgotPasswordButton = document.createElement("button");
//   forgotPasswordButton.textContent = "Réinitialiser le mot de passe";
//   forgotPasswordButton.type = "submit";
//   forgotPasswordButton.className = "bg-purple-600 hover:bg-purple-700 font-semibold py-2 px-4 rounded ";

//   forgotPasswordForm.appendChild(forgotPasswordEmailInput);
//   forgotPasswordForm.appendChild(forgotPasswordCodeInput);
//   forgotPasswordForm.appendChild(forgotPasswordButton);
//   forgotPasswordPanel.appendChild(forgotPasswordForm);

//   const switchToLoginFromForgotLink = document.createElement("a");
//   switchToLoginFromForgotLink.href = "#";
//   switchToLoginFromForgotLink.textContent = "Retour à la connexion";
//   switchToLoginFromForgotLink.className = "text-center text-blue-400 hover:text-blue-200 text-sm mt-1 cursor-pointer";
//   forgotPasswordPanel.appendChild(switchToLoginFromForgotLink);

//   // Le gestionnaire de soumission est défini ici pour rester avec le formulaire
//   forgotPasswordForm.addEventListener("submit", (event) => {
//     event.preventDefault();
//     const email = forgotPasswordEmailInput.value;
//     const code = forgotPasswordCodeInput.value;
//     options.onForgotPasswordSubmit(email, code);
//   });

//   return {
//     panel: forgotPasswordPanel,
//     form: forgotPasswordForm,
//     emailInput: forgotPasswordEmailInput,
//     codeInput: forgotPasswordCodeInput,
//     switchToLoginFromForgotLink: switchToLoginFromForgotLink,
//   };
// }