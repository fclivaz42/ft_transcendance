// LISTE VISUELLE de la force :crée l'élément HTML de la liste de force latérale (strengthListElement) et une fonction update pour la mettre à jour.
import { PasswordStrengthResult } from "./createPasswordInput.js";

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
    bg-gray-700/60 dark:bg-gray-100/60
    rounded-lg shadow-xl z-20 hidden
    min-w-[250px] text-sm text-gray-200 dark:text-gray-800
    backdrop-blur-md backdrop-saturate-150 border border-gray-400/30
  `.replace(/\s+/g, " ");

  const criteria = [
    { key: 'minLength', text: 'Au moins 8 cacaractères' },
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

  const updateListDisplay = (result: PasswordStrengthResult): boolean => { // <--- MODIFICATION ICI
        let allCriteriaMet = true; // Pour suivre la validité globale

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
          allCriteriaMet = false;
          li.classList.remove("text-green-400", "dark:text-green-600");
          li.classList.add("text-gray-200", "dark:text-gray-800");
          if (marker) {
            marker.classList.remove("bg-green-400", "border-green-400");
            marker.classList.add("border-red-500", "border-gray-500");
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
