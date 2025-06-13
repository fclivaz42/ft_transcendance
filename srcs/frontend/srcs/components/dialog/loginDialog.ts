
import { createDialog } from "./index.js";
import { checkPasswordStrength, PasswordStrengthResult } from "../input/createPasswordInput.js"; 
import { createPasswordStrengthList } from "../input/passwordStrengh.js";
import { LoginDialogOptions, CustomPasswordInput } from "./createPanel.js"; 
import { 
  createRegisterPanel, 
  createLoginPanel, 
  createForgotPasswordPanel 
} from "./createPanel.js"; 

// --- Dialog ---
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
  panelsContainer.className = "relative w-full flex flex-col items-center justify-center"; //patate heeere un overflow hidden enleve


  // --- CRÉATION DE PANNEAUX ---
  const { 
    panel: registerPanel, 
    form: registerForm, 
    displayNameInput: registerDisplayName, 
    passwordInput: registerPasswordInput, 
    confirmPasswordInput: registerConfirmPasswordInput, 
    passwordMatchFeedback, 
    switchToLoginLink 
  } = createRegisterPanel(options); 

  const { 
    panel: loginPanel, 
    form: loginForm, 
    displayNameInput: loginDisplayName, 
    passwordInput: loginPasswordInput, 
    rememberMeCheckbox, 
    switchToForgotPasswordLink, 
    switchToRegisterLink 
  } = createLoginPanel(options); 

  const { 
    panel: forgotPasswordPanel, 
    form: forgotPasswordForm, 
    emailInput: forgotPasswordEmailInput, 
    codeInput: forgotPasswordCodeInput, 
    switchToLoginFromForgotLink 
  } = createForgotPasswordPanel(options); 


  dialog.appendChild(dialogTitle);
  panelsContainer.appendChild(registerPanel);
  panelsContainer.appendChild(loginPanel);
  panelsContainer.appendChild(forgotPasswordPanel);
  dialog.appendChild(panelsContainer);

  
// --- GESTION DE LA LISTE DE FORCE DE MOT DE PASSE EXTERNE ---
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

  // --- Fonction de validation de la correspondance des mots de passe  ---
  const checkPasswordMatch = () => {
    const password = registerPasswordInput.value;
    const confirmPassword = registerConfirmPasswordInput.value;
    const isRegisterPanelActive = currentMode === 'register';

    // Vérifier si le champ de confirmation est en focus
    const isConfirmPasswordInputFocused = document.activeElement === registerConfirmPasswordInput.inputElement;

    const hasMismatch = confirmPassword.length > 0 && 
                        (password.substring(0, confirmPassword.length) !== confirmPassword || 
                         confirmPassword.length > password.length);


    if (isRegisterPanelActive && isConfirmPasswordInputFocused && hasMismatch) {
        passwordMatchFeedback.classList.remove('hidden');
        passwordMatchFeedback.classList.add('flex');
        passwordMatchFeedback.innerHTML = '<svg class="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg><span class="text-red-500">Mots de passe différents</span>';
    } else {
        passwordMatchFeedback.classList.add('hidden');
        passwordMatchFeedback.classList.remove('flex');
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
    if (passwordMatchFeedback) { 
        passwordMatchFeedback.classList.add('hidden'); 
    }

    setTimeout(() => {
        let activePanel;
        if (mode === 'login') activePanel = loginPanel;
        else if (mode === 'register') activePanel = registerPanel;
        else activePanel = forgotPasswordPanel;

        if (activePanel) {
            //here hauteur
            panelsContainer.style.height = `${activePanel.scrollHeight}px`;
        }
        if (mode === 'register') {
            checkPasswordMatch(); 
        }
    }, animate ? 500 : 0);
  };

  switchToForgotPasswordLink.addEventListener("click", (e) => {
    e.preventDefault();
    switchMode('forgotPassword');
  });

  switchToLoginLink.addEventListener("click", (e) => {
    e.preventDefault();
    switchMode('login');
  });

  switchToLoginFromForgotLink.addEventListener("click", (e) => {
    e.preventDefault();
    switchMode('login');
  });

  switchToRegisterLink.addEventListener("click", (e) => {
    e.preventDefault();
    switchMode('register');
  });

  switchMode(options.initialMode, false);

  return dialog;
}