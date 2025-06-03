
// une fois "Login" clicker, va generer le dialogue et apelle le login manager
// qui apelle login DIalog ici  puis lui appelle Input/infoInput.ts

import { createDialog } from "./index.js"; // note that it's important to target .js files, including index. VSCode won't resolve it automatically.
import { createInfoInput } from "../input/infoInput.js"; //appelle la methode input


export function createLoginDialog(): HTMLDialogElement 
{
  const dialog = createDialog({ allowClose: false });//ajoute la croix

  dialog.classList.add(

    "overflow-hidden", // pour eviter le scroll
    "w-[400px]",
    "max-w-full",
    "rounded-xl", // coins arrondis
    "bg-gray-900",
    "p-6",
    "shadow-2xl",      // ombre portée,// "shadow-lg"
    "border",          // bord léger
  );

  const dialogBody = document.createElement("div");
  dialogBody.className = "flex flex-col gap-6";

  const emailInput = createInfoInput("Adresse e-mail", "email");
  const passwordInput = createInfoInput("Mot de passe", "password");
  passwordInput.type = "password";

  const button = document.createElement("button");
  button.textContent = "Suivant";
  button.className = "bg-blue-600 hover:bg-blue-700 font-semibold py-2 px-4 rounded";

  dialogBody.appendChild(emailInput);
  dialogBody.appendChild(passwordInput);
  dialogBody.appendChild(button);

  dialog.appendChild(dialogBody);
  return dialog;
}

/////////////////
// version 2 en 1
// components/dialog/loginDialog.ts
// une fois "Login" cliqué, va generer le dialogue et apelle le login manager
// qui apelle login DIalog ici puis lui appelle Input/infoInput.ts

// import { createDialog } from "./index.js";
// import { createInfoInput } from "../input/infoInput.js"; // Importe la fonction createInfoInput

// // Définir une interface pour les options passées à createLoginDialog
// interface LoginDialogOptions {
//   initialMode: 'login' | 'register'; // Définit le mode initial (login ou register)
//   onSubmit: (mode: 'login' | 'register', data: { email: string; password?: string; confirmPassword?: string }) => void;
//   onSwitchMode: (newMode: 'login' | 'register') => void;
// }

// export function createLoginDialog(options: LoginDialogOptions): HTMLDialogElement {
//   const dialog = createDialog({ allowClose: false }); // Toujours pas de croix interne !

//   dialog.classList.add(
//     "overflow-hidden", // Cache le débordement pendant les transitions
//     "w-[400px]",
//     "max-w-full",
//     "rounded-xl",
//     "bg-gray-900",
//     "p-6",
//     "shadow-2xl",
//     "border",
//     "relative", // Pour que les éléments absolus s'y positionnent
//     "flex", "flex-col", // Pour organiser le titre et le conteneur des panneaux
//     "h-auto", // **Ajout important : la hauteur s'adapte au contenu**
//     "min-h-[300px]" // **Ajout important : une hauteur minimale pour que le contenu soit visible**
//   );

//   // --- Titre dynamique du dialogue ---
//   const dialogTitle = document.createElement("h2");
//   dialogTitle.className = "text-3xl font-bold text-white mb-6 text-center";

//   // --- Conteneur des panneaux (pour l'animation de glissement) ---
//   const panelsContainer = document.createElement("div");
//   panelsContainer.className = "relative w-full flex-grow overflow-hidden";
//   // **Ajout important : assure que le conteneur prend la hauteur restante**
//   panelsContainer.style.height = '100%'; // S'assure qu'il prend 100% de la hauteur disponible par flex-grow

//   // --- Panneau d'Inscription (Register) ---
//   const registerPanel = document.createElement("div");
//   registerPanel.className = `
//     absolute inset-0
//     flex flex-col gap-6
//     transition-transform duration-500 ease-in-out transform opacity-0
//     h-full w-full // **Ajout important : le panneau prend toute la hauteur/largeur**
//   `;

//   const registerForm = document.createElement("form");
//   registerForm.className = "flex flex-col gap-6 flex-grow"; // **Ajout important : le formulaire s'étire**

//   const registerEmailInput = createInfoInput("Adresse e-mail", "email");
//   const registerPasswordInput = createInfoInput("Mot de passe", "password");
//   registerPasswordInput.type = "password";
//   const registerConfirmPasswordInput = createInfoInput("Confirmer mot de passe", "password");
//   registerConfirmPasswordInput.type = "password";

//   const registerButton = document.createElement("button");
//   registerButton.textContent = "S'inscrire";
//   registerButton.type = "submit";
//   registerButton.className = "bg-green-600 hover:bg-green-700 font-semibold py-2 px-4 rounded mt-auto"; // **Ajout : 'mt-auto' pousse le bouton vers le bas si espace**

//   registerForm.appendChild(registerEmailInput);
//   registerForm.appendChild(registerPasswordInput);
//   registerForm.appendChild(registerConfirmPasswordInput);
//   registerForm.appendChild(registerButton);
//   registerPanel.appendChild(registerForm);
//   registerPanel.appendChild(registerButton); // Le bouton est déjà ajouté via form. L'ajouter directement est une duplication.
//   // Correction: le bouton fait partie du formulaire pour la soumission.

//   const switchToLoginLink = document.createElement("a");
//   switchToLoginLink.href = "#";
//   switchToLoginLink.textContent = "Déjà un compte ? Se connecter";
//   switchToLoginLink.className = "text-center text-blue-400 hover:text-blue-200 text-sm mt-4 cursor-pointer";
//   registerPanel.appendChild(switchToLoginLink);


//   // --- Panneau de Connexion (Login) ---
//   const loginPanel = document.createElement("div");
//   loginPanel.className = `
//     absolute inset-0
//     flex flex-col gap-6
//     transition-transform duration-500 ease-in-out transform opacity-0
//     h-full w-full // **Ajout important : le panneau prend toute la hauteur/largeur**
//   `;

//   const loginForm = document.createElement("form");
//   loginForm.className = "flex flex-col gap-6 flex-grow"; // **Ajout important : le formulaire s'étire**

//   const loginEmailInput = createInfoInput("Adresse e-mail", "email");
//   const loginPasswordInput = createInfoInput("Mot de passe", "password");
//   loginPasswordInput.type = "password";

//   const loginButton = document.createElement("button");
//   loginButton.textContent = "Connexion";
//   loginButton.type = "submit";
//   loginButton.className = "bg-blue-600 hover:bg-blue-700 font-semibold py-2 px-4 rounded mt-auto"; // **Ajout : 'mt-auto' pousse le bouton vers le bas si espace**

//   loginForm.appendChild(loginEmailInput);
//   loginForm.appendChild(loginPasswordInput);
//   loginForm.appendChild(loginButton);
//   loginPanel.appendChild(loginForm);
//   loginPanel.appendChild(loginButton); // Encore une duplication. Correction:

//   const switchToRegisterLink = document.createElement("a");
//   switchToRegisterLink.href = "#";
//   switchToRegisterLink.textContent = "Pas encore de compte ? S'inscrire";
//   switchToRegisterLink.className = "text-center text-blue-400 hover:text-blue-200 text-sm mt-4 cursor-pointer";
//   loginPanel.appendChild(switchToRegisterLink);

//   // --- Ajout des éléments au dialogue ---
//   dialog.appendChild(dialogTitle); // Ajoute le titre dynamique
//   panelsContainer.appendChild(registerPanel);
//   panelsContainer.appendChild(loginPanel);
//   dialog.appendChild(panelsContainer); // Ajoute le conteneur des panneaux

//   // --- Logique de soumission des formulaires ---
//   registerForm.addEventListener("submit", (event) => {
//     event.preventDefault();
//     const email = registerEmailInput.value;
//     const password = registerPasswordInput.value;
//     const confirmPassword = registerConfirmPasswordInput.value;
//     options.onSubmit('register', { email, password, confirmPassword });
//   });

//   loginForm.addEventListener("submit", (event) => {
//     event.preventDefault();
//     const email = loginEmailInput.value;
//     const password = loginPasswordInput.value;
//     options.onSubmit('login', { email, password });
//   });

//   // --- Logique de bascule entre les panneaux ---
//   let currentMode: 'login' | 'register';

//   const switchMode = (mode: 'login' | 'register', animate = true) => {
//     if (mode === currentMode) return;

//     dialogTitle.textContent = mode === 'login' ? "Se connecter" : "S'inscrire";

//     const hiddenClass = 'opacity-0';
//     const visibleClass = 'opacity-100';
//     const slideUp = '-translate-y-full'; // Glisse vers le haut (hors de vue)
//     const slideDown = 'translate-y-full'; // Glisse vers le bas (hors de vue)
//     const slideIn = 'translate-y-0'; // Position normale (visible)

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

//     if (mode === 'login') {
//       // Panneau d'inscription sort
//       registerPanel.classList.remove(slideIn, visibleClass);
//       registerPanel.classList.add(slideUp, hiddenClass);

//       // Panneau de connexion entre
//       loginPanel.classList.remove(slideUp, slideDown, hiddenClass); // Nettoie toutes les positions cachées
//       loginPanel.classList.add(slideIn, visibleClass);

//     } else { // mode === 'register'
//       // Panneau de connexion sort
//       loginPanel.classList.remove(slideIn, visibleClass);
//       loginPanel.classList.add(slideUp, hiddenClass);

//       // Panneau d'inscription entre
//       registerPanel.classList.remove(slideUp, slideDown, hiddenClass); // Nettoie toutes les positions cachées
//       registerPanel.classList.add(slideIn, visibleClass);
//     }
//     currentMode = mode;
//     options.onSwitchMode(mode);
//   };

//   // Ajoute les écouteurs de clic pour les liens de bascule
//   switchToLoginLink.addEventListener("click", (e) => {
//     e.preventDefault();
//     switchMode('login');
//   });

//   switchToRegisterLink.addEventListener("click", (e) => {
//     e.preventDefault();
//     switchMode('register');
//   });

//   // Définir le mode initial sans animation pour éviter une transition à l'ouverture
//   switchMode(options.initialMode, false);

//   return dialog;
// }


//////////////////////////////
// // components/dialog/loginDialog.ts
// import { createDialog } from "./index.js";
// import { createInfoInput } from "../input/infoInput.js";

// interface LoginDialogOptions {
//   initialMode: 'login' | 'register';
//   onSubmit: (mode: 'login' | 'register', data: { email: string; password?: string; confirmPassword?: string }) => void;
//   onSwitchMode: (newMode: 'login' | 'register') => void;
// }

// export function createLoginDialog(options: LoginDialogOptions): HTMLDialogElement {
//   const dialog = createDialog({ allowClose: false });

//   dialog.classList.add(
//     "overflow-hidden",
//     "w-[400px]",
//     "max-w-full",
//     "rounded-xl",
//     "bg-gray-900",
//     // --- MODIFICATION 1 : Réduire le padding vertical du dialogue ---
//     "py-4", // Ancien: "p-6" (24px partout). Nouveau: 16px de padding vertical
//     "px-6", // Conserve 24px de padding horizontal
//     "shadow-2xl",
//     "border",
//     "relative",
//     "flex", "flex-col",
//     "h-auto",
//     "max-h-[90vh]",
//     "my-auto"
//   );

//   const dialogTitle = document.createElement("h2");
//   // --- MODIFICATION 2 : Réduire le margin-bottom du titre ---
//   dialogTitle.className = "text-3xl font-bold text-white mb-4 text-center"; // Ancien: "mb-6" (24px). Nouveau: "mb-4" (16px)

//   const panelsContainer = document.createElement("div");
//   panelsContainer.className = "relative w-full overflow-hidden";
//   // --- MODIFICATION 3 : Réduire la hauteur fixe du conteneur de panneaux ---
//   // Ajustez cette valeur pour qu'elle corresponde exactement au contenu du formulaire le plus grand
//   panelsContainer.style.height = '240px'; // Ancien: '280px'. Essayez 240px ou même 220px.

//   // --- Panneau d'Inscription (Register) ---
//   const registerPanel = document.createElement("div");
//   registerPanel.className = `
//     absolute inset-0
//     flex flex-col gap-4 // MODIFICATION 4: Réduire le gap entre les éléments du formulaire (ancien: gap-6)
//     transition-transform duration-500 ease-in-out transform opacity-0
//     h-full w-full
//   `;

//   const registerForm = document.createElement("form");
//   registerForm.className = "flex flex-col gap-4"; // MODIFICATION 4: Réduire le gap ici aussi

//   const registerEmailInput = createInfoInput("Adresse e-mail", "email");
//   const registerPasswordInput = createInfoInput("Mot de passe", "password");
//   registerPasswordInput.type = "password";
//   const registerConfirmPasswordInput = createInfoInput("Confirmer mot de passe", "password");
//   registerConfirmPasswordInput.type = "password";

//   const registerButton = document.createElement("button");
//   registerButton.textContent = "S'inscrire";
//   registerButton.type = "submit";
//   registerButton.className = "bg-green-600 hover:bg-green-700 font-semibold py-2 px-4 rounded mt-auto";

//   registerForm.appendChild(registerEmailInput);
//   registerForm.appendChild(registerPasswordInput);
//   registerForm.appendChild(registerConfirmPasswordInput);
//   registerForm.appendChild(registerButton);
//   registerPanel.appendChild(registerForm);

//   const switchToLoginLink = document.createElement("a");
//   switchToLoginLink.href = "#";
//   switchToLoginLink.textContent = "Déjà un compte ? Se connecter";
//   switchToLoginLink.className = "text-center text-blue-400 hover:text-blue-200 text-sm mt-2 cursor-pointer"; // MODIFICATION 5: Réduire le margin-top du lien (ancien: mt-4)
//   registerPanel.appendChild(switchToLoginLink);

//   // --- Panneau de Connexion (Login) ---
//   const loginPanel = document.createElement("div");
//   loginPanel.className = `
//     absolute inset-0
//     flex flex-col gap-4 // MODIFICATION 4: Réduire le gap ici aussi
//     transition-transform duration-500 ease-in-out transform opacity-0
//     h-full w-full
//   `;

//   const loginForm = document.createElement("form");
//   loginForm.className = "flex flex-col gap-4"; // MODIFICATION 4: Réduire le gap ici aussi

//   const loginEmailInput = createInfoInput("Adresse e-mail", "email");
//   const loginPasswordInput = createInfoInput("Mot de passe", "password");
//   loginPasswordInput.type = "password";

//   const loginButton = document.createElement("button");
//   loginButton.textContent = "Connexion";
//   loginButton.type = "submit";
//   loginButton.className = "bg-blue-600 hover:bg-blue-700 font-semibold py-2 px-4 rounded mt-auto";

//   loginForm.appendChild(loginEmailInput);
//   loginForm.appendChild(loginPasswordInput);
//   loginForm.appendChild(loginButton);
//   loginPanel.appendChild(loginForm);

//   const switchToRegisterLink = document.createElement("a");
//   switchToRegisterLink.href = "#";
//   switchToRegisterLink.textContent = "Pas encore de compte ? S'inscrire";
//   switchToRegisterLink.className = "text-center text-blue-400 hover:text-blue-200 text-sm mt-2 cursor-pointer"; // MODIFICATION 5: Réduire le margin-top du lien (ancien: mt-4)
//   loginPanel.appendChild(switchToRegisterLink);

//   dialog.appendChild(dialogTitle);
//   panelsContainer.appendChild(registerPanel);
//   panelsContainer.appendChild(loginPanel);
//   dialog.appendChild(panelsContainer);

//   registerForm.addEventListener("submit", (event) => {
//     event.preventDefault();
//     const email = registerEmailInput.value;
//     const password = registerPasswordInput.value;
//     const confirmPassword = registerConfirmPasswordInput.value;
//     options.onSubmit('register', { email, password, confirmPassword });
//   });

//   loginForm.addEventListener("submit", (event) => {
//     event.preventDefault();
//     const email = loginEmailInput.value;
//     const password = loginPasswordInput.value;
//     options.onSubmit('login', { email, password });
//   });

//   let currentMode: 'login' | 'register';

//   const switchMode = (mode: 'login' | 'register', animate = true) => {
//     if (mode === currentMode) return;

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
//   };

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
/////////////////////////
