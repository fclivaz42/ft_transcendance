
export { createLoginPanel } from './loginPanel.js';
export { createRegisterPanel } from './registerPanel.js';
export { createForgotPasswordPanel } from './forgotPswPanel.js';

// 1. Interfaces partagées pour la logique de dialogue
export interface LoginDialogOptions {
  initialMode: 'login' | 'register' | 'forgotPassword';
  onSwitchMode: (mode: 'login' | 'register' | 'forgotPassword') => void;

  onSubmit(mode: 'login', data: { displayName: string; password: string; rememberMe: boolean; }): void;
  onSubmit(mode: 'register', data: { displayName: string; email: string; password: string; confirmPassword: string; }): void;

  onForgotPasswordSubmit: (email: string, code: string) => void;
}

// Interface pour les propriétés de la boîte de dialogue générique
export interface DialogProps {
  allowClose?: boolean;
  child?: HTMLElement;
}



// 2. Export de la fonction générique createDialog (une seule fois !)
export function createDialog(props?: DialogProps): HTMLDialogElement {
  const dialog = document.createElement("dialog");
  
  if (props?.allowClose) {
    const closeButton = document.createElement("button");
    closeButton.className = "select-none border-0 m-0 p-0 text-3xl absolute top-2 right-2 text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100";
    closeButton.innerHTML = "×";
    closeButton.onclick = () => dialog.remove();
    dialog.appendChild(closeButton);
  }

  if (props?.child) {
    dialog.appendChild(props.child);
  }

  dialog.className = "fixed left-0 right-0 top-0 bottom-0 p-8 bg-background dark:bg-background_dark border-0 rounded-lg shadow-lg flex flex-col justify-center items-center gap-y-4 text-black dark:text-white";

  return dialog;
}
