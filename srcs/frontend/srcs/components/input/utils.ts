/*
updateFieldAppearance
prend en parametre 2 champs: inputContainer(CustomInputContainer et CustomPasswordInputContainer)
errorFeedbackElement: HTMLDivElement
validationFunction: (value: string) => { isValid: boolean; errorMessage: string | null }
isFocused: boolean
forceMessageDisplay: boolean
*/
import { CustomInputContainer } from './infoInput'; // Assure-toi d'importer les interfaces nécessaires
import { CustomPasswordInputContainer } from './createPasswordInput'; // Assure-toi d'importer les interfaces nécessaires

export const updateFieldAppearance = (
    inputContainer: CustomInputContainer | CustomPasswordInputContainer,
    errorFeedbackElement: HTMLDivElement,
    validationFunction: (value: string) => { isValid: boolean; errorMessage: string | null },
    isFocused: boolean,
    forceMessageDisplay: boolean = false
) => {
    const value = inputContainer.inputElement.value.trim();
    const { isValid, errorMessage } = validationFunction(value);

    // DÉTERMINER SI LE CHAMP DOIT MONTRER DES VISUELS D'ERREUR (bordure, !, message)
    // C'est l'état "touched and invalid".
    // Un champ est "touched" si sa valeur n'est pas vide OU si il est actuellement en focus.
    // L'idée est d'éviter d'afficher des erreurs sur des champs VIDES et non touchés.
    const isTouched = inputContainer._touched;
    const shouldShowErrorVisuals = !isValid && isTouched;


    // --- Gérer les classes de bordure et de focus ---
    if (shouldShowErrorVisuals && !forceMessageDisplay) { // forceMessageDisplay est pour la soumission, où on force le rouge si invalide
        inputContainer.inputElement.classList.add('border-red-500');
        inputContainer.inputElement.classList.remove('border-gray-400');
        inputContainer.inputElement.classList.remove("focus:ring-blue-500", "focus:border-blue-500");
        inputContainer.inputElement.classList.add("focus:ring-red-500", "focus:border-red-500");
    } else {
        // Champ valide OU non touché/vide OU mode soumission (géré par forceMessageDisplay)
        inputContainer.inputElement.classList.remove('border-red-500');
        inputContainer.inputElement.classList.add('border-gray-400'); // Bordure neutre
        inputContainer.inputElement.classList.remove("focus:ring-red-500", "focus:border-red-500");
        inputContainer.inputElement.classList.add("focus:ring-blue-500", "focus:border-blue-500");
    }

// --- LOGIQUE SPÉCIFIQUE POUR LE "!" ET LE MESSAGE TEXTUEL ---
    if (shouldShowErrorVisuals) { // Seulement si invalide ET touché
        if (isFocused) {
            // En focus sur un champ invalide et touché : message textuel, pas de !
            errorFeedbackElement.textContent = errorMessage || "";
            errorFeedbackElement.classList.remove('hidden');
            if ('errorIconElement' in inputContainer) {
                (inputContainer as CustomInputContainer).errorIconElement.classList.add('hidden');
            }
        } else {
            // Hors focus sur un champ invalide et touché : pas de message, le !
            errorFeedbackElement.classList.add('hidden');
            if ('errorIconElement' in inputContainer) {
                (inputContainer as CustomInputContainer).errorIconElement.classList.remove('hidden');
            }
        }
    } else {
        // Champ valide OU non touché/vide : tout est caché
        errorFeedbackElement.classList.add('hidden');
        if ('errorIconElement' in inputContainer) {
            (inputContainer as CustomInputContainer).errorIconElement.classList.add('hidden');
        }
    }

    // Gérer l'affichage forcé du message (pour la soumission)
    if (forceMessageDisplay && !isValid) { // À la soumission, si invalide, on force le message
        errorFeedbackElement.textContent = errorMessage || "";
        errorFeedbackElement.classList.remove('hidden');
        if ('errorIconElement' in inputContainer) {
            (inputContainer as CustomInputContainer).errorIconElement.classList.add('hidden');
        }
    }

    return isValid;
};

