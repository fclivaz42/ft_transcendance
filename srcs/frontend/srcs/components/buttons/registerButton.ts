import { createButton } from "./index.js";

export function createRegisterButton(): HTMLElement {
  return createButton({
    title: "Register",
    logo: "./assets/ui/login-door-1-svgrepo-com.svg",
    color: "bg-white",
    darkColor: "dark:bg-background_dark",
    id: "registerButton",
    href: "#",
    i18n: "header.usermenu.register",
  });
}