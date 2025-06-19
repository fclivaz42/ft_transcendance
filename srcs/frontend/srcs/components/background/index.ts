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


// le titre a un z-index: 10
// Sphères qui passent devant le titre : z-index: 20 (ou tout nombre > 10)
// Sphères qui passent derrière le titre : z-index: 5 (ou tout nombre < 10)
export function InteractivBubble(): HTMLElement {
  const frame = document.createElement("div");

  // frame.className = "fixed top-0 left-0 w-screen h-screen overflow-hidden bg-gradient-to-br from-[rgb(108,0,162)] to-[rgb(0,17,82)]";
  // frame.id = "frame";

  // frame.innerHTML = `
  frame.className = "fixed top-0 left-0 w-screen h-screen overflow-hidden bg-gradient-to-br from-[rgb(108,0,162)] to-[rgb(0,17,82)]";
  frame.id = "background-frame"; // RENOMMÉ L'ID POUR ÉVITER CONFLIT AVEC VOTRE AUTRE 'frame'
                                // C'est crucial car vous avez un autre composant 'frame' qui est une div 'h-full w-full bg-white'
                                // Celui-ci doit être le VRAI fond.

  frame.innerHTML = `
    <div class="absolute inset-0 blur-[40px] w-full h-full"> <div id="blob-bg-1" class="absolute w-[800px] h-[800px] rounded-full mix-blend-hard-light opacity-100 bg-[radial-gradient(circle_at_center,_rgba(18,_113,_255,_0.8)_0,_rgba(18,_113,_255,_0)_50%)] z-20"></div>
        <div id="blob-bg-2" class="absolute w-[800px] h-[800px] rounded-full mix-blend-hard-light opacity-100 bg-[radial-gradient(circle_at_center,_rgba(221,_74,_255,_0.8)_0,_rgba(221,_74,_255,_0)_50%)]z-20"></div>
        <div id="blob-bg-3" class="absolute w-[800px] h-[800px] rounded-full mix-blend-hard-light opacity-100 bg-[radial-gradient(circle_at_center,_rgba(100,_220,_255,_0.8)_0,_rgba(100,_220,_255,_0)_50%)]z-20"></div>
        <div id="blob-bg-4" class="absolute w-[800px] h-[800px] rounded-full mix-blend-hard-light opacity-70 bg-[radial-gradient(circle_at_center,_rgba(200,_50,_50,_0.7)_0,_rgba(200,_50,_50,_0)_50%)]z-20"></div>
        <div id="blob-bg-5" class="absolute w-[1600px] h-[1600px] rounded-full mix-blend-hard-light opacity-100 bg-[radial-gradient(circle_at_center,_rgba(180,_180,_50,_0.8)_0,_rgba(180,_180,_50,_0)_50%)]z-20"></div>
        <div id="interactive-blob" class="absolute w-[200px] h-[200px] rounded-full mix-blend-hard-light opacity-70 bg-[radial-gradient(circle_at_center,_rgba(140,_100,_255,_0.8)_0,_rgba(140,_100,_255,_0)_50%)] pointer-events-none z-0"></div>
    </div>

    <div class="absolute inset-0 blur-[40px] w-full h-full">
        </div>

    
 
        </h1>
    </div>
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
                    z-">
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
  const ATTRACTION_RADIUS = 350; // Rayon en pixels autour du curseur pour déclencher l'attraction >400 tres sensible < 50 ignore
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