// // export function createFrame(): HTMLElement {
// //   const frame = document.createElement("div");

// //   frame.className = "h-full w-full bg-white p-8 bg-background dark:bg-background_dark";
// //   frame.id = "frame";
// //   frame.innerHTML = `
// //     <main class="h-full w-full p-8">
// //         <div class="bg-red-200 h-full w-full">
// //         </div>
// //       </main>
// //   `;

// //   return frame;
// // }

// // 
// // srcs/components/frame/index.ts

// // La fonction createFrame est directement définie et exportée ici
// export function createFrame(): HTMLElement {
//   const frame = document.createElement("div");

//   // Les classes Tailwind pour la structure de base de la frame
//   frame.className = "h-full w-full bg-white p-8 bg-background dark:bg-background_dark relative overflow-hidden"; // Ajout de 'relative' et 'overflow-hidden' pour le positionnement interne

//   frame.id = "frame";
//   frame.innerHTML = `
//     <main class="h-full w-full p-8">
//         <div class="bg-red-200 h-full w-full">
//         </div>
//     </main>
//   `;

//   // --- Début de la logique interactive pour la div rouge interne ---
//   const interactiveElement = frame.querySelector(".bg-red-200") as HTMLDivElement;

//   if (!interactiveElement) {
//     console.warn("Interactive element (.bg-red-200) not found inside the frame. Interactive animation will not apply.");
//     return frame; // Retourne la frame sans interactivité si l'élément cible n'est pas trouvé
//   }

//   // Styles pour que l'élément interactif puisse être positionné et visible
//   interactiveElement.style.position = "absolute"; // Positionné absolument par rapport à la 'frame' (qui est relative)
//   interactiveElement.style.left = "0px";
//   interactiveElement.style.top = "0px";
//   interactiveElement.style.width = "100px";
//   interactiveElement.style.height = "100px";
//   interactiveElement.style.borderRadius = "50%"; // Rendre l'élément rond
//   interactiveElement.style.backgroundColor = "rgba(0, 255, 0, 0.5)"; // Couleur verte semi-transparente pour le test
//   interactiveElement.style.pointerEvents = "none"; // Permet de cliquer à travers l'élément pour ne pas bloquer les éléments UI
//   interactiveElement.style.transition = "transform 0.1s ease-out"; // Ajoute une transition douce

//   // Initialisation des positions au centre de l'élément parent (la frame)
//   let targetX: number = frame.offsetWidth / 2;
//   let targetY: number = frame.offsetHeight / 2;
//   let curX: number = targetX;
//   let curY: number = targetY;

//   function animate() {
//     // Effet d'amortissement (easing) pour un mouvement plus fluide
//     curX += (targetX - curX) / 10;
//     curY += (targetY - curY) / 10;

//     // Applique la transformation pour positionner et centrer l'élément
//     // Le translate(-50%, -50%) centre l'élément par rapport aux coordonnées (curX, curY)
//     interactiveElement.style.transform = `translate(${curX}px, ${curY}px) translate(-50%, -50%)`;

//     requestAnimationFrame(animate); // Rappelle la fonction pour la prochaine frame
//   }

//   // Met à jour les coordonnées cibles en fonction du mouvement de la souris sur la frame
//   frame.addEventListener("mousemove", (e) => {
//     // Récupère la position de la souris relative à la frame
//     const frameRect = frame.getBoundingClientRect();
//     targetX = e.clientX - frameRect.left;
//     targetY = e.clientY - frameRect.top;
//   });

//   // Démarrer l'animation
//   animate();
//   // --- Fin de la logique interactive ---

//   return frame; // Retourne l'élément frame avec la logique interactive appliquée
// }

// srcs/components/frame/index.t



//////////////////////1 cercle coicne a gauche
// // Importe la fonction createBackgroundElement pour créer la structure du background
// import { createBackgroundElement } from "../background/background.js";
// // Importe la fonction d'aide pour le calcul du déplacement
// import { calculateElementOffset } from "../background/interactiveLogic.js";

// export function createFrame(): HTMLElement {
//   const frame = document.createElement("div");

//   // Classes Tailwind pour la structure de base de la frame
//   // 'relative' est crucial pour contenir le background absolu et les éléments interactifs
//   frame.className = "h-full w-full bg-white p-8 bg-background dark:bg-background_dark relative overflow-hidden";
//   frame.id = "frame";

//   // --- Insertion du background interactif AVANT le contenu principal de la frame ---
//   const backgroundContainer = createBackgroundElement();
//   // Donnez-lui un z-index inférieur au contenu principal de la frame
//   backgroundContainer.style.zIndex = '0'; 
//   frame.appendChild(backgroundContainer); // Ajoutez le background au début de la frame

//   // Contenu principal de la frame (la div rouge)
//   frame.innerHTML += `
//     <main class="h-full w-full p-8 relative z-10"> <div id="frame-interactive-element" class="bg-red-200 h-full w-full"></div>
//     </main>
//   `;

//   // --- Récupération de TOUS les éléments interactifs ---
//   const frameInteractiveElement = frame.querySelector("#frame-interactive-element") as HTMLDivElement;
//   const cursorBubble = backgroundContainer.querySelector("#cursor-bubble") as HTMLDivElement;
//   const backgroundShapes: HTMLElement[] = [
//     backgroundContainer.querySelector("#shape1") as HTMLDivElement,
//     backgroundContainer.querySelector("#shape2") as HTMLDivElement,
//     backgroundContainer.querySelector("#shape3") as HTMLDivElement,
//     backgroundContainer.querySelector("#shape4") as HTMLDivElement,
//   ].filter(Boolean) as HTMLElement[];

//   // --- Vérifications et styles initiaux pour les éléments ---
//   if (!frameInteractiveElement || !cursorBubble || backgroundShapes.length === 0) {
//     console.warn("Un ou plusieurs éléments interactifs n'ont pas été trouvés. L'interactivité pourrait être limitée.");
//   }

//   // Styles pour l'élément interactif de la frame (le rond vert)
//   if (frameInteractiveElement) {
//     frameInteractiveElement.style.position = "absolute";
//     frameInteractiveElement.style.left = "0px";
//     frameInteractiveElement.style.top = "0px";
//     frameInteractiveElement.style.width = "100px";
//     frameInteractiveElement.style.height = "100px";
//     frameInteractiveElement.style.borderRadius = "50%";
//     frameInteractiveElement.style.backgroundColor = "rgba(0, 255, 0, 0.5)"; // Vert semi-transparent
//     frameInteractiveElement.style.pointerEvents = "none";
//     frameInteractiveElement.style.transform = `translate(-50%, -50%)`; // Centrer le rond
//     frameInteractiveElement.style.transition = "transform 0.1s ease-out";
//   }

//   // --- Préparation des données pour tous les éléments réactifs ---
//   const allReactiveElements: { element: HTMLElement, parent: HTMLElement, factor: number }[] = [];

//   // Ajout de l'élément interactif de la frame
//   if (frameInteractiveElement && frameInteractiveElement.parentElement) {
//     allReactiveElements.push({
//       element: frameInteractiveElement,
//       parent: frameInteractiveElement.parentElement, // Le parent est la main div
//       factor: 0.3 // Facteur de réaction pour la bulle verte de la frame
//     });
//   }

//   // Ajout des formes de l'arrière-plan
//   backgroundShapes.forEach((shape, index) => {
//     if (shape.parentElement) {
//       allReactiveElements.push({
//         element: shape,
//         parent: shape.parentElement, // Le parent est backgroundContainer
//         factor: (index + 1) * 0.04 + 0.1 // Facteurs pour les formes du background
//       });
//     }
//   });

//   // --- Logique d'animation unifiée pour tous les éléments ---
//   let targetX: number = window.innerWidth / 2; // Position cible du curseur (globale)
//   let targetY: number = window.innerHeight / 2;
//   let currentBubbleX: number = targetX; // Position actuelle de la bulle du curseur
//   let currentBubbleY: number = targetY;

//   const bubbleSize = cursorBubble ? cursorBubble.offsetWidth : 0; // Taille de la bulle pour le centrage

//   function animate() {
//     // Mouvement de la bulle du curseur
//     currentBubbleX += (targetX - currentBubbleX) / 8;
//     currentBubbleY += (targetY - currentBubbleY) / 8;
//     if (cursorBubble) {
//       // Récupérer la position du conteneur du background
//       const backgroundContainerRect = backgroundContainer.getBoundingClientRect();
      
//       // Convertir les coordonnées globales du curseur en coordonnées relatives au backgroundContainer
//       const relativeX = currentBubbleX - backgroundContainerRect.left;
//       const relativeY = currentBubbleY - backgroundContainerRect.top;

//       // Positionner la bulle du curseur, en la centrant sur les coordonnées relatives
//       cursorBubble.style.transform = `translate(${relativeX - bubbleSize / 2}px, ${relativeY - bubbleSize / 2}px)`;
//     }


//     // Mouvement de toutes les autres formes réactives
//     allReactiveElements.forEach(data => {
//       const { element, parent, factor } = data;
//       const elementRect = element.getBoundingClientRect();
//       const parentRect = parent.getBoundingClientRect();

//       // Calculer l'offset de l'élément par rapport au curseur
//       const { offsetX, offsetY } = calculateElementOffset(
//         elementRect,
//         parentRect,
//         currentBubbleX, // Utilisez la position lissée de la bulle comme référence
//         currentBubbleY,
//         factor
//       );

//       // Appliquer la transformation. Nous devons tenir compte de la position initiale CSS/inline.
//       // Cette transformation est relative à la position de base de l'élément.
//       element.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
//     });

//     requestAnimationFrame(animate);
//   }

//   // Écouteur d'événement de la souris sur la fenêtre pour capturer les coordonnées globales
//   window.addEventListener("mousemove", (e) => {
//     targetX = e.clientX;
//     targetY = e.clientY;
//   });

//   // Écouteur de redimensionnement de la fenêtre
//   window.addEventListener("resize", () => {
//     // Réinitialiser les positions cibles
//     targetX = window.innerWidth / 2;
//     targetY = window.innerHeight / 2;
//     currentBubbleX = targetX;
//     currentBubbleY = targetY; // Pour éviter un "saut" au redimensionnement
//   });

//   // Démarrer l'animation
//   animate();

//   console.log("Frame with integrated interactive background initialized.");

//   return frame; // Retourne l'élément frame complet
// }


// srcs/components/frame/index.ts
//////////////////////////////////////////////cercle test
// export function createFrame(): HTMLElement {
//   const frame = document.createElement("div");

//   frame.className = "h-full w-full bg-white p-8 bg-background dark:bg-background_dark relative overflow-hidden";

//   frame.id = "frame";
//   frame.innerHTML = `
//     <main class="h-full w-full p-8">
//         <div id="interactive-circle-fast" class="h-full w-full"></div>
//         <div id="interactive-circle-slow" class="h-full w-full"></div>
//         <div id="interactive-circle-very-slow" class="h-full w-full"></div>
//         <div id="interactive-circle-extra-slow" class="h-full w-full"></div>
//     </main>
//   `;

//   // --- Récupération des éléments interactifs ---
//   const fastCircle = frame.querySelector("#interactive-circle-fast") as HTMLDivElement;
//   const slowCircle = frame.querySelector("#interactive-circle-slow") as HTMLDivElement;
//   const verySlowCircle = frame.querySelector("#interactive-circle-very-slow") as HTMLDivElement;
//   const extraSlowCircle = frame.querySelector("#interactive-circle-extra-slow") as HTMLDivElement; // NOUVEAU !

//   if (!fastCircle || !slowCircle || !verySlowCircle || !extraSlowCircle) { // Vérification du nouveau cercle
//     console.warn("Un ou plusieurs cercles interactifs n'ont pas été trouvés. L'animation pourrait être limitée.");
//     return frame;
//   }

//   // --- Styles pour les éléments interactifs ---
//   // Styles pour le cercle rapide (ton bleu clair) proceh du curseur
//   fastCircle.style.position = "absolute";
//   fastCircle.style.left = "0px";
//   fastCircle.style.top = "0px";
//   fastCircle.style.width = "100px";
//   fastCircle.style.height = "100px";
//   fastCircle.style.borderRadius = "50%";
//   fastCircle.style.backgroundColor = "rgba(100, 100, 255, 0.6)"; // Bleu plus clair
//   fastCircle.style.pointerEvents = "none";
//   fastCircle.style.transform = `translate(-50%, -50%)`;
//   fastCircle.style.filter = "blur(60px)"; // Léger flou

//   // Styles pour le cercle lent (ton bleu moyen)
//   slowCircle.style.position = "absolute";
//   slowCircle.style.left = "0px";
//   slowCircle.style.top = "0px";
//   slowCircle.style.width = "300px";
//   slowCircle.style.height = "300px";
//   slowCircle.style.borderRadius = "50%";
//   slowCircle.style.backgroundColor = "rgba(120, 0, 180, 0.4)"; // Bleu moyen, nouveau petit violet
//   slowCircle.style.pointerEvents = "none";
//   slowCircle.style.transform = `translate(-50%, -50%)`;
//   slowCircle.style.filter = "blur(20px)"; // Flou moyen

//   // Styles pour le TRÈS lent (ton violet profond)
//   verySlowCircle.style.position = "absolute";
//   verySlowCircle.style.left = "0px";
//   verySlowCircle.style.top = "0px";
//   verySlowCircle.style.width = "400px";
//   verySlowCircle.style.height = "400px";
//   verySlowCircle.style.borderRadius = "50%";
//   verySlowCircle.style.backgroundColor = "rgba(120, 0, 180, 0.4)"; // Violet profond
//   verySlowCircle.style.pointerEvents = "none";
//   verySlowCircle.style.transform = `translate(-50%, -50%)`;
//   verySlowCircle.style.filter = "blur(20px)"; // Flou plus prononcé

//   // Styles pour l'EXTRA lent (ton bleu très clair et transparent) -- NOUVEAU !
//   extraSlowCircle.style.position = "absolute";
//   extraSlowCircle.style.left = "0px";
//   extraSlowCircle.style.top = "0px";
//   extraSlowCircle.style.width = "600px"; // Encore plus grand !
//   extraSlowCircle.style.height = "600px"; // Encore plus grand !
//   extraSlowCircle.style.borderRadius = "50%";
//   extraSlowCircle.style.backgroundColor = "rgba(150, 150, 255, 0.1)"; // Bleu très clair, très transparent
//   extraSlowCircle.style.pointerEvents = "none";
//   extraSlowCircle.style.transform = `translate(-50%, -50%)`;
//   extraSlowCircle.style.filter = "blur(60px)"; // Flou très prononcé

//   // --- Initialisation des positions et vitesses ---
//   // Valeurs plus petites (ex: 5) = plus rapide, Valeurs plus grandes (ex: 20) = plus lent
//   let targetX: number = window.innerWidth / 2; // Position cible du curseur (globale)
//   let targetY: number = window.innerHeight / 2;

//   // Pour le cercle rapide
//   let fastCurX: number = targetX;
//   let fastCurY: number = targetY;
//   const fastSpeed = 10;

//   // Pour le cercle lent
//   let slowCurX: number = targetX;
//   let slowCurY: number = targetY;
//   const slowSpeed = 60;

//   // Pour le TRÈS lent
//   let verySlowCurX: number = targetX;
//   let verySlowCurY: number = targetY;
//   const verySlowSpeed = 150;

//   // Pour l'EXTRA lent -- NOUVEAU !
//   let extraSlowCurX: number = targetX;
//   let extraSlowCurY: number = 50;
//   const extraSlowSpeed = 800; // Encore plus lent ! (ajustez si besoin)

//   function animate() {
//     const frameRect = frame.getBoundingClientRect();

//     // --- Animation pour le cercle rapide ---
//     const fastTargetRelativeX = targetX - frameRect.left;
//     const fastTargetRelativeY = targetY - frameRect.top;
//     fastCurX += (fastTargetRelativeX - fastCurX) / fastSpeed;
//     fastCurY += (fastTargetRelativeY - fastCurY) / fastSpeed;
//     fastCircle.style.transform = `translate(${fastCurX}px, ${fastCurY}px) translate(-50%, -50%)`;

//     // --- Animation pour le cercle lent ---
//     const slowTargetRelativeX = targetX - frameRect.left;
//     const slowTargetRelativeY = targetY - frameRect.top;
//     slowCurX += (slowTargetRelativeX - slowCurX) / slowSpeed;
//     slowCurY += (slowTargetRelativeY - slowCurY) / slowSpeed;
//     slowCircle.style.transform = `translate(${slowCurX}px, ${slowCurY}px) translate(-50%, -50%)`;

//     // --- Animation pour le TRÈS lent ---
//     const verySlowTargetRelativeX = targetX - frameRect.left;
//     const verySlowTargetRelativeY = targetY - frameRect.top;
//     verySlowCurX += (verySlowTargetRelativeX - verySlowCurX) / verySlowSpeed;
//     verySlowCurY += (verySlowTargetRelativeY - verySlowCurY) / verySlowSpeed;
//     verySlowCircle.style.transform = `translate(${verySlowCurX}px, ${verySlowCurY}px) translate(-50%, -50%)`;

//     // --- Animation pour l'EXTRA lent -- NOUVEAU ! ---
//     const extraSlowTargetRelativeX = targetX - frameRect.left;
//     const extraSlowTargetRelativeY = targetY - frameRect.top;
//     extraSlowCurX += (extraSlowTargetRelativeX - extraSlowCurX) / extraSlowSpeed;
//     extraSlowCurY += (extraSlowTargetRelativeY - extraSlowCurY) / extraSlowSpeed;
//     extraSlowCircle.style.transform = `translate(${extraSlowCurX}px, ${extraSlowCurY}px) translate(-50%, -50%)`;

//     requestAnimationFrame(animate);
//   }

//   // Met à jour les coordonnées cibles quand la souris bouge (écouteur global sur window)
//   window.addEventListener("mousemove", (e) => {
//     targetX = e.clientX;
//     targetY = e.clientY;
//   });

//   // Gérer le redimensionnement de la fenêtre
//   window.addEventListener("resize", () => {
//     targetX = window.innerWidth / 2;
//     targetY = window.innerHeight / 2;
//     const currentFrameLeft = frame.getBoundingClientRect().left;
//     const currentFrameTop = frame.getBoundingClientRect().top;

//     fastCurX = targetX - currentFrameLeft;
//     fastCurY = targetY - currentFrameTop;
//     slowCurX = targetX - currentFrameLeft;
//     slowCurY = targetY - currentFrameTop;
//     verySlowCurX = targetX - currentFrameLeft;
//     verySlowCurY = targetY - currentFrameTop;
//     extraSlowCurX = targetX - currentFrameLeft; // Nouveau !
//     extraSlowCurY = targetY - currentFrameTop; // Nouveau !
//   });

//   // Démarrer l'animation
//   animate();

//   return frame;
// }
///////////////////////////je kiiiiiiif effet halo
// export function createFrame(): HTMLElement {
//   const frame = document.createElement("div");

//   frame.className = "h-full w-full bg-white p-8 bg-background dark:bg-background_dark relative overflow-hidden";
//   frame.id = "frame";

//   // --- 1. Ajout de DIVs pour les nouvelles sphères dans le HTML interne ---
//   frame.innerHTML = `
//     <main class="h-full w-full p-8">
//         <div id="interactive-circle-fast"></div>       <div id="blob-medium-1"></div>                  <div id="blob-slow-2"></div>                    <div id="blob-very-slow-3"></div>               <div id="blob-extra-slow-4"></div>              <div id="blob-giant-5"></div>                   </main>
//   `;

//   // --- 2. Récupération de TOUS les éléments interactifs (anciens et nouveaux) ---
//   const fastCircle = frame.querySelector("#interactive-circle-fast") as HTMLDivElement;
//   const blobMedium1 = frame.querySelector("#blob-medium-1") as HTMLDivElement;
//   const blobSlow2 = frame.querySelector("#blob-slow-2") as HTMLDivElement;
//   const blobVerySlow3 = frame.querySelector("#blob-very-slow-3") as HTMLDivElement;
//   const blobExtraSlow4 = frame.querySelector("#blob-extra-slow-4") as HTMLDivElement;
//   const blobGiant5 = frame.querySelector("#blob-giant-5") as HTMLDivElement; // Nouvelle sphère

//   // Vérification de la présence de toutes les sphères
//   if (!fastCircle || !blobMedium1 || !blobSlow2 || !blobVerySlow3 || !blobExtraSlow4 || !blobGiant5) {
//     console.warn("Un ou plusieurs cercles interactifs n'ont pas été trouvés. L'animation pourrait être limitée.");
//     return frame;
//   }

//   // --- 3. Styles et Caractéristiques pour chaque sphère (Couleurs, Tailles, Flou, Mode de fusion) ---
//   // Couleurs basées sur le code de référence : (R, G, B, Opacité)
//   // Mode de fusion : hard-light (donne un effet lumineux et mélange les couleurs)

//   // Sphère principale (Fast Circle) - proche du curseur
//   fastCircle.style.position = "absolute";
//   fastCircle.style.left = "0px";
//   fastCircle.style.top = "0px";
//   fastCircle.style.width = "150px"; // Taille augmentée pour plus de présence
//   fastCircle.style.height = "150px";
//   fastCircle.style.borderRadius = "50%";
//   fastCircle.style.backgroundColor = "rgba(140, 100, 255, 0.8)"; // Couleuer interactive (violet/bleu)
//   fastCircle.style.pointerEvents = "none";
//   fastCircle.style.transform = `translate(-50%, -50%)`;
//   fastCircle.style.filter = "blur(40px)"; // Flou doux
//   fastCircle.style.mixBlendMode = "hard-light"; // Mode de fusion clé pour l'effet lave

//   // Nouvelle Sphère 1 (Blob Medium 1) - basée sur --color1
//   blobMedium1.style.position = "absolute";
//   blobMedium1.style.left = "0px";
//   blobMedium1.style.top = "0px";
//   blobMedium1.style.width = "300px";
//   blobMedium1.style.height = "300px";
//   blobMedium1.style.borderRadius = "50%";
//   blobMedium1.style.backgroundColor = "rgba(18, 113, 255, 0.7)"; // Couleur bleu vif
//   blobMedium1.style.pointerEvents = "none";
//   blobMedium1.style.transform = `translate(-50%, -50%)`;
//   blobMedium1.style.filter = "blur(30px)"; // Flou moyen
//   blobMedium1.style.mixBlendMode = "hard-light";

//   // Nouvelle Sphère 2 (Blob Slow 2) - basée sur --color2
//   blobSlow2.style.position = "absolute";
//   blobSlow2.style.left = "0px";
//   blobSlow2.style.top = "0px";
//   blobSlow2.style.width = "450px"; // Taille plus grande
//   blobSlow2.style.height = "450px";
//   blobSlow2.style.borderRadius = "50%";
//   blobSlow2.style.backgroundColor = "rgba(221, 74, 255, 0.6)"; // Couleur rose/violet
//   blobSlow2.style.pointerEvents = "none";
//   blobSlow2.style.transform = `translate(-50%, -50%)`;
//   blobSlow2.style.filter = "blur(50px)"; // Flou plus prononcé
//   blobSlow2.style.mixBlendMode = "hard-light";

//   // Ancienne Very Slow Circle (Blob Very Slow 3) - basée sur --color3
//   blobVerySlow3.style.position = "absolute";
//   blobVerySlow3.style.left = "0px";
//   blobVerySlow3.style.top = "0px";
//   blobVerySlow3.style.width = "250px"; // Taille ajustée pour être distincte
//   blobVerySlow3.style.height = "250px";
//   blobVerySlow3.style.borderRadius = "50%";
//   blobVerySlow3.style.backgroundColor = "rgba(100, 220, 255, 0.6)"; // Couleur cyan/bleu clair
//   blobVerySlow3.style.pointerEvents = "none";
//   blobVerySlow3.style.transform = `translate(-50%, -50%)`;
//   blobVerySlow3.style.filter = "blur(25px)"; // Flou doux
//   blobVerySlow3.style.mixBlendMode = "hard-light";

//   // Ancienne Extra Slow Circle (Blob Extra Slow 4) - basée sur --color4
//   blobExtraSlow4.style.position = "absolute";
//   blobExtraSlow4.style.left = "0px";
//   blobExtraSlow4.style.top = "0px";
//   blobExtraSlow4.style.width = "350px"; // Taille ajustée
//   blobExtraSlow4.style.height = "350px";
//   blobExtraSlow4.style.borderRadius = "50%";
//   blobExtraSlow4.style.backgroundColor = "rgba(200, 50, 50, 0.7)"; // Couleur rouge
//   blobExtraSlow4.style.pointerEvents = "none";
//   blobExtraSlow4.style.transform = `translate(-50%, -50%)`;
//   blobExtraSlow4.style.filter = "blur(40px)"; // Flou moyen
//   blobExtraSlow4.style.mixBlendMode = "hard-light";

//   // Nouvelle Sphère 5 (Blob Giant 5) - basée sur --color5
//   blobGiant5.style.position = "absolute";
//   blobGiant5.style.left = "0px";
//   blobGiant5.style.top = "0px";
//   blobGiant5.style.width = "600px"; // Très grande
//   blobGiant5.style.height = "600px";
//   blobGiant5.style.borderRadius = "50%";
//   blobGiant5.style.backgroundColor = "rgba(180, 180, 50, 0.5)"; // Couleur jaune/vert
//   blobGiant5.style.pointerEvents = "none";
//   blobGiant5.style.transform = `translate(-50%, -50%)`;
//   blobGiant5.style.filter = "blur(70px)"; // Flou très prononcé
//   blobGiant5.style.mixBlendMode = "hard-light";

//   // --- 4. Initialisation des positions et vitesses pour TOUTES les sphères ---
//   // Valeurs plus petites = plus rapide; Valeurs plus grandes = plus lent
//   let targetX: number = window.innerWidth / 2; // Position cible du curseur (globale)
//   let targetY: number = window.innerHeight / 2;

//   // Pour le cercle rapide
//   let fastCurX: number = targetX;
//   let fastCurY: number = targetY;
//   const fastSpeed = 10; // Très rapide

//   // Pour Blob Medium 1
//   let blobMedium1CurX: number = targetX;
//   let blobMedium1CurY: number = targetY;
//   const blobMedium1Speed = 30; // Moyenne

//   // Pour Blob Slow 2
//   let blobSlow2CurX: number = targetX;
//   let blobSlow2CurY: number = targetY;
//   const blobSlow2Speed = 70; // Lente

//   // Pour Blob Very Slow 3
//   let blobVerySlow3CurX: number = targetX;
//   let blobVerySlow3CurY: number = targetY;
//   const blobVerySlow3Speed = 45; // Entre moyenne et lente

//   // Pour Blob Extra Slow 4
//   let blobExtraSlow4CurX: number = targetX;
//   let blobExtraSlow4CurY: number = targetY;
//   const blobExtraSlow4Speed = 90; // Très lente

//   // Pour Blob Giant 5
//   let blobGiant5CurX: number = targetX;
//   let blobGiant5CurY: number = targetY;
//   const blobGiant5Speed = 120; // Extrêmement lente

//   // --- 5. La logique d'animation (mise à jour pour toutes les sphères) ---
//   function animate() {
//     const frameRect = frame.getBoundingClientRect();

//     // Calculs de position relative à la frame pour chaque sphère
//     // (targetX/Y sont les coordonnées absolues de la souris)

//     // Fast Circle
//     const fastTargetRelativeX = targetX - frameRect.left;
//     const fastTargetRelativeY = targetY - frameRect.top;
//     fastCurX += (fastTargetRelativeX - fastCurX) / fastSpeed;
//     fastCurY += (fastTargetRelativeY - fastCurY) / fastSpeed;
//     fastCircle.style.transform = `translate(${fastCurX}px, ${fastCurY}px) translate(-50%, -50%)`;

//     // Blob Medium 1
//     const blobMedium1TargetRelativeX = targetX - frameRect.left;
//     const blobMedium1TargetRelativeY = targetY - frameRect.top;
//     blobMedium1CurX += (blobMedium1TargetRelativeX - blobMedium1CurX) / blobMedium1Speed;
//     blobMedium1CurY += (blobMedium1TargetRelativeY - blobMedium1CurY) / blobMedium1Speed;
//     blobMedium1.style.transform = `translate(${blobMedium1CurX}px, ${blobMedium1CurY}px) translate(-50%, -50%)`;

//     // Blob Slow 2
//     const blobSlow2TargetRelativeX = targetX - frameRect.left;
//     const blobSlow2TargetRelativeY = targetY - frameRect.top;
//     blobSlow2CurX += (blobSlow2TargetRelativeX - blobSlow2CurX) / blobSlow2Speed;
//     blobSlow2CurY += (blobSlow2TargetRelativeY - blobSlow2CurY) / blobSlow2Speed;
//     blobSlow2.style.transform = `translate(${blobSlow2CurX}px, ${blobSlow2CurY}px) translate(-50%, -50%)`;

//     // Blob Very Slow 3
//     const blobVerySlow3TargetRelativeX = targetX - frameRect.left;
//     const blobVerySlow3TargetRelativeY = targetY - frameRect.top;
//     blobVerySlow3CurX += (blobVerySlow3TargetRelativeX - blobVerySlow3CurX) / blobVerySlow3Speed;
//     blobVerySlow3CurY += (blobVerySlow3TargetRelativeY - blobVerySlow3CurY) / blobVerySlow3Speed;
//     blobVerySlow3.style.transform = `translate(${blobVerySlow3CurX}px, ${blobVerySlow3CurY}px) translate(-50%, -50%)`;

//     // Blob Extra Slow 4
//     const blobExtraSlow4TargetRelativeX = targetX - frameRect.left;
//     const blobExtraSlow4TargetRelativeY = targetY - frameRect.top;
//     blobExtraSlow4CurX += (blobExtraSlow4TargetRelativeX - blobExtraSlow4CurX) / blobExtraSlow4Speed;
//     blobExtraSlow4CurY += (blobExtraSlow4TargetRelativeY - blobExtraSlow4CurY) / blobExtraSlow4Speed;
//     blobExtraSlow4.style.transform = `translate(${blobExtraSlow4CurX}px, ${blobExtraSlow4CurY}px) translate(-50%, -50%)`;

//     // Blob Giant 5
//     const blobGiant5TargetRelativeX = targetX - frameRect.left;
//     const blobGiant5TargetRelativeY = targetY - frameRect.top;
//     blobGiant5CurX += (blobGiant5TargetRelativeX - blobGiant5CurX) / blobGiant5Speed;
//     blobGiant5CurY += (blobGiant5TargetRelativeY - blobGiant5CurY) / blobGiant5Speed;
//     blobGiant5.style.transform = `translate(${blobGiant5CurX}px, ${blobGiant5CurY}px) translate(-50%, -50%)`;


//     requestAnimationFrame(animate);
//   }

//   // --- 6. Mise à jour des positions cibles au mouvement de la souris et redimensionnement ---
//   window.addEventListener("mousemove", (e) => {
//     targetX = e.clientX;
//     targetY = e.clientY;
//   });

//   window.addEventListener("resize", () => {
//     targetX = window.innerWidth / 2;
//     targetY = window.innerHeight / 2;
//     const currentFrameLeft = frame.getBoundingClientRect().left;
//     const currentFrameTop = frame.getBoundingClientRect().top;

//     // Réinitialisation des positions courantes pour toutes les sphères après redimensionnement
//     fastCurX = targetX - currentFrameLeft;
//     fastCurY = targetY - currentFrameTop;
//     blobMedium1CurX = targetX - currentFrameLeft;
//     blobMedium1CurY = targetY - currentFrameTop;
//     blobSlow2CurX = targetX - currentFrameLeft;
//     blobSlow2CurY = targetY; // Correction: should be targetY - currentFrameTop
//     blobVerySlow3CurX = targetX - currentFrameLeft;
//     blobVerySlow3CurY = targetY - currentFrameTop;
//     blobExtraSlow4CurX = targetX - currentFrameLeft;
//     blobExtraSlow4CurY = targetY - currentFrameTop;
//     blobGiant5CurX = targetX - currentFrameLeft;
//     blobGiant5CurY = targetY - currentFrameTop;
//   });

//   // Démarrer l'animation
//   animate();

//   return frame;
// }

// 
type BaseBlob = {
  id: string
  element: HTMLDivElement | null
  currentX: number
  currentY: number
  isAttracted: boolean
  attractionSpeed: number
  animPhase: number
  baseX: number
  baseY: number
}

type VerticalBlob = BaseBlob & {
  animType: 'vertical'
  animAmplitude: number
  animSpeed: number
}

type HorizontalBlob = BaseBlob & {
  animType: 'horizontal'
  animAmplitude: number
  animSpeed: number
}

type CircularBlob = BaseBlob & {
  animType: 'circle'
  animRadius: number
  animSpeed: number
}

type BlobData = VerticalBlob | HorizontalBlob | CircularBlob



export function createFrame(): HTMLElement {
  const frame = document.createElement("div");

  frame.className = "fixed top-0 left-0 w-screen h-screen overflow-hidden bg-gradient-to-br from-[rgb(108,0,162)] to-[rgb(0,17,82)]";
  frame.id = "frame";

  frame.innerHTML = `
    <div class="blur-[40px] w-full h-full">

        <div id="blob-bg-1" class="absolute
                    w-[800px] h-[800px] rounded-full
                    mix-blend-hard-light opacity-100
                    bg-[radial-gradient(circle_at_center,_rgba(18,_113,_255,_0.8)_0,_rgba(18,_113,_255,_0)_50%)]">
        </div>

        <div id="blob-bg-2" class="absolute
                    w-[800px] h-[800px] rounded-full
                    mix-blend-hard-light opacity-100
                    bg-[radial-gradient(circle_at_center,_rgba(221,_74,_255,_0.8)_0,_rgba(221,_74,_255,_0)_50%)]">
        </div>

        <div id="blob-bg-3" class="absolute
                    w-[800px] h-[800px] rounded-full
                    mix-blend-hard-light opacity-100
                    bg-[radial-gradient(circle_at_center,_rgba(100,_220,_255,_0.8)_0,_rgba(100,_220,_255,_0)_50%)]">
        </div>

        <div id="blob-bg-4" class="absolute
                    w-[800px] h-[800px] rounded-full
                    mix-blend-hard-light opacity-70
                    bg-[radial-gradient(circle_at_center,_rgba(200,_50,_50,_0.7)_0,_rgba(200,_50,_50,_0)_50%)]">
        </div>

        <div id="blob-bg-5" class="absolute
                    w-[1600px] h-[1600px] rounded-full
                    mix-blend-hard-light opacity-100
                    bg-[radial-gradient(circle_at_center,_rgba(180,_180,_50,_0.8)_0,_rgba(180,_180,_50,_0)_50%)]">
        </div>

        <div id="interactive-blob" class="absolute
                    w-[200px] h-[200px] rounded-full
                    mix-blend-hard-light opacity-70
                    bg-[radial-gradient(circle_at_center,_rgba(140,_100,_255,_0.8)_0,_rgba(140,_100,_255,_0)_50%)]
                    pointer-events-none
                    z-50">
        </div>

    </div>
  `;

  const interactiveBlob = frame.querySelector("#interactive-blob") as HTMLDivElement;

  // --- NOUVEAU : Sélection et préparation des blobs de fond (maintenant gérés par JS) ---
  // Chaque blob a ses propres paramètres d'animation JS
  const backgroundBlobsData = [
    {
      id: "blob-bg-1", element: null as HTMLDivElement | null,
      currentX: 0, currentY: 0, // Position JS actuelle
      isAttracted: false, attractionSpeed: 30, // Paramètres d'attraction
      // Paramètres d'animation JS : Vertical
      animType: 'vertical', animAmplitude: 200, animSpeed: 0.0005, animPhase: 0,
      baseX: 0.25 * window.innerWidth, baseY: 0.5 * window.innerHeight // Point central pour l'animation
    },
    {
      id: "blob-bg-2", element: null as HTMLDivElement | null,
      currentX: 0, currentY: 0,
      isAttracted: false, attractionSpeed: 40,
      // Paramètres d'animation JS : Circulaire
      animType: 'circle', animRadius: 250, animSpeed: 0.0003, animPhase: Math.PI / 2,
      baseX: 0.7 * window.innerWidth, baseY: 0.3 * window.innerHeight
    },
    {
      id: "blob-bg-3", element: null as HTMLDivElement| null,
      currentX: 0, currentY: 0,
      isAttracted: false, attractionSpeed: 35,
      // Paramètres d'animation JS : Circulaire (lent)
      animType: 'circle', animRadius: 300, animSpeed: 0.0002, animPhase: Math.PI,
      baseX: 0.3 * window.innerWidth, baseY: 0.7 * window.innerHeight
    },
    {
      id: "blob-bg-4", element: null as HTMLDivElement | null,
      currentX: 0, currentY: 0,
      isAttracted: false, attractionSpeed: 50,
      // Paramètres d'animation JS : Horizontal
      animType: 'horizontal', animAmplitude: 150, animSpeed: 0.0004, animPhase: Math.PI / 4,
      baseX: 0.6 * window.innerWidth, baseY: 0.8 * window.innerHeight
    },
    {
      id: "blob-bg-5", element: null as HTMLDivElement | null,
      currentX: 0, currentY: 0,
      isAttracted: false, attractionSpeed: 60,
      // Paramètres d'animation JS : Circulaire (très grand)
      animType: 'circle', animRadius: 400, animSpeed: 0.00015, animPhase: 0,
      baseX: 0.5 * window.innerWidth, baseY: 0.5 * window.innerHeight
    }
  ];

  backgroundBlobsData.forEach(blob => {
    blob.element = frame.querySelector(`#${blob.id}`) as HTMLDivElement;
    if (!blob.element) {
      console.warn(`Blob with ID ${blob.id} not found.`);
      return;
    }
    // Initialiser la position JS du blob à son point de base (avant l'animation)
    const frameRect = frame.getBoundingClientRect();
    blob.currentX = blob.baseX - frameRect.left;
    blob.currentY = blob.baseY - frameRect.top;
  });
  // --- FIN NOUVEAU ---

  if (!interactiveBlob) {
    console.warn("La sphère interactive n'a pas été trouvée. L'animation du curseur sera absente.");
    return frame;
  }

  // --- Paramètre pour l'attraction ---
  const ATTRACTION_RADIUS = 250; // Rayon en pixels autour du curseur pour déclencher l'attraction
  const GLIDE_BACK_SPEED = 20; // Vitesse de glissement vers le chemin programmé

  // --- LOGIQUE JS POUR LA SPHÈRE INTERACTIVE (CURSEUR) ---
  interactiveBlob.style.transform = "translate(-50%, -50%)"; // Initialisation du transform de base

  let targetX: number = window.innerWidth / 2;
  let targetY: number = window.innerHeight / 2;

  let currentX: number;
  let currentY: number;

  const initialFrameRect = frame.getBoundingClientRect();
  currentX = targetX - initialFrameRect.left;
  currentY = targetY - initialFrameRect.top;

  const interactiveBlobSpeed = 10; // Vitesse de suivi du curseur pour le blob interactif

  let lastTime = 0; // Pour calculer le deltaTime pour les animations JS

  function animate(time: DOMHighResTimeStamp) {
    if (!lastTime) lastTime = time;
    const deltaTime = time - lastTime;
    lastTime = time;

    const frameRect = frame.getBoundingClientRect();
    const targetRelativeX = targetX - frameRect.left;
    const targetRelativeY = targetY - frameRect.top;

    // --- Animation pour la sphère interactive (curseur) ---
    currentX += (targetRelativeX - currentX) / interactiveBlobSpeed;
    currentY += (targetRelativeY - currentY) / interactiveBlobSpeed;
    interactiveBlob.style.transform = `translate(${currentX}px, ${currentY}px) translate(-50%, -50%)`;

    // --- NOUVEAU : Logique de mouvement programmé et d'attraction pour les blobs de fond ---
    backgroundBlobsData.forEach(blob => {
      if (!blob.element) return;

      // 1. Calculer la position "programmée" du blob en JS
      let programmedX: number;
      let programmedY: number;

      const timeFactor = time * blob.animSpeed; // Utilise le temps pour faire avancer l'animation

      // switch (blob.animType) {
      //   case 'vertical':
      //     programmedX = blob.baseX - frameRect.left;
      //     programmedY = blob.baseY + Math.sin(timeFactor + blob.animPhase) * blob.animAmplitude - frameRect.top;
      //     break;
      //   case 'horizontal':
      //     programmedX = blob.baseX + Math.sin(timeFactor + blob.animPhase) * blob.animAmplitude - frameRect.left;
      //     programmedY = blob.baseY - frameRect.top;
      //     break;
      //   case 'circle':
      //     programmedX = blob.baseX + Math.cos(timeFactor + blob.animPhase) * blob.animRadius - frameRect.left;
      //     programmedY = blob.baseY + Math.sin(timeFactor + blob.animPhase) * blob.animRadius - frameRect.top;
      //     break;
      //   default:
      //     programmedX = blob.baseX - frameRect.left;
      //     programmedY = blob.baseY - frameRect.top;
      // }
      switch (blob.animType) {
        case 'vertical': {
          const b = blob as VerticalBlob;
          programmedX = b.baseX - frameRect.left;
          programmedY = b.baseY + Math.sin(timeFactor + b.animPhase) * b.animAmplitude - frameRect.top;
          break;
        }
        case 'horizontal': {
          const b = blob as HorizontalBlob;
          programmedX = b.baseX + Math.sin(timeFactor + b.animPhase) * b.animAmplitude - frameRect.left;
          programmedY = b.baseY - frameRect.top;
          break;
        }
        case 'circle': {
          const b = blob as CircularBlob;
          programmedX = b.baseX + Math.cos(timeFactor + b.animPhase) * b.animRadius - frameRect.left;
          programmedY = b.baseY + Math.sin(timeFactor + b.animPhase) * b.animRadius - frameRect.top;
          break;
        }
        default:
          programmedX = blob.baseX - frameRect.left;
          programmedY = blob.baseY - frameRect.top;
      }
      
      // 2. Vérifier la distance au curseur
      const blobCenterX = (blob.element.getBoundingClientRect().left + blob.element.getBoundingClientRect().width / 2) - frameRect.left;
      const blobCenterY = (blob.element.getBoundingClientRect().top + blob.element.getBoundingClientRect().height / 2) - frameRect.top;

      const distance = Math.sqrt(
        Math.pow(targetRelativeX - blobCenterX, 2) +
        Math.pow(targetRelativeY - blobCenterY, 2)
      );

      // 3. Appliquer l'attraction ou le retour au chemin programmé
      if (distance < ATTRACTION_RADIUS) {
        // Le curseur est proche : Attirer le blob
        if (!blob.isAttracted) {
          // Si le blob commence à être attiré, initialiser sa position JS à sa position visuelle actuelle
          blob.isAttracted = true;
          blob.currentX = blobCenterX;
          blob.currentY = blobCenterY;
        }
        blob.currentX += (targetRelativeX - blob.currentX) / blob.attractionSpeed;
        blob.currentY += (targetRelativeY - blob.currentY) / blob.attractionSpeed;

      } else {
        // Le curseur est trop loin : Revenir au chemin programmé
        if (blob.isAttracted) {
          blob.isAttracted = false; // Le blob n'est plus attiré
        }
        // Glisser doucement vers la position programmée
        blob.currentX += (programmedX - blob.currentX) / GLIDE_BACK_SPEED;
        blob.currentY += (programmedY - blob.currentY) / GLIDE_BACK_SPEED;
      }

      // 4. Appliquer la transformation finale
      blob.element.style.transform = `translate(${blob.currentX}px, ${blob.currentY}px) translate(-50%, -50%)`;
    });
    // --- FIN NOUVEAU ---

    requestAnimationFrame(animate);
  }

  window.addEventListener("mousemove", (e) => {
    targetX = e.clientX;
    targetY = e.clientY;
  });

  window.addEventListener("resize", () => {
    // Recalcule les positions de base des blobs de fond en cas de redimensionnement
    backgroundBlobsData.forEach(blob => {
      // Recalcule la baseX/Y par rapport à la nouvelle taille de fenêtre
      switch(blob.id) { // Adapter selon les IDs pour leurs positions initiales
        case "blob-bg-1": blob.baseX = 0.25 * window.innerWidth; blob.baseY = 0.5 * window.innerHeight; break;
        case "blob-bg-2": blob.baseX = 0.7 * window.innerWidth; blob.baseY = 0.3 * window.innerHeight; break;
        case "blob-bg-3": blob.baseX = 0.3 * window.innerWidth; blob.baseY = 0.7 * window.innerHeight; break;
        case "blob-bg-4": blob.baseX = 0.6 * window.innerWidth; blob.baseY = 0.8 * window.innerHeight; break;
        case "blob-bg-5": blob.baseX = 0.5 * window.innerWidth; blob.baseY = 0.5 * window.innerHeight; break;
      }
      const currentFrameLeft = frame.getBoundingClientRect().left;
      const currentFrameTop = frame.getBoundingClientRect().top;
      // Réinitialise leur position JS à leur position de base après redimensionnement
      blob.currentX = blob.baseX - currentFrameLeft;
      blob.currentY = blob.baseY - currentFrameTop;
      blob.isAttracted = false; // Sort de l'état d'attraction
    });


    // Réinitialisation de la position pour le blob interactif
    targetX = window.innerWidth / 2;
    targetY = window.innerHeight / 2;
    const currentFrameLeft = frame.getBoundingClientRect().left;
    const currentFrameTop = frame.getBoundingClientRect().top;
    currentX = targetX - currentFrameLeft;
    currentY = targetY - currentFrameTop;
  });

  // Démarrer l'animation
  animate(0); // Appeler avec 0 pour initialiser lastTime

  return frame;
}