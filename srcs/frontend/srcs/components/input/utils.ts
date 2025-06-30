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

   

    return isValid;
};

// Version simplifiée pour l'edit du usermenu
export function simpleupdateFieldAppearance(
     inputContainer: CustomInputContainer | CustomPasswordInputContainer,
    errorFeedbackElement: HTMLDivElement,
    validationFunction: (value: string) => { isValid: boolean; errorMessage: string | null },
    showErrorsImmediately: boolean, // Si true, affiche l'erreur dès qu'elle apparaît (input/focus)
    validateIfEmpty = false // NOUVEAU: Si true, valide même si le champ est vide (pour soumission finale)
) {
    const value = inputContainer.inputElement.value.trim(); // Important: trim pour les espaces

    if (value === '' && !validateIfEmpty) {
        inputContainer.inputElement.classList.remove("border-red-500"); // Enlève les bordures de validation
        errorFeedbackElement.classList.add("hidden"); 
        return true; // Considéré comme valide car vide
    }


  // Effectue la validation réelle du contenu (si le champ n'est pas vide ou si validateIfEmpty est true)
    const { isValid, errorMessage } = validationFunction(value);

    // Mise à jour de l'apparence
    if (isValid) 
    {
        inputContainer.inputElement.classList.remove("border-red-500");
        errorFeedbackElement.classList.add("hidden");
    }
    else 
    {
        inputContainer.inputElement.classList.add("border-red-500");
        if (showErrorsImmediately) 
        {
            errorFeedbackElement.textContent = errorMessage;
            errorFeedbackElement.classList.remove("hidden");
        }
         else {
            // Si showErrorsImmediately est false, on cache l'erreur pour ne pas l'afficher "trop tôt"
            errorFeedbackElement.classList.add("hidden");
         }
    }
    return isValid;
}