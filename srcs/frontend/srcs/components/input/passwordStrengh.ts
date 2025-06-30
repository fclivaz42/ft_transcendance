// LISTE VISUELLE de la force :crée l'élément HTML de la liste de force latérale (strengthListElement) et une fonction update pour la mettre à jour.
import { PasswordStrengthResult } from "./createPasswordInput.js";
import { i18nHandler } from "../../handlers/i18nHandler.js";

// Helper pour créer la liste de vérification de la force du mot de passe
// retourne un objet avec un element (la liste <ul>) et une fonction update
//update : Elle met à jour l'affichage visuel de la liste de force.
// Elle retourne un booléen (true si tous les critères sont remplis, false sinon).
export function createPasswordStrengthList(): { element: HTMLUListElement, update: (result: PasswordStrengthResult) => boolean } {
  const strengthList = document.createElement("ul");
  strengthList.className = `
    absolute
    top-1/2 -translate-y-1/2
    left-full ml-4
    p-4
    bg-background dark:bg-background_dark
    rounded-lg shadow-2xl z-20 hidden
    min-w-[250px] text-sm text-black dark:text-white
    backdrop-blur-md backdrop-saturate-150 border border-gray-400/80 dark:border-gray-600/30
  `.replace(/\s+/g, " ");

  const criteria = [
    { key: 'minLength', text: i18nHandler.getValue('passwordStrength.minLength') },
    { key: 'hasUppercase', text: i18nHandler.getValue('passwordStrength.hasUppercase') },
    { key: 'hasLowercase', text: i18nHandler.getValue('passwordStrength.hasLowercase') },
    { key: 'hasNumber', text: i18nHandler.getValue('passwordStrength.hasNumber') },
    { key: 'hasSpecialChar', text: i18nHandler.getValue('passwordStrength.hasSpecialChar') },
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

  const updateListDisplay = (result: PasswordStrengthResult): boolean => { // <--- MODIFICATION ICI
        let allCriteriaMet = true; // Pour suivre la validité globale

    criteria.forEach(c => {
      const li = strengthItems[c.key];
      if (li) {
        const marker = li.querySelector('span');
        if (result[c.key as keyof PasswordStrengthResult]) {
          li.classList.remove("text-gray-500", "dark:text-gray-500");
          li.classList.add("text-green-600", "dark:text-green-400");
          if (marker) {
            marker.classList.remove("border-gray-500", "border-red-500");
            marker.classList.add("bg-green-600", "border-green-600", "dark:bg-green-400", "dark:border-green-400");
          }
        } else {
          allCriteriaMet = false;
          li.classList.remove("text-green-600", "dark:text-green-400");
          li.classList.add("text-gray-500", "dark:text-gray-500");
          if (marker) {
            marker.classList.remove("bg-green-600", "border-green-600", "dark:bg-green-400", "dark:border-green-400");
            marker.classList.add("border-gray-500", "dark:border-gray-600");
          }
        }
      }
    });
    return allCriteriaMet;
  };

  return {
    element: strengthList,
    update: updateListDisplay
  };
}
