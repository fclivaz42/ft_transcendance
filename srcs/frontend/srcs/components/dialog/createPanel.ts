// createRegisterPanel(), createLoginPanel(), createForgotPasswordPanel()
//retourneraient le panneau HTML ccomplet avec ses champs et boutons
import { createInfoInput } from "../input/infoInput.js";
import { createPasswordInput } from "../input/createPasswordInput.js"; 

export interface LoginDialogOptions {
  initialMode: 'login' | 'register' | 'forgotPassword';
  onSwitchMode: (mode: 'login' | 'register' | 'forgotPassword') => void;

  // Surcharge pour le mode 'login'
  onSubmit(mode: 'login', data: { displayName: string; password: string; rememberMe: boolean; }): void;
  // Surcharge pour le mode 'register' - AJOUTÉ L'EMAIL ICI
  onSubmit(mode: 'register', data: { displayName: string; email: string; password: string; confirmPassword: string; }): void;
  // Vous pouvez ajouter d'autres surcharges si d'autres modes appellent onSubmit avec des données différentes

  onForgotPasswordSubmit: (email: string, code: string) => void; // Ceci est pour le bouton spécifique de Forgot Password
}

// Exportez ce type pour qu'il puisse être utilisé ailleurs..kezako
export type CustomPasswordInput = HTMLDivElement & { value: string, inputElement: HTMLInputElement, _enableStrengthCheck: boolean };

// srcs/components/dialog/createPanels.ts



// Fonction pour créer le panneau d'inscription heeere adapter gestion hauteur des panneaux et du container panelscontainer
// export function createRegisterPanel(options: LoginDialogOptions) {
//   const registerPanel = document.createElement("div");
//   registerPanel.className = `

//     absolute inset-0
//     flex flex-col gap-3 
//     transition-transform duration-500 ease-in-out transform opacity-0
//     w-full
//      items-center
//   `.replace(/\s+/g, " ");

//   const registerForm = document.createElement("form");
//   registerForm.className = "flex flex-col gap-3 w-full max-w-xs px-2"; 

//   const registerDisplayName = createInfoInput("Nom d'utilisateur", "displayName");
//   const registerEmailInput = createInfoInput("Adresse e-mail", "email");
  
//   const registerPasswordInput = createPasswordInput("Mot de passe", "password", true) as CustomPasswordInput;
//   const registerConfirmPasswordInput = createPasswordInput("Confirmer mot de passe", "confirmPassword", false) as CustomPasswordInput;
  
//   const passwordMatchFeedback = document.createElement("div");
//   passwordMatchFeedback.className = "text-sm text-red-400 ml-2 hidden items-center justify-end gap-1 font-semibold";
//   registerConfirmPasswordInput.appendChild(passwordMatchFeedback);

//   const registerButton = document.createElement("button");
//   registerButton.textContent = "S'inscrire";
//   registerButton.type = "submit";
//   registerButton.className = "bg-green-600 hover:bg-green-700 font-semibold py-2 px-4 rounded";
  
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

//   // Le gestionnaire de soumission est défini ici pour rester avec le formulaire
//   registerForm.addEventListener("submit", (event) => {
//     event.preventDefault();
//     const displayName = registerDisplayName.value;
//     const password = registerPasswordInput.value;
//     const confirmPassword = registerConfirmPasswordInput.value;

//     // La validation de correspondance des mots de passe reste dans loginDialog.ts pour sa logique globale
//     // (car elle est liée aux écouteurs d'événements blur/focus/input)
//     // Mais nous pouvons laisser la validation finale au submit ici.
//     if (password !== confirmPassword) {
//         alert("Les mots de passe ne correspondent pas !");
//         passwordMatchFeedback.classList.remove('hidden');
//         passwordMatchFeedback.classList.add('flex');
//         passwordMatchFeedback.innerHTML = '<svg class="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg><span class="text-red-500">Mots de passe différents</span>';
//         return; 
//     }

//     options.onSubmit('register', { displayName, password, confirmPassword });
//   });


//   return {
//     panel: registerPanel,
//     form: registerForm,
//     displayNameInput: registerDisplayName,
//     passwordInput: registerPasswordInput,
//     confirmPasswordInput: registerConfirmPasswordInput,
//     passwordMatchFeedback: passwordMatchFeedback, // Retourne aussi le feedback
//     switchToLoginLink: switchToLoginLink,
//     emailInput: registerEmailInput // Ajoutez l'email si vous l'utilisez
//   };
// }
// export function createRegisterPanel(options: LoginDialogOptions) {
//   const registerPanel = document.createElement("div");
//   registerPanel.className = `
//     absolute inset-0
//     flex flex-col gap-3 
//     transition-transform duration-500 ease-in-out transform opacity-0
//     w-full
//     items-center // <-- AJOUTÉ/AJUSTÉ POUR CENTRER LE CONTENU DU PANNEAU
//   `.replace(/\s+/g, " ");
    
//   const registerForm = document.createElement("form");
//   registerForm.className = "flex flex-col gap-3 w-full max-w-xs px-2 mx-auto";
// //////// ENTRY
//   const registerDisplayName = createInfoInput("Nom d'utilisateur", "displayName");
//   const registerEmailInput = createInfoInput("Adresse e-mail", "email");
//     //-parsing nom utilisateur
//   const displayNameErrorFeedback = document.createElement("div");
//   displayNameErrorFeedback.className = "text-sm text-red-400 ml-2 hidden"; // Hidden par défaut
//   registerDisplayName.appendChild(displayNameErrorFeedback); // S'assurer que createInfoInput permet l'ajout d'enfants ou l'adapter si nécessaire

//   const registerPasswordInput = createPasswordInput("Mot de passe", "password", true) as CustomPasswordInput;
//   const registerConfirmPasswordInput = createPasswordInput("Confirmer mot de passe", "confirmPassword", false) as CustomPasswordInput;
  
//   const passwordMatchFeedback = document.createElement("div");
//   passwordMatchFeedback.className = "text-sm text-red-400 ml-2 hidden items-center justify-end gap-1 font-semibold";
//   registerConfirmPasswordInput.appendChild(passwordMatchFeedback);

// //--------bouton d'inscription
//  const registerButton = document.createElement("button");
//   registerButton.textContent = "S'inscrire";
//   registerButton.type = "submit";
//   registerButton.className = `
//     font-semibold py-2 px-4 rounded
//     // État par défaut (désactivé - effet verre)
//     bg-transparent border border-green-700/[.3] // Bordure fine, légèrement transparente
//     shadow-[0_0_15px_rgba(0,255,0,0.1),_inset_0_0_10px_rgba(0,255,0,0.05)] // Ombre subtile verte
//     text-green-300/[.7] // Texte légèrement transparent et verdâtre
//     cursor-not-allowed

//     // Transitions fluides pour les changements de propriété
//     transition-all duration-500 ease-in-out // Transition pour toutes les propriétés en 0.5s
//   `.replace(/\s+/g, " ");
//   registerButton.disabled = true;

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

//   // ---Fonction de validation du formulaire d'inscription ---
// //   Uniquement des lettres, chiffres, et les caractères spéciaux , pas de double . et pas en 1er ni dernier position sont autorisés dans la partie locale (avant le @).
// //notif sous champs: la fonction doit retourner un element conteneur (div) qui englobe. si retourne directement l'element input -> on doit creer div et positionnner avec css  
// const validateRegisterForm = () => {
//      const displayNameValue = registerDisplayName.value.trim();
//       const isDisplayNameFilled = displayNameValue !== '';
//          // Regex pour lettres (majuscules/minuscules), chiffres, et point. Exclut @ et . consécutifs
//       // ^[a-zA-Z0-9]+([.][a-zA-Z0-9]+)*$
//       // Cette regex assure:
//       // - Commence par des lettres ou chiffres
//       // - Peut contenir des points, mais pas deux points consécutifs
//       // - Les points doivent être suivis de lettres ou chiffres
//       // - Ne contient pas d'autres caractères spéciaux, notamment @
//       const displayNameRegex = /^[a-zA-Z0-9]+([.][a-zA-Z0-9]+)*$/;
//       const isDisplayNameValid = displayNameRegex.test(displayNameValue);
//          // Afficher/masquer le message d'erreur pour le nom d'utilisateur
//       if (!isDisplayNameFilled || !isDisplayNameValid) {
//           displayNameErrorFeedback.textContent = "Seules les lettres, chiffres et points sont autorisés (pas de points consécutifs).";
//           displayNameErrorFeedback.classList.remove('hidden');
//       } else {
//           displayNameErrorFeedback.classList.add('hidden');
//       }

//       const emailValue = registerEmailInput.value.trim();
//       const isEmailFilled = emailValue !== '';
//       // Regex pour l'email:
//       // ^[a-zA-Z0-9._%+-]+@  -> Partie locale (avant le @)
//       // [a-zA-Z0-9.-]+      -> Nom de domaine (ex: google, hotmail)
//       // \.[a-zA-Z]{2,}$     -> TLD (ex: .com, .fr, .org) minimum 2 lettres
//       const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
//       const isEmailValid = emailRegex.test(emailValue);
//       const isPasswordFilled = registerPasswordInput.value.trim() !== '';
//       const isConfirmPasswordFilled = registerConfirmPasswordInput.value.trim() !== '';
//       const doPasswordsMatch = registerPasswordInput.value === registerConfirmPasswordInput.value;
      
//       const isValid = isDisplayNameFilled && 
//                       isEmailValid &&
//                       isPasswordFilled && 
//                       isConfirmPasswordFilled && 
//                       doPasswordsMatch;

//       registerButton.disabled = !isValid; // Active ou désactive le bouton
// if (isValid) {
//           registerButton.classList.remove(
//               'bg-transparent', 'border', 'border-green-700/[.3]', 
//               'shadow-[0_0_15px_rgba(0,255,0,0.1),_inset_0_0_10px_rgba(0,255,0,0.05)]', 
//               'text-green-300/[.7]', 
//               'cursor-not-allowed'
//           );
//           registerButton.classList.add(
//               'bg-green-600', // Couleur pleine
//               'hover:bg-green-700', // Réactive le hover
//               'text-white', // Texte blanc
//               'cursor-pointer' // Curseur normal
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
//           // registerButton.classList.remove('shadow-md'); // Exemple de suppression d'ombre différente
//       }
//   };

//   // --- NOUVEAU : Ajouter des écouteurs d'événements 'input' pour déclencher la validation ---
//   // Note: registerDisplayName.inputElement et registerEmailInput.inputElement supposent
//   // que createInfoInput retourne un objet avec un inputElement, comme createPasswordInput.
//   // Si createInfoInput retourne directement l'input HTML, utilisez juste .addEventListener
//   // sur registerDisplayName et registerEmailInput.
// registerDisplayName.addEventListener('input', validateRegisterForm);
// registerEmailInput.addEventListener('input', validateRegisterForm);
//   registerPasswordInput.inputElement.addEventListener('input', validateRegisterForm);
//   registerConfirmPasswordInput.inputElement.addEventListener('input', validateRegisterForm);

//   // Le gestionnaire de soumission est défini ici pour rester avec le formulaire
//   registerForm.addEventListener("submit", (event) => {
//     event.preventDefault();
    
//     // Revalider une dernière fois avant soumission
//     validateRegisterForm(); 
//     if (registerButton.disabled) { // Si le bouton est disabled, cela signifie que la validation a échoué
//         alert("Veuillez remplir tous les champs correctement et assurez-vous que les mots de passe correspondent.");
//         return; 
//     }

//     const displayName = registerDisplayName.value;
//     const email = registerEmailInput.value; // N'oubliez pas de récupérer l'email
//     const password = registerPasswordInput.value;
//     const confirmPassword = registerConfirmPasswordInput.value;

//     options.onSubmit('register', { displayName, email, password, confirmPassword }); // Passe l'email
//   });

//   return {
//     panel: registerPanel,
//     form: registerForm,
//     displayNameInput: registerDisplayName,
//     passwordInput: registerPasswordInput,
//     confirmPasswordInput: registerConfirmPasswordInput,
//     passwordMatchFeedback: passwordMatchFeedback, 
//     switchToLoginLink: switchToLoginLink,
//     emailInput: registerEmailInput // Retourne aussi l'emailInput
//   };
// }
// ... (imports)



// displayNameContainer et emailContainer. Chacun est un div avec des classes flex flex-col gap-1 pour empiler l'input et son message d'erreur.
//
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
  registerForm.className = "flex flex-col gap-3 w-full max-w-xs px-2 mx-auto";

  // --- CONTENEUR POUR LE NOM D'UTILISATEUR ET SON MESSAGE D'ERREUR ---
  const displayNameContainer = document.createElement("div");
  displayNameContainer.className = "flex flex-col gap-1"; // Organise label, input, error en colonne

  const registerDisplayNameInput = createInfoInput("Nom d'utilisateur", "displayName"); // Renommé pour plus de clarté
  // Si createInfoInput gère déjà le label, sinon ajoutez-le ici:
  // const displayNameLabel = document.createElement("label");
  // displayNameLabel.textContent = "Nom d'utilisateur";
  // displayNameLabel.htmlFor = "displayName"; // Assurez-vous que createInfoInput donne un ID à l'input
  // displayNameContainer.appendChild(displayNameLabel);

  displayNameContainer.appendChild(registerDisplayNameInput);

  const displayNameErrorFeedback = document.createElement("div");
  displayNameErrorFeedback.className = "text-sm text-red-400 ml-2 hidden";
  displayNameContainer.appendChild(displayNameErrorFeedback);
  // --- FIN CONTENEUR DISPLAY NAME ---


  // --- CONTENEUR POUR L'EMAIL ET SON MESSAGE D'ERREUR ---
  const emailContainer = document.createElement("div");
  emailContainer.className = "flex flex-col gap-1";

  const registerEmailInput = createInfoInput("Adresse e-mail", "email");
  emailContainer.appendChild(registerEmailInput);

  const emailErrorFeedback = document.createElement("div");
  emailErrorFeedback.className = "text-sm text-red-400 ml-2 hidden";
  emailContainer.appendChild(emailErrorFeedback);
  // --- FIN CONTENEUR EMAIL ---


  // --- CONTENEUR POUR LE MOT DE PASSE ET SON MESSAGE D'ERREUR (si CustomPasswordInput ne le gère pas déjà) ---
  // Note: Votre CustomPasswordInput semble déjà gérer cela avec passwordMatchFeedback,
  // donc nous ne créons pas de conteneur ici si CustomPasswordInput est déjà un div parent.
  const registerPasswordInput = createPasswordInput("Mot de passe", "password", true) as CustomPasswordInput;
  const registerConfirmPasswordInput = createPasswordInput("Confirmer mot de passe", "confirmPassword", false) as CustomPasswordInput;
  
  const passwordMatchFeedback = document.createElement("div");
  passwordMatchFeedback.className = "text-sm text-red-400 ml-2 hidden items-center justify-end gap-1 font-semibold";
  // L'ajout à registerConfirmPasswordInput suggère qu'il est déjà un conteneur.
  registerConfirmPasswordInput.appendChild(passwordMatchFeedback);


  const registerButton = document.createElement("button");
  registerButton.textContent = "S'inscrire";
  registerButton.type = "submit";
  registerButton.className = `
    font-semibold py-2 px-4 rounded
    bg-transparent border border-green-700/[.3] 
    shadow-[0_0_15px_rgba(0,255,0,0.1),_inset_0_0_10px_rgba(0,255,0,0.05)]
    text-green-300/[.7] 
    cursor-not-allowed
    transition-all duration-500 ease-in-out
  `.replace(/\s+/g, " ");
  
  registerButton.disabled = true;

  // --- AJOUT DES CONTENEURS AU FORMULAIRE ---
  registerForm.appendChild(displayNameContainer); // Ajout du conteneur
  registerForm.appendChild(emailContainer);       // Ajout du conteneur
  registerForm.appendChild(registerPasswordInput); // Ces deux sont déjà des conteneurs grâce à createPasswordInput
  registerForm.appendChild(registerConfirmPasswordInput);
  registerForm.appendChild(registerButton);
  registerPanel.appendChild(registerForm);

  const switchToLoginLink = document.createElement("a");
  switchToLoginLink.href = "#";
  switchToLoginLink.textContent = "Déjà un compte ? Se connecter";
  switchToLoginLink.className = "text-center text-blue-400 hover:text-blue-200 text-sm mt-1 cursor-pointer";
  registerPanel.appendChild(switchToLoginLink);

  // --- Fonction de validation du formulaire d'inscription ---
  const validateRegisterForm = () => {
      // Utilisez les inputs directs, car createInfoInput retourne l'input
      const displayNameValue = registerDisplayNameInput.value.trim();
      const emailValue = registerEmailInput.value.trim();
      const passwordValue = registerPasswordInput.value.trim();
      const confirmPasswordValue = registerConfirmPasswordInput.value.trim();

      // ==========================================================
      // --- VALIDATION DU DISPLAY NAME ---
      // ==========================================================
      // Regex pour lettres (a-z, A-Z), chiffres (0-9), tiret (-), point (.)
      // Pas de tiret/point au début/fin, pas de tiret/point consécutifs, pas d'espaces, pas d'autres caractères spéciaux
      const displayNameRegex = /^[a-zA-Z0-9]+([.-][a-zA-Z0-9]+)*[a-zA-Z0-9]?$/;
      const isDisplayNameFilled = displayNameValue !== '';
      const isDisplayNameValidFormat = displayNameRegex.test(displayNameValue);
      const containsSpace = displayNameValue.includes(' ');
      
      let isDisplayNameValid = isDisplayNameFilled && isDisplayNameValidFormat && !containsSpace;

      if (!isDisplayNameFilled) {
        //   displayNameErrorFeedback.textContent = "Le nom d'utilisateur est requis.";
        //   displayNameErrorFeedback.classList.remove('hidden');
      } else if (containsSpace) {
          displayNameErrorFeedback.textContent = "Essayez sans espaces ou avec  _ . -";
          displayNameErrorFeedback.classList.remove('hidden');
          isDisplayNameValid = false;
      } else if (!isDisplayNameValidFormat) {
          displayNameErrorFeedback.textContent = "! Essayez avec uniquement des lettres, des chiffres et ces signes : _ . -";
          displayNameErrorFeedback.classList.remove('hidden');
      } else {
          displayNameErrorFeedback.classList.add('hidden');
      }
      // ==========================================================


      // ==========================================================
      // --- VALIDATION DE L'EMAIL ---
      // ==========================================================
      // Regex plus précise pour l'email selon vos critères :
      // - ^[a-zA-Z0-9._%+-]+ : Partie locale (avant le @) - lettres, chiffres, ., _, %, +, -
      // - @                 : Un seul @
      // - [a-zA-Z0-9.-]+    : Partie domaine (après le @, avant le TLD) - lettres, chiffres, ., - (pas de points ou tirets consécutifs)
      // - \.                : Un point pour séparer le domaine du TLD
      // - [a-zA-Z]{2,}$     : TLD (extension) - au moins 2 lettres
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      
      const isEmailFilled = emailValue !== '';
      // Vérifications supplémentaires pour les points consécutifs et début/fin de la partie locale
      const localPart = emailValue.split('@')[0];
      const hasConsecutiveDotsInLocal = localPart?.includes('..');
      const hasDotAtStartOfLocal = localPart?.startsWith('.');
      const hasDotAtEndOfLocal = localPart?.endsWith('.');

      const domainPart = emailValue.split('@')[1];
      const hasConsecutiveDotsInDomain = domainPart?.includes('..');
      const hasConsecutiveHyphensInDomain = domainPart?.includes('--'); // Si vous voulez aussi empêcher les tirets consécutifs dans le domaine


      let isEmailValid = isEmailFilled && 
                         emailRegex.test(emailValue) && 
                         !hasConsecutiveDotsInLocal &&
                         !hasDotAtStartOfLocal &&
                         !hasDotAtEndOfLocal &&
                         !hasConsecutiveDotsInDomain &&
                         !hasConsecutiveHyphensInDomain; // Si pertinent


      if (!isEmailFilled) {
        //   emailErrorFeedback.textContent = "L'adresse e-mail est requise.";
        //   emailErrorFeedback.classList.remove('hidden');
      } else if (!isEmailValid) {
          // Message d'erreur plus détaillé pour l'email
          if (!emailValue.includes('@') || emailValue.split('@').length > 2) {
             emailErrorFeedback.textContent = "Vous êtes sûr?Essayez avec seul '@'.";
          } else if (hasDotAtStartOfLocal || hasDotAtEndOfLocal) {
             emailErrorFeedback.textContent = "Le nom d'utilisateur doit se terminer par une lettre ou un chiffre";
          } else if (hasConsecutiveDotsInLocal || hasConsecutiveDotsInDomain) {
             emailErrorFeedback.textContent = "Vous êtes sûr? pour les double '.' ";
          } else { // Si aucune des conditions spécifiques ci-dessus n'e.st remplie, c'est un problème de format général
             emailErrorFeedback.textContent = "Format d'adresse e-mail invalide (ex: user@domaine.com).";
          }
          emailErrorFeedback.classList.remove('hidden');
      } else {
          emailErrorFeedback.classList.add('hidden');
      }
      // ==========================================================


      // ==========================================================
      // --- VALIDATION DES MOTS DE PASSE (inchangée) ---
      // ==========================================================
      const isPasswordFilled = passwordValue !== '';
      const isConfirmPasswordFilled = confirmPasswordValue !== '';
      const doPasswordsMatch = passwordValue === confirmPasswordValue;
      // ==========================================================

      // --- Validation globale pour activer/désactiver le bouton ---
      const isFormValid = isDisplayNameValid &&
                          isEmailValid &&
                          isPasswordFilled && 
                          isConfirmPasswordFilled && 
                          doPasswordsMatch; 

      registerButton.disabled = !isFormValid; 

      // --- Gestion de l'apparence du bouton ---
      if (isFormValid) {
          registerButton.classList.remove(
              'bg-transparent', 'border', 'border-green-700/[.3]', 
              'shadow-[0_0_15px_rgba(0,255,0,0.1),_inset_0_0_10px_rgba(0,255,0,0.05)]', 
              'text-green-300/[.7]', 
              'cursor-not-allowed'
          );
          registerButton.classList.add(
              'bg-green-600', 
              'hover:bg-green-700', 
              'text-white', 
              'cursor-pointer'
          );
      } else {
          registerButton.classList.add(
              'bg-transparent', 'border', 'border-green-700/[.3]', 
              'shadow-[0_0_15px_rgba(0,255,0,0.1),_inset_0_0_10px_rgba(0,255,0,0.05)]', 
              'text-green-300/[.7]', 
              'cursor-not-allowed'
          );
          registerButton.classList.remove(
              'bg-green-600', 
              'hover:bg-green-700', 
              'text-white', 
              'cursor-pointer'
          );
      }
  };

  // --- Écouteurs d'événements input/blur et gestionnaire de soumission ---
  // Puisque createInfoInput retourne l'input directement, écoutez sur l'input directement.
  registerDisplayNameInput.addEventListener('input', validateRegisterForm); // ICI CHANGEMENT !
  registerEmailInput.addEventListener('input', validateRegisterForm);       // ICI CHANGEMENT !
  registerPasswordInput.inputElement.addEventListener('input', validateRegisterForm);
  registerConfirmPasswordInput.inputElement.addEventListener('input', validateRegisterForm);

  registerPasswordInput.inputElement.addEventListener('blur', validateRegisterForm);
  registerConfirmPasswordInput.inputElement.addEventListener('blur', validateRegisterForm);


  registerForm.addEventListener("submit", (event) => {
    event.preventDefault();
    validateRegisterForm(); 
    if (registerButton.disabled) { 
        return; 
    }

    const displayName = registerDisplayNameInput.value; // UTILISE LE NOM RENOMMÉ
    const email = registerEmailInput.value; 
    const password = registerPasswordInput.value;
    const confirmPassword = registerConfirmPasswordInput.value;

    options.onSubmit('register', { displayName, email, password, confirmPassword }); 
  });

  validateRegisterForm();

  return {
    panel: registerPanel,
    form: registerForm,
    displayNameInput: registerDisplayNameInput, // EXPORTE LE NOM RENOMMÉ
    emailInput: registerEmailInput,           // EXPORTE LE NOM RENOMMÉ
    passwordInput: registerPasswordInput,
    confirmPasswordInput: registerConfirmPasswordInput,
    passwordMatchFeedback: passwordMatchFeedback,
    switchToLoginLink: switchToLoginLink,
    displayNameErrorFeedback: displayNameErrorFeedback,
    emailErrorFeedback: emailErrorFeedback
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