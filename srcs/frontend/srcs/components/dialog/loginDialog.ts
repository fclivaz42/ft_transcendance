// srcs/components/dialog/loginDialog.ts

// --- Imports ---
import { createDialog } from "./index.js"; // This imports the generic createDialog
import { checkPasswordStrength, PasswordStrengthResult } from "../input/createPasswordInput.js";
import { createPasswordStrengthList } from "../input/passwordStrengh.js";
// Import the panel creation functions and LoginDialogOptions directly from index.js if they are re-exported there.
// If they are not re-exported by index.js, then you need to import them from their specific files:
// import { createLoginPanel } from './loginPanel.js';
// import { createRegisterPanel } from './registerPanel.js';
// import { createForgotPasswordPanel } from './forgotPswPanel.js';
// import { LoginDialogOptions } from './index.js'; // Or adjust path if LoginDialogOptions is in another file
import { createLoginPanel, createRegisterPanel, createForgotPasswordPanel, LoginDialogOptions } from './index.js';


// --- Main Login Dialog Function ---
export function createLoginDialog(options: LoginDialogOptions): HTMLDialogElement
{
  const dialog = createDialog({ allowClose: false });

  dialog.classList.add(
    "overflow-visible",
    "w-[400px]",
    "max-w-full",
    "rounded-xl",
    "bg-gray-900",
    "px-6",
    "pt-1",
    "pb-4",
    "text-white",
    "shadow-2xl",
    "border",
    "relative"
  );

  const dialogTitle = document.createElement("h2");
  dialogTitle.className = "text-2xl font-bold text-white mb-2 text-center";

  const panelsContainer = document.createElement("div");
  panelsContainer.className = "relative w-full flex flex-col items-center justify-center overflow-hidden"; // This overflow-hidden may cause issues if content is larger than container


  // --- PANEL CREATION ---
  // Ensure all panel variables are destructured here, within the function's scope.
const {
  panel: registerPanel,
  form: registerForm,
  displayNameInput: registerDisplayName,
  passwordInput: registerPasswordInput,
  confirmPasswordInput: registerConfirmPasswordInput,
  switchToLoginLink: registerSwitchToLoginLink, // <--- RENAME IT HERE!
  passwordErrorFeedback: registerPasswordErrorFeedback,
  confirmPasswordErrorFeedback: registerConfirmPasswordErrorFeedback,
} = createRegisterPanel(options);

const {
  panel: loginPanel,
  form: loginForm,
  displayNameInput: loginDisplayName,
  passwordInput: loginPasswordInput,
  rememberMeCheckbox,
  switchToForgotPasswordLink, // <-- Keep this name for the login panel's link
  switchToRegisterLink,       // <-- Keep this name for the login panel's link
  displayNameErrorFeedback: loginDisplayNameErrorFeedback,
  passwordErrorFeedback: loginPasswordErrorFeedback,
} = createLoginPanel(options);

const {
  panel: forgotPasswordPanel,
  form: forgotPasswordForm,
  emailInput: forgotPasswordEmailInput,
  codeInput: forgotPasswordCodeInput,
  // The property name returned by createForgotPasswordPanel is 'switchToLoginFromForgotLink'
  // We will destructure it and assign it to a new variable name for clarity if needed,
  // but in this case, the name is already clear.
  switchToLoginFromForgotLink // <--- This is the correct property name from the source object.
} = createForgotPasswordPanel(options);

  dialog.appendChild(dialogTitle);
  panelsContainer.appendChild(registerPanel);
  panelsContainer.appendChild(loginPanel);
  panelsContainer.appendChild(forgotPasswordPanel);
  dialog.appendChild(panelsContainer);


// --- PASSWORD STRENGTH LIST MANAGEMENT (EXTERNAL) ---
  const { element: strengthListElement, update: updateStrengthList } = createPasswordStrengthList();
  dialog.appendChild(strengthListElement);

  strengthListElement.classList.add('hidden');

  const passwordInputsWithStatus = [
    // Assuming _enableStrengthCheck correctly reflects if the input needs strength checking
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
    const password = registerPasswordInput.value;
    const confirmPassword = registerConfirmPasswordInput.value;
    const isRegisterPanelActive = currentMode === 'register';

    // Check if the confirmation field is in focus
    const isConfirmPasswordInputFocused = document.activeElement === registerConfirmPasswordInput.inputElement;

    const hasMismatch = confirmPassword.length > 0 &&
                        (password.substring(0, confirmPassword.length) !== confirmPassword ||
                         confirmPassword.length > password.length);

    // Use registerConfirmPasswordErrorFeedback (the correct, defined element)
    if (isRegisterPanelActive && isConfirmPasswordInputFocused && hasMismatch) {
        registerConfirmPasswordErrorFeedback.classList.remove('hidden');
        registerConfirmPasswordErrorFeedback.classList.add('flex');
        registerConfirmPasswordErrorFeedback.innerHTML = '<svg class="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg><span class="text-red-500">Mots de passe différents</span>';
    } else {
        registerConfirmPasswordErrorFeedback.classList.add('hidden');
        registerConfirmPasswordErrorFeedback.classList.remove('flex');
    }
  };

  registerPasswordInput.inputElement.addEventListener('input', checkPasswordMatch);
  registerConfirmPasswordInput.inputElement.addEventListener('input', checkPasswordMatch);

  registerConfirmPasswordInput.inputElement.addEventListener('focus', checkPasswordMatch);

  registerPasswordInput.inputElement.addEventListener('blur', () => {
    setTimeout(checkPasswordMatch, 50);
  });
  registerConfirmPasswordInput.inputElement.addEventListener('blur', () => {
    setTimeout(checkPasswordMatch, 50);
  });


  let currentMode: 'login' | 'register' | 'forgotPassword';

  const setPanelContainerHeight = (panel: HTMLElement) => {
    // On force le panel à être visible pour mesurer sa hauteur réelle
    panel.style.visibility = 'hidden';
    panel.classList.remove('opacity-0');
    panel.classList.add('opacity-100');
    panel.classList.add('translate-x-0');
    // On attend le prochain repaint pour mesurer
    requestAnimationFrame(() => {
      panelsContainer.style.height = `${panel.scrollHeight}px`;
      // On remet le panel dans son état normal
      panel.style.visibility = '';
      if (panel !== loginPanel && panel !== registerPanel && panel !== forgotPasswordPanel) return;
      if (panel !== loginPanel) loginPanel.classList.add('opacity-0');
      if (panel !== registerPanel) registerPanel.classList.add('opacity-0');
      if (panel !== forgotPasswordPanel) forgotPasswordPanel.classList.add('opacity-0');
    });
  };

  const switchMode = (mode: 'login' | 'register' | 'forgotPassword', animate = true) => {
    if (mode === currentMode) return;

    if (mode === 'login') {
        dialogTitle.textContent = "Se connecter";
    } else if (mode === 'register') {
        dialogTitle.textContent = "S'inscrire";
    } else { // mode === 'forgotPassword'
        dialogTitle.textContent = "Mot de passe oublié";
    }

    const hiddenClass = 'opacity-0';
    const visibleClass = 'opacity-100';
    const slideLeft = '-translate-x-full';
    const slideRight = 'translate-x-full';
    const slideIn = 'translate-x-0';

    const addTransitions = () => {
        registerPanel.classList.add('transition-transform', 'transition-opacity', 'duration-500', 'ease-in-out');
        loginPanel.classList.add('transition-transform', 'transition-opacity', 'duration-500', 'ease-in-out');
        forgotPasswordPanel.classList.add('transition-transform', 'transition-opacity', 'duration-500', 'ease-in-out');
    };
    const removeTransitions = () => {
        registerPanel.classList.remove('transition-transform', 'transition-opacity', 'duration-500', 'ease-in-out');
        loginPanel.classList.remove('transition-transform', 'transition-opacity', 'duration-500', 'ease-in-out');
        forgotPasswordPanel.classList.remove('transition-transform', 'transition-opacity', 'duration-500', 'ease-in-out');
    };

    if (animate) {
        addTransitions();
    } else {
        removeTransitions();
    }

    [registerPanel, loginPanel, forgotPasswordPanel].forEach(panel => {
        panel.classList.remove(slideIn, slideLeft, slideRight, visibleClass, hiddenClass);
        panel.classList.add(hiddenClass);
    });


    if (mode === 'login') {
      loginPanel.classList.remove(hiddenClass);
      loginPanel.classList.add(slideIn, visibleClass);

      registerPanel.classList.add(slideLeft);
      forgotPasswordPanel.classList.add(slideRight);

    } else if (mode === 'register') {
      registerPanel.classList.remove(hiddenClass);
      registerPanel.classList.add(slideIn, visibleClass);

      loginPanel.classList.add(slideRight);
      forgotPasswordPanel.classList.add(slideLeft);

    } else { // mode === 'forgotPassword'
      forgotPasswordPanel.classList.remove(hiddenClass);
      forgotPasswordPanel.classList.add(slideIn, visibleClass);

      loginPanel.classList.add(slideLeft);
      registerPanel.classList.add(slideRight);
    }

    currentMode = mode;
    options.onSwitchMode(mode);

    strengthListElement.classList.add('hidden');
    // Corrected: Use registerConfirmPasswordErrorFeedback as it's the correct element
    if (registerConfirmPasswordErrorFeedback) {
        registerConfirmPasswordErrorFeedback.classList.add('hidden');
    }

    setTimeout(() => {
        let activePanel;
        if (mode === 'login') activePanel = loginPanel;
        else if (mode === 'register') activePanel = registerPanel;
        else activePanel = forgotPasswordPanel;

        if (activePanel) {
            setPanelContainerHeight(activePanel);
        }
        if (mode === 'register') {
            checkPasswordMatch();
        }
    }, animate ? 500 : 0);
  };

  // --- Event Listeners for Mode Switching ---
  // Ensure these are correctly using the destructured links from each panel
  switchToForgotPasswordLink.addEventListener("click", (e: MouseEvent) => {
    e.preventDefault();
    switchMode('forgotPassword');
  });

  registerSwitchToLoginLink.addEventListener("click", (e: MouseEvent) => { // Using registerSwitchToLoginLink
    e.preventDefault();
    switchMode('login');
  });

  switchToLoginFromForgotLink .addEventListener("click", (e: MouseEvent) => {
    e.preventDefault();
    switchMode('login');
  });

  switchToRegisterLink.addEventListener("click", (e: MouseEvent) => { // Using loginPanel's switchToRegisterLink
    e.preventDefault();
    switchMode('register');
    });

    switchToLoginFromForgotLink.addEventListener("click", (e: MouseEvent) => {
  e.preventDefault();
  switchMode('login');
   });
  // --- Initial Mode Setup ---
  // 1. Rendre le panel initial visible AVANT le switchMode
let initialPanel: HTMLElement;
if (options.initialMode === 'login') initialPanel = loginPanel;
else if (options.initialMode === 'register') initialPanel = registerPanel;
else initialPanel = forgotPasswordPanel;

// On rend visible UNIQUEMENT le panel initial
[registerPanel, loginPanel, forgotPasswordPanel].forEach(panel => {
  if (panel === initialPanel) {
    panel.classList.remove('opacity-0');
    panel.classList.add('opacity-100', 'translate-x-0');
  } else {
    panel.classList.remove('opacity-100', 'translate-x-0');
    panel.classList.add('opacity-0');
  }
});

// On attend le prochain repaint pour fixer la hauteur
requestAnimationFrame(() => {
  panelsContainer.style.height = `${initialPanel.scrollHeight}px`;
  // Appeler switchMode pour appliquer la logique normale (sans animation)
  switchMode(options.initialMode, false);
});

return dialog;
}
