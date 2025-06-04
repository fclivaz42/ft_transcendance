// // src/background/index.ts
// import { createBackgroundElement } from "./background";

// export function createInteractiveBackground(parent: HTMLElement = document.body) {
//   const bg = createBackgroundElement();
//   parent.appendChild(bg);

//   const bubble = bg.querySelector("#interactive-bubble") as HTMLDivElement;

//   let curX = 0, curY = 0, targetX = 0, targetY = 0;

//   function animate() {
//     curX += (targetX - curX) / 20;
//     curY += (targetY - curY) / 20;
//     bubble.style.transform = `translate(${curX}px, ${curY}px)`;
//     requestAnimationFrame(animate);
//   }

//   window.addEventListener("mousemove", (e) => {
//     targetX = e.clientX;
//     targetY = e.clientY;
//   });

//   bubble.className = `
//     absolute w-full h-full 
//     bg-[radial-gradient(circle,_rgba(140,100,255,0.7)_0%,_rgba(140,100,255,0)_50%)] 
//     mix-blend-hard-light opacity-70
//   `;

//   animate();
// }
// components/background/index.ts





// import { createBackgroundElement } from "./background";

// export function createInteractiveBackground(parent: HTMLElement = document.body) {
//   const bg = createBackgroundElement();
//   parent.appendChild(bg);

//   const bubble = bg.querySelector("#interactive-bubble") as HTMLDivElement;

//   // Initialisation des positions au centre de l'écran pour un démarrage doux
//   let curX: number = window.innerWidth / 2;
//   let curY: number = window.innerHeight / 2;
//   let targetX: number = curX;
//   let targetY: number = curY;

//   // Obtenir la taille de la bulle pour la centrer
//   const bubbleSize = bubble.offsetWidth; // width et height sont les mêmes car rounded-full

//   function animate() {
//     // Easing effect: la bulle se rapproche progressivement de la cible
//     curX += (targetX - curX) / 10; // Valeur plus petite (ex: 5) pour un effet plus lent, plus grande (ex: 20) pour plus rapide
//     curY += (targetY - curY) / 10;

//     // Positionner la bulle de manière à ce que son centre suive le curseur
//     // targetX et targetY sont les coordonnées du curseur.
//     // Nous décalons la bulle de la moitié de sa taille pour la centrer.
//     bubble.style.left = `${curX - bubbleSize / 2}px`;
//     bubble.style.top = `${curY - bubbleSize / 2}px`;

//     requestAnimationFrame(animate); // Appelle la fonction à la prochaine frame d'animation
//   }

//   // Mettre à jour les coordonnées cibles quand la souris bouge
//   window.addEventListener("mousemove", (e) => {
//     targetX = e.clientX;
//     targetY = e.clientY;
//   });

//   // Gérer le redimensionnement de la fenêtre pour repositionner la bulle si besoin
//   window.addEventListener("resize", () => {
//     // Si la bulle est censée suivre le curseur, le redimensionnement n'affecte pas la cible.
//     // Cependant, si la bulle est "loin" du curseur, on peut la ramener au centre du nouvel écran
//     // si le curseur ne bouge pas. Pour l'instant, on se base sur la position du curseur.
//     // L'important est de réévaluer bubbleSize si la taille du DOM est dynamique.
//     // Ici, la taille est fixe (w-96 h-96), donc pas besoin de recalculer bubbleSize.
//   });

//   // Démarrer l'animation
//   animate();
// }


// srcs/components/background/index.ts

import { createBackgroundElement } from "./background.js"; // N'oubliez pas l'extension .js pour le navigateur

export function createInteractiveBackground(parent: HTMLElement = document.body) {
  const bg = createBackgroundElement(); // Crée l'élément de fond simplifié
  parent.appendChild(bg); // L'ajoute au parent (ici, le body)

  // TOUTE LA LOGIQUE DE BULLE ET D'ANIMATION EST SUPPRIMÉE POUR CE TEST
  // Si le titre s'affiche, c'est que le module est bien chargé et le composant de base fonctionne.
  // Cela nous permettra de réintroduire la logique étape par étape.
  console.log("createInteractiveBackground: Fond simplifié ajouté.");
}