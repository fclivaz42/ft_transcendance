// srcs/managers/BackgroundManager.ts

import { createInteractiveBackground } from "../components/background/index.js"; // Importe la fonction du composant

export default class BackgroundManager {
  constructor() {
    // Le constructeur est l'endroit pour initialiser les propriétés si nécessaire.
    // Pour un background simple, il n'y a peut-être pas besoin de beaucoup ici.
  }

  public initialize() {
    // C'est ici que le background est injecté et géré.
    // document.body est la cible la plus logique pour un background plein écran.
    createInteractiveBackground(document.body); 
    console.log("BackgroundManager initialized: Interactive background added to body.");
  }

  // Si vous aviez besoin de méthodes pour contrôler le background plus tard (ex: changer de couleur, activer/désactiver),
  // elles iraient ici :
  // public changeBackground(newColor: string) { /* ... */ }
}