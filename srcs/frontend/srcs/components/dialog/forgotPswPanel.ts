// // Fonction pour créer le panneau de mot de passe oublié

// import { createInfoInput, CustomInputContainer } from '../input/infoInput.js';
// import { LoginDialogOptions } from './index.js'; // Import from your new index.ts
// import { i18nHandler } from "../../handlers/i18nHandler.js";

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

//   const forgotPasswordEmailInput = createInfoInput(i18nHandler.getValue("panel.emailLabel"), "forgotEmail");
//   const forgotPasswordCodeInput = createInfoInput(i18nHandler.getValue("panel.forgotPasswordPanel.validation.code"), "forgotCode");
  
//   const forgotPasswordButton = document.createElement("button");
//   forgotPasswordButton.textContent = i18nHandler.getValue("panel.forgotPasswordPanel.sendButton");
//   forgotPasswordButton.type = "submit";
//   forgotPasswordButton.className = "bg-purple-600 hover:bg-purple-700 font-semibold py-2 px-4 rounded ";
//   forgotPasswordButton.className += " mb-8";
//   forgotPasswordForm.appendChild(forgotPasswordEmailInput);
//   forgotPasswordForm.appendChild(forgotPasswordButton);
//   forgotPasswordForm.appendChild(forgotPasswordCodeInput);

//   forgotPasswordPanel.appendChild(forgotPasswordForm);

//   const switchToLoginFromForgotLink = document.createElement("a");
//   switchToLoginFromForgotLink.href = "#";
//   switchToLoginFromForgotLink.textContent = i18nHandler.getValue("panel.forgotPasswordPanel.link.loginPanel");
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
////////////////////////////////mail gauche->
// Fonction pour créer le panneau de mot de passe oublié

import { createInfoInput, CustomInputContainer } from '../input/infoInput.js';
import { LoginDialogOptions } from './index.js';
import { i18nHandler } from "../../handlers/i18nHandler.js";

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
  forgotPasswordForm.className = "flex flex-col w-full max-w-xs px-2";

  const forgotPasswordEmailInput = createInfoInput(i18nHandler.getValue("panel.emailLabel"), "forgotEmail");
  forgotPasswordEmailInput.className += " mb-6";

  const forgotPasswordButton = document.createElement("button");
  forgotPasswordButton.textContent = i18nHandler.getValue("panel.forgotPasswordPanel.sendButton");
  forgotPasswordButton.type = "submit";
  forgotPasswordButton.className = "bg-purple-600 hover:bg-purple-700 font-semibold py-2 px-4 rounded mb-6";

  const forgotPasswordCodeInput = createInfoInput(i18nHandler.getValue("panel.forgotPasswordPanel.validation.code"), "forgotCode");

  // --- NOUVEAUX ÉLÉMENTS POUR L'ANIMATION DE L'ENVELOPPE ---
  const mailAnimationContainer = document.createElement("div");
  mailAnimationContainer.className = `
    relative w-full flex justify-center items-center h-16 overflow-hidden
    opacity-0 transition-opacity duration-500 ease-out
  `.replace(/\s+/g, " ");

  // L'icône ouverte commence le plus à GAUCHE possible, hors du viewport
  const mailOpenIcon = document.createElement("img");
  mailOpenIcon.src = "./assets/ui/mail-open.svg";
  mailOpenIcon.alt = "Mail envoyé";
  mailOpenIcon.className = `
    absolute w-10 h-10
    left-1/2 -translate-x-1/2 -translate-x-[500%] opacity-0 // Départ: Centré, puis décalé 500% à GAUCHE (très loin)
    transition-all duration-700 ease-in-out
  `.replace(/\s+/g, " ");

  // L'icône fermée est initialement à la même position de départ, mais cachée
  const mailClosedIcon = document.createElement("img");
  mailClosedIcon.src = "./assets/ui/mail-open.svg";
  mailClosedIcon.alt = "Mail envoyé";
  mailClosedIcon.className = `
    absolute w-10 h-10
    left-1/2 -translate-x-1/2 -translate-x-[500%] opacity-0 hidden // Départ: comme l'icône ouverte
    transition-all duration-700 ease-in-out
  `.replace(/\s+/g, " ");

  mailAnimationContainer.appendChild(mailOpenIcon);
  mailAnimationContainer.appendChild(mailClosedIcon);
  // --- FIN DES NOUVEAUX ÉLÉMENTS ---

  forgotPasswordForm.appendChild(forgotPasswordEmailInput);
  forgotPasswordForm.appendChild(forgotPasswordButton);
  forgotPasswordForm.appendChild(mailAnimationContainer);
  forgotPasswordForm.appendChild(forgotPasswordCodeInput);

  forgotPasswordPanel.appendChild(forgotPasswordForm);

  const switchToLoginFromForgotLink = document.createElement("a");
  switchToLoginFromForgotLink.href = "#";
  switchToLoginFromForgotLink.textContent = i18nHandler.getValue("panel.forgotPasswordPanel.link.loginPanel");
  switchToLoginFromForgotLink.className = "text-center text-blue-400 hover:text-blue-200 text-sm mt-1 cursor-pointer";
  forgotPasswordPanel.appendChild(switchToLoginFromForgotLink);

  forgotPasswordForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const email = forgotPasswordEmailInput.value;
    const code = forgotPasswordCodeInput.value;

    // --- LOGIQUE DE L'ANIMATION "VOYAGE" (GAUCHE À DROITE) ---

    // 0. Pré-réinitialisation rapide pour s'assurer que tout est en place pour le départ
    mailOpenIcon.classList.add('hidden', 'opacity-0', '-translate-x-[500%]'); // Recommence très à gauche
    mailClosedIcon.classList.add('hidden', 'opacity-0', '-translate-x-[500%]'); // Recommence très à gauche
    mailOpenIcon.classList.remove('translate-x-0', 'translate-x-[500%]');
    mailClosedIcon.classList.remove('translate-x-0', 'translate-x-[500%]');


    // 1. Rendre le conteneur visible et préparer l'icône ouverte pour le départ
    mailAnimationContainer.classList.remove('opacity-0');
    mailAnimationContainer.classList.add('opacity-100');

    mailOpenIcon.classList.remove('hidden'); // Rendre l'icône ouverte non-cachée

    // 2. Faire venir l'enveloppe ouverte de la gauche vers le centre
    setTimeout(() => {
        mailOpenIcon.classList.remove('-translate-x-[500%]'); // Démarre le mouvement vers le centre (enlève le négatif)
        mailOpenIcon.classList.add('opacity-100', 'translate-x-0'); // Rendre visible et au centre
    }, 100); // Petit délai pour s'assurer que les classes initiales sont bien appliquées

    // 3. L'enveloppe ouverte s'estompe et l'enveloppe fermée apparaît au centre
    setTimeout(() => {
        mailOpenIcon.classList.remove('opacity-100');
        mailOpenIcon.classList.add('opacity-0'); // Fait disparaître l'enveloppe ouverte
        // Laisser un court instant pour le fondu avant de cacher complètement
        setTimeout(() => {
            mailOpenIcon.classList.add('hidden'); // Cache l'icône ouverte
        }, 300); // Durée du fondu (doit être < duration-700)

        mailClosedIcon.classList.remove('hidden', '-translate-x-[500%]'); // Révèle l'enveloppe fermée
        mailClosedIcon.classList.add('opacity-100', 'translate-x-0'); // Apparaît au centre
    }, 800); // 100ms (délai initial) + 700ms (durée de transition) = 800ms pour l'arrivée au centre

    // 4. L'enveloppe fermée part vers la droite
    setTimeout(() => {
        mailClosedIcon.classList.remove('opacity-100', 'translate-x-0');
        mailClosedIcon.classList.add('opacity-0', 'translate-x-[500%]'); // Part vers la droite et s'estompe (très loin)
    }, 1600); // 800ms (changement d'icône) + 800ms (attente avant départ) = 1600ms. Ajustez 800ms selon votre souhait d'attente.

    // 5. Réinitialisation des icônes et masquage du conteneur après l'animation
    setTimeout(() => {
        mailAnimationContainer.classList.add('opacity-0'); // Cache le conteneur
        // Réinitialiser les classes des icônes pour la prochaine utilisation
        mailOpenIcon.classList.add('hidden', 'opacity-0', '-translate-x-[500%]');
        mailClosedIcon.classList.add('hidden', 'opacity-0', '-translate-x-[500%]');
    }, 2400); // 1600ms (départ à droite) + 800ms (durée de transition) = 2400ms. Ajusté pour correspondre à la fin du mouvement.

    // --- FIN DE LA LOGIQUE D'ANIMATION ---

    options.onForgotPasswordSubmit(email, code); // Appeler la fonction de soumission
  });

  return {
    panel: forgotPasswordPanel,
    form: forgotPasswordForm,
    emailInput: forgotPasswordEmailInput,
    codeInput: forgotPasswordCodeInput,
    switchToLoginFromForgotLink: switchToLoginFromForgotLink,
  };
}
