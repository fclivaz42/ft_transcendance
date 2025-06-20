// Fonction pour créer le panneau de mot de passe oublié

import { createInfoInput, CustomInputContainer } from '../input/infoInput.js';
import { LoginDialogOptions } from './index.js'; // Import from your new index.ts
import { i18nHandler } from "../../handlers/i18nHandler.js";

export function createForgotPasswordPanel(options: LoginDialogOptions) {
  const forgotPasswordPanel = document.createElement("div");
  forgotPasswordPanel.className = `
    absolute inset-0
    flex flex-col gap-3 
    transition-transform duration-500 ease-in-out transform opacity-0
    w-full
    justify-center items-center pb-6
  `.replace(/\s+/g, " ");

  const forgotPasswordForm = document.createElement("form");
  forgotPasswordForm.className = "flex flex-col gap-3 w-full max-w-xs px-2";

  const forgotPasswordEmailInput = createInfoInput(i18nHandler.getValue("panel.emailLabel"), "forgotEmail");
  const forgotPasswordCodeInput = createInfoInput(i18nHandler.getValue("panel.forgotPasswordPanel.validation.code"), "forgotCode");
  
  const forgotPasswordButton = document.createElement("button");
  forgotPasswordButton.textContent = i18nHandler.getValue("panel.forgotPasswordPanel.sendButton");
  forgotPasswordButton.type = "submit";
  forgotPasswordButton.className = "bg-purple-600 hover:bg-purple-700 font-semibold py-2 px-4 rounded ";

  forgotPasswordForm.appendChild(forgotPasswordEmailInput);
  forgotPasswordForm.appendChild(forgotPasswordCodeInput);
  forgotPasswordForm.appendChild(forgotPasswordButton);
  forgotPasswordPanel.appendChild(forgotPasswordForm);

  const switchToLoginFromForgotLink = document.createElement("a");
  switchToLoginFromForgotLink.href = "#";
  switchToLoginFromForgotLink.textContent = i18nHandler.getValue("panel.forgotPasswordPanel.link.loginPanel");
  switchToLoginFromForgotLink.className = "text-center text-blue-400 hover:text-blue-200 text-sm mt-1 cursor-pointer";
  forgotPasswordPanel.appendChild(switchToLoginFromForgotLink);

  // Le gestionnaire de soumission est défini ici pour rester avec le formulaire
  forgotPasswordForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const email = forgotPasswordEmailInput.value;
    const code = forgotPasswordCodeInput.value;
    options.onForgotPasswordSubmit(email, code);
  });

  return {
    panel: forgotPasswordPanel,
    form: forgotPasswordForm,
    emailInput: forgotPasswordEmailInput,
    codeInput: forgotPasswordCodeInput,
    switchToLoginFromForgotLink: switchToLoginFromForgotLink,
  };
}