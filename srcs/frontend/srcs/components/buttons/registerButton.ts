import { createButton } from "./index.js";

export function createRegisterButton(): HTMLElement {
  return createButton({
    title: "Register",
    logo: "./assets/ui/login-door-1-svgrepo-com.svg",
    color: "white",
    id: "registerButton",
    href: "#"
  });
}