//fonction principale :createLoginPanel: cree un panneau de connexion 
//  création -> assemblage -> comportement -> initialisation.

// ==============================
// 1. IMPORTS
// ==============================
import { createInfoInput, CustomInputContainer } from '../input/infoInput.js';
import { createPasswordInput, CustomPasswordInputContainer } from '../input/createPasswordInput.js';
import { LoginDialogOptions } from './index.js';
import { updateFieldAppearance } from '../input/utils.js'; 


// ==============================
// 2. EXPORT MAIN FUNCTION: createLoginPanel
// ==============================
export function createLoginPanel(options: LoginDialogOptions) 
{

// 2.1. DÉCLARATION ET INITIALISATION DES ÉLÉMENTS DOM PRINCIPAUX
// ==============================================================
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

// 2.2. DÉCLARATION DES FONCTIONS DE VALIDATION de login
// =====================================================
    // check si input Login est valid
    const validateLoginDisplayName = (value: string) => 
    {
        let isValid = true;
        let errorMessage: string | null = null;
        if (value === '') {
            isValid = false;
            errorMessage = "Merci de saisir votre nom d'utilisateur.";//ajouter les regles?
        }
        return { isValid, errorMessage };
    };
    // check si input mdp est valid
    const validateLoginPassword = (value: string) => 
    {
        let isValid = true;
        let errorMessage: string | null = null;
        if (value === '') {
            isValid = false;
            errorMessage = "Le mot de passe est requis.";
        }
        return { isValid, errorMessage };
    };

    // valid les input du formulaire -> acces au boutton login
    const validateLoginForm = () => 
    {
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

// 2.3. CRÉATION ET CONFIGURATION DES ÉLÉMENTS DU FORMULAIRE
// (Inputs, checkbox, bouton, liens)
// ============================================================
    //champ Nom user
  const loginDisplayNameContainer = createInfoInput("Nom d'utilisateur", "displayName");
  const displayNameErrorFeedback = document.createElement("div");
  displayNameErrorFeedback.className = "text-sm text-red-400 ml-2 mt-1 hidden";
  loginDisplayNameContainer.appendChild(displayNameErrorFeedback);
   // Champ Mot de passe
  const loginPasswordContainer: CustomPasswordInputContainer = createPasswordInput("Mot de passe", "password", false); // Force à false pour ne pas montrer la force ici
  const passwordErrorFeedback = document.createElement("div");
  passwordErrorFeedback.className = "text-sm text-red-400 ml-2 mt-1 hidden";
  loginPasswordContainer.appendChild(passwordErrorFeedback);

    // Conteneur "remember me"
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
    // Bouton de connexion
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

    // Liens bas de panneau ->vers autre panel
  const switchToForgotPasswordLink = document.createElement("a");
  switchToForgotPasswordLink.href = "#";
  switchToForgotPasswordLink.textContent = "Mot de passe oublié ?";
  switchToForgotPasswordLink.className = "text-center text-blue-400 hover:text-blue-200 text-sm mt-1 cursor-pointer";
//   loginPanel.appendChild(switchToForgotPasswordLink);

  const switchToRegisterLink = document.createElement("a");
  switchToRegisterLink.href = "#";
  switchToRegisterLink.textContent = "Pas encore de compte ? S'inscrire";
  switchToRegisterLink.className = "text-center text-blue-400 hover:text-blue-200 text-sm mt-1 cursor-pointer";
//   "text-center text-blue-400 hover:text-blue-200 text-sm mt-1 cursor-pointer"
//   loginPanel.appendChild(switchToRegisterLink);
//   loginPanel.appendChild(switchToForgotPasswordLink);

// 2.4. ASSEMBLAGE DU DOM
// (Ajout des éléments créés aux conteneurs appropriés)
// ==============================
  loginForm.appendChild(loginDisplayNameContainer);
  loginForm.appendChild(loginPasswordContainer);
  loginForm.appendChild(rememberMeContainer); 
  loginForm.appendChild(loginButton);
  loginPanel.appendChild(loginForm);
    loginPanel.appendChild(switchToRegisterLink);
  loginPanel.appendChild(switchToForgotPasswordLink);
  //le reste direct appele en dessous

// 2.5. CONFIGURATION DES ÉCOUTEURS D'ÉVÉNEMENTS
// (Gestion des interactions utilisateur)
// ==============================
    // Écouteurs pour le champ Nom d'utilisateur
    loginDisplayNameContainer.inputElement.addEventListener('input', () => {
        loginDisplayNameContainer._touched = true; // Marquer comme touché
        updateFieldAppearance(loginDisplayNameContainer, displayNameErrorFeedback, validateLoginDisplayName, true, false);
        validateLoginForm();
    });
    loginDisplayNameContainer.inputElement.addEventListener('focus', () => {
        // Le focus seul ne marque pas "touché" si le champ est vide et n'a pas été tapé
        updateFieldAppearance(loginDisplayNameContainer, displayNameErrorFeedback, validateLoginDisplayName, true, false);
        validateLoginForm();
    });
    loginDisplayNameContainer.inputElement.addEventListener('blur', () => {
        loginDisplayNameContainer._touched = true; // Marquer comme touché
        updateFieldAppearance(loginDisplayNameContainer, displayNameErrorFeedback, validateLoginDisplayName, false, false);
        validateLoginForm();
    });

    //   // Écouteurs pour le champ Mot de passe, Pour loginPasswordContainer 
    loginPasswordContainer.inputElement.addEventListener('input', () => {
        loginPasswordContainer._touched = true; // Marquer comme touché
        updateFieldAppearance(loginPasswordContainer, passwordErrorFeedback, validateLoginPassword, true, false);
        validateLoginForm();
    });
    loginPasswordContainer.inputElement.addEventListener('focus', () => {
        updateFieldAppearance(loginPasswordContainer, passwordErrorFeedback, validateLoginPassword, true, false);
        validateLoginForm();
    });
    loginPasswordContainer.inputElement.addEventListener('blur', () => {
        loginPasswordContainer._touched = true; // Marquer comme touché
        updateFieldAppearance(loginPasswordContainer, passwordErrorFeedback, validateLoginPassword, false, false);
        validateLoginForm();
    });

    // Écouteur pour la soumission du formulaire
    loginForm.addEventListener("submit", (event) => 
    {
        event.preventDefault();
        const isFormValid = validateLoginForm();

        const fieldsToValidateOnSubmit = [
            { container: loginDisplayNameContainer, feedback: displayNameErrorFeedback, validate: validateLoginDisplayName },
            { container: loginPasswordContainer, feedback: passwordErrorFeedback, validate: validateLoginPassword },
        ];

        fieldsToValidateOnSubmit.forEach(field => {
            field.container._touched = true; // Marquer comme touché pour la soumission
            updateFieldAppearance(field.container, field.feedback, field.validate, false, true); // forceMessageDisplay = true
        });

        if (!isFormValid) {
            return;
        }
        // Récupération des valeurs du formulaire si valide
        const displayName = loginDisplayNameContainer.value;
        const password = loginPasswordContainer.value;
        const rememberMe = rememberMeCheckbox.checked;

        options.onSubmit('login', { displayName, password, rememberMe });
    });

// 2.6. INITIALISATION DE L'ÉTAT DU PANEL
// (tous les elements sont prets et disponible)
// ==============================

// --- Initial setup ---
validateLoginForm();

// Assure que les champs commencent dans un état neutre (pas d'erreurs visibles) isTouched = false
updateFieldAppearance(loginDisplayNameContainer, displayNameErrorFeedback, validateLoginDisplayName, false, false);
updateFieldAppearance(loginPasswordContainer, passwordErrorFeedback, validateLoginPassword, false, false);

// ==============================
// 2.7. RETOUR DES ÉLÉMENTS DU PANEL
// (Ce que la fonction createLoginPanel rend disponible à l'extérieur)
// ==============================
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
