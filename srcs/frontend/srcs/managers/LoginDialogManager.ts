
////////////////////mode 2 en 1 frluide
// if (data.displayName === 'test@example.com' && data.password === 'password123') {
//chef orchestre (fond flou et fonce) + animation entree + croix
//inject dans le DOM le Dialog,overlay soomber et blurredBackground
// LoginDialogManager.ts
// gere le contenu de la fenetre de connexion
import SarifDialog from "../class/BackdropDialog";
import { createLoginDialog } from "../components/backdropDialog/loginDialog"; // Importe la fonction modifiée
import { createLogin2fa } from "../components/dialog/login2fa";
import { i18nHandler } from "../handlers/i18nHandler.js";
import UserHandler from "../handlers/UserHandler.js";
import NotificationManager from "./NotificationManager.js";

class LoginDialogManager {
  private dialog: SarifDialog | null = null;
  private currentDialogMode: 'login' | 'register'  | 'forgotPassword' = 'register';; // Suivre le mode actuel

	private async init2fa() {
		const dialog = createLogin2fa();
		dialog.show();
	}

  public initialize() {
    const handleSwitchMode = (newMode: 'login' | 'register' | 'forgotPassword') => {
      this.currentDialogMode = newMode;
      console.log(`LoginDialogManager: Mode de dialogue changé en ${newMode}`);
    };

    // --- Fonction de gestion de la soumission (Login ou Register) ---
    const handleAuthSubmit = async (mode: 'login' | 'register', data: { displayName: string; email: string, password?: string; confirmPassword?: string }) => {
      console.log(`Soumission en mode ${mode} pour l'e-mail: ${data.displayName}`);

      // *******************************************************************
      //APPELS AU BACKEND
      // *******************************************************************
//test
			// User object
			let user = {
				DisplayName: data.displayName,
				EmailAddress: data.email,
				Password: data.password,
				ClientId: UserHandler.clientId,
			}
      if (mode === 'login') {
				// le login peut se faire avec un displayName ou un email
				if (data.displayName.search(/@/) > -1) {
					user.EmailAddress = data.displayName;
					user.DisplayName = "";
				}
				if (!UserHandler.clientId)
					throw new Error("error.missingClientId");
				try {
					const res = await fetch("/api/users/login", {
						method: "POST",
						headers: {
							"Content-Type": "application/json"
						},
						body: JSON.stringify(user),
					});
					if (res.status === 401)
						NotificationManager.notify({
							level: "error",
							title: i18nHandler.getValue("panel.loginPanel.notification.loginErrorTitle"),
							message: i18nHandler.getValue("panel.loginPanel.notification.loginBadCredentials")
						});
					else if (!res.ok)
						throw new Error("error.loginFailed");
					else
						this.init2fa();
				} catch (error) {
					console.error(error);
					NotificationManager.notify({
						level: "error",
						title: i18nHandler.getValue("generic.errorTitle"),
						message: i18nHandler.getValue("generic.errorMessage")
					});
				}
      } else if (mode === 'register') {
				if (data.password !== data.confirmPassword) {
					NotificationManager.notify({
						level: "error",
						title: i18nHandler.getValue("panel.registerPanel.notification.registerErrorTitle"),
						message: i18nHandler.getValue("panel.registerPanel.notification.registerPassMismatchMessage")
					});
					return;
				}
				// fetch sur /users/register pour enregistrer l'utilisateur
				await fetch("/api/users/register", {
					method: "POST",
					headers: {
						"Content-Type": "application/json"
					},
					body: JSON.stringify(user),
				}).then(response => {
					if (response.ok) {
						UserHandler.fetchUser();
						dialog.remove();
					} else {
						if (response.status === 409)
							NotificationManager.notify({
								level: "error",
								title: i18nHandler.getValue("panel.registerPanel.notification.registerErrorTitle"),
								message: i18nHandler.getValue("panel.registerPanel.notification.registerCredentialTaken")
							});
						else
							NotificationManager.notify({
								level: "error",
								title: i18nHandler.getValue("panel.registerPanel.notification.registerErrorTitle"),
								message: i18nHandler.getValue("panel.registerPanel.notification.registerErrorMessage")
							});
					}
				})
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

    /*dialog.classList.add(
      "transition", "duration-300", "ease-out",
      "opacity-0", "scale-95"
    );*/
    Object.assign(dialog.style, {
      maxWidth: "400px",
      position: "relative",
      height: "auto", //s'adapte à la taille du contenu ,
      overflow: "visible",     // <-- permet au contenu de dépasser si besoin
    });

    document.body.style.overflow = "hidden";


    // --- Logique d'affichage ---
    dialog.showModal();
    requestAnimationFrame(() => {
      this.dialog!.classList.remove("opacity-0", "scale-95");
      this.dialog!.classList.add("opacity-100", "scale-100");

    });
  }
}

export const loginDialogManager = new LoginDialogManager();
