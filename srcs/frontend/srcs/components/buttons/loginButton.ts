//UserMenumanager ->here-> loginDialogManager -> createLoginDialog->
import { i18nHandler } from "../../handlers/i18nHandler.js";
import { loginDialogManager } from "../../managers/LoginDialogManager.js";
import { createButton } from "./index.js";

export function createLoginButton(): HTMLElement {
  const button = createButton({
    title: i18nHandler.getValue("header.usermenu.login"),
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
