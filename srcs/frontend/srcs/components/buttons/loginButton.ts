//UserMenumanager ->here-> loginDialogManager -> createLoginDialog->
import { i18nHandler } from "../../handlers/i18nHandler.js";
import { loginDialogManager } from "../../managers/LoginDialogManager.js";
import { createButtonIcon } from "./index.js";

export function createLoginButton(): HTMLElement {
  const button = createButtonIcon({
    logo: "/assets/ui/login-door-1-svgrepo-com.svg",
    color: "bg-white",
    darkColor: "dark:bg-background_dark",
    id: "loginButton",
    i18n: "header.usermenu.login",
		f: () => loginDialogManager.initialize(),
		addClasses: "h-[40px]",
  });
  return button;
}
