// --- Imports ---
import { createDialog } from "./index.js";
import { checkPasswordStrength, PasswordStrengthResult } from "../input/createPasswordInput.js";
import { createPasswordStrengthList } from "../input/passwordStrengh.js";
import { createLoginPanel, createRegisterPanel } from './index.js';
import { i18nHandler } from "../../handlers/i18nHandler.js";
import { createGoogleLoginButton } from "./googleLoginButton.js";

// Interfaces partagées pour la logique de dialogue
export interface LoginDialogOptions {
  initialMode: 'login' | 'register';
  onSwitchMode: (mode: 'login' | 'register') => void;

  onSubmit(mode: 'login', data: { displayName: string; password: string; }): void;
  onSubmit(mode: 'register', data: { displayName: string; email: string; password: string; confirmPassword: string; }): void;
}

// --- Main Login Dialog Function ---
export function createLoginDialog(options: LoginDialogOptions): HTMLDialogElement
{
  const dialog = createDialog({ allowClose: true });

  dialog.classList.add(
    "w-[400px]",
    "max-w-full",
  );

  const dialogTitle = document.createElement("h2");
  dialogTitle.className = "text-2xl font-bold mb-2 text-center";

  const panelsContainer = document.createElement("div");
  panelsContainer.className = "relative w-full flex flex-col items-center justify-center min-h-[280px]";

  // --- PANEL CREATION ---
  // Ensure all panel variables are destructured here, within the function's scope.
  const {
    panel: registerPanel,
    form: registerForm,
    displayNameInput: registerDisplayName,
    passwordInput: registerPasswordInput,
    confirmPasswordInput: registerConfirmPasswordInput,
    switchToLoginLink: registerSwitchToLoginLink,
    passwordErrorFeedback: registerPasswordErrorFeedback,
    confirmPasswordErrorFeedback: registerConfirmPasswordErrorFeedback,
  } = createRegisterPanel(options);

  const {
    panel: loginPanel,
    form: loginForm,
    displayNameInput: loginDisplayName,
    passwordInput: loginPasswordInput,
    switchToRegisterLink,
    displayNameErrorFeedback: loginDisplayNameErrorFeedback,
    passwordErrorFeedback: loginPasswordErrorFeedback,
  } = createLoginPanel(options);


  dialog.appendChild(dialogTitle);

 
  registerPanel.classList.add('opacity-0', 'translate-x-full'); // Hors écran à droite ou à gauche, selon le sens de la transition d'entrée
  loginPanel.classList.add('opacity-0', 'translate-x-full');



  panelsContainer.appendChild(loginPanel);
  panelsContainer.appendChild(registerPanel);

  dialog.appendChild(panelsContainer);
	dialog.appendChild((() => {
		const hr = document.createElement("hr");
		hr.className = "w-3/4 my-4";
		return hr;
	})());	
	dialog.appendChild(createGoogleLoginButton());


// --- PASSWORD STRENGTH LIST MANAGEMENT (EXTERNAL) ---
  const { element: strengthListElement, update: updateStrengthList } = createPasswordStrengthList();
  dialog.appendChild(strengthListElement);

  strengthListElement.classList.add('hidden');

  const passwordInputsWithStatus = [
    { input: registerPasswordInput.inputElement, enableStrength: registerPasswordInput._enableStrengthCheck },
    { input: registerConfirmPasswordInput.inputElement, enableStrength: registerConfirmPasswordInput._enableStrengthCheck },
    { input: loginPasswordInput.inputElement, enableStrength: loginPasswordInput._enableStrengthCheck }
  ];

  passwordInputsWithStatus.forEach(({ input, enableStrength }) => {

    if (enableStrength) {
        input.addEventListener('passwordStrengthChange', (e: CustomEvent<{ strengthResult: PasswordStrengthResult }>) => {
            if (!strengthListElement.classList.contains('hidden')) {
                updateStrengthList(e.detail.strengthResult);
            }
        });
    }

    input.addEventListener('focus', () => {
        if (enableStrength) {
            strengthListElement.classList.remove('hidden');
            const initialStrength = checkPasswordStrength(input.value);
            updateStrengthList(initialStrength);
        }
    });

    input.addEventListener('blur', () => {
        setTimeout(() => {
            const focusedElement = document.activeElement;
            const isAnotherStrengthInputFocused = passwordInputsWithStatus.some(
                item => item.input === focusedElement && item.enableStrength
            );

            if (enableStrength && !isAnotherStrengthInputFocused) {
                strengthListElement.classList.add('hidden');
            }
        }, 50);
    });
  });

  // --- Password Match Validation Function ---
  const checkPasswordMatch = () => {
    const password = registerPasswordInput.inputElement.value; // Accès à la valeur correcte
    const confirmPassword = registerConfirmPasswordInput.inputElement.value; // Accès à la valeur correcte
    const isRegisterPanelActive = currentMode === 'register';

    const isConfirmPasswordInputFocused = document.activeElement === registerConfirmPasswordInput.inputElement;

    // Condition pour montrer le message de mismatch uniquement si confirmation a commencé à être tapée
    const hasMismatch = confirmPassword.length > 0 && password !== confirmPassword;
                         // Simplifié : le substr ou la longueur sont gérés par la validation générale,
                         // ici on veut juste savoir si les mots de passe ne sont PAS identiques une fois que confirmPassword n'est plus vide.



  };

  registerPasswordInput.inputElement.addEventListener('input', checkPasswordMatch);
  registerConfirmPasswordInput.inputElement.addEventListener('input', checkPasswordMatch);

  registerConfirmPasswordInput.inputElement.addEventListener('focus', checkPasswordMatch);

  registerPasswordInput.inputElement.addEventListener('blur', () => {
    // Si l'utilisateur quitte le champ mot de passe, et que le champ confirmation est touché
    // ou n'a pas été tapé encore, on re-checke pour s'assurer que le message de mismatch disparaît si nécessaire
    setTimeout(checkPasswordMatch, 50);
  });
  registerConfirmPasswordInput.inputElement.addEventListener('blur', () => {
    // Si l'utilisateur quitte le champ confirmation, on re-checke immédiatement
    setTimeout(checkPasswordMatch, 50);
  });


  let currentMode: 'login' | 'register' ;

  const setPanelContainerHeight = (panel: HTMLElement) => {

    requestAnimationFrame(() => { // S'assurer que le navigateur a eu le temps de rendre
      //panelsContainer.style.height = `${panel.scrollHeight}px`;
    });
  };


  const switchMode = (mode: 'login' | 'register' , animate = true) => {
    if (mode === currentMode) return;

    // Définir le titre du dialogue
    if (mode === 'login') {
        dialogTitle.textContent = i18nHandler.getValue("panel.loginPanel.panelTitle");
    } else if (mode === 'register') {
        dialogTitle.textContent = i18nHandler.getValue("panel.registerPanel.panelTitle");
    } 

    const hiddenClass = 'opacity-0';
    const visibleClass = 'opacity-100';
    const slideLeft = '-translate-x-full';
    const slideRight = 'translate-x-full';
    const slideIn = 'translate-x-0';

    const addTransitions = () => {
        registerPanel.classList.add('transition-transform', 'transition-opacity', 'duration-500', 'ease-in-out');
        loginPanel.classList.add('transition-transform', 'transition-opacity', 'duration-500', 'ease-in-out');
        
    };
    const removeTransitions = () => {
        registerPanel.classList.remove('transition-transform', 'transition-opacity', 'duration-500', 'ease-in-out');
        loginPanel.classList.remove('transition-transform', 'transition-opacity', 'duration-500', 'ease-in-out');
        
    };

    if (animate) {
        addTransitions();
    } else {
        removeTransitions();
    }

    // Réinitialiser tous les panneaux à un état caché et hors écran (pour une transition propre)
    [registerPanel, loginPanel].forEach(panel => {
        panel.classList.remove(slideIn, slideLeft, slideRight, visibleClass, hiddenClass);
        // Important: Mettre tous les panneaux hors écran pour la transition d'entrée/sortie
        if (panel === loginPanel) {
             panel.classList.add(mode === 'login' ? slideIn : slideRight);
        } else if (panel === registerPanel) {
             panel.classList.add(mode === 'register' ? slideIn : slideLeft);
        }
        panel.classList.add(hiddenClass); // Tous les panneaux sont initialement cachés
    });


    // *** LA LOGIQUE CLÉ EST ICI POUR DÉCLENCHER LA TRANSITION APRÈS UN REPAINT ***
    requestAnimationFrame(() => {
        if (mode === 'login') {
            loginPanel.classList.remove(hiddenClass, slideLeft, slideRight);
            loginPanel.classList.add(slideIn, visibleClass);
        } else if (mode === 'register') {
            registerPanel.classList.remove(hiddenClass, slideLeft, slideRight);
            registerPanel.classList.add(slideIn, visibleClass);
        }
    });


    currentMode = mode;
    options.onSwitchMode(mode); // Notifie l'appelant du changement de mode

    // Cacher la liste de force du mot de passe lors du changement de panneau
    strengthListElement.classList.add('hidden');
    // Cacher le message d'erreur de correspondance du mot de passe
    if (registerConfirmPasswordErrorFeedback) {
        registerConfirmPasswordErrorFeedback.classList.add('hidden');
    }

    // Ajuster la hauteur du conteneur après la transition pour une meilleure UX
    // Utiliser un setTimeout pour attendre la fin de la transition visuelle si animate est vrai
    setTimeout(() => {
        let activePanel;
        if (mode === 'login') activePanel = loginPanel;
        else if (mode === 'register') activePanel = registerPanel;

        if (activePanel) {
            setPanelContainerHeight(activePanel);
        }
        // Pour s'assurer que checkPasswordMatch est appelé après que le panel soit mesuré et potentiellement visible
        if (mode === 'register') {
            checkPasswordMatch();
        }
    }, animate ? 500 : 0); // Attendre la durée de la transition si animation est active
  };

  // --- Event Listeners for Mode Switching ---


  registerSwitchToLoginLink.addEventListener("click", (e: MouseEvent) => {
    e.preventDefault();
    switchMode('login');
  });


  switchToRegisterLink.addEventListener("click", (e: MouseEvent) => {
    e.preventDefault();
    switchMode('register');
  });

  // --- Initial Mode Setup ---
  
  // Assure que le mode initial est configuré avec ou sans animation.
  // Pour le premier chargement du dialogue, il n'y a pas d'animation "d'entrée"
  // depuis un autre panneau. Le panneau s'affiche juste.
  switchMode(options.initialMode, false); // false pour animate car c'est le premier affichage du dialogue.

  return dialog;
}
