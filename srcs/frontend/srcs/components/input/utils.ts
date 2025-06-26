// /*
// updateFieldAppearance
// prend en parametre 2 champs: inputContainer(CustomInputContainer et CustomPasswordInputContainer)
// errorFeedbackElement: HTMLDivElement
// validationFunction: (value: string) => { isValid: boolean; errorMessage: string | null }
// isFocused: boolean
// forceMessageDisplay: boolean
// */
// import { CustomInputContainer } from './infoInput'; // Assure-toi d'importer les interfaces nécessaires
// import { CustomPasswordInputContainer } from './createPasswordInput'; // Assure-toi d'importer les interfaces nécessaires

// export const updateFieldAppearance = (
//     inputContainer: CustomInputContainer | CustomPasswordInputContainer,
//     errorFeedbackElement: HTMLDivElement,
//     validationFunction: (value: string) => { isValid: boolean; errorMessage: string | null },
//     isFocused: boolean,
//     forceMessageDisplay: boolean = false
// ) => {
//     const value = inputContainer.inputElement.value.trim();
//     const { isValid, errorMessage } = validationFunction(value);

//     // DÉTERMINER SI LE CHAMP DOIT MONTRER DES VISUELS D'ERREUR (bordure, !, message)
//     // C'est l'état "touched and invalid".
//     // Un champ est "touched" si sa valeur n'est pas vide OU si il est actuellement en focus.
//     // L'idée est d'éviter d'afficher des erreurs sur des champs VIDES et non touchés.
//     const isTouched = inputContainer._touched;
//     const shouldShowErrorVisuals = !isValid && isTouched;


//     // --- Gérer les classes de bordure et de focus ---
//     if (shouldShowErrorVisuals && !forceMessageDisplay) { // forceMessageDisplay est pour la soumission, où on force le rouge si invalide
//         inputContainer.inputElement.classList.add('border-red-500');
//         inputContainer.inputElement.classList.remove('border-gray-400');
//         inputContainer.inputElement.classList.remove("focus:ring-blue-500", "focus:border-blue-500");
//         inputContainer.inputElement.classList.add("focus:ring-red-500", "focus:border-red-500");
//     } else {
//         // Champ valide OU non touché/vide OU mode soumission (géré par forceMessageDisplay)
//         inputContainer.inputElement.classList.remove('border-red-500');
//         inputContainer.inputElement.classList.add('border-gray-400'); // Bordure neutre
//         inputContainer.inputElement.classList.remove("focus:ring-red-500", "focus:border-red-500");
//         inputContainer.inputElement.classList.add("focus:ring-blue-500", "focus:border-blue-500");
//     }

// // --- LOGIQUE SPÉCIFIQUE POUR LE "!" ET LE MESSAGE TEXTUEL ---
//     if (shouldShowErrorVisuals) { // Seulement si invalide ET touché
//         if (isFocused) {
//             // En focus sur un champ invalide et touché : message textuel, pas de !
//             errorFeedbackElement.textContent = errorMessage || "";
//             errorFeedbackElement.classList.remove('hidden');
//             if ('errorIconElement' in inputContainer) {
//                 (inputContainer as CustomInputContainer).errorIconElement.classList.add('hidden');
//             }
//         } else {
//             // Hors focus sur un champ invalide et touché : pas de message, le !
//             errorFeedbackElement.classList.add('hidden');
//             if ('errorIconElement' in inputContainer) {
//                 (inputContainer as CustomInputContainer).errorIconElement.classList.remove('hidden');
//             }
//         }
//     } else {
//         // Champ valide OU non touché/vide : tout est caché
//         errorFeedbackElement.classList.add('hidden');
//         if ('errorIconElement' in inputContainer) {
//             (inputContainer as CustomInputContainer).errorIconElement.classList.add('hidden');
//         }
//     }

//     // Gérer l'affichage forcé du message (pour la soumission)
//     if (forceMessageDisplay && !isValid) { // À la soumission, si invalide, on force le message
//         errorFeedbackElement.textContent = errorMessage || "";
//         errorFeedbackElement.classList.remove('hidden');
//         if ('errorIconElement' in inputContainer) {
//             (inputContainer as CustomInputContainer).errorIconElement.classList.add('hidden');
//         }
//     }

//     return isValid;
// };

// input/utils.ts (ou .js)

///////////////////////////////////////////
import { CustomInputContainer } from './infoInput';
import { CustomPasswordInputContainer } from './createPasswordInput';

export const updateFieldAppearance = (
    inputContainer: CustomInputContainer | CustomPasswordInputContainer,
    errorFeedbackElement: HTMLDivElement,
    validationFunction: (value: string) => { isValid: boolean; errorMessage: string | null },
    isFocused: boolean,
    forceMessageDisplay: boolean = false
) => {
    const value = inputContainer.inputElement.value.trim();
    const { isValid, errorMessage } = validationFunction(value);

    const isTouched = inputContainer._touched;

    // Condition pour afficher le message d'erreur textuel et l'icône '!'
    // Le message et l'icône s'affichent si :
    // 1. Il y a un `errorMessage` (c'est-à-dire que le validateur a trouvé une erreur explicite)
    // 2. Le champ a été "touché" par l'utilisateur
    // 3. OU on est en mode `forceMessageDisplay` (soumission du formulaire)
    const shouldShowExplicitError = errorMessage !== null && (isTouched || forceMessageDisplay);

    // --- Gérer le message d'erreur textuel (la div sous le champ) ---
    if (shouldShowExplicitError && (isFocused || forceMessageDisplay)) {
        errorFeedbackElement.textContent = errorMessage || "";
        errorFeedbackElement.classList.remove('hidden');
    } else {
        errorFeedbackElement.textContent = '';
        errorFeedbackElement.classList.add('hidden');
    }

    // --- Gérer l'icône d'erreur (le "!") ---
    if ('errorIconElement' in inputContainer) {
        if (shouldShowExplicitError && (!isFocused || forceMessageDisplay)) {
            (inputContainer as CustomInputContainer).errorIconElement.classList.remove('hidden');
        } else {
            (inputContainer as CustomInputContainer).errorIconElement.classList.add('hidden');
        }
    }

    // --- Gérer les classes de bordure (rouge/neutre/focus) ---
    // La bordure rouge apparaît UNIQUEMENT si `shouldShowExplicitError` est vrai.
    // Sinon, elle revient à la bordure par défaut (grise).
    if (shouldShowExplicitError) {
        // Applique la bordure rouge si une erreur explicite doit être montrée
        inputContainer.inputElement.classList.remove('border-gray-400');
        inputContainer.inputElement.classList.add('border-red-500');
        inputContainer.inputElement.classList.remove("focus:ring-blue-500", "focus:border-blue-500");
        inputContainer.inputElement.classList.add("focus:ring-red-500", "focus:border-red-500");
    } else {
        // Revertit à la bordure par défaut (grise)
        // Ceci couvre les cas où le champ est valide, non touché,
        // ou invalide mais sans message d'erreur explicite (ex: email avant le '@')
        inputContainer.inputElement.classList.remove('border-red-500'); // S'assurer que le rouge est retiré
        inputContainer.inputElement.classList.add('border-gray-400'); // Applique la bordure grise par défaut
        inputContainer.inputElement.classList.remove("focus:ring-red-500", "focus:border-red-500");
        inputContainer.inputElement.classList.add("focus:ring-blue-500", "focus:border-blue-500");
    }

    // Gère les styles de focus génériques (si tu en as)
    // if (isFocused) {
    //     inputContainer.inputElement.classList.add('ring-2', 'ring-offset-2');
    // } else {
    //     inputContainer.inputElement.classList.remove('ring-2', 'ring-offset-2');
    // }

    return isValid;
};