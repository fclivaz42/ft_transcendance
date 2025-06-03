

/////////////////////////////////////////////////////////////version1 avec juste un login
//// une fois "Login" clicker, va generer le dialogue et apelle le login manager
// qui apelle login DIalog ici  puis lui appelle Input/infoInput.ts

// import { createDialog } from "./index.js"; // note that it's important to target .js files, including index. VSCode won't resolve it automatically.
// import { createInfoInput } from "../input/infoInput.js"; //appelle la methode input


// export function createLoginDialog(): HTMLDialogElement 
// {
//   const dialog = createDialog({ allowClose: false });//ajoute la croix

//   dialog.classList.add(

//     "overflow-hidden", // pour eviter le scroll
//     "w-[400px]",
//     "max-w-full",
//     "rounded-xl", // coins arrondis
//     "bg-gray-900",
//     "p-6",
//     "shadow-2xl",      // ombre portée,// "shadow-lg"
//     "border",          // bord léger
//   );

//   const dialogBody = document.createElement("div");
//   dialogBody.className = "flex flex-col gap-6";

//   const emailInput = createInfoInput("Adresse e-mail", "email");
//   const passwordInput = createInfoInput("Mot de passe", "password");
//   passwordInput.type = "password";

//   const button = document.createElement("button");
//   button.textContent = "Suivant";
//   button.className = "bg-blue-600 hover:bg-blue-700 font-semibold py-2 px-4 rounded";

//   dialogBody.appendChild(emailInput);
//   dialogBody.appendChild(passwordInput);
//   dialogBody.appendChild(button);

//   dialog.appendChild(dialogBody);
//   return dialog;
// }
///////////////////////////////////////////////////////////



/////////////////////////fenetre 2 en 1
// components/dialog/loginDialog.ts
import { createDialog } from "./index.js";
import { createInfoInput } from "../input/infoInput.js";
import { createPasswordInput } from "../input/createPasswordInput.js"; // Importer la fonction pour créer le champ de mot de passe

interface LoginDialogOptions 
{
  initialMode: 'login' | 'register';
  onSubmit: (mode: 'login' | 'register', data: { email: string; password?: string; confirmPassword?: string }) => void;
  onSwitchMode: (newMode: 'login' | 'register') => void;
}
  // --- Dialog ---
export function createLoginDialog(options: LoginDialogOptions): HTMLDialogElement 
{
  const dialog = createDialog({ allowClose: false });

  dialog.classList.add(
    "overflow-hidden",
    "w-[400px]",
    "max-w-full",
    "rounded-xl",
    "bg-gray-900",
    "px-6", // padding horizontal seulement
    "pt-1", // petit padding haut
    "pb-4", // petit padding bas
    "text-white",
    "shadow-2xl",
    "border",
  );

  // --- Titre ---
  const dialogTitle = document.createElement("h2");
  dialogTitle.className = "text-2xl font-bold text-white mb-2 text-center"; 
    // --- Container principale[login- register] ---
  const dialogBody = document.createElement("div");
  dialogBody.className = "flex flex-col gap-4";
    // --- Panneau animation [login-Register] ---
  const panelsContainer = document.createElement("div");
  panelsContainer.className = "relative w-full overflow-hidden";




  // ---Conteneur (Register) ---//
  //////////////////////////////////////////////////////////////////
  //!rempli le conteneur parent + info transition
  const registerPanel = document.createElement("div");
  registerPanel.className = `
    absolute inset-0
    flex flex-col gap-3 
    transition-transform duration-500 ease-in-out transform opacity-0
    w-full
  `;
// --- Création du formulaire d'inscription[champs, bouton] ---
  const registerForm = document.createElement("form");
  registerForm.className = "flex flex-col gap-3 "; 

  const registerEmailInput = createInfoInput("Adresse e-mail", "email");
  // const registerPasswordInput = createInfoInput("Mot de passe", "password");
  const registerPasswordInput = createPasswordInput("Mot de passe", "password")as HTMLDivElement & { value: string }; //sûr que l'élément est d'un certain type <-- Utilise createPasswordInput
  const registerConfirmPasswordInput = createPasswordInput("Confirmer mot de passe", "confirmPassword")as HTMLDivElement & { value: string }; // <-- Utilise createPasswordInput
  // registerPasswordInput.type = "password";
  // const registerConfirmPasswordInput = createInfoInput("Confirmer mot de passe", "password");
  // registerConfirmPasswordInput.type = "password";

  const registerButton = document.createElement("button");
  registerButton.textContent = "S'inscrire";
  registerButton.type = "submit";
  registerButton.className = "bg-green-600 hover:bg-green-700 font-semibold py-2 px-4 rounded mt-auto";
  // Insertion des champs et bouton dans le formulaire
  registerForm.appendChild(registerEmailInput);
  registerForm.appendChild(registerPasswordInput);
  registerForm.appendChild(registerConfirmPasswordInput);
  registerForm.appendChild(registerButton);
  registerPanel.appendChild(registerForm);

  // Lien pour switch au mode connexion
  const switchToLoginLink = document.createElement("a");
  switchToLoginLink.href = "#";
  switchToLoginLink.textContent = "Déjà un compte ? Se connecter";
  switchToLoginLink.className = "text-center text-blue-400 hover:text-blue-200 text-sm mt-1 cursor-pointer"; // MODIFICATION 5: Réduire le margin-top du lien (ancien: mt-2). Nouveau: 4px (0.25rem)
  registerPanel.appendChild(switchToLoginLink);

  // ---Conteneur (login) ---//
  //////////////////////////////////////////////////////////////////
    //!rempli le conteneur parent + info transition
  const loginPanel = document.createElement("div");
  loginPanel.className = `
    absolute inset-0
    flex flex-col gap-3 
    transition-transform duration-500 ease-in-out transform opacity-0
    w-full
  `;
// --- Création du formulairelogin[champs, bouton] ---
  const loginForm = document.createElement("form");
  loginForm.className = "flex flex-col gap-3 "; // MODIFICATION 4: gap-3 et flex-grow

  const loginEmailInput = createInfoInput("Adresse e-mail", "email");
  // const loginPasswordInput = createInfoInput("Mot de passe", "password");
  // loginPasswordInput.type = "password";
  const loginPasswordInput = createPasswordInput("Mot de passe", "password") as HTMLDivElement & { value: string }; // <-- Utilise createPasswordInput

  const loginButton = document.createElement("button");
  loginButton.textContent = "Connexion";
  loginButton.type = "submit";
  loginButton.className = "bg-blue-600 hover:bg-blue-700 font-semibold py-2 px-4 rounded ";
    // Insertion des champs et bouton dans le formulaire
  loginForm.appendChild(loginEmailInput);
  loginForm.appendChild(loginPasswordInput);
  loginForm.appendChild(loginButton);
  loginPanel.appendChild(loginForm);
// Lien pour switch au mode inscription
  const switchToRegisterLink = document.createElement("a");
  switchToRegisterLink.href = "#";
  switchToRegisterLink.textContent = "Pas encore de compte ? S'inscrire";
  switchToRegisterLink.className = "text-center text-blue-400 hover:text-blue-200 text-sm mt-1 cursor-pointer"; // MODIFICATION 5: Réduire le margin-top du lien
  loginPanel.appendChild(switchToRegisterLink);


  // Insertion des éléments(createElement ) dans le dialogue principale
  dialog.appendChild(dialogTitle);
  panelsContainer.appendChild(registerPanel);
  panelsContainer.appendChild(loginPanel);
  dialog.appendChild(panelsContainer);
  dialog.appendChild(dialogBody);//Cela permet de séparer la structure du fond (dialog) de celle du contenu (body), ce qui évite que des marges et paddings s’écrasent ou se doublent.
  
// --- Gestion des rentrees ---
  registerForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const email = registerEmailInput.value;
    const password = registerPasswordInput.value;
    const confirmPassword = registerConfirmPasswordInput.value;
    options.onSubmit('register', { email, password, confirmPassword });
  });

  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const email = loginEmailInput.value;
    const password = loginPasswordInput.value;
    options.onSubmit('login', { email, password });
  });
  // --- Fonction de changement de panneau[login-Register] ---
  let currentMode: 'login' | 'register';

  const switchMode = (mode: 'login' | 'register', animate = true) => {
    if (mode === currentMode) return;

  // Mise à jour du titre
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
// Animation des panneaux
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

 
  // --- Ajustement dynamique de la hauteur du conteneur ---
    setTimeout(() => {
        const activePanel = (mode === 'login' ? loginPanel : registerPanel);
        panelsContainer.style.height = `${activePanel.scrollHeight}px`;
    }, animate ? 500 : 0);
  };
// --- Gestion des clics sur les liens de changement de mode ---
  switchToLoginLink.addEventListener("click", (e) => {
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