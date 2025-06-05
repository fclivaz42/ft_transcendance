// components/input/passwordInput.ts

export function createPasswordInput(placeholder: string, name: string): HTMLDivElement {
    // Conteneur principal pour l'input et le bouton d'œil
    const container = document.createElement("div");
    container.className = "relative w-full"; // `relative` pour positionner l'icône de l'œil
  
    // L'input de mot de passe
    const input = document.createElement("input");
    input.type = "password"; // C'est crucial pour masquer le texte
    input.name = name;
    input.placeholder = placeholder;
  
    // Classes pour l'input (similaires à votre createInfoInput)
    input.className = `
      w-full
      px-4
      py-2
      mt-2
      text-white
      bg-gray-800
      border
      border-gray-700
      rounded-lg
      focus:outline-none
      focus:ring-2
      focus:ring-blue-500
      dark:bg-white
      dark:text-black
      pr-10 // Ajoutez un padding à droite pour laisser de la place au bouton œil
    `.replace(/\s+/g, " ");
  
    // Bouton pour afficher/masquer le mot de passe (l'icône de l'œil)
    const toggleButton = document.createElement("button");
    toggleButton.type = "button"; // Important: ne pas soumettre le formulaire
    toggleButton.className = `
      absolute
      right-3
      top-1/2
      -translate-y-1/2
      text-gray-400
      hover:text-gray-200
      focus:outline-none
      dark:text-gray-600
      dark:hover:text-gray-800
    `.replace(/\s+/g, " ");
  
    // Icônes de l'œil (vous pouvez utiliser des SVG, Font Awesome, ou simplement du texte)
    // Pour la simplicité, utilisons des symboles Unicode ou du texte pour le moment.
    // Idéalement, utilisez des icônes SVG pour plus de flexibilité.
    const eyeIcon = document.createElement("span");
    eyeIcon.className = "icon"; // Pourrait être utilisé pour styliser si vous utilisez des librairies d'icônes
    eyeIcon.textContent = "👁️"; // Icône "œil" par défaut (visible)
  
    const eyeSlashIcon = document.createElement("span");
    eyeSlashIcon.className = "icon hidden"; // Icône "œil barré" (cachée par défaut)
    eyeSlashIcon.textContent = "🙈"; // Ou "👁️‍🗨️" ou autre
  
    toggleButton.appendChild(eyeIcon);
    toggleButton.appendChild(eyeSlashIcon);
  
    // Logique de bascule
    toggleButton.addEventListener("click", () => {
      if (input.type === "password") {
        input.type = "text";
        eyeIcon.classList.add("hidden");
        eyeSlashIcon.classList.remove("hidden");
      } else {
        input.type = "password";
        eyeIcon.classList.remove("hidden");
        eyeSlashIcon.classList.add("hidden");
      }
    });
  
    // Assembler les éléments
    container.appendChild(input);
    container.appendChild(toggleButton);
  
    // Ajouter une propriété `value` pour un accès facile
    // Ceci est un accesseur pour rendre l'accès à `input.value` plus propre
    Object.defineProperty(container, 'value', {
      get: () => input.value,
      set: (val) => { input.value = val; },
      enumerable: true,
      configurable: true
    });
  
    return container; // Retourne le conteneur, pas seulement l'input
  }