

// // srcs/components/dialog/loginDialog.ts
// import { createDialog } from "./index.js";
// import { createInfoInput } from "../input/infoInput.js";
// import { createPasswordInput, checkPasswordStrength, PasswordStrengthResult } from "../input/createPasswordInput.js"; 


// interface LoginDialogOptions 
// {
//   initialMode: 'login' | 'register' | 'forgotPassword'; // <-- AJOUT DU NOUVEAU MODE
//   onSubmit: (mode: 'login' | 'register', data: { displayName: string; password?: string; confirmPassword?: string }) => void;
//   onSwitchMode: (newMode: 'login' | 'register' | 'forgotPassword') => void; // <-- AJOUT DU NOUVEAU MODE
//   // AJOUT D'UN NOUVEL ÉVÉNEMENT DE SOUMISSION POUR LE MOT DE PASSE OUBLIÉ
//   onForgotPasswordSubmit: (email: string, code: string) => void; 
// }


// // Helper pour créer la liste de vérification
// function createPasswordStrengthList(): { element: HTMLUListElement, update: (result: PasswordStrengthResult) => void } {
//     const strengthList = document.createElement("ul");
//     strengthList.className = `
//       absolute
//       top-1/2 -translate-y-1/2
//       left-full ml-4
//       p-4 bg-gray-700 dark:bg-gray-100 rounded-lg shadow-xl z-20 hidden
//       min-w-[250px] text-sm text-gray-200 dark:text-gray-800
//     `.replace(/\s+/g, " ");

//     const criteria = [
//         { key: 'minLength', text: 'Au moins 8 caractères' },
//         { key: 'hasUppercase', text: 'Au moins une majuscule' },
//         { key: 'hasLowercase', text: 'Au moins une minuscule' },
//         { key: 'hasNumber', text: 'Au moins un chiffre' },
//         { key: 'hasSpecialChar', text: 'Au moins un caractère spécial (!@#$%)' },
//     ];

//     const strengthItems: { [key: string]: HTMLLIElement } = {};

//     criteria.forEach(c => {
//         const li = document.createElement("li");
//         li.textContent = c.text;
//         li.className = "flex items-center gap-2 mb-1 last:mb-0";
        
//         const marker = document.createElement("span");
//         marker.className = "w-3 h-3 rounded-full border border-gray-500 flex-shrink-0";
//         li.prepend(marker);

//         strengthList.appendChild(li);
//         strengthItems[c.key] = li;
//     });

//     const updateListDisplay = (result: PasswordStrengthResult) => {
//         criteria.forEach(c => {
//             const li = strengthItems[c.key];
//             if (li) {
//                 const marker = li.querySelector('span');
//                 if (result[c.key as keyof PasswordStrengthResult]) {
//                     li.classList.remove("text-gray-200", "dark:text-gray-800");
//                     li.classList.add("text-green-400", "dark:text-green-600");
//                     if (marker) {
//                         marker.classList.remove("border-gray-500", "border-red-500");
//                         marker.classList.add("bg-green-400", "border-green-400");
//                     }
//                 } else {
//                     li.classList.remove("text-green-400", "dark:text-green-600");
//                     li.classList.add("text-gray-200", "dark:text-gray-800");
//                     if (marker) {
//                         marker.classList.remove("bg-green-400", "border-green-400");
//                         marker.classList.add("border-red-500", "border-gray-500");
//                     }
//                 }
//             }
//         });
//     };

//     return {
//         element: strengthList,
//         update: updateListDisplay
//     };
// }


// // --- Dialog ---
// export function createLoginDialog(options: LoginDialogOptions): HTMLDialogElement 
// {
//   const dialog = createDialog({ allowClose: false });

//   dialog.classList.add(
//     "overflow-visible",
//     "w-[400px]",
//     "max-w-full",
//     "rounded-xl",
//     "bg-gray-900",
//     "px-6",
//     "pt-1",
//     "pb-4",
//     "text-white",
//     "shadow-2xl",
//     "border",
//     "relative"
//   );

//   const dialogTitle = document.createElement("h2");
//   dialogTitle.className = "text-2xl font-bold text-white mb-2 text-center"; 
//   const dialogBody = document.createElement("div");
//   dialogBody.className = "flex flex-col gap-4";
//   const panelsContainer = document.createElement("div");
//   panelsContainer.className = "relative w-full overflow-hidden";


//   const registerPanel = document.createElement("div");
//   registerPanel.className = `
//     absolute inset-0
//     flex flex-col gap-3 
//     transition-transform duration-500 ease-in-out transform opacity-0
//     w-full
//   `;
//   const registerForm = document.createElement("form");
//   registerForm.className = "flex flex-col gap-3 "; 

//   const registerDisplayName= createInfoInput("Nom d'utilisateur", "displayName");
//   const registerEmailInput = createInfoInput("Adresse e-mail", "email");
  
//   type CustomPasswordInput = HTMLDivElement & { value: string, inputElement: HTMLInputElement, _enableStrengthCheck: boolean };

//   const registerPasswordInput = createPasswordInput("Mot de passe", "password", true) as CustomPasswordInput;
//   const registerConfirmPasswordInput = createPasswordInput("Confirmer mot de passe", "confirmPassword", false) as CustomPasswordInput;
  
//   const registerButton = document.createElement("button");
//   registerButton.textContent = "S'inscrire";
//   registerButton.type = "submit";
//   registerButton.className = "bg-green-600 hover:bg-green-700 font-semibold py-2 px-4 rounded mt-auto";
  
//   registerForm.appendChild(registerDisplayName);
//   registerForm.appendChild(registerEmailInput);
//   registerForm.appendChild(registerPasswordInput);
//   registerForm.appendChild(registerConfirmPasswordInput);
//   registerForm.appendChild(registerButton);
//   registerPanel.appendChild(registerForm);

//   const switchToLoginLink = document.createElement("a");
//   switchToLoginLink.href = "#";
//   switchToLoginLink.textContent = "Déjà un compte ? Se connecter";
//   switchToLoginLink.className = "text-center text-blue-400 hover:text-blue-200 text-sm mt-1 cursor-pointer";
//   registerPanel.appendChild(switchToLoginLink);

//   const loginPanel = document.createElement("div");
//   loginPanel.className = `
//     absolute inset-0
//     flex flex-col gap-3 
//     transition-transform duration-500 ease-in-out transform opacity-0
//     w-full
//   `;
//   const loginForm = document.createElement("form");
//   loginForm.className = "flex flex-col gap-3 ";

//   const loginDisplayName = createInfoInput("Nom d'utilisateur", "displayName");
//   const loginPasswordInput = createPasswordInput("Mot de passe", "password", false) as CustomPasswordInput;

//   const loginButton = document.createElement("button");
//   loginButton.textContent = "Connexion";
//   loginButton.type = "submit";
//   loginButton.className = "bg-blue-600 hover:bg-blue-700 font-semibold py-2 px-4 rounded ";
  
//   loginForm.appendChild(loginDisplayName);
//   loginForm.appendChild(loginPasswordInput);
//   loginForm.appendChild(loginButton);
//   loginPanel.appendChild(loginForm);

//   // --- NOUVEAU : Lien "Mot de passe oublié ?" ---
//   const switchToForgotPasswordLink = document.createElement("a");
//   switchToForgotPasswordLink.href = "#";
//   switchToForgotPasswordLink.textContent = "Mot de passe oublié ?";
//   switchToForgotPasswordLink.className = "text-center text-blue-400 hover:text-blue-200 text-sm mt-1 cursor-pointer";
//   loginPanel.appendChild(switchToForgotPasswordLink); // Ajouté au panneau de connexion

//   const switchToRegisterLink = document.createElement("a");
//   switchToRegisterLink.href = "#";
//   switchToRegisterLink.textContent = "Pas encore de compte ? S'inscrire";
//   switchToRegisterLink.className = "text-center text-blue-400 hover:text-blue-200 text-sm mt-1 cursor-pointer";
//   loginPanel.appendChild(switchToRegisterLink);


//   // --- NOUVEAU : Panneau "Mot de passe oublié" ---
//   const forgotPasswordPanel = document.createElement("div");
//   forgotPasswordPanel.className = `
//     absolute inset-0
//     flex flex-col gap-3 
//     transition-transform duration-500 ease-in-out transform opacity-0
//     w-full
//   `;
//   const forgotPasswordForm = document.createElement("form");
//   forgotPasswordForm.className = "flex flex-col gap-3 ";

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


//   dialog.appendChild(dialogTitle);
//   panelsContainer.appendChild(registerPanel);
//   panelsContainer.appendChild(loginPanel);
//   panelsContainer.appendChild(forgotPasswordPanel); // <-- AJOUT DU NOUVEAU PANNEAU AU CONTENEUR
//   dialog.appendChild(panelsContainer);
//   dialog.appendChild(dialogBody);
  
// // --- GESTION DE LA LISTE DE FORCE DE MOT DE PASSE EXTERNE ---
//   const { element: strengthListElement, update: updateStrengthList } = createPasswordStrengthList();
//   dialog.appendChild(strengthListElement);

//   strengthListElement.classList.add('hidden');

//   const passwordInputsWithStatus = [
//     { input: registerPasswordInput.inputElement, enableStrength: registerPasswordInput._enableStrengthCheck }, 
//     { input: registerConfirmPasswordInput.inputElement, enableStrength: registerConfirmPasswordInput._enableStrengthCheck }, 
//     { input: loginPasswordInput.inputElement, enableStrength: loginPasswordInput._enableStrengthCheck }
//   ];

//   passwordInputsWithStatus.forEach(({ input, enableStrength }) => {
    
//     if (enableStrength) {
//         input.addEventListener('passwordStrengthChange', (e: CustomEvent<{ strengthResult: PasswordStrengthResult }>) => {
//             if (!strengthListElement.classList.contains('hidden')) {
//                 updateStrengthList(e.detail.strengthResult);
//             }
//         });
//     }

//     input.addEventListener('focus', () => {
//         if (enableStrength) {
//             strengthListElement.classList.remove('hidden');
//             const initialStrength = checkPasswordStrength(input.value); 
//             updateStrengthList(initialStrength);
//         }
//     });

//     input.addEventListener('blur', () => {
//         setTimeout(() => {
//             const focusedElement = document.activeElement;
//             const isAnotherStrengthInputFocused = passwordInputsWithStatus.some(
//                 item => item.input === focusedElement && item.enableStrength
//             );

//             if (enableStrength && !isAnotherStrengthInputFocused) {
//                 strengthListElement.classList.add('hidden');
//             }
//         }, 50);
//     });
//   });

//   registerForm.addEventListener("submit", (event) => {
//     event.preventDefault();
//     const displayName = registerDisplayName.value;
//     const password = registerPasswordInput.value;
//     const confirmPassword = registerConfirmPasswordInput.value;
//     options.onSubmit('register', { displayName, password, confirmPassword });
//   });

//   loginForm.addEventListener("submit", (event) => {
//     event.preventDefault();
//     const displayName = loginDisplayName.value;
//     const password = loginPasswordInput.value;
//     options.onSubmit('login', { displayName, password });
//   });

//   // --- NOUVEAU : Gestion de la soumission du formulaire de mot de passe oublié ---
//   forgotPasswordForm.addEventListener("submit", (event) => {
//     event.preventDefault();
//     const email = forgotPasswordEmailInput.value;
//     const code = forgotPasswordCodeInput.value;
//     options.onForgotPasswordSubmit(email, code); // Appelle la nouvelle fonction de rappel
//   });


//   let currentMode: 'login' | 'register' | 'forgotPassword'; // <-- METTRE À JOUR LE TYPE

//   const switchMode = (mode: 'login' | 'register' | 'forgotPassword', animate = true) => { // <-- METTRE À JOUR LE TYPE
//     if (mode === currentMode) return;

//     // --- METTRE À JOUR LE TITRE DU DIALOGUE SELON LE NOUVEAU MODE ---
//     if (mode === 'login') {
//         dialogTitle.textContent = "Se connecter";
//     } else if (mode === 'register') {
//         dialogTitle.textContent = "S'inscrire";
//     } else { // mode === 'forgotPassword'
//         dialogTitle.textContent = "Mot de passe oublié";
//     }

//     const hiddenClass = 'opacity-0';
//     const visibleClass = 'opacity-100';
//     const slideLeft = '-translate-x-full'; // Utilisation de translate-x pour un effet latéral
//     const slideRight = 'translate-x-full';
//     const slideIn = 'translate-x-0';

//     const addTransitions = () => {
//         registerPanel.classList.add('transition-transform', 'transition-opacity', 'duration-500', 'ease-in-out');
//         loginPanel.classList.add('transition-transform', 'transition-opacity', 'duration-500', 'ease-in-out');
//         forgotPasswordPanel.classList.add('transition-transform', 'transition-opacity', 'duration-500', 'ease-in-out'); // <-- AJOUT
//     };
//     const removeTransitions = () => {
//         registerPanel.classList.remove('transition-transform', 'transition-opacity', 'duration-500', 'ease-in-out');
//         loginPanel.classList.remove('transition-transform', 'transition-opacity', 'duration-500', 'ease-in-out');
//         forgotPasswordPanel.classList.remove('transition-transform', 'transition-opacity', 'duration-500', 'ease-in-out'); // <-- AJOUT
//     };

//     if (animate) {
//         addTransitions();
//     } else {
//         removeTransitions();
//     }

//     // Réinitialiser toutes les classes de position pour les panneaux
//     [registerPanel, loginPanel, forgotPasswordPanel].forEach(panel => {
//         panel.classList.remove(slideIn, slideLeft, slideRight, visibleClass, hiddenClass);
//         panel.classList.add(hiddenClass); // Cacher par défaut avant de positionner
//     });


//     if (mode === 'login') {
//       loginPanel.classList.remove(hiddenClass);
//       loginPanel.classList.add(slideIn, visibleClass);

//       registerPanel.classList.add(slideLeft); // S'assure que l'autre panneau est bien positionné
//       forgotPasswordPanel.classList.add(slideRight); // S'assure que l'autre panneau est bien positionné

//     } else if (mode === 'register') { 
//       registerPanel.classList.remove(hiddenClass);
//       registerPanel.classList.add(slideIn, visibleClass);

//       loginPanel.classList.add(slideRight);
//       forgotPasswordPanel.classList.add(slideLeft); // S'assure que l'autre panneau est bien positionné

//     } else { // mode === 'forgotPassword'
//       forgotPasswordPanel.classList.remove(hiddenClass);
//       forgotPasswordPanel.classList.add(slideIn, visibleClass);

//       loginPanel.classList.add(slideLeft); // Le panneau de connexion se déplace à gauche
//       registerPanel.classList.add(slideRight); // Le panneau d'inscription se déplace à droite
//     }
    
//     currentMode = mode;
//     options.onSwitchMode(mode);

//     // Cacher la bulle de force du mot de passe lors du changement de mode
//     strengthListElement.classList.add('hidden'); // <-- AJOUT POUR CACHER LA BULLE

//     setTimeout(() => {
//         let activePanel;
//         if (mode === 'login') activePanel = loginPanel;
//         else if (mode === 'register') activePanel = registerPanel;
//         else activePanel = forgotPasswordPanel; // <-- AJOUT

//         if (activePanel) { // Assurez-vous que le panneau actif existe
//             panelsContainer.style.height = `${activePanel.scrollHeight}px`;
//         }
//     }, animate ? 500 : 0);
//   };

//   // --- NOUVEL ÉCOUTEUR POUR LE LIEN "Mot de passe oublié ?" ---
//   switchToForgotPasswordLink.addEventListener("click", (e) => {
//     e.preventDefault();
//     switchMode('forgotPassword');
//   });

//   switchToLoginLink.addEventListener("click", (e) => {
//     e.preventDefault();
//     switchMode('login');
//     // strengthListElement.classList.add('hidden'); // Déjà fait dans switchMode
//   });

//   // Nouveau lien de retour vers le login depuis le panneau forgotPassword
//   switchToLoginFromForgotLink.addEventListener("click", (e) => {
//     e.preventDefault();
//     switchMode('login');
//   });

//   switchToRegisterLink.addEventListener("click", (e) => {
//     e.preventDefault();
//     switchMode('register');
//     // strengthListElement.classList.add('hidden'); // Déjà fait dans switchMode
//   });

//   switchMode(options.initialMode, false);

//   return dialog;
// }

// srcs/components/dialog/loginDialog.ts
import { createDialog } from "./index.js";
import { createInfoInput } from "../input/infoInput.js";
import { createPasswordInput, checkPasswordStrength, PasswordStrengthResult } from "../input/createPasswordInput.js"; 


interface LoginDialogOptions 
{
  initialMode: 'login' | 'register' | 'forgotPassword';
  onSubmit: (mode: 'login' | 'register', data: { displayName: string; password?: string; confirmPassword?: string }) => void;
  onSwitchMode: (newMode: 'login' | 'register' | 'forgotPassword') => void;
  onForgotPasswordSubmit: (email: string, code: string) => void; 
}


// Helper pour créer la liste de vérification
function createPasswordStrengthList(): { element: HTMLUListElement, update: (result: PasswordStrengthResult) => void } {
    const strengthList = document.createElement("ul");
    strengthList.className = `
      absolute
      top-1/2 -translate-y-1/2
      left-full ml-4
      p-4 bg-gray-700 dark:bg-gray-100 rounded-lg shadow-xl z-20 hidden
      min-w-[250px] text-sm text-gray-200 dark:text-gray-800
    `.replace(/\s+/g, " ");

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
        li.className = "flex items-center gap-2 mb-1 last:mb-0";
        
        const marker = document.createElement("span");
        marker.className = "w-3 h-3 rounded-full border border-gray-500 flex-shrink-0";
        li.prepend(marker);

        strengthList.appendChild(li);
        strengthItems[c.key] = li;
    });

    const updateListDisplay = (result: PasswordStrengthResult) => {
        criteria.forEach(c => {
            const li = strengthItems[c.key];
            if (li) {
                const marker = li.querySelector('span');
                if (result[c.key as keyof PasswordStrengthResult]) {
                    li.classList.remove("text-gray-200", "dark:text-gray-800");
                    li.classList.add("text-green-400", "dark:text-green-600");
                    if (marker) {
                        marker.classList.remove("border-gray-500", "border-red-500");
                        marker.classList.add("bg-green-400", "border-green-400");
                    }
                } else {
                    li.classList.remove("text-green-400", "dark:text-green-600");
                    li.classList.add("text-gray-200", "dark:text-gray-800");
                    if (marker) {
                        marker.classList.remove("bg-green-400", "border-green-400");
                        marker.classList.add("border-red-500", "border-gray-500");
                    }
                }
            }
        });
    };

    return {
        element: strengthList,
        update: updateListDisplay
    };
}


// --- Dialog ---
export function createLoginDialog(options: LoginDialogOptions): HTMLDialogElement 
{
  const dialog = createDialog({ allowClose: false });

  dialog.classList.add(
    "overflow-visible",
    "w-[400px]",
    "max-w-full",
    "rounded-xl",
    "bg-gray-900",
    "px-6",
    "pt-1",
    "pb-4",
    "text-white",
    "shadow-2xl",
    "border",
    "relative"
  );

  const dialogTitle = document.createElement("h2");
  dialogTitle.className = "text-2xl font-bold text-white mb-2 text-center"; 
  const dialogBody = document.createElement("div");
  dialogBody.className = "flex flex-col gap-4";
  const panelsContainer = document.createElement("div");
  panelsContainer.className = "relative w-full overflow-hidden";


  const registerPanel = document.createElement("div");
  registerPanel.className = `
    absolute inset-0
    flex flex-col gap-3 
    transition-transform duration-500 ease-in-out transform opacity-0
    w-full
  `;
  const registerForm = document.createElement("form");
  registerForm.className = "flex flex-col gap-3 "; 

  const registerDisplayName= createInfoInput("Nom d'utilisateur", "displayName");
  const registerEmailInput = createInfoInput("Adresse e-mail", "email");
  
  type CustomPasswordInput = HTMLDivElement & { value: string, inputElement: HTMLInputElement, _enableStrengthCheck: boolean };

  const registerPasswordInput = createPasswordInput("Mot de passe", "password", true) as CustomPasswordInput;
  const registerConfirmPasswordInput = createPasswordInput("Confirmer mot de passe", "confirmPassword", false) as CustomPasswordInput;
  
  const passwordMatchFeedback = document.createElement("div");
  passwordMatchFeedback.className = "text-sm text-red-400 ml-2 hidden items-center justify-end gap-1 font-semibold";
  registerConfirmPasswordInput.appendChild(passwordMatchFeedback);

  const registerButton = document.createElement("button");
  registerButton.textContent = "S'inscrire";
  registerButton.type = "submit";
  registerButton.className = "bg-green-600 hover:bg-green-700 font-semibold py-2 px-4 rounded mt-auto";
  
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

  const loginPanel = document.createElement("div");
  loginPanel.className = `
    absolute inset-0
    flex flex-col gap-3 
    transition-transform duration-500 ease-in-out transform opacity-0
    w-full
  `;
  const loginForm = document.createElement("form");
  loginForm.className = "flex flex-col gap-3 ";

  const loginDisplayName = createInfoInput("Nom d'utilisateur", "displayName");
  const loginPasswordInput = createPasswordInput("Mot de passe", "password", false) as CustomPasswordInput;

  const loginButton = document.createElement("button");
  loginButton.textContent = "Connexion";
  loginButton.type = "submit";
  loginButton.className = "bg-blue-600 hover:bg-blue-700 font-semibold py-2 px-4 rounded ";
  
  loginForm.appendChild(loginDisplayName);
  loginForm.appendChild(loginPasswordInput);
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


  const forgotPasswordPanel = document.createElement("div");
  forgotPasswordPanel.className = `
    absolute inset-0
    flex flex-col gap-3 
    transition-transform duration-500 ease-in-out transform opacity-0
    w-full
  `;
  const forgotPasswordForm = document.createElement("form");
  forgotPasswordForm.className = "flex flex-col gap-3 ";

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


  dialog.appendChild(dialogTitle);
  panelsContainer.appendChild(registerPanel);
  panelsContainer.appendChild(loginPanel);
  panelsContainer.appendChild(forgotPasswordPanel);
  dialog.appendChild(panelsContainer);
  dialog.appendChild(dialogBody);
  
// --- GESTION DE LA LISTE DE FORCE DE MOT DE PASSE EXTERNE ---
  const { element: strengthListElement, update: updateStrengthList } = createPasswordStrengthList();
  dialog.appendChild(strengthListElement);

  strengthListElement.classList.add('hidden');

  const passwordInputsWithStatus = [
    { input: registerPasswordInput.inputElement, enableStrength: registerPasswordInput._enableStrengthCheck }, 
    { input: registerConfirmPasswordInput.inputElement, enableStrength: registerConfirmPasswordInput._enableStrengthCheck }, 
    { input: loginPasswordInput.inputElement, enableStrength: loginPasswordInput._enableStrengthCheck }
  ];

  passwordInputsWithStatus.forEach(({ input, enableStrength }) => {
    
    if (enableStrength) {
        input.addEventListener('passwordStrengthChange', (e: CustomEvent<{ strengthResult: PasswordStrengthResult }>) => {
            if (!strengthListElement.classList.contains('hidden')) {
                updateStrengthList(e.detail.strengthResult);
            }
        });
    }

    input.addEventListener('focus', () => {
        if (enableStrength) {
            strengthListElement.classList.remove('hidden');
            const initialStrength = checkPasswordStrength(input.value); 
            updateStrengthList(initialStrength);
        }
    });

    input.addEventListener('blur', () => {
        setTimeout(() => {
            const focusedElement = document.activeElement;
            const isAnotherStrengthInputFocused = passwordInputsWithStatus.some(
                item => item.input === focusedElement && item.enableStrength
            );

            if (enableStrength && !isAnotherStrengthInputFocused) {
                strengthListElement.classList.add('hidden');
            }
        }, 50);
    });
  });

  // --- MODIFIÉ : Fonction de validation de la correspondance des mots de passe ---
  const checkPasswordMatch = () => {
    const password = registerPasswordInput.value;
    const confirmPassword = registerConfirmPasswordInput.value;
    const isRegisterPanelActive = currentMode === 'register';

    // Vérifier si le champ de confirmation est en focus
    const isConfirmPasswordInputFocused = document.activeElement === registerConfirmPasswordInput.inputElement;

    // Nouvelle condition pour détecter une différence de manière subtile :
    // Le mot de passe de confirmation doit avoir au moins un caractère, ET
    // (soit il ne correspond pas au début du mot de passe original,
    // soit il est plus long que le mot de passe original)
    const hasMismatch = confirmPassword.length > 0 && 
                        (password.substring(0, confirmPassword.length) !== confirmPassword || 
                         confirmPassword.length > password.length);


    // Afficher le feedback si :
    // 1. Nous sommes en mode inscription
    // 2. Le champ de confirmation est en focus
    // 3. Une différence est détectée (selon 'hasMismatch')
    if (isRegisterPanelActive && isConfirmPasswordInputFocused && hasMismatch) {
        passwordMatchFeedback.classList.remove('hidden');
        passwordMatchFeedback.classList.add('flex');
        passwordMatchFeedback.innerHTML = '<svg class="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg><span class="text-red-500">Mots de passe différents</span>';
    } else {
        // Cacher le feedback si les conditions ne sont pas remplies
        passwordMatchFeedback.classList.add('hidden');
        passwordMatchFeedback.classList.remove('flex');
    }
  };

  // Les écouteurs 'input' restent sur les deux champs pour que la vérification se déclenche
  registerPasswordInput.inputElement.addEventListener('input', checkPasswordMatch);
  registerConfirmPasswordInput.inputElement.addEventListener('input', checkPasswordMatch);
  
  // Seulement sur le FOCUS du champ de confirmation
  registerConfirmPasswordInput.inputElement.addEventListener('focus', checkPasswordMatch);

  // Sur le BLUR des DEUX champs, on veut relancer checkPasswordMatch
  // pour qu'il masque le feedback si le champ de confirmation n'est plus focus.
  registerPasswordInput.inputElement.addEventListener('blur', () => {
    setTimeout(checkPasswordMatch, 50); 
  });
  registerConfirmPasswordInput.inputElement.addEventListener('blur', () => {
    setTimeout(checkPasswordMatch, 50); 
  });


  registerForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const displayName = registerDisplayName.value;
    const password = registerPasswordInput.value;
    const confirmPassword = registerConfirmPasswordInput.value;

    if (currentMode === 'register' && password !== confirmPassword) {
        alert("Les mots de passe ne correspondent pas !");
        // Force l'affichage du message d'erreur lors de la soumission si mismatch,
        // même si le champ n'est pas en focus.
        passwordMatchFeedback.classList.remove('hidden');
        passwordMatchFeedback.classList.add('flex');
        passwordMatchFeedback.innerHTML = '<svg class="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg><span class="text-red-500">Mots de passe différents</span>';
        
        return; 
    }

    options.onSubmit('register', { displayName, password, confirmPassword });
  });

  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const displayName = loginDisplayName.value;
    const password = loginPasswordInput.value;
    options.onSubmit('login', { displayName, password });
  });

  forgotPasswordForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const email = forgotPasswordEmailInput.value;
    const code = forgotPasswordCodeInput.value;
    options.onForgotPasswordSubmit(email, code);
  });


  let currentMode: 'login' | 'register' | 'forgotPassword';

  const switchMode = (mode: 'login' | 'register' | 'forgotPassword', animate = true) => {
    if (mode === currentMode) return;

    if (mode === 'login') {
        dialogTitle.textContent = "Se connecter";
    } else if (mode === 'register') {
        dialogTitle.textContent = "S'inscrire";
    } else { // mode === 'forgotPassword'
        dialogTitle.textContent = "Mot de passe oublié";
    }

    const hiddenClass = 'opacity-0';
    const visibleClass = 'opacity-100';
    const slideLeft = '-translate-x-full';
    const slideRight = 'translate-x-full';
    const slideIn = 'translate-x-0';

    const addTransitions = () => {
        registerPanel.classList.add('transition-transform', 'transition-opacity', 'duration-500', 'ease-in-out');
        loginPanel.classList.add('transition-transform', 'transition-opacity', 'duration-500', 'ease-in-out');
        forgotPasswordPanel.classList.add('transition-transform', 'transition-opacity', 'duration-500', 'ease-in-out');
    };
    const removeTransitions = () => {
        registerPanel.classList.remove('transition-transform', 'transition-opacity', 'duration-500', 'ease-in-out');
        loginPanel.classList.remove('transition-transform', 'transition-opacity', 'duration-500', 'ease-in-out');
        forgotPasswordPanel.classList.remove('transition-transform', 'transition-opacity', 'duration-500', 'ease-in-out');
    };

    if (animate) {
        addTransitions();
    } else {
        removeTransitions();
    }

    [registerPanel, loginPanel, forgotPasswordPanel].forEach(panel => {
        panel.classList.remove(slideIn, slideLeft, slideRight, visibleClass, hiddenClass);
        panel.classList.add(hiddenClass);
    });


    if (mode === 'login') {
      loginPanel.classList.remove(hiddenClass);
      loginPanel.classList.add(slideIn, visibleClass);

      registerPanel.classList.add(slideLeft);
      forgotPasswordPanel.classList.add(slideRight);

    } else if (mode === 'register') { 
      registerPanel.classList.remove(hiddenClass);
      registerPanel.classList.add(slideIn, visibleClass);

      loginPanel.classList.add(slideRight);
      forgotPasswordPanel.classList.add(slideLeft);

    } else { // mode === 'forgotPassword'
      forgotPasswordPanel.classList.remove(hiddenClass);
      forgotPasswordPanel.classList.add(slideIn, visibleClass);

      loginPanel.classList.add(slideLeft);
      registerPanel.classList.add(slideRight);
    }
    
    currentMode = mode;
    options.onSwitchMode(mode);

    strengthListElement.classList.add('hidden');
    passwordMatchFeedback.classList.add('hidden'); // S'assure que le feedback est caché lors du changement de mode

    setTimeout(() => {
        let activePanel;
        if (mode === 'login') activePanel = loginPanel;
        else if (mode === 'register') activePanel = registerPanel;
        else activePanel = forgotPasswordPanel;

        if (activePanel) {
            panelsContainer.style.height = `${activePanel.scrollHeight}px`;
        }
        if (mode === 'register') {
            checkPasswordMatch(); 
        }
    }, animate ? 500 : 0);
  };

  switchToForgotPasswordLink.addEventListener("click", (e) => {
    e.preventDefault();
    switchMode('forgotPassword');
  });

  switchToLoginLink.addEventListener("click", (e) => {
    e.preventDefault();
    switchMode('login');
  });

  switchToLoginFromForgotLink.addEventListener("click", (e) => {
    e.preventDefault();
    switchMode('login');
  });

  switchToRegisterLink.addEventListener("click", (e) => {
    e.preventDefault();
    switchMode('register');
  });

  switchMode(options.initialMode, false);

  return dialog;
}