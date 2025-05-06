interface ButtonProps {
  title: string;
  logo?: string;
  color?: string;
  darkColor?: string;
  id?: string;
  href?: string;
}

export function createButton(props: ButtonProps): HTMLElement {
  const button = document.createElement("a");

  button.className = `${props.color || "bg-white"} ${props.darkColor || "dark:bg-black"} rounded-lg p-3 text-xs font-semibold flex align-middle items-center gap-x-1`;
  button.innerHTML = `
    ${props.logo ? `<img class="h-4 w-4 dark:invert" src="${props.logo}">` : ""}
    <p>${props.title}</p>
  `;

  if (props.id)
    button.id = props.id;
  if (props.href)
    button.href = props.href;
  return button;
}

export { createLoginButton } from "./loginButton.js";
export { createRegisterButton } from "./registerButton.js";
export { createLogoutButton } from "./logoutButton.js";