

// ////////////////////////////////////////////////////////////
// //formulaire
// //// une fois "Login" clicker, va generer le dialogue et apelle le login manager
// // qui apelle login DIalog ici  puis lui appelle Input/infoInput.ts


// /////////////////////////fenetre 2 en 1
// // components/dialog/loginDialog.ts
// import { createDialog } from "./index.js";
// import { createInfoInput } from "../input/infoInput.js";
// import { createPasswordInput } from "../input/createPasswordInput.js"; // Importer la fonction pour créer le champ de mot de passe

// interface LoginDialogOptions 
// {
//   initialMode: 'login' | 'register';
//   onSubmit: (mode: 'login' | 'register', data: { displayName: string; password?: string; confirmPassword?: string }) => void;
//   onSwitchMode: (newMode: 'login' | 'register') => void;
// }
//   // --- Dialog ---
// export function createLoginDialog(options: LoginDialogOptions): HTMLDialogElement 
// {
//   const dialog = createDialog({ allowClose: false });

//   dialog.classList.add(
//     "overflow-hidden",
//     "w-[400px]",
//     "max-w-full",
//     "rounded-xl",
//     "bg-gray-900",
//     "px-6", // padding horizontal seulement
//     "pt-1", // petit padding haut
//     "pb-4", // petit padding bas
//     "text-white",
//     "shadow-2xl",
//     "border",
//   );

//   // --- Titre ---
//   const dialogTitle = document.createElement("h2");
//   dialogTitle.className = "text-2xl font-bold text-white mb-2 text-center"; 
//     // --- Container principale[login- register] ---
//   const dialogBody = document.createElement("div");
//   dialogBody.className = "flex flex-col gap-4";
//     // --- Panneau animation [login-Register] ---
//   const panelsContainer = document.createElement("div");
//   panelsContainer.className = "relative w-full overflow-hidden";




//   // ---Conteneur (Register) ---//
//   //////////////////////////////////////////////////////////////////
//   //!rempli le conteneur parent + info transition
//   const registerPanel = document.createElement("div");
//   registerPanel.className = `
//     absolute inset-0
//     flex flex-col gap-3 
//     transition-transform duration-500 ease-in-out transform opacity-0
//     w-full
//   `;
// // --- Création du formulaire d'inscription[champs, bouton] ---
//   const registerForm = document.createElement("form");
//   registerForm.className = "flex flex-col gap-3 "; 

//   const registerDisplayName= createInfoInput("Nom d'utilisateur", "displayName");
//   const registerEmailInput = createInfoInput("Adresse e-mail", "email");
//   // const registerPasswordInput = createInfoInput("Mot de passe", "password");
//   const registerPasswordInput = createPasswordInput("Mot de passe", "password")as HTMLDivElement & { value: string }; //sûr que l'élément est d'un certain type <-- Utilise createPasswordInput
//   const registerConfirmPasswordInput = createPasswordInput("Confirmer mot de passe", "confirmPassword")as HTMLDivElement & { value: string }; // <-- Utilise createPasswordInput
//   // registerPasswordInput.type = "password";
//   // const registerConfirmPasswordInput = createInfoInput("Confirmer mot de passe", "password");
//   // registerConfirmPasswordInput.type = "password";

//   const registerButton = document.createElement("button");
//   registerButton.textContent = "S'inscrire";
//   registerButton.type = "submit";
//   registerButton.className = "bg-green-600 hover:bg-green-700 font-semibold py-2 px-4 rounded mt-auto";
//   // Insertion des champs et bouton dans le formulaire
//   registerForm.appendChild(registerDisplayName);
//   registerForm.appendChild(registerEmailInput);
//   registerForm.appendChild(registerPasswordInput);
//   registerForm.appendChild(registerConfirmPasswordInput);
//   registerForm.appendChild(registerButton);
//   registerPanel.appendChild(registerForm);

//   // Lien pour switch au mode connexion
//   const switchToLoginLink = document.createElement("a");
//   switchToLoginLink.href = "#";
//   switchToLoginLink.textContent = "Déjà un compte ? Se connecter";
//   switchToLoginLink.className = "text-center text-blue-400 hover:text-blue-200 text-sm mt-1 cursor-pointer"; // MODIFICATION 5: Réduire le margin-top du lien (ancien: mt-2). Nouveau: 4px (0.25rem)
//   registerPanel.appendChild(switchToLoginLink);

//   // ---Conteneur (login) ---//
//   //////////////////////////////////////////////////////////////////
//     //!rempli le conteneur parent + info transition
//   const loginPanel = document.createElement("div");
//   loginPanel.className = `
//     absolute inset-0
//     flex flex-col gap-3 
//     transition-transform duration-500 ease-in-out transform opacity-0
//     w-full
//   `;
// // --- Création du formulairelogin[champs, bouton] ---
//   const loginForm = document.createElement("form");
//   loginForm.className = "flex flex-col gap-3 "; // MODIFICATION 4: gap-3 et flex-grow

//   // const loginEmailInput = createInfoInput("Adresse e-mail", "email");
//   const loginDisplayName = createInfoInput("Nom d'utilisateur", "displayName");
//   const loginPasswordInput = createPasswordInput("Mot de passe", "password") as HTMLDivElement & { value: string }; // <-- Utilise createPasswordInput

//   const loginButton = document.createElement("button");
//   loginButton.textContent = "Connexion";
//   loginButton.type = "submit";
//   loginButton.className = "bg-blue-600 hover:bg-blue-700 font-semibold py-2 px-4 rounded ";
//     // Insertion des champs et bouton dans le formulaire
//   // loginForm.appendChild(loginEmailInput);
//   loginForm.appendChild(loginDisplayName);
//   loginForm.appendChild(loginPasswordInput);
//   loginForm.appendChild(loginButton);
//   loginPanel.appendChild(loginForm);
// // Lien pour switch au mode inscription
//   const switchToRegisterLink = document.createElement("a");
//   switchToRegisterLink.href = "#";
//   switchToRegisterLink.textContent = "Pas encore de compte ? S'inscrire";
//   switchToRegisterLink.className = "text-center text-blue-400 hover:text-blue-200 text-sm mt-1 cursor-pointer"; // MODIFICATION 5: Réduire le margin-top du lien
//   loginPanel.appendChild(switchToRegisterLink);


//   // Insertion des éléments(createElement ) dans le dialogue principale
//   dialog.appendChild(dialogTitle);
//   panelsContainer.appendChild(registerPanel);
//   panelsContainer.appendChild(loginPanel);
//   dialog.appendChild(panelsContainer);
//   dialog.appendChild(dialogBody);//Cela permet de séparer la structure du fond (dialog) de celle du contenu (body), ce qui évite que des marges et paddings s’écrasent ou se doublent.
  
// // --- Gestion des rentrees ---
//   registerForm.addEventListener("submit", (event) => {
//     event.preventDefault();
//     const displayName = registerDisplayName.value;
//     // const email = registerEmailInput.value;
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
//   // --- Fonction de changement de panneau[login-Register] ---
//   let currentMode: 'login' | 'register';

//   const switchMode = (mode: 'login' | 'register', animate = true) => {
//     if (mode === currentMode) return;

//   // Mise à jour du titre
//     dialogTitle.textContent = mode === 'login' ? "Se connecter" : "S'inscrire";

//     const hiddenClass = 'opacity-0';
//     const visibleClass = 'opacity-100';
//     const slideUp = '-translate-y-full';
//     const slideDown = 'translate-y-full';
//     const slideIn = 'translate-y-0';

//     const addTransitions = () => {
//         registerPanel.classList.add('transition-transform', 'transition-opacity', 'duration-500', 'ease-in-out');
//         loginPanel.classList.add('transition-transform', 'transition-opacity', 'duration-500', 'ease-in-out');
//     };
//     const removeTransitions = () => {
//         registerPanel.classList.remove('transition-transform', 'transition-opacity', 'duration-500', 'ease-in-out');
//         loginPanel.classList.remove('transition-transform', 'transition-opacity', 'duration-500', 'ease-in-out');
//     };

//     if (animate) {
//         addTransitions();
//     } else {
//         removeTransitions();
//     }
// // Animation des panneaux
//     if (mode === 'login') {
//       registerPanel.classList.remove(slideIn, visibleClass);
//       registerPanel.classList.add(slideUp, hiddenClass);

//       loginPanel.classList.remove(slideUp, slideDown, hiddenClass);
//       loginPanel.classList.add(slideIn, visibleClass);

//     } else { // mode === 'register'
//       loginPanel.classList.remove(slideIn, visibleClass);
//       loginPanel.classList.add(slideUp, hiddenClass);

//       registerPanel.classList.remove(slideUp, slideDown, hiddenClass);
//       registerPanel.classList.add(slideIn, visibleClass);
//     }
//     currentMode = mode;
//     options.onSwitchMode(mode);

 
//   // --- Ajustement dynamique de la hauteur du conteneur ---
//     setTimeout(() => {
//         const activePanel = (mode === 'login' ? loginPanel : registerPanel);
//         panelsContainer.style.height = `${activePanel.scrollHeight}px`;
//     }, animate ? 500 : 0);
//   };
// // --- Gestion des clics sur les liens de changement de mode ---
//   switchToLoginLink.addEventListener("click", (e) => {
//     e.preventDefault();
//     switchMode('login');
//   });

//   switchToRegisterLink.addEventListener("click", (e) => {
//     e.preventDefault();
//     switchMode('register');
//   });

//   switchMode(options.initialMode, false);

//   return dialog;
// }
// components/dialog/loginDialog.ts
import { createDialog } from "./index.js";
import { createInfoInput } from "../input/infoInput.js";
// IMPORTEZ CES DEUX ÉLÉMENTS :
import { createPasswordInput, checkPasswordStrength, PasswordStrengthResult } from "../input/createPasswordInput.js"; 


interface LoginDialogOptions 
{
  initialMode: 'login' | 'register';
  onSubmit: (mode: 'login' | 'register', data: { displayName: string; password?: string; confirmPassword?: string }) => void;
  onSwitchMode: (newMode: 'login' | 'register') => void;
}

// Supprimer ou commenter cette interface si elle est maintenant importée depuis createPasswordInput.ts
// interface PasswordStrengthResult {
//   minLength: boolean;
//   hasUppercase: boolean;
//   hasLowercase: boolean;
//   hasNumber: boolean;
//   hasSpecialChar: boolean;
// }

// Helper pour créer la liste de vérification (vous pouvez le laisser ici ou le déplacer dans un fichier utilitaire si vous le réutilisez ailleurs)
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
  const registerPasswordInput = createPasswordInput("Mot de passe", "password") as HTMLDivElement & { value: string, inputElement: HTMLInputElement };
  const registerConfirmPasswordInput = createPasswordInput("Confirmer mot de passe", "confirmPassword") as HTMLDivElement & { value: string, inputElement: HTMLInputElement };
  
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
  const loginPasswordInput = createPasswordInput("Mot de passe", "password") as HTMLDivElement & { value: string, inputElement: HTMLInputElement };

  const loginButton = document.createElement("button");
  loginButton.textContent = "Connexion";
  loginButton.type = "submit";
  loginButton.className = "bg-blue-600 hover:bg-blue-700 font-semibold py-2 px-4 rounded ";
  
  loginForm.appendChild(loginDisplayName);
  loginForm.appendChild(loginPasswordInput);
  loginForm.appendChild(loginButton);
  loginPanel.appendChild(loginForm);

  const switchToRegisterLink = document.createElement("a");
  switchToRegisterLink.href = "#";
  switchToRegisterLink.textContent = "Pas encore de compte ? S'inscrire";
  switchToRegisterLink.className = "text-center text-blue-400 hover:text-blue-200 text-sm mt-1 cursor-pointer";
  loginPanel.appendChild(switchToRegisterLink);


  dialog.appendChild(dialogTitle);
  panelsContainer.appendChild(registerPanel);
  panelsContainer.appendChild(loginPanel);
  dialog.appendChild(panelsContainer);
  dialog.appendChild(dialogBody);
  
// --- GESTION DE LA LISTE DE FORCE DE MOT DE PASSE EXTERNE ---
  const { element: strengthListElement, update: updateStrengthList } = createPasswordStrengthList();
  dialog.appendChild(strengthListElement);

  strengthListElement.classList.add('hidden');

  const passwordInputs = [
    registerPasswordInput.inputElement, 
    registerConfirmPasswordInput.inputElement, 
    loginPasswordInput.inputElement
  ];

  passwordInputs.forEach(input => {
    input.addEventListener('passwordStrengthChange', (e: CustomEvent<{ strengthResult: PasswordStrengthResult }>) => {
        if (!strengthListElement.classList.contains('hidden')) {
            updateStrengthList(e.detail.strengthResult);
        }
    });

    input.addEventListener('focus', () => {
        if (input.name === 'password' || input.name === 'confirmPassword') {
            strengthListElement.classList.remove('hidden');
            // La fonction checkPasswordStrength est maintenant importée et utilisable ici
            const initialStrength = checkPasswordStrength(input.value); 
            updateStrengthList(initialStrength);
        }
    });

    input.addEventListener('blur', () => {
        setTimeout(() => {
            const focusedElement = document.activeElement;
            const isAnotherPasswordInputFocused = passwordInputs.includes(focusedElement as HTMLInputElement);

            if (!isAnotherPasswordInputFocused) {
                strengthListElement.classList.add('hidden');
            }
        }, 50);
    });
  });

  registerForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const displayName = registerDisplayName.value;
    const password = registerPasswordInput.value;
    const confirmPassword = registerConfirmPasswordInput.value;
    options.onSubmit('register', { displayName, password, confirmPassword });
  });

  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const displayName = loginDisplayName.value;
    const password = loginPasswordInput.value;
    options.onSubmit('login', { displayName, password });
  });
  let currentMode: 'login' | 'register';

  const switchMode = (mode: 'login' | 'register', animate = true) => {
    if (mode === currentMode) return;

    dialogTitle.textContent = mode === 'login' ? "Se connecter" : "S'inscrire";

    const hiddenClass = 'opacity-0';
    const visibleClass = 'opacity-100';
    const slideUp = '-translate-y-full';
    const slideDown = 'translate-y-full';
    const slideIn = 'translate-y-0';

    const addTransitions = () => {
        registerPanel.classList.add('transition-transform', 'transition-opacity', 'duration-500', 'ease-in-out');
        loginPanel.classList.add('transition-transform', 'transition-opacity', 'duration-500', 'ease-in-out');
    };
    const removeTransitions = () => {
        registerPanel.classList.remove('transition-transform', 'transition-opacity', 'duration-500', 'ease-in-out');
        loginPanel.classList.remove('transition-transform', 'transition-opacity', 'duration-500', 'ease-in-out');
    };

    if (animate) {
        addTransitions();
    } else {
        removeTransitions();
    }
    if (mode === 'login') {
      registerPanel.classList.remove(slideIn, visibleClass);
      registerPanel.classList.add(slideUp, hiddenClass);

      loginPanel.classList.remove(slideUp, slideDown, hiddenClass);
      loginPanel.classList.add(slideIn, visibleClass);

    } else { // mode === 'register'
      loginPanel.classList.remove(slideIn, visibleClass);
      loginPanel.classList.add(slideUp, hiddenClass);

      registerPanel.classList.remove(slideUp, slideDown, hiddenClass);
      registerPanel.classList.add(slideIn, visibleClass);
    }
    currentMode = mode;
    options.onSwitchMode(mode);

    setTimeout(() => {
        const activePanel = (mode === 'login' ? loginPanel : registerPanel);
        panelsContainer.style.height = `${activePanel.scrollHeight}px`;
    }, animate ? 500 : 0);
  };
  switchToLoginLink.addEventListener("click", (e) => {
    e.preventDefault();
    switchMode('login');
    strengthListElement.classList.add('hidden');
  });

  switchToRegisterLink.addEventListener("click", (e) => {
    e.preventDefault();
    switchMode('register');
    strengthListElement.classList.add('hidden');
  });

  switchMode(options.initialMode, false);

  return dialog;
}