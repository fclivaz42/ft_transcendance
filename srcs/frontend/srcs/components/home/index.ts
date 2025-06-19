//titre et 2 bouttons d'accueil qui puise dans le i18handler
//retourn une HTMLElement (div)


import { i18nHandler } from "../../handlers/i18nHandler.js"; // Assurez-vous que le chemin est correct

/**
 * Interface pour les options de la page d'accueil.
 * Sera utilisée pour passer les textes traduits.
 */
interface HomePageOptions {
  guestButtonText: string;
  accountButtonText: string;
}

/**
 * Crée et retourne l'élément HTML de la page d'accueil.
 *
 * @param options - Options contenant les textes traduits pour le titre et les boutons.
 * @returns L'élément HTMLElement représentant la page d'accueil.
 */
export function createHomePage(options: HomePageOptions): HTMLElement {
  const homePage = document.createElement("section");
  homePage.id = "accueil-page"; // ID unique pour la page d'accueil
  homePage.className = `
    absolute inset-0 flex flex-col items-center justify-center
    transition-transform duration-700 ease-in-out
    z-10 // Sera au-dessus du fond animé
  `.replace(/\s+/g, " "); // Nettoie les espaces multiples pour Tailwind

  // Conteneur pour le titre et les boutons pour un meilleur contrôle du centrage
  const contentWrapper = document.createElement("div");
  contentWrapper.className = "flex flex-col items-center justify-center space-y-12"; // Espace entre titre et boutons

  // Titre du projet "Transcendence"
  const titleElement = document.createElement("h1");
   titleElement.className = `
    text-7xl md:text-8xl lg:text-9xl font-extrabold drop-shadow-lg text-center
    bg-clip-text text-transparent
    bg-gradient-to-r from-purple-400/30 via-pink-500/30 to-red-500/30
  `.replace(/\s+/g, " ");
  titleElement.textContent = "Transcendence"; // Texte du titre via i18n
  titleElement.style.fontFamily = 'Verdana, sans-serif'; // Police monospace pour le titre
  // Conteneur pour les boutons
  const buttonsWrapper = document.createElement("div");
  buttonsWrapper.className = "flex flex-col sm:flex-row space-y-6 sm:space-y-0 sm:space-x-8 mt-12"; // Réactif pour mobile/desktop

  // Bouton "Jouer en Guest"
  const guestButton = document.createElement("button");
  guestButton.id = "guest-button";
  guestButton.className = `px-8 py-4 bg-transparent text-white text-xl font-semibold rounded-full
    border-2 border-white shadow-lg
    hover:bg-white/20 hover:border-transparent
    transition duration-300 transform hover:scale-105
    focus:outline-none focus:ring-4 focus:ring-white focus:ring-opacity-50
  `.replace(/\s+/g, " ");
  guestButton.textContent = options.guestButtonText;

  // Bouton "Utiliser un compte"
  const accountButton = document.createElement("button");
  accountButton.id = "account-button";
  accountButton.className = `
  px-8 py-4 bg-transparent text-white text-xl font-semibold rounded-full
    border-2 border-white shadow-lg
    hover:bg-white/20 hover:border-transparent
    transition duration-300 transform hover:scale-105
    focus:outline-none focus:ring-4 focus:ring-white focus:ring-opacity-50
  `.replace(/\s+/g, " ");
  accountButton.textContent = options.accountButtonText;

  // Assemblage du DOM
  buttonsWrapper.appendChild(guestButton);
  buttonsWrapper.appendChild(accountButton);

  contentWrapper.appendChild(titleElement);
  contentWrapper.appendChild(buttonsWrapper);

  homePage.appendChild(contentWrapper);

  return homePage;
}