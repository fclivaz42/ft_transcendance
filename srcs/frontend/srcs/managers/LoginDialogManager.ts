
import { createLoginDialog } from "../components/dialog/loginDialog.js";

class LoginDialogManager {
  // public initialize() {
  //   const main = document.getElementById("main");
  //   if (!main) {
  //     console.error("Main element not found");
  //     return;
  //   }

  //   // Conteneur principal plein écran
  //   const overlay = document.createElement("div");
  //   overlay.className = `
  //     fixed
  //     top-0 left-0 right-0 bottom-0
  //     z-50
  //     flex items-center justify-center
  //     bg-black/90
  //     backdrop-blur-3xl
  //   `.replace(/\s+/g, " ");
    
    

  //   // Titre au-dessus du dialog
  //   const title = document.createElement("h1");
  //   title.textContent = "Connexion";
  //   title.className = "text-4xl font-bold text-white mb-8";

  //   // Boîte de dialogue (vraie balise <dialog>)
  //   const dialog = createLoginDialog();

  //   // Ajout dans le DOM
  //   overlay.appendChild(title);
  //   overlay.appendChild(dialog);
  //   main.appendChild(overlay);
  //   document.body.style.overflow = "hidden";//evite de scroller la page en arriere plan

  //   dialog.showModal();
  // }
  //-----------------------------------------------versopm flou conta
  // public initialize() {
  //   const main = document.getElementById("main");
  //   if (!main) {
  //     console.error("Main element not found");
  //     return;
  //   }
  
  //   // 1. Clone flouté doux du fond
  //   const blurredBackground = main.cloneNode(true) as HTMLElement;
  //   blurredBackground.id = "blurred-background";
  //   Object.assign(blurredBackground.style, {
  //     position: "fixed",
  //     top: "0",
  //     left: "0",
  //     width: "100vw",
  //     height: "100vh",
  //     zIndex: "40",
  //     filter: "blur(12px) brightness(0.9)",
  //     transform: "scale(1.01)",
  //     pointerEvents: "none",
  //     opacity: "0",
  //     transition: "opacity 0.4s ease",
  //   });
  
  //   // 2. Overlay sombre centré
  //   const overlay = document.createElement("div");
  //   overlay.className = `
  //     fixed inset-0
  //     z-50
  //     flex items-center justify-center
  //     bg-black/60
  //   `.replace(/\s+/g, " ");
  //   overlay.style.opacity = "0";
  //   overlay.style.transition = "opacity 0.4s ease";
  
  //   // 3. Titre
  //   const title = document.createElement("h1");
  //   title.textContent = "Connexion";
  //   title.className = "text-4xl font-bold text-white mb-8";
  
  //   // 4. Création du dialog
  //   const dialog = createLoginDialog();
  //   dialog.classList.add(
  //     "transition", "duration-300", "ease-out",
  //     "opacity-0", "scale-95"
  //   );
  
  //   // 5. Ajout au DOM
  //   overlay.appendChild(title);
  //   overlay.appendChild(dialog);
  //   document.body.appendChild(blurredBackground);
  //   document.body.appendChild(overlay);
  //   document.body.style.overflow = "hidden";
  
  //   // 6. Lancer les animations
  //   requestAnimationFrame(() => {
  //     blurredBackground.style.opacity = "1";
  //     overlay.style.opacity = "1";
  //     dialog.classList.remove("opacity-0", "scale-95");
  //     dialog.classList.add("opacity-100", "scale-100");
  //   });
  
  //   // 7. Afficher le dialog
  //   dialog.showModal();
  // }
  //------------------------------
//   public initialize() {
//   const main = document.getElementById("main");
//   if (!main) {
//     console.error("Main element not found");
//     return;
//   }

//   const blurredBackground = main.cloneNode(true) as HTMLElement;
//   blurredBackground.id = "blurred-background";
//   Object.assign(blurredBackground.style, {
//     position: "fixed",
//     top: "0",
//     left: "0",
//     width: "100vw",
//     height: "100vh",
//     zIndex: "40",
//     filter: "blur(12px) brightness(0.9)",
//     transform: "scale(1.01)",
//     pointerEvents: "none",
//     opacity: "0",
//     transition: "opacity 0.4s ease",
//   });

//   const overlay = document.createElement("div");
//   overlay.className = `
//     fixed inset-0
//     z-50
//     flex items-center justify-center
//     bg-black/60
//   `.replace(/\s+/g, " ");
//   overlay.style.opacity = "0";
//   overlay.style.transition = "opacity 0.4s ease";

//   const title = document.createElement("h1");
//   title.textContent = "Connexion";
//   title.className = "text-4xl font-bold text-white mb-8";

//   const dialog = createLoginDialog();
//   dialog.classList.add(
//     "transition", "duration-300", "ease-out",
//     "opacity-0", "scale-95"
//   );

//   // Bouton fermeture
//   const closeBtn = document.createElement("button");
//   closeBtn.innerHTML = "&times;";
//   closeBtn.setAttribute("aria-label", "Fermer");
//   closeBtn.className = `
//     absolute top-4 right-4
//     text-white text-2xl font-bold
//     hover:text-red-500
//     focus:outline-none
//   `;
//   dialog.style.position = "relative";
//   dialog.appendChild(closeBtn);

//   closeBtn.addEventListener("click", () => {
//     dialog.classList.remove("opacity-100", "scale-100");
//     dialog.classList.add("opacity-0", "scale-95");

//     overlay.style.opacity = "0";
//     blurredBackground.style.opacity = "0";

//     setTimeout(() => {
//       dialog.close();
//       overlay.remove();
//       blurredBackground.remove();
//       document.body.style.overflow = "auto";
//     }, 300);
//   });

//   overlay.appendChild(title);
//   overlay.appendChild(dialog);

//   document.body.appendChild(blurredBackground);
//   document.body.appendChild(overlay);
//   document.body.style.overflow = "hidden";

//   requestAnimationFrame(() => {
//     blurredBackground.style.opacity = "1";
//     overlay.style.opacity = "1";
//     dialog.classList.remove("opacity-0", "scale-95");
//     dialog.classList.add("opacity-100", "scale-100");
//   });

//   dialog.showModal();
// }
public initialize() {
  const main = document.getElementById("main");
  if (!main) {
    console.error("Main element not found");
    return;
  }

  // Clone flouté doux du fond
  const blurredBackground = main.cloneNode(true) as HTMLElement;
  blurredBackground.id = "blurred-background";
  Object.assign(blurredBackground.style, {
    position: "fixed",
    top: "0",
    left: "0",
    width: "100vw",
    height: "100vh",
    zIndex: "40",
    filter: "blur(12px) brightness(0.9)",
    transform: "scale(1.01)",
    pointerEvents: "none",
    opacity: "0",
    transition: "opacity 0.4s ease",
  });

  // Overlay sombre centré
  const overlay = document.createElement("div");
  overlay.className = `
    fixed inset-0
    flex flex-col items-center justify-center
    bg-black/60
  `.replace(/\s+/g, " ");
  overlay.style.opacity = "0";
  overlay.style.transition = "opacity 0.4s ease";
  overlay.style.zIndex = "45";
  // No need for overflow: "visible" here on the overlay as the button will be inside the dialog

  // Titre
  const title = document.createElement("h1");
  title.textContent = "Connexion";
  title.className = "text-4xl font-bold text-white mb-8";

  // Création du dialog
  const dialog = createLoginDialog(); // Assuming createLoginDialog returns a <dialog> element
  dialog.classList.add(
    "transition", "duration-300", "ease-out",
    "opacity-0", "scale-95"
  );
  dialog.style.maxWidth = "400px";
  // Set the dialog's position to relative to allow absolute positioning of the button inside it
  dialog.style.position = "relative";
  // dialog.style.padding = "20px"; // Add some padding so content doesn't get hidden by the button

  // Bouton fermeture (croix)
  const closeBtn = document.createElement("button");
  closeBtn.innerHTML = "<span style='font-size: 40px;'>&times;</span>";
  // closeBtn.innerHTML = "&times;";
  closeBtn.setAttribute("aria-label", "Fermer");
  closeBtn.className = `
    text-white text-3xl font-bold cursor-pointer
    hover:text-red-500
    focus:outline-none
  `;
  closeBtn.style.userSelect = "none";
  closeBtn.style.position = "absolute";

  // closeBtn.style.top = "10px"; // Position relative to the dialog's top-right corner
  // closeBtn.style.right = "10px";
  // closeBtn.style.width = "35px";
  // closeBtn.style.height = "35px";
  closeBtn.style.top = "-5px";   // Move it up, adjust as needed
  closeBtn.style.right = "-5px"; // Move it to the right, adjust as needed
  closeBtn.style.width = "50px";   // Increased button width
  closeBtn.style.height = "50px";  // Increased button height
  closeBtn.style.backgroundColor = "rgba(0,0,0,0.7)";
  closeBtn.style.borderRadius = "6px";
  closeBtn.style.lineHeight = "35px";
  closeBtn.style.textAlign = "center";
  closeBtn.style.boxShadow = "0 0 10px rgba(0,0,0,0.7)";
  closeBtn.style.zIndex = "100"; // super au-dessus

  // Append the close button directly to the dialog
  dialog.appendChild(closeBtn);

  // Append the title and dialog (which now contains the close button) to the overlay
  overlay.appendChild(title);
  overlay.appendChild(dialog); // Append the dialog directly to the overlay, no need for dialogWrapper

  // Ajout au DOM
  document.body.appendChild(blurredBackground);
  document.body.appendChild(overlay);
  document.body.style.overflow = "hidden";

  closeBtn.addEventListener("click", () => {
    dialog.classList.remove("opacity-100", "scale-100");
    dialog.classList.add("opacity-0", "scale-95");

    overlay.style.opacity = "0";
    blurredBackground.style.opacity = "0";

    setTimeout(() => {
      dialog.close();
      overlay.remove();
      blurredBackground.remove();
      document.body.style.overflow = "auto";
    }, 300);
  });

  requestAnimationFrame(() => {
    blurredBackground.style.opacity = "1";
    overlay.style.opacity = "1";
    dialog.classList.remove("opacity-0", "scale-95");
    dialog.classList.add("opacity-100", "scale-100");
  });

  dialog.showModal();
}
  
}

export const loginDialogManager = new LoginDialogManager();

// // appelle dialogue> loginDialog.ts
// import { createLoginDialog } from "../components/dialog/loginDialog.js";

// class LoginDialogManager {
//   public initialize() {
//     const main = document.getElementById("main");
//     if (!main) {
//       console.error("Main element not found");
//       return;
//     }

//     const dialog = createLoginDialog();

//     main.appendChild(dialog);
//     dialog.showModal();
//   }
// }

// export const loginDialogManager = new LoginDialogManager();