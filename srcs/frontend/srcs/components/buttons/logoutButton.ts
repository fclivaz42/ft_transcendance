import { createButton } from "./index.js";

export function createLogoutButton(): HTMLElement {
  return createButton({
    title: "Logout",
    logo: "./assets/ui/login-door-1-svgrepo-com.svg",
    color: "red-300",
    id: "logoutButton",
    href: "#"
  });
}