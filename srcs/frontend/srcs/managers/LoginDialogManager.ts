

/////////////////////////////////////////version 1 de login avec 2 elemen t
// // //gere le contenu de la fenetre de connexion
// // code JavaScript côté client enverra des requêtes HTTP à votre serveur, qui lui-même interagira avec la base de données.


// // export const loginDialogManager = new LoginDialogManager();
// import { createLoginDialog } from "../components/dialog/loginDialog.js";

// class LoginDialogManager 
// {
//   public initialize() 
//   {
//     const main = document.getElementById("main");
//     if (!main) 
//       {
//       console.error("Main element not found");
//       return;
//     }

//     // 1. Fond flouté et assombri (clone de 'main' avec filtre)
//     const blurredBackground = main.cloneNode(true) as HTMLElement;
//     blurredBackground.id = "blurred-background";
//     Object.assign(blurredBackground.style, 
//     {
//       position: "fixed",
//       top: "0",
//       left: "0",
//       width: "100vw",
//       height: "100vh",
//       zIndex: "40", // Sous l'overlay et le dialog
//       filter: "blur(12px) brightness(0.9)",
//       transform: "scale(1.01)",
//       pointerEvents: "none", // N'intercepte pas les événements de souris
//       opacity: "0",
//       transition: "opacity 0.4s ease",
//     });

//     // 2. Overlay sombre (couche de fond, contiendra le dialog)
//     const overlay = document.createElement("div");
//     overlay.className = `
//       fixed inset-0
//       flex flex-col items-center justify-center
//       bg-black/60
//     `.replace(/\s+/g, " ");
//     Object.assign(overlay.style, 
//     {
//       opacity: "0",
//       transition: "opacity 0.4s ease",
//       zIndex: "45",
//       pointerEvents: "auto",
//     });

//     // 3. Création du <dialog> principal
//     const dialog = createLoginDialog();
//     dialog.classList.add
//     (
//       "transition", "duration-300", "ease-out",
//       "opacity-0", "scale-95"
//     );
//     Object.assign(dialog.style, 
//     {
//       maxWidth: "400px",
//       position: "relative", 
//     });

    
//     // Ajout au DOM: l'ordre est important: d'abord le fond flou, puis l'overlay, puis le dialog.
//     document.body.appendChild(blurredBackground);
//     document.body.appendChild(overlay); // L'overlay est directement un enfant de body
//     document.body.appendChild(dialog);

//     document.body.style.overflow = "hidden"; // Empêche le scroll du corps

//     // --- Logique de fermeture ---
//     const closeAll = () => 
//     {
//       // 1. Déclenchement des animations de sortie
//       dialog.classList.remove("opacity-100", "scale-100");
//       dialog.classList.add("opacity-0", "scale-95");
//       overlay.style.opacity = "0";
//       blurredBackground.style.opacity = "0";

//       // 2. Suppression des éléments du DOM après la fin des transitions
//       // Utilisez une durée un peu plus longue que la transition pour être sûr.
//       // La transition du dialog est 300ms, l'overlay/blurredBackground 400ms.
//       // On prend la plus longue (400ms) plus une petite marge.
//       setTimeout(() => {
//         dialog.close(); // Ferme le dialog de son état modal
//         dialog.remove(); // Retire le dialog du DOM
//         overlay.remove(); // Retire l'overlay du DOM
//         blurredBackground.remove(); // Retire le fond flou du DOM
//         document.body.style.overflow = "auto"; // Réactive le scroll
//       }, 450); // Attendre la fin des transitions (400ms) + petite marge
//     };


//     // Écouteur pour fermer en cliquant en dehors du dialog
//     // Le dialog a un pseudo-élément ::backdrop par défaut quand showModal() est utilisé.
//     // Nous pouvons écouter les clics sur ce ::backdrop.
//     dialog.addEventListener('click', (event) => 
//     {
//         // Si le clic n'est pas sur le contenu du dialog (mais sur le backdrop)
//         if (event.target === dialog) {
//             closeAll();
//         }
//     });

//     // --- Logique d'affichage ---
//     // Important: showModal() doit être appelé AVANT de déclencher les animations d'entrée
//     dialog.showModal(); // Affiche le dialog en tant que modal, il se place au-dessus de tout

//     requestAnimationFrame(() => 
//       {
//       // Maintenant que le dialog est affiché, on déclenche les animations
//       blurredBackground.style.opacity = "1";
//       overlay.style.opacity = "1";
//       dialog.classList.remove("opacity-0", "scale-95");
//       dialog.classList.add("opacity-100", "scale-100");
//     });
//   }
// }
// export const loginDialogManager = new LoginDialogManager();

///////////////////////////////////////




////////////////////mode 2 en 1 frluide
// LoginDialogManager.ts
// gere le contenu de la fenetre de connexion
import { createLoginDialog } from "../components/dialog/loginDialog.js"; // Importe la fonction modifiée

class LoginDialogManager {
  private dialog: HTMLDialogElement | null = null;
  private closeAllCallback: (() => void) | null = null;
  private currentDialogMode: 'login' | 'register' = 'register'; // Suivre le mode actuel

  public initialize() {
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
    const handleAuthSubmit = async (mode: 'login' | 'register', data: { email: string; password?: string; confirmPassword?: string }) => {
      console.log(`Soumission en mode ${mode} pour l'e-mail: ${data.email}`);

      // *******************************************************************
      // REMPLACEZ CE BLOC PAR VOTRE VÉRITABLE LOGIQUE DE CONNEXION/INSCRIPTION
      // AVEC DES APPELS À VOTRE BACKEND (ex: fetch('/api/login', ...))
      // *******************************************************************

      if (mode === 'login') {
        if (data.email === 'test@example.com' && data.password === 'password123') {
          alert("Connexion réussie (simulée) !");
          this.closeAllCallback?.();
        } else {
          alert("Connexion échouée : E-mail ou mot de passe incorrect.");
        }
      } else if (mode === 'register') {
        if (data.email === 'newuser@example.com' && data.password === 'newpass' && data.password === data.confirmPassword) {
          alert("Inscription réussie (simulée) !");
          this.closeAllCallback?.();
        } else {
          alert("Inscription échouée : Veuillez vérifier les informations (et la confirmation du mot de passe).");
        }
      }
    };

    // --- Fonction de gestion du changement de mode ---
    const handleSwitchMode = (newMode: 'login' | 'register') => {
      this.currentDialogMode = newMode;
      console.log(`LoginDialogManager: Mode de dialogue changé en ${newMode}`);
    };

    // 3. Création du <dialog> principal
    const dialog = createLoginDialog({
      initialMode: 'register',
      onSubmit: handleAuthSubmit,
      onSwitchMode: handleSwitchMode
    });

    this.dialog = dialog;

    dialog.classList.add(
      "transition", "duration-300", "ease-out",
      "opacity-0", "scale-95"
    );
    Object.assign(dialog.style, {
      maxWidth: "400px",
      position: "relative",
      // --- AJOUT IMPORTANT ICI ---
      height: "auto", // Assure que le dialogue s'adapte à son contenu
      maxHeight: "90vh", // Limite la hauteur maximale
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

    dialog.addEventListener('click', (event) => {
      if (event.target === dialog) {
        this.closeAllCallback?.();
      }
    });

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