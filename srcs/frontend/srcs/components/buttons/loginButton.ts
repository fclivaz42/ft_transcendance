import { createButton } from "./index.js";

export function createLoginButton(): HTMLElement {
  return createButton({
    title: "Login",
    logo: "./assets/ui/login-door-1-svgrepo-com.svg",
    color: "bg-white",
    darkColor: "dark:bg-background_dark",
    id: "loginButton",
    href: "#"
  });
}