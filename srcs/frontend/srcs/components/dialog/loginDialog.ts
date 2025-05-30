
// lui appelle Input/infoInput.ts

import { createDialog } from "./index.js"; // note that it's important to target .js files, including index. VSCode won't resolve it automatically.
import { createInfoInput } from "../input/infoInput.js"; //appelle la methode input


export function createLoginDialog(): HTMLDialogElement {
  const dialog = createDialog({ allowClose: true });

  dialog.classList.add(
    // "bg-zinc-900",     // fond sombre
    // "rounded-xl",      // coins arrondis
    // "p-8",             // padding intérieur
    // "text-white",      // texte blanc
    // "max-w-xl",        // largeur max
    // "w-full",          // prend toute la largeur disponible
    // "shadow-2xl",      // ombre portée
    // "backdrop-blur",   // effet flou si supporté
    // "border",          // bord léger
    // "border-zinc-700"  // couleur du bord
    "w-[400px]",
    "max-w-full",
    "rounded-xl",
    "bg-gray-900",
    "p-6",
    "text-white",
    "shadow-lg"
  );

  const dialogBody = document.createElement("div");
  dialogBody.className = "flex flex-col gap-6";

  const emailInput = createInfoInput("Adresse e-mail", "email");
  const passwordInput = createInfoInput("Mot de passe", "password");
  passwordInput.type = "password";

  const button = document.createElement("button");
  button.textContent = "Se connecter";
  button.className = "bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded";

  dialogBody.appendChild(emailInput);
  dialogBody.appendChild(passwordInput);
  dialogBody.appendChild(button);

  dialog.appendChild(dialogBody);
  return dialog;
}

// export function createLoginDialog(): HTMLDialogElement {
//   const dialog = createDialog({ allowClose: true });

//   const dialogBody = document.createElement("div");
//   dialogBody.className = "p-4";

//   const title = document.createElement("h1");
//   title.textContent = "Se connecter ou créer un compte";
//   title.className = "text-xl mb-3 text-white dark:text-black";// si en mode nuit

//   // Cree les champs de saisie
//   //idee: user entre l'email, si c'est dans la db -> laisse acces au champ de mot de passe sinon
//   // donne acces au boutton de s'inscrire
//   const emailInput = createInfoInput("Adresse e-mail", "email");


//   // Ajoute tout dans le body, vrai element DOM
//   dialogBody.appendChild(title);
//   dialogBody.appendChild(emailInput);

//   dialog.appendChild(dialogBody);
//   return dialog;
//   //---------------------------------------------------------------------
// export function createLoginDialog(): HTMLDialogElement {
//   // already made a dialog component for you, allowClose is for the close button
//   // feel free to change the dialog component to suit your needs, as long as it can be used in other components
//   const dialog = createDialog({allowClose: true});

//   // you should be able to use tailwind extension here
//   // to handle dark mode, just add dark: prefix to the class name
//   // some colors are already defined in tailwind.config.js, like bg-background and bg-background_dark -> if you need more colors, just add them there
//   const dialogBody = `
//   <h1>Connecte toi</h1>
//   <p class="
//     dark:bg-white
//     dark:text-black
//     bg-black
//     text-white">
//     Dark mode example
//   </p>
//   `
  

//   // .insertAdjaccentHTML is used to keep the innerHTML instance intact
//   dialog.insertAdjacentHTML("beforeend", dialogBody);
//   return dialog;
// }