

// ==============================
// 1. IMPORTS
// ==============================
import { createInfoInput, CustomInputContainer } from '../input/infoInput.js';
import { createPasswordInput, CustomPasswordInputContainer, checkPasswordStrength } from '../input/createPasswordInput.js';
import { LoginDialogOptions } from './loginDialog.js';
import { updateFieldAppearance } from '../input/utils.js'; // Chemin vers la fonction générique
import { createPasswordStrengthList} from '../input/passwordStrengh.js';
import { i18nHandler } from "../../handlers/i18nHandler.js";
// ==============================
// 2. EXPORT FUNCTION: createRegisterPanel
// ==============================
export function createRegisterPanel(options: LoginDialogOptions) {
  // ==============================
  // 2.1. DÉCLARATION ET INITIALISATION DES ÉLÉMENTS DOM PRINCIPAUX
  // ==============================
  const registerPanel = document.createElement("div");
  registerPanel.className = `
    absolute inset-0
    flex flex-col gap-3
    transition-transform duration-500 ease-in-out transform hidden
    w-full
    items-center
    pb-6
		h-fit
  `.replace(/\s+/g, " ");

  const registerForm = document.createElement("form");
  registerForm.className = `
    flex flex-col gap-3 w-full max-w-xs px-2

  `.replace(/\s+/g, " ");// merde enleve qui casse tout  max-h-[80vh] overflow-y-auto

  // ==============================
  // 2.2. DÉCLARATION DES FONCTIONS DE VALIDATION SPÉCIFIQUES AU PANEL
  // ==============================

  // Validation Nom d'utilisateur
  const validateRegisterDisplayName = (value: string) => {
    let isValid = true;
    let errorMessage: string | null = null;
    if (value === '') {
      isValid = false;
      errorMessage = i18nHandler.getValue("panel.registerPanel.validation.usernameRequired");
    } else if (value.length < 3 || value.length > 14) {
      isValid = false;
      errorMessage = i18nHandler.getValue("panel.registerPanel.validation.lengthError");
    } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
      isValid = false;
      errorMessage = i18nHandler.getValue("panel.registerPanel.validation.charactersError");
    }
    return { isValid, errorMessage };
  };

  // Validation Email
  const validateRegisterEmail = (value: string) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    let isValid = true;
    let errorMessage: string | null = null;
    if (value === '') {
      isValid = false;
      errorMessage = i18nHandler.getValue("panel.registerPanel.validation.emailRequired");
    } else if (!emailRegex.test(value)) {
      isValid = false;
      errorMessage = i18nHandler.getValue("panel.registerPanel.validation.emailFormatError");
    }
    return { isValid, errorMessage };
  };

  // Validation Mot de passe (utilise checkPasswordStrength du CustomPasswordInput)
  const validateRegisterPassword = (value: string) => {

    if (value === '') {
       return { isValid: false, errorMessage: null };
    } 
    const strength = checkPasswordStrength(value);

    // Le mot de passe est valide si TOUS les critères de force sont remplis.
    // Sinon, il est invalide.
    const isValid = strength.minLength &&
                    strength.hasUppercase &&
                    strength.hasLowercase &&
                    strength.hasNumber &&
                    strength.hasSpecialChar;

    // Retourne la validité. errorMessage reste null si isValid est false
    // (car les détails sont gérés par la liste de force),
    // ou si isValid est true.
    return { isValid, errorMessage: null };
  };

// feedback ultra-instantané
const validateRegisterConfirmPassword = (value: string) => {
    let isValid = true;
    let errorMessage: string | null = null; // Important : initialise à null

    const passwordValue = registerPasswordContainer.inputElement.value.trim();

    if (value.length === 0) {
        // Cas 1: Le champ de confirmation est vide.
        // Il est invalide et le message s'affiche immédiatement.
        isValid = false;
        errorMessage = i18nHandler.getValue("panel.registerPanel.validation.confirmPasswordRequired");
    } else if (passwordValue.length === 0) {
        // Cas 2: Le mot de passe principal est vide, mais on tape dans la confirmation.
        // C'est invalide.
        isValid = false;
        errorMessage = i18nHandler.getValue("panel.registerPanel.validation.passwordRequired"); // Nouveau message si le premier champ est vide
    } else {
        // Cas 3: Comparaison caractère par caractère
        // Parcourir la chaîne de confirmation (ou le mot de passe original si plus court)
        const len = Math.min(value.length, passwordValue.length); // Compare seulement jusqu'à la longueur la plus courte

        for (let i = 0; i < len; i++) {
            if (value[i] !== passwordValue[i]) {
                // Si un caractère ne correspond pas, c'est une erreur immédiate.
                isValid = false;
                errorMessage = i18nHandler.getValue("panel.registerPanel.validation.passwordMismatch");
                break; // Arrêter la boucle dès la première différence
            }
        }

        // Après la boucle :
        if (isValid && value.length < passwordValue.length) {
            // Si tous les caractères comparés jusqu'à présent correspondent,
            // mais que la confirmation est plus courte que le mot de passe original.
            // Le champ n'est pas encore "valide" au sens complet, mais pas d'erreur affichée.
            isValid = false; // Invalide car incomplet
            errorMessage = null; // PAS DE MESSAGE TEXTUEL ICI
        } else if (isValid && value.length > passwordValue.length) {
            // Si la confirmation est plus longue que le mot de passe original,
            // et que tous les caractères comparés correspondent (jusqu'à la longueur de passwordValue).
            // Alors, c'est une non-concordance (car la fin dépasse).
            isValid = false;
            errorMessage = i18nHandler.getValue("panel.registerPanel.validation.passwordMismatch");
        } else if (isValid && value.length === passwordValue.length) {
            // Si tous les caractères comparés correspondent et les longueurs sont identiques.
            // C'est valide.
            isValid = true;
            errorMessage = null;
        }
        // Le cas où isValid est déjà false (détecté par la boucle for) est déjà géré avec errorMessage.
    }
    return { isValid, errorMessage };
};

  // Validation globale du formulaire (pour l'état du bouton)
  const validateRegisterForm = () => {
    const isDisplayNameValid = validateRegisterDisplayName(registerDisplayNameContainer.inputElement.value.trim()).isValid;
    const isEmailValid = validateRegisterEmail(registerEmailContainer.inputElement.value.trim()).isValid;
    const isPasswordValid = validateRegisterPassword(registerPasswordContainer.inputElement.value.trim()).isValid;
    const isConfirmPasswordValid = validateRegisterConfirmPassword(registerConfirmPasswordContainer.inputElement.value.trim()).isValid;

    const isFormValid = isDisplayNameValid && isEmailValid && isPasswordValid && isConfirmPasswordValid;

    registerButton.disabled = !isFormValid;

    if (isFormValid) {
      registerButton.classList.remove(
          'cursor-not-allowed', 'opacity-50',
          'bg-transparent', 'border', 'border-green-700/[.3]',
          'shadow-[0_0_15px_rgba(0,255,0,0.1),_inset_0_0_10px_rgba(0,255,0,0.05)]',
          'text-green-300/[.7]'
      );
      registerButton.classList.add(
          'bg-green-600',
          'hover:bg-green-700',
          'text-white',
          'cursor-pointer',
          'block'
      );
    } else {
      registerButton.classList.add(
          'cursor-not-allowed', 'opacity-50',
          'bg-transparent', 'border', 'border-green-700/[.3]',
          'shadow-[0_0_15px_rgba(0,255,0,0.1),_inset_0_0_10px_rgba(0,255,0,0.05)]',
          'text-green-300/[.7]'
      );
      registerButton.classList.remove(
          'bg-green-600',
          'hover:bg-green-700',
          'text-white',
          'cursor-pointer',
          'block'
      );
    }
    return isFormValid;
  };

  // ==============================
  // 2.3. CRÉATION ET CONFIGURATION DES ÉLÉMENTS DU FORMULAIRE
  // ==============================

  // Champ Nom d'utilisateur
  const registerDisplayNameContainer = createInfoInput(i18nHandler.getValue("panel.usernameLabel"), "rdisplayName");
  const registerDisplayNameErrorFeedback = document.createElement("div");
  registerDisplayNameErrorFeedback.className = "text-sm text-red-400 ml-2 mt-1 hidden";
  registerDisplayNameContainer.appendChild(registerDisplayNameErrorFeedback);

  // Champ Email
  const registerEmailContainer = createInfoInput(i18nHandler.getValue("panel.emailLabel"), "email");
  const registerEmailErrorFeedback = document.createElement("div");
  registerEmailErrorFeedback.className = "text-sm text-red-400 ml-2 mt-1 hidden";
  registerEmailContainer.appendChild(registerEmailErrorFeedback);

  // Champ Mot de passe
  const registerPasswordContainer: CustomPasswordInputContainer = createPasswordInput(i18nHandler.getValue("panel.passwordLabel"), "rpassword", true, "new-password"); // Force à true pour montrer la force ici
  const registerPasswordErrorFeedback = document.createElement("div");
  registerPasswordErrorFeedback.className = "text-sm text-red-400 ml-2 mt-1 hidden";
  registerPasswordContainer.appendChild(registerPasswordErrorFeedback);

  // Champ Confirmer mot de passe
  const registerConfirmPasswordContainer: CustomPasswordInputContainer = createPasswordInput(i18nHandler.getValue("panel.registerPanel.confirmPasswordLabel"), "confirmPassword", false, "new-password");
  const registerConfirmPasswordErrorFeedback = document.createElement("div");
  registerConfirmPasswordErrorFeedback.className = "text-sm text-red-400 ml-2 mt-1 hidden";
  registerConfirmPasswordContainer.appendChild(registerConfirmPasswordErrorFeedback);

  // Bouton d'inscription
  const registerButton = document.createElement("button");
  registerButton.textContent = i18nHandler.getValue("panel.registerPanel.registerButton");
  registerButton.type = "submit";
  registerButton.className = `
    font-semibold py-2 px-4 rounded
    bg-green-600
    cursor-not-allowed
    opacity-50
    transition-all duration-300
  `.replace(/\s+/g, " ");
  registerButton.disabled = true;

  // Lien "Déjà un compte ?"
  const switchToLoginLink = document.createElement("a");
  switchToLoginLink.href = "#";
  switchToLoginLink.textContent = i18nHandler.getValue("panel.registerPanel.link.loginPanel");
  switchToLoginLink.className = "text-center text-blue-400 hover:text-blue-200 text-sm mt-1 cursor-pointer";

  // ==============================
  // 2.4. ASSEMBLAGE DU DOM
  // ==============================
  registerForm.appendChild(registerDisplayNameContainer);
  registerForm.appendChild(registerEmailContainer);
  registerForm.appendChild(registerPasswordContainer);
  registerForm.appendChild(registerConfirmPasswordContainer);
  registerForm.appendChild(registerButton);

  registerPanel.appendChild(registerForm);
  registerPanel.appendChild(switchToLoginLink);

  // ==============================
  // 2.5. CONFIGURATION DES ÉCOUTEURS D'ÉVÉNEMENTS
  // ==============================

  // Écouteurs pour le champ Nom d'utilisateur
  registerDisplayNameContainer.inputElement.addEventListener('input', () => {
    registerDisplayNameContainer._touched = true; // Marquer comme touché
    // isFocused = true (car l'input est actif), forceMessageDisplay = false (pas de soumission)
    updateFieldAppearance(registerDisplayNameContainer, registerDisplayNameErrorFeedback, validateRegisterDisplayName, true, false);
    validateRegisterForm();
  });
  registerDisplayNameContainer.inputElement.addEventListener('focus', () => {
    // Si déjà touché, afficher le message. Sinon, juste la bordure si invalide.
    updateFieldAppearance(registerDisplayNameContainer, registerDisplayNameErrorFeedback, validateRegisterDisplayName, true, false);
    validateRegisterForm();
  });
  registerDisplayNameContainer.inputElement.addEventListener('blur', () => {
    registerDisplayNameContainer._touched = true; // Marquer comme touché
    // isFocused = false, forceMessageDisplay = false. Affichera le "!" si invalide, masquera le message.
    updateFieldAppearance(registerDisplayNameContainer, registerDisplayNameErrorFeedback, validateRegisterDisplayName, false, false);
    validateRegisterForm();
  });

  // Écouteurs pour le champ Email
  registerEmailContainer.inputElement.addEventListener('input', () => {
    registerEmailContainer._touched = true;
    updateFieldAppearance(registerEmailContainer, registerEmailErrorFeedback, validateRegisterEmail, true, false);
    validateRegisterForm();
  });
  registerEmailContainer.inputElement.addEventListener('focus', () => {
    updateFieldAppearance(registerEmailContainer, registerEmailErrorFeedback, validateRegisterEmail, true, false);
    validateRegisterForm();
  });
  registerEmailContainer.inputElement.addEventListener('blur', () => {
    registerEmailContainer._touched = true;
    updateFieldAppearance(registerEmailContainer, registerEmailErrorFeedback, validateRegisterEmail, false, false);
    validateRegisterForm();
  });

  // Écouteurs pour le champ Mot de passe
  registerPasswordContainer.inputElement.addEventListener('input', () => {
    registerPasswordContainer._touched = true;
    updateFieldAppearance(registerPasswordContainer, registerPasswordErrorFeedback, validateRegisterPassword, true, false);
    validateRegisterForm();
    // Revalide la confirmation de mot de passe car le mot de passe source a changé
    // Marquer la confirmation comme touchée pour que son erreur de non-concordance apparaisse immédiatement.
    registerConfirmPasswordContainer._touched = true;
    updateFieldAppearance(registerConfirmPasswordContainer, registerConfirmPasswordErrorFeedback, validateRegisterConfirmPassword, true, false); // isFocused=true car on suppose que l'utilisateur est toujours dans le flow
  });
  registerPasswordContainer.inputElement.addEventListener('focus', () => {
    updateFieldAppearance(registerPasswordContainer, registerPasswordErrorFeedback, validateRegisterPassword, true, false);
    validateRegisterForm();
  });
  registerPasswordContainer.inputElement.addEventListener('blur', () => {
    registerPasswordContainer._touched = true;
    updateFieldAppearance(registerPasswordContainer, registerPasswordErrorFeedback, validateRegisterPassword, false, false);
    validateRegisterForm();
  });

  // Écouteurs pour le champ Confirmer mot de passe
  registerConfirmPasswordContainer.inputElement.addEventListener('input', () => {
    registerConfirmPasswordContainer._touched = true;
    updateFieldAppearance(registerConfirmPasswordContainer, registerConfirmPasswordErrorFeedback, validateRegisterConfirmPassword, true, false);
    validateRegisterForm();
  });
  registerConfirmPasswordContainer.inputElement.addEventListener('focus', () => {
    updateFieldAppearance(registerConfirmPasswordContainer, registerConfirmPasswordErrorFeedback, validateRegisterConfirmPassword, true, false);
    validateRegisterForm();
  });
  registerConfirmPasswordContainer.inputElement.addEventListener('blur', () => {
    registerConfirmPasswordContainer._touched = true;
    updateFieldAppearance(registerConfirmPasswordContainer, registerConfirmPasswordErrorFeedback, validateRegisterConfirmPassword, false, false);
    validateRegisterForm();
  });

  // Écouteur pour la soumission du formulaire
  registerForm.addEventListener("submit", (event) => {
    event.preventDefault();
    // Re-valide tout le formulaire et met à jour l'état du bouton
    const isFormValid = validateRegisterForm();

    // Force l'affichage des erreurs pour tous les champs à la soumission,
    // même s'ils n'ont pas été "touchés" auparavant.
    const fieldsToValidateOnSubmit = [
        { container: registerDisplayNameContainer, feedback: registerDisplayNameErrorFeedback, validate: validateRegisterDisplayName },
        { container: registerEmailContainer, feedback: registerEmailErrorFeedback, validate: validateRegisterEmail },
        { container: registerPasswordContainer, feedback: registerPasswordErrorFeedback, validate: validateRegisterPassword },
        { container: registerConfirmPasswordContainer, feedback: registerConfirmPasswordErrorFeedback, validate: validateRegisterConfirmPassword },
    ];

    fieldsToValidateOnSubmit.forEach(field => {
        field.container._touched = true; // Marquer tous les champs comme touchés
        // forceMessageDisplay = true pour montrer le message complet (pas seulement le !)
        updateFieldAppearance(field.container, field.feedback, field.validate, false, true);
    });

    if (!isFormValid) {
        return; // Arrête la soumission si le formulaire est invalide
    }

    // Récupération des valeurs du formulaire si valide
    const displayName = registerDisplayNameContainer.inputElement.value;
    const email = registerEmailContainer.inputElement.value;
    const password = registerPasswordContainer.inputElement.value;
    const confirmPassword = registerConfirmPasswordContainer.inputElement.value;

    options.onSubmit('register', { displayName, email, password, confirmPassword });
  });

  // ==============================
  // 2.6. INITIALISATION DE L'ÉTAT DU PANEL
  // ==============================
  validateRegisterForm(); // Définit l'état initial du bouton d'inscription

  // Initialisation de l'apparence des champs :
  // Les champs commencent non touchés (_touched est déjà false par défaut à la création de CustomInputContainer)
  // et on ne force pas l'affichage du message. Donc, aucune erreur visible au démarrage.

  updateFieldAppearance(registerDisplayNameContainer, registerDisplayNameErrorFeedback, validateRegisterDisplayName, false, false);
  updateFieldAppearance(registerEmailContainer, registerEmailErrorFeedback, validateRegisterEmail, false, false);
  updateFieldAppearance(registerPasswordContainer, registerPasswordErrorFeedback, validateRegisterPassword, false, false);
  updateFieldAppearance(registerConfirmPasswordContainer, registerConfirmPasswordErrorFeedback, validateRegisterConfirmPassword, false, false);


  // ==============================
  // 2.7. RETOUR DES ÉLÉMENTS DU PANEL
  // ==============================
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
