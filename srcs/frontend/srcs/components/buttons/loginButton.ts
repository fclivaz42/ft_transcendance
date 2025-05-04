import { createButton } from "./index.js";

export function createLoginButton(): HTMLElement {
  return createButton({
    title: "Login",
    logo: "./assets/ui/login-door-1-svgrepo-com.svg",
    color: "white",
    id: "loginButton",
    href: "#"
  });
}