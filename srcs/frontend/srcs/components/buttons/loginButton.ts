//UserMenumanager ->here-> loginDialogManager -> createLoginDialog->
import { loginDialogManager } from "../../managers/LoginDialogManager.js";
import { createButton } from "./index.js";

export function createLoginButton(): HTMLElement {
  const button = createButton({
    title: "Login",
    logo: "./assets/ui/login-door-1-svgrepo-com.svg",
    color: "bg-white",
    darkColor: "dark:bg-background_dark",
    id: "loginButton",
    i18n: "header.usermenu.login",
  });
  button.onclick = () => {
    loginDialogManager.initialize();
  }
  return button;
}
