import { i18nHandler } from "../../handlers/i18nHandler.js";
import { sanitizer } from "../../helpers/sanitizer.js";
import { ButtonProps } from "../../interfaces/baseProps.js";

export function createButton(props: ButtonProps): HTMLAnchorElement {
  const button = document.createElement("a") as HTMLAnchorElement;

  button.className = `${props.color || "bg-white"} ${props.darkColor || "dark:bg-black"} hover:animate-scale hover:animate-duration-100 cursor-pointer rounded-lg p-3 text-xs font-semibold flex align-middle items-center gap-x-3`;
  button.innerHTML = `
    ${props.logo ? `<img class="select-none h-4 w-4 dark:invert" src="${sanitizer(props.logo)}">` : ""}
  `;
	if (props.i18n)
		button.innerHTML += `<p data-i18n=${sanitizer(props.i18n)}>${sanitizer(i18nHandler.getValue(props.i18n))}</p>`;

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
		button.classList += ` ${props.addClasses}`;
  return button;
}

export { createLoginButton } from "./loginButton.js";
export { createRegisterButton } from "./registerButton.js";
export { createLogoutButton } from "./logoutButton.js";
