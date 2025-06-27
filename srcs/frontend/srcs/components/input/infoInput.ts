import createTextbox from "./textbox";

//Cree un champ de input de type texte, defini  en gris dedans ce qui est requis
export interface CustomInputContainer extends HTMLDivElement {
    inputElement: HTMLInputElement;
    errorIconElement: HTMLDivElement; // Ou SVGElement, si c'est une icône SVG
    value: string; // Pour un accès facile à la valeur de l'input
    _touched: boolean;// si vierge ou pas
    _hadPreviousError: boolean;
}
//sait quand l'input est focus, blur, ou change
//ajout de listeners pour focus et blur -> panel va le gerer
export function createInfoInput(labelName: string, inputName: string): CustomInputContainer {
    const container = document.createElement('div') as CustomInputContainer;
    container.className = "relative w-full"; // `relative` est important pour positionner l'icône

    

	const input = createTextbox({
		type: "text",
		placeholder: labelName,
		name: inputName,
		id: inputName, // Important pour associer le label
	});
    
    // --- NOUVEL ÉLÉMENT POUR L'ICÔNE D'ERREUR ---
    const errorIcon = document.createElement('div');
    errorIcon.className = `
        absolute inset-y-0 right-0 pr-3 
        flex items-center 
        pointer-events-none 
        text-red-500 hidden 
    `.replace(/\s+/g, " ");
    //  insérer un SVG d'icône ici
    errorIcon.innerHTML = `<svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path></svg>`;
    // Ou juste un point si vous préférez : errorIcon.textContent = "•"; // Avec des styles pour le rendre rouge et gras

  
    container.appendChild(input);
    container.appendChild(errorIcon);
    // --- NOUVEAUX ÉCOUTEURS D'ÉVÉNEMENTS POUR SIGNALER FOCUS/BLUR ---
    input.addEventListener("focus", () => {
        const event = new CustomEvent('inputFocus', { detail: { inputName: inputName } });
        input.dispatchEvent(event);
    });

    input.addEventListener("blur", () => {
        const event = new CustomEvent('inputBlur', { detail: { inputName: inputName } });
        input.dispatchEvent(event);
    });

    // Exposer l'input et l'icône pour un accès facile et touched 
    container.inputElement = input;
    container.errorIconElement = errorIcon;
    container._touched = false;

    // Ajouter un getter pour la valeur de l'input
    Object.defineProperty(container, 'value', {
        get: () => input.value,
        set: (val) => { input.value = val; } 
    });

    return container;
}
declare global {
    interface HTMLElementEventMap {
        'inputFocus': CustomEvent<{ inputName: string }>;
        'inputBlur': CustomEvent<{ inputName: string }>;
        
    }
}
