import { createDialog } from "./index.js"; // note that it's important to target .js files, including index. VSCode won't resolve it automatically.

export function createLoginDialog(): HTMLDialogElement {
  // already made a dialog component for you, allowClose is for the close button
  // feel free to change the dialog component to suit your needs, as long as it can be used in other components
  const dialog = createDialog({allowClose: true});

  // you should be able to use tailwind extension here
  // to handle dark mode, just add dark: prefix to the class name
  // some colors are already defined in tailwind.config.js, like bg-background and bg-background_dark -> if you need more colors, just add them there
  const dialogBody = `
  <h1>Lorem ipsum jsp quoi</h1>
  <p class="
    dark:bg-white
    dark:text-black
    bg-black
    text-white">
    Dark mode example
  </p>
  `

  // .insertAdjaccentHTML is used to keep the innerHTML instance intact
  dialog.insertAdjacentHTML("beforeend", dialogBody);
  return dialog;
}