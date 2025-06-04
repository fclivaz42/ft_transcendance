// export function createFrame(): HTMLElement {
//   const frame = document.createElement("div");

//   frame.className = "h-full w-full bg-white p-8 bg-background dark:bg-background_dark";
//   frame.id = "frame";
//   frame.innerHTML = `
//     <main class="h-full w-full p-8">
//         <div class="bg-red-200 h-full w-full">
//         </div>
//       </main>
//   `;

//   return frame;
// }

// 
// srcs/components/frame/index.ts

// La fonction createFrame est directement définie et exportée ici
export function createFrame(): HTMLElement {
  const frame = document.createElement("div");

  // Les classes Tailwind pour la structure de base de la frame
  frame.className = "h-full w-full bg-white p-8 bg-background dark:bg-background_dark relative overflow-hidden"; // Ajout de 'relative' et 'overflow-hidden' pour le positionnement interne

  frame.id = "frame";
  frame.innerHTML = `
    <main class="h-full w-full p-8">
        <div class="bg-red-200 h-full w-full">
        </div>
    </main>
  `;

  // --- Début de la logique interactive pour la div rouge interne ---
  const interactiveElement = frame.querySelector(".bg-red-200") as HTMLDivElement;

  if (!interactiveElement) {
    console.warn("Interactive element (.bg-red-200) not found inside the frame. Interactive animation will not apply.");
    return frame; // Retourne la frame sans interactivité si l'élément cible n'est pas trouvé
  }

  // Styles pour que l'élément interactif puisse être positionné et visible
  interactiveElement.style.position = "absolute"; // Positionné absolument par rapport à la 'frame' (qui est relative)
  interactiveElement.style.left = "0px";
  interactiveElement.style.top = "0px";
  interactiveElement.style.width = "100px";
  interactiveElement.style.height = "100px";
  interactiveElement.style.borderRadius = "50%"; // Rendre l'élément rond
  interactiveElement.style.backgroundColor = "rgba(0, 255, 0, 0.5)"; // Couleur verte semi-transparente pour le test
  interactiveElement.style.pointerEvents = "none"; // Permet de cliquer à travers l'élément pour ne pas bloquer les éléments UI
  interactiveElement.style.transition = "transform 0.1s ease-out"; // Ajoute une transition douce

  // Initialisation des positions au centre de l'élément parent (la frame)
  let targetX: number = frame.offsetWidth / 2;
  let targetY: number = frame.offsetHeight / 2;
  let curX: number = targetX;
  let curY: number = targetY;

  function animate() {
    // Effet d'amortissement (easing) pour un mouvement plus fluide
    curX += (targetX - curX) / 10;
    curY += (targetY - curY) / 10;

    // Applique la transformation pour positionner et centrer l'élément
    // Le translate(-50%, -50%) centre l'élément par rapport aux coordonnées (curX, curY)
    interactiveElement.style.transform = `translate(${curX}px, ${curY}px) translate(-50%, -50%)`;

    requestAnimationFrame(animate); // Rappelle la fonction pour la prochaine frame
  }

  // Met à jour les coordonnées cibles en fonction du mouvement de la souris sur la frame
  frame.addEventListener("mousemove", (e) => {
    // Récupère la position de la souris relative à la frame
    const frameRect = frame.getBoundingClientRect();
    targetX = e.clientX - frameRect.left;
    targetY = e.clientY - frameRect.top;
  });

  // Démarrer l'animation
  animate();
  // --- Fin de la logique interactive ---

  return frame; // Retourne l'élément frame avec la logique interactive appliquée
}