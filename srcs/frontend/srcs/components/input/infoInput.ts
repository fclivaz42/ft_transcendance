//Cree un champ de input de type texte, defini  en gris dedans ce qui est requis
export interface CustomInputContainer extends HTMLDivElement {
    inputElement: HTMLInputElement;
    errorIconElement: HTMLDivElement; // Ou SVGElement, si c'est une icône SVG
    value: string; // Pour un accès facile à la valeur de l'input
}

export function createInfoInput(labelName: string, inputName: string): CustomInputContainer {
    const container = document.createElement('div') as CustomInputContainer;
    container.className = "relative w-full"; // `relative` est important pour positionner l'icône

    const label = document.createElement('label');
    label.htmlFor = inputName;
    label.textContent = labelName;
    label.className = "block text-sm font-medium text-gray-300 mb-1"; // Styles pour le label

    const input = document.createElement('input');
    input.type = "text"; // Ou "email", "password", etc., selon le besoin
    input.name = inputName;
    input.id = inputName; // Important pour associer le label
    input.placeholder = `Entrez votre ${labelName.toLowerCase()}`;
    input.className = `
        w-full p-2 border rounded-md shadow-sm
        bg-gray-700 text-white placeholder-gray-400
        border-gray-600 focus:ring-green-500 focus:border-green-500
        outline-none transition-all duration-300 ease-in-out
    `.replace(/\s+/g, " ");

    // --- NOUVEL ÉLÉMENT POUR L'ICÔNE D'ERREUR ---
    const errorIcon = document.createElement('div');
    errorIcon.className = `
        absolute inset-y-0 right-0 pr-3 
        flex items-center 
        pointer-events-none 
        text-red-500 hidden 
    `.replace(/\s+/g, " ");
    // Vous pouvez insérer un SVG d'icône ici, par exemple un X ou un point d'exclamation
    errorIcon.innerHTML = `<svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path></svg>`;
    // Ou juste un point si vous préférez : errorIcon.textContent = "•"; // Avec des styles pour le rendre rouge et gras

    container.appendChild(label);
    container.appendChild(input);
    container.appendChild(errorIcon);

    // Exposer l'input et l'icône pour un accès facile
    container.inputElement = input;
    container.errorIconElement = errorIcon;

    // Ajouter un getter pour la valeur de l'input
    Object.defineProperty(container, 'value', {
        get: () => input.value,
        set: (val) => { input.value = val; } // Permet de définir la valeur via container.value si nécessaire
    });

    return container;
}

// export function createInfoInput(placeholder: string, name: string): HTMLInputElement {
//     const input = document.createElement("input");
//     input.type = "text";
//     input.name = name;
//     input.placeholder = placeholder;
  
   
//     input.className = `
//       w-full
//       px-4
//       py-2
//       mt-2
//       text-white
//       bg-gray-800
//       border
//       border-gray-700
//       rounded-lg
//       focus:outline-none
//       focus:ring-2
//       focus:ring-blue-500
//       dark:bg-white
//       dark:text-black
//     `.replace(/\s+/g, " "); // Nettoie les espaces
  
//     return input;
//   }

