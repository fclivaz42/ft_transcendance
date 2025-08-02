/*

*/ 

import { createHomePage } from "../components/home/index.js"; // Assurez-vous que le chemin est correct
import { i18nHandler } from "../handlers/i18nHandler.js"; // Assurez-vous que le chemin est correct

export default class HomeManager {
  private _homePageElement: HTMLElement | null = null;
  private _guestButton: HTMLButtonElement | null = null;
  private _accountButton: HTMLButtonElement | null = null;

  constructor() {
    // Ici, vous pourriez injecter d'autres managers si le HomeManager avait besoin
    // d'interagir directement avec eux pour des transitions complexes, par exemple.
  }

  /**
   * Initialise la page d'accueil, l'ajoute au DOM et attache les écouteurs d'événements.
   * @param parentElement Le HTMLElement parent auquel la page d'accueil doit être ajoutée.
   */
  public initialize(parentElement: HTMLElement) {
    if (!parentElement) {
      return;
    }

    // Récupérer les textes traduits
    const title = i18nHandler.getValue("home.title");
    const guestButtonText = i18nHandler.getValue("home.guestButton.label");
    const accountButtonText = i18nHandler.getValue("home.accountButton.label");

    // Créer l'élément de la page d'accueil
	this._homePageElement = createHomePage({
      guestButtonText, // Passe les options des boutons
      accountButtonText,
    });

    // Ajouter la page d'accueil au parentElement fourni
    parentElement.appendChild(this._homePageElement);

    // Récupérer les références des boutons pour attacher les écouteurs
    this._guestButton = this._homePageElement.querySelector("#guest-button");
    this._accountButton = this._homePageElement.querySelector("#account-button");

    // Attacher les écouteurs d'événements
    this._guestButton?.addEventListener("click", () => this._handleGuestLogin());
    this._accountButton?.addEventListener("click", () => this._handleAccountLogin());
  }

  /**
   * Gère l'action "Jouer en Guest".
   * Pour l'instant, juste un log, la logique de transition viendra ici.
   */
  private _handleGuestLogin() {
    // FUTURE: Déclencher la transition vers la page principale du jeu
    // Exemple: this.transitionToGamePage();
  }

  /**
   * Gère l'action "Utiliser un compte".
   * Pour l'instant, juste un log, la logique de transition vers le dialogue de login viendra ici.
   */
  private _handleAccountLogin() {
    // FUTURE: Ouvrir le dialogue de login
    // Exemple: this._loginDialogManager.showLoginDialog();
    // FUTURE: Déclencher la transition vers la page principale du jeu après login réussi
  }

  /**
   * Méthode pour déclencher la transition de sortie de la page d'accueil.
   * Cette méthode sera appelée par les gestionnaires de clic des boutons.
   * Elle ajoutera une classe pour animer le départ.
   */
  public hideHomePage() {
    if (this._homePageElement) {
      this._homePageElement.classList.add("-translate-y-full"); // Anime la page vers le haut
      // Optionnel: Supprimer l'élément du DOM après l'animation pour nettoyer
      // setTimeout(() => {
      //   this._homePageElement?.remove();
      //   this._homePageElement = null;
      // }, 700); // Durée de l'animation CSS
    }
  }

  /**
   * Méthode pour afficher la page d'accueil si elle a été cachée.
   * Utile si l'on veut revenir à l'accueil depuis une autre page.
   */
  public showHomePage() {
    if (this._homePageElement) {
      this._homePageElement.classList.remove("-translate-y-full");
      // S'assurer qu'elle est visible si elle avait été cachée avec 'hidden'
      this._homePageElement.classList.remove("hidden");
    }
  }
}
