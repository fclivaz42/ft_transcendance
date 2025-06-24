import { ButtonProps } from "../../interfaces/baseProps.js";

export function createButton(props: ButtonProps): HTMLAnchorElement {
  const button = document.createElement("a") as HTMLAnchorElement;

  button.className = `${props.color || "bg-white"} ${props.darkColor || "dark:bg-black"} hover:animate-scale hover:animate-duration-100 cursor-pointer rounded-lg p-3 text-xs font-semibold flex align-middle items-center gap-x-3`;
  button.innerHTML = `
    ${props.logo ? `<img class="select-none h-4 w-4 dark:invert" src="${props.logo}">` : ""}
    <p${props.i18n ? " data-i18n=" + props.i18n: ""}>${props.title}</p>
  `;

  if (props.id)
    button.id = props.id;
  if (props.href)
    button.href = props.href;
	button.onclick = () => {
		if (props.f) {
			props.f();
		}
	}
	if (props.addClasses)
		button.classList.add(props.addClasses);
  return button;
}

export { createLoginButton } from "./loginButton.js";
export { createRegisterButton } from "./registerButton.js";
export { createLogoutButton } from "./logoutButton.js";
