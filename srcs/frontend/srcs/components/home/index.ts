// //titre et 2 bouttons d'accueil qui puise dans le i18handler
// //retourn une HTMLElement (div)


// import { i18nHandler } from "../../handlers/i18nHandler.js"; // Assurez-vous que le chemin est correct

// /**
//  * Interface pour les options de la page d'accueil.
//  * Sera utilisée pour passer les textes traduits.
//  */
// interface HomePageOptions {
//   guestButtonText: string;
//   accountButtonText: string;
// }

// /**
//  * Crée et retourne l'élément HTML de la page d'accueil.
//  *
//  * @param options - Options contenant les textes traduits pour le titre et les boutons.
//  * @returns L'élément HTMLElement représentant la page d'accueil.
//  */
// export function createHomePage(options: HomePageOptions): HTMLElement {
//   const homePage = document.createElement("section");
//   homePage.id = "accueil-page"; // ID unique pour la page d'accueil
//   homePage.className = `
//     absolute inset-0 flex flex-col items-center justify-center
//     transition-transform duration-700 ease-in-out
//     z-10 // Sera au-dessus du fond animé
//   `.replace(/\s+/g, " "); // Nettoie les espaces multiples pour Tailwind

//   // Conteneur pour le titre et les boutons pour un meilleur contrôle du centrage
//   const contentWrapper = document.createElement("div");
//   contentWrapper.className = "flex flex-col items-center justify-center space-y-12"; // Espace entre titre et boutons

//   // Titre du projet "Transcendence"
//   const titleElement = document.createElement("h1");
//    titleElement.className = `
//     text-7xl md:text-8xl lg:text-9xl font-extrabold drop-shadow-lg text-center
//     bg-clip-text text-transparent
//     bg-gradient-to-r from-purple-400/30 via-pink-500/30 to-red-500/30
//   `.replace(/\s+/g, " ");
//   titleElement.textContent = "Pong"; // Texte du titre via i18n
//   titleElement.style.fontFamily = 'Verdana, sans-serif'; // Police monospace pour le titre
//   // Conteneur pour les boutons
//   const buttonsWrapper = document.createElement("div");
//   buttonsWrapper.className = "flex flex-col sm:flex-row space-y-6 sm:space-y-0 sm:space-x-8 mt-6"; // Réactif pour mobile/desktop

//   // Bouton "Jouer en Guest"
//   const guestButton = document.createElement("button");
//   guestButton.id = "guest-button";
//   guestButton.className = `px-8 py-4 bg-transparent text-white text-xl font-semibold rounded-full
//     border-2 border-white shadow-lg
//     hover:bg-white/20 hover:border-transparent
//     transition duration-300 transform hover:scale-105
//     focus:outline-none focus:ring-4 focus:ring-white focus:ring-opacity-50
//   `.replace(/\s+/g, " ");
//   guestButton.textContent = options.guestButtonText;

//   // Bouton "Utiliser un compte"
//   const accountButton = document.createElement("button");
//   accountButton.id = "account-button";
//   accountButton.className = `
//   px-8 py-4 bg-transparent text-white text-xl font-semibold rounded-full
//     border-2 border-white shadow-lg
//     hover:bg-white/20 hover:border-transparent
//     transition duration-300 transform hover:scale-105
//     focus:outline-none focus:ring-4 focus:ring-white focus:ring-opacity-50
//   `.replace(/\s+/g, " ");
//   accountButton.textContent = options.accountButtonText;

//   // Assemblage du DOM
//   buttonsWrapper.appendChild(guestButton);
//   buttonsWrapper.appendChild(accountButton);

//   contentWrapper.appendChild(titleElement);
//   contentWrapper.appendChild(buttonsWrapper);

//   homePage.appendChild(contentWrapper);

//   return homePage;
// }

// homePage.ts (ou le fichier qui représente votre page d'accueil)

export function createHomePage() {
    const homePageContainer = document.createElement("div");
    homePageContainer.className = `
        relative min-h-screen bg-gray-900 flex flex-col items-center justify-center
        overflow-hidden // Important pour cacher l'overflow du zoom
    `.replace(/\s+/g, " ");

    // Overlay qui va servir à l'animation de zoom
    const zoomOverlay = document.createElement("div");
    zoomOverlay.className = `
        absolute // Important: Positionné par rapport au conteneur principal
        rounded-full // Pour qu'il soit toujours rond pendant l'animation
        opacity-0 // Invisible au début
        transition-all duration-700 ease-in-out // Animation rapide
        z-50 // Assure qu'il est au-dessus de tout
        pointer-events-none // Pour ne pas bloquer les clics tant qu'il n'est pas actif
    `.replace(/\s+/g, " ");

    const guestButton = document.createElement("button");
    guestButton.textContent = "Guest";
    guestButton.className = `
        bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-8 rounded-full text-2xl
        relative z-10 // Pour qu'il soit cliquable et visible
        transition-colors duration-300
    `.replace(/\s+/g, " ");
    guestButton.style.minWidth = "200px";

    const accountButton = document.createElement("button");
    accountButton.textContent = "Avec un compte";
    accountButton.className = `
        bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-full text-2xl
        relative z-10 // Pour qu'il soit cliquable et visible
        transition-colors duration-300
    `.replace(/\s+/g, " ");
    accountButton.style.minWidth = "200px";

    const buttonsContainer = document.createElement("div");
    buttonsContainer.className = `
        flex flex-col md:flex-row gap-6 p-4 z-10 // Les boutons restent au-dessus
    `.replace(/\s+/g, " ");

    buttonsContainer.appendChild(guestButton);
    buttonsContainer.appendChild(accountButton);

    homePageContainer.appendChild(buttonsContainer);
    homePageContainer.appendChild(zoomOverlay);

    // --- Logique d'animation ---
    const animateZoom = (button: HTMLButtonElement, colorClass: string) => {
        // 1. Désactiver les interactions sur les boutons pour éviter les re-clics
        guestButton.style.pointerEvents = 'none';
        accountButton.style.pointerEvents = 'none';

        // 2. Récupérer la position et la taille du bouton cliqué
        const rect = button.getBoundingClientRect();

        // 3. Positionner et dimensionner l'overlay pour qu'il corresponde au bouton
        // Utilisation de variables CSS pour des transitions plus fluides si nécessaire
        // Mais ici, nous allons juste définir les styles directement
        zoomOverlay.style.width = `${rect.width}px`;
        zoomOverlay.style.height = `${rect.height}px`;
        zoomOverlay.style.left = `${rect.left}px`;
        zoomOverlay.style.top = `${rect.top}px`;
        
        // S'assurer qu'il est un cercle, même si le bouton est rectangulaire (rounded-full)
        zoomOverlay.style.borderRadius = "50%"; 

        // 4. Appliquer la couleur et rendre l'overlay visible (opacité 1)
        zoomOverlay.classList.remove('opacity-0');
        zoomOverlay.classList.add('opacity-100');
        // Nettoyer les anciennes classes de couleur et ajouter la nouvelle
        zoomOverlay.className = zoomOverlay.className.replace(/bg-\w+-\d+/g, '');
        zoomOverlay.classList.add(colorClass);

        // 5. Cacher les boutons pour un effet plus net (ou les faire disparaître avec une transition)
        buttonsContainer.classList.add('opacity-0', 'pointer-events-none');

        // 6. Déclencher l'animation de zoom après un très court délai
        // Le délai permet au navigateur de "peindre" l'état initial de l'overlay sur le bouton
        setTimeout(() => {
            // Calculer la taille nécessaire pour couvrir l'écran
            // La taille de l'overlay sera le max de la largeur ou hauteur de l'écran, ajusté par sa position
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;
            
            // Calculer la plus grande distance depuis le centre du bouton jusqu'aux coins de l'écran
            const centerBtnX = rect.left + rect.width / 2;
            const centerBtnY = rect.top + rect.height / 2;
            
            const distances = [
                Math.sqrt(Math.pow(centerBtnX, 2) + Math.pow(centerBtnY, 2)), // Top-left
                Math.sqrt(Math.pow(viewportWidth - centerBtnX, 2) + Math.pow(centerBtnY, 2)), // Top-right
                Math.sqrt(Math.pow(centerBtnX, 2) + Math.pow(viewportHeight - centerBtnY, 2)), // Bottom-left
                Math.sqrt(Math.pow(viewportWidth - centerBtnX, 2) + Math.pow(viewportHeight - centerBtnY, 2)) // Bottom-right
            ];
            const maxDistance = Math.max(...distances);
            
            // Le diamètre du cercle doit être au moins deux fois la plus grande distance
            const targetDiameter = maxDistance * 2; 

            // Appliquer la transformation de zoom et la transition (plus rapide ici)
            zoomOverlay.style.transition = 'all 700ms ease-in-out'; // On peut réappliquer pour assurer la durée
            zoomOverlay.style.width = `${targetDiameter}px`;
            zoomOverlay.style.height = `${targetDiameter}px`;
            
            // Recentrer l'overlay sur la page tout en grandissant
            // Pour que l'animation de zoom semble partir du centre du bouton
            zoomOverlay.style.left = `${centerBtnX - targetDiameter / 2}px`;
            zoomOverlay.style.top = `${centerBtnY - targetDiameter / 2}px`;
            
            // Le scale-0 / scale-100 n'est plus nécessaire ici puisque nous modifions width/height directement
            // et la position est ajustée pour maintenir le centre.

            // Optionnel: Déclencher la navigation ou le changement de vue après l'animation
            setTimeout(() => {
                // Par exemple, rediriger l'utilisateur ou changer l'état de l'application
                console.log(`Navigating to ${colorClass} related content`);
                // window.location.href = `/app/${colorClass.includes('red') ? 'guest' : 'account'}`;
                // Si vous avez un système de routage SPA, ce serait ici :
                // router.navigate(colorClass.includes('red') ? '/guest' : '/account');
            }, 700); // Attendre la fin de l'animation de zoom

        }, 50); // Petit délai pour le rendu initial de l'overlay sur le bouton
    };

    guestButton.addEventListener("click", () => {
        animateZoom(guestButton, "bg-red-600");
    });

    accountButton.addEventListener("click", () => {
        animateZoom(accountButton, "bg-blue-600");
    });

    return homePageContainer;
}

// Pour l'intégration, vous devriez appeler cette fonction
// et ajouter le résultat au corps de votre document ou à l'élément principal de votre application.
// Exemple dans index.ts ou main.ts:
/*
import { createHomePage } from './homePage.js';
document.addEventListener('DOMContentLoaded', () => {
    const appRoot = document.getElementById('app-root'); // Si vous avez un div racine
    if (appRoot) {
        appRoot.appendChild(createHomePage());
    } else {
        document.body.appendChild(createHomePage());
    }
});
*/