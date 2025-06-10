// createRegisterPanel(), createLoginPanel(), createForgotPasswordPanel()
//retourneraient le panneau HTML ccomplet avec ses champs et boutons
import { createInfoInput } from "../input/infoInput.js";
import { createPasswordInput } from "../input/createPasswordInput.js"; 
export interface LoginDialogOptions 
{
  initialMode: 'login' | 'register' | 'forgotPassword';
  onSubmit: (mode: 'login' | 'register', data: { displayName: string; password?: string; confirmPassword?: string; rememberMe?: boolean }) => void;
  onSwitchMode: (newMode: 'login' | 'register' | 'forgotPassword') => void;
  onForgotPasswordSubmit: (email: string, code: string) => void; 
}
// Exportez ce type pour qu'il puisse être utilisé ailleurs..kezako
export type CustomPasswordInput = HTMLDivElement & { value: string, inputElement: HTMLInputElement, _enableStrengthCheck: boolean };

// srcs/components/dialog/createPanels.ts



// Fonction pour créer le panneau d'inscription heeere adapter gestion hauteur des panneaux et du container panelscontainer
export function createRegisterPanel(options: LoginDialogOptions) {
  const registerPanel = document.createElement("div");
  registerPanel.className = `

    absolute inset-0
    flex flex-col gap-3 
    transition-transform duration-500 ease-in-out transform opacity-0
    w-full
     items-center
  `.replace(/\s+/g, " ");

  const registerForm = document.createElement("form");
  registerForm.className = "flex flex-col gap-3 w-full max-w-xs px-2"; 

  const registerDisplayName = createInfoInput("Nom d'utilisateur", "displayName");
  const registerEmailInput = createInfoInput("Adresse e-mail", "email");
  
  const registerPasswordInput = createPasswordInput("Mot de passe", "password", true) as CustomPasswordInput;
  const registerConfirmPasswordInput = createPasswordInput("Confirmer mot de passe", "confirmPassword", false) as CustomPasswordInput;
  
  const passwordMatchFeedback = document.createElement("div");
  passwordMatchFeedback.className = "text-sm text-red-400 ml-2 hidden items-center justify-end gap-1 font-semibold";
  registerConfirmPasswordInput.appendChild(passwordMatchFeedback);

  const registerButton = document.createElement("button");
  registerButton.textContent = "S'inscrire";
  registerButton.type = "submit";
  registerButton.className = "bg-green-600 hover:bg-green-700 font-semibold py-2 px-4 rounded";
  
  registerForm.appendChild(registerDisplayName);
  registerForm.appendChild(registerEmailInput);
  registerForm.appendChild(registerPasswordInput);
  registerForm.appendChild(registerConfirmPasswordInput);
  registerForm.appendChild(registerButton);
  registerPanel.appendChild(registerForm);

  const switchToLoginLink = document.createElement("a");
  switchToLoginLink.href = "#";
  switchToLoginLink.textContent = "Déjà un compte ? Se connecter";
  switchToLoginLink.className = "text-center text-blue-400 hover:text-blue-200 text-sm mt-1 cursor-pointer";
  registerPanel.appendChild(switchToLoginLink);

  // Le gestionnaire de soumission est défini ici pour rester avec le formulaire
  registerForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const displayName = registerDisplayName.value;
    const password = registerPasswordInput.value;
    const confirmPassword = registerConfirmPasswordInput.value;

    // La validation de correspondance des mots de passe reste dans loginDialog.ts pour sa logique globale
    // (car elle est liée aux écouteurs d'événements blur/focus/input)
    // Mais nous pouvons laisser la validation finale au submit ici.
    if (password !== confirmPassword) {
        alert("Les mots de passe ne correspondent pas !");
        passwordMatchFeedback.classList.remove('hidden');
        passwordMatchFeedback.classList.add('flex');
        passwordMatchFeedback.innerHTML = '<svg class="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg><span class="text-red-500">Mots de passe différents</span>';
        return; 
    }

    options.onSubmit('register', { displayName, password, confirmPassword });
  });


  return {
    panel: registerPanel,
    form: registerForm,
    displayNameInput: registerDisplayName,
    passwordInput: registerPasswordInput,
    confirmPasswordInput: registerConfirmPasswordInput,
    passwordMatchFeedback: passwordMatchFeedback, // Retourne aussi le feedback
    switchToLoginLink: switchToLoginLink,
    emailInput: registerEmailInput // Ajoutez l'email si vous l'utilisez
  };
}

// Fonction pour créer le panneau de connexion
export function createLoginPanel(options: LoginDialogOptions) {
  const loginPanel = document.createElement("div");
  loginPanel.className = `
    absolute inset-0
    flex flex-col gap-3 
    transition-transform duration-500 ease-in-out transform opacity-0
    w-full
    justify-center items-center pb-6
  `.replace(/\s+/g, " ");

  const loginForm = document.createElement("form");
  loginForm.className = "flex flex-col gap-3 w-full max-w-xs px-2";

  const loginDisplayName = createInfoInput("Nom d'utilisateur", "displayName");
  const loginPasswordInput = createPasswordInput("Mot de passe", "password", false) as CustomPasswordInput;

  const rememberMeContainer = document.createElement("div");
  rememberMeContainer.className = "flex items-center mt-2"; 
  
  const rememberMeCheckbox = document.createElement("input");
  rememberMeCheckbox.type = "checkbox";
  rememberMeCheckbox.id = "rememberMe";
  rememberMeCheckbox.className = `
    mr-2 h-4 w-4 text-blue-600 bg-gray-800 border-gray-600 
    rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 
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
  loginButton.className = "bg-blue-600 hover:bg-blue-700 font-semibold py-2 px-4 rounded ";
  
  loginForm.appendChild(loginDisplayName);
  loginForm.appendChild(loginPasswordInput);
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

  // Le gestionnaire de soumission est défini ici pour rester avec le formulaire
  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const displayName = loginDisplayName.value;
    const password = loginPasswordInput.value;
    const rememberMe = rememberMeCheckbox.checked; 
    options.onSubmit('login', { displayName, password, rememberMe });
  });

  return {
    panel: loginPanel,
    form: loginForm,
    displayNameInput: loginDisplayName,
    passwordInput: loginPasswordInput,
    rememberMeCheckbox: rememberMeCheckbox, // Retourne la checkbox
    switchToForgotPasswordLink: switchToForgotPasswordLink,
    switchToRegisterLink: switchToRegisterLink,
  };
}

// Fonction pour créer le panneau de mot de passe oublié
export function createForgotPasswordPanel(options: LoginDialogOptions) {
  const forgotPasswordPanel = document.createElement("div");
  forgotPasswordPanel.className = `
    absolute inset-0
    flex flex-col gap-3 
    transition-transform duration-500 ease-in-out transform opacity-0
    w-full
    justify-center items-center pb-6
  `.replace(/\s+/g, " ");

  const forgotPasswordForm = document.createElement("form");
  forgotPasswordForm.className = "flex flex-col gap-3 w-full max-w-xs px-2";

  const forgotPasswordEmailInput = createInfoInput("Votre adresse e-mail", "forgotEmail");
  const forgotPasswordCodeInput = createInfoInput("Code reçu par e-mail", "forgotCode");
  
  const forgotPasswordButton = document.createElement("button");
  forgotPasswordButton.textContent = "Réinitialiser le mot de passe";
  forgotPasswordButton.type = "submit";
  forgotPasswordButton.className = "bg-purple-600 hover:bg-purple-700 font-semibold py-2 px-4 rounded ";

  forgotPasswordForm.appendChild(forgotPasswordEmailInput);
  forgotPasswordForm.appendChild(forgotPasswordCodeInput);
  forgotPasswordForm.appendChild(forgotPasswordButton);
  forgotPasswordPanel.appendChild(forgotPasswordForm);

  const switchToLoginFromForgotLink = document.createElement("a");
  switchToLoginFromForgotLink.href = "#";
  switchToLoginFromForgotLink.textContent = "Retour à la connexion";
  switchToLoginFromForgotLink.className = "text-center text-blue-400 hover:text-blue-200 text-sm mt-1 cursor-pointer";
  forgotPasswordPanel.appendChild(switchToLoginFromForgotLink);

  // Le gestionnaire de soumission est défini ici pour rester avec le formulaire
  forgotPasswordForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const email = forgotPasswordEmailInput.value;
    const code = forgotPasswordCodeInput.value;
    options.onForgotPasswordSubmit(email, code);
  });

  return {
    panel: forgotPasswordPanel,
    form: forgotPasswordForm,
    emailInput: forgotPasswordEmailInput,
    codeInput: forgotPasswordCodeInput,
    switchToLoginFromForgotLink: switchToLoginFromForgotLink,
  };
}