
// ////////////////////mode 2 en 1 frluide
// // if (data.displayName === 'test@example.com' && data.password === 'password123') {
// //chef orchestre (fond flou et fonce) + animation entree + croix
// //inject dans le DOM le Dialog,overlay soomber et blurredBackground
// // LoginDialogManager.ts
// // gere le contenu de la fenetre de connexion
// import { createLoginDialog } from "../components/dialog/loginDialog.js"; // Importe la fonction modifiée

// class LoginDialogManager {
//   private dialog: HTMLDialogElement | null = null;
//   private closeAllCallback: (() => void) | null = null;
//   private currentDialogMode: 'login' | 'register'  | 'forgotPassword' = 'register';; // Suivre le mode actuel

//   public initialize() {
//     const handleSwitchMode = (newMode: 'login' | 'register' | 'forgotPassword') => { // <-- UPDATE THIS LINE
//       this.currentDialogMode = newMode;
//       console.log(`LoginDialogManager: Mode de dialogue changé en ${newMode}`);
//     };
//     const main = document.getElementById("main");
//     if (!main) {
//       console.error("Main element not found");
//       return;
    
//     }

//     const blurredBackground = main.cloneNode(true) as HTMLElement;
//     blurredBackground.id = "blurred-background";
//     Object.assign(blurredBackground.style, {
//       position: "fixed",
//       top: "0",
//       left: "0",
//       width: "100vw",
//       height: "100vh",
//       zIndex: "40",
//       filter: "blur(12px) brightness(0.9)",
//       transform: "scale(1.01)",
//       pointerEvents: "none",
//       opacity: "0",
//       transition: "opacity 0.4s ease",
//       mindHeight: "unset",
//     });

//     const overlay = document.createElement("div");
//     overlay.className = `
//       fixed inset-0
//       flex flex-col items-center justify-center
//       bg-black/60
//     `.replace(/\s+/g, " ");
//     Object.assign(overlay.style, {
//       opacity: "0",
//       transition: "opacity 0.4s ease",
//       zIndex: "45",
//       pointerEvents: "auto",
//     });

//     // --- Fonction de gestion de la soumission (Login ou Register) ---
//     const handleAuthSubmit = async (mode: 'login' | 'register', data: { displayName: string; password?: string; confirmPassword?: string }) => {
//       console.log(`Soumission en mode ${mode} pour l'e-mail: ${data.displayName}`);

//       // *******************************************************************
//       //APPELS AU BACKEND
//       // *******************************************************************
// //test
//       if (mode === 'login') {
//         if (data.displayName === 'test@example.com' && data.password === 'password123') {
//           alert("Connexion réussie (simulée) !");
//           this.closeAllCallback?.();
//         } else {
//           alert("Connexion échouée : E-mail ou mot de passe incorrect.");
//         }
//       } else if (mode === 'register') {
//         if (data.displayName === 'newuser@example.com' && data.password === 'newpass' && data.password === data.confirmPassword) {
//           alert("Inscription réussie (simulée) !");
//           this.closeAllCallback?.();
//         } else {
//           alert("Inscription échouée : Veuillez vérifier les informations (et la confirmation du mot de passe).");
//         }
//       }
//     };

//     const handleForgotPasswordSubmit = (email: string, code: string) => {
//         console.log(`Mot de passe oublié soumis: Email=${email}, Code=${code}`);
  
//         alert("Réinitialisation du mot de passe (simulée) pour : " + email);

//     };

//     // 3. Création du <dialog> principal
//     const dialog = createLoginDialog({
//       initialMode: 'register',
//       onSubmit: handleAuthSubmit,
//       onSwitchMode: handleSwitchMode,
//       onForgotPasswordSubmit: handleForgotPasswordSubmit // <-- ADD THIS LINE
//     });

//     this.dialog = dialog;

//     dialog.classList.add(
//       "transition", "duration-300", "ease-out",
//       "opacity-0", "scale-95"
//     );
//     Object.assign(dialog.style, {
//       maxWidth: "400px",
//       position: "relative",
//       height: "auto", //s'adapte à la taille du contenu
//       maxHeight: "70vh",    // <-- heeeeeeeere :limite haute raisonnable dialog
//       minHeight: "50vh"   ,
//       overflow: "visible",     // <-- permet au contenu de dépasser si besoin
//       padding: "1.5rem",       
//     });

//     // 4. Bouton de fermeture (la croix)
//     const closeBtn = document.createElement("button");
//     closeBtn.textContent = "×";
//     closeBtn.setAttribute("aria-label", "Fermer la boîte de dialogue");
//     closeBtn.className = `
//       absolute
//       -top-6
//       -right-6
//       z-50
//       w-10 h-10
//       text-3xl
//       font-bold
//       bg-black/70
//       rounded-md
//       flex
//       items-center
//       justify-center
//       cursor-pointer
//       hover:text-red-500
//       hover:bg-black/90
//       shadow-lg
//       select-none
//       focus:outline-none
//     `.replace(/\s+/g, " ");
//     dialog.appendChild(closeBtn);


//     document.body.appendChild(blurredBackground);
//     document.body.appendChild(overlay);
//     document.body.appendChild(dialog);
//     document.body.style.overflow = "hidden";

//     // --- Logique de fermeture complète ---
//     overlay.addEventListener("click", (event) => {
//     if (event.target === overlay) {
//       this.closeAllCallback?.();
//     }
//   });
//     this.closeAllCallback = () => {
//       this.dialog!.classList.remove("opacity-100", "scale-100");
//       this.dialog!.classList.add("opacity-0", "scale-95");
//       overlay.style.opacity = "0";
//       blurredBackground.style.opacity = "0";

//       setTimeout(() => {
//         this.dialog!.close();
//         this.dialog!.remove();
//         overlay.remove();
//         blurredBackground.remove();
//         document.body.style.overflow = "auto";
//         this.dialog = null;
//         this.closeAllCallback = null;
//       }, 450);
//     };

//     closeBtn.addEventListener("click", this.closeAllCallback);


//     // --- Logique d'affichage ---
//     dialog.showModal();
//     requestAnimationFrame(() => {
//       blurredBackground.style.opacity = "1";
//       overlay.style.opacity = "1";
//       this.dialog!.classList.remove("opacity-0", "scale-95");
//       this.dialog!.classList.add("opacity-100", "scale-100");
//     });
//   }
// }

// export const loginDialogManager = new LoginDialogManager();


////////////////////mode 2 en 1 frluide
// if (data.displayName === 'test@example.com' && data.password === 'password123') {
//chef orchestre (fond flou et fonce) + animation entree + croix
//inject dans le DOM le Dialog,overlay soomber et blurredBackground
// LoginDialogManager.ts
// gere le contenu de la fenetre de connexion
import { createLoginDialog } from "../components/dialog/loginDialog.js"; // Importe la fonction modifiée

class LoginDialogManager {
  private dialog: HTMLDialogElement | null = null;
  private closeAllCallback: (() => void) | null = null;
  private currentDialogMode: 'login' | 'register'  | 'forgotPassword' = 'register';; // Suivre le mode actuel

  public initialize() {
    const handleSwitchMode = (newMode: 'login' | 'register' | 'forgotPassword') => {
      this.currentDialogMode = newMode;
      console.log(`LoginDialogManager: Mode de dialogue changé en ${newMode}`);
    };
    const main = document.getElementById("main");
    if (!main) {
      console.error("Main element not found");
      return;
    
    }

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
      mindHeight: "unset",
    });

    const overlay = document.createElement("div");
    overlay.className = `
      fixed inset-0
      flex flex-col items-center justify-center
      bg-black/60
    `.replace(/\s+/g, " ");
    Object.assign(overlay.style, {
      opacity: "0",
      transition: "opacity 0.4s ease",
      zIndex: "45",
      pointerEvents: "auto",
    });

    // --- Fonction de gestion de la soumission (Login ou Register) ---
    const handleAuthSubmit = async (mode: 'login' | 'register', data: { displayName: string; password?: string; confirmPassword?: string }) => {
      console.log(`Soumission en mode ${mode} pour l'e-mail: ${data.displayName}`);

      // *******************************************************************
      //APPELS AU BACKEND
      // *******************************************************************
//test
      if (mode === 'login') {
        if (data.displayName === 'test@example.com' && data.password === 'password123') {
          alert("Connexion réussie (simulée) !");
          this.closeAllCallback?.();
        } else {
          alert("Connexion échouée : E-mail ou mot de passe incorrect.");
        }
      } else if (mode === 'register') {
        if (data.displayName === 'newuser@example.com' && data.password === 'newpass' && data.password === data.confirmPassword) {
          alert("Inscription réussie (simulée) !");
          this.closeAllCallback?.();
        } else {
          alert("Inscription échouée : Veuillez vérifier les informations (et la confirmation du mot de passe).");
        }
      }
    };

    const handleForgotPasswordSubmit = (email: string, code: string) => {
        console.log(`Mot de passe oublié soumis: Email=${email}, Code=${code}`);
  
        alert("Réinitialisation du mot de passe (simulée) pour : " + email);

    };

    // 3. Création du <dialog> principal
const dialog = createLoginDialog({
   initialMode: 'register',//ordre 1er panel a s'afficher
   onSubmit: handleAuthSubmit,
   onSwitchMode: handleSwitchMode,
   onForgotPasswordSubmit: handleForgotPasswordSubmit
});

    this.dialog = dialog;

    dialog.classList.add(
      "transition", "duration-300", "ease-out",
      "opacity-0", "scale-95"
    );
    Object.assign(dialog.style, {
      maxWidth: "400px",
      position: "relative",
      height: "auto", //s'adapte à la taille du contenu
      maxHeight: "70vh",    // <-- heeeeeeeere :limite haute raisonnable dialog
      minHeight: "50vh"   ,
      overflow: "visible",     // <-- permet au contenu de dépasser si besoin
      padding: "1.5rem",       
    });

    // 4. Bouton de fermeture (la croix)
    const closeBtn = document.createElement("button");
    closeBtn.textContent = "×";
    closeBtn.setAttribute("aria-label", "Fermer la boîte de dialogue");
    closeBtn.className = `
      absolute
      -top-6
      -right-6
      z-50
      w-10 h-10
      text-3xl
      font-bold
      bg-black/70
      rounded-md
      flex
      items-center
      justify-center
      cursor-pointer
      hover:text-red-500
      hover:bg-black/90
      shadow-lg
      select-none
      focus:outline-none
    `.replace(/\s+/g, " ");
    dialog.appendChild(closeBtn);


    document.body.appendChild(blurredBackground);
    document.body.appendChild(overlay);
    document.body.appendChild(dialog);
    document.body.style.overflow = "hidden";

    // --- Logique de fermeture complète ---
    overlay.addEventListener("click", (event) => {
    if (event.target === overlay) {
      this.closeAllCallback?.();
    }
  });
    this.closeAllCallback = () => {
      this.dialog!.classList.remove("opacity-100", "scale-100");
      this.dialog!.classList.add("opacity-0", "scale-95");
      overlay.style.opacity = "0";
      blurredBackground.style.opacity = "0";

      setTimeout(() => {
        this.dialog!.close();
        this.dialog!.remove();
        overlay.remove();
        blurredBackground.remove();
        document.body.style.overflow = "auto";
        this.dialog = null;
        this.closeAllCallback = null;
      }, 450);
    };

    closeBtn.addEventListener("click", this.closeAllCallback);


    // --- Logique d'affichage ---
    dialog.showModal();
    requestAnimationFrame(() => {
      blurredBackground.style.opacity = "1";
      overlay.style.opacity = "1";
      this.dialog!.classList.remove("opacity-0", "scale-95");
      this.dialog!.classList.add("opacity-100", "scale-100");

    });
  }
}

export const loginDialogManager = new LoginDialogManager();