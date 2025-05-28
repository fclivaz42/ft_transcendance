import { createLoginDialog } from "../components/dialog/loginDialog.js";

class LoginDialogManager {
  public initialize() {
    const main = document.getElementById("main");
    if (!main) {
      console.error("Main element not found");
      return;
    }

    const dialog = createLoginDialog();

    main.appendChild(dialog);
    dialog.showModal();
  }
}

export const loginDialogManager = new LoginDialogManager();