// srcs/components/background/interactiveLogic.ts

// Fonction d'aide pour calculer le déplacement d'un élément
// Prend l'élément, sa position initiale, la position de la "bulle" du curseur, et un facteur
export function calculateElementOffset(
    elementRect: DOMRect, // BoundingClientRect de l'élément à déplacer
    parentRect: DOMRect,  // BoundingClientRect de son conteneur parent
    cursorX: number,      // Position X du curseur (globale)
    cursorY: number,      // Position Y du curseur (globale)
    factor: number        // Facteur de réaction (ex: 0.1, 0.2, etc.)
  ): { offsetX: number, offsetY: number } {
    
    // Centre de l'élément relatif à la fenêtre
    const elementCenterX = elementRect.left + elementRect.width / 2;
    const elementCenterY = elementRect.top + elementRect.height / 2;
  
    // Distance entre le centre de l'élément et le curseur
    const deltaX = cursorX - elementCenterX;
    const deltaY = cursorY - elementCenterY;
  
    // Calcul du déplacement basé sur la distance et le facteur
    const offsetX = deltaX * factor * 0.05; // 0.05 est un multiplicateur d'amplitude globale, ajustez
    const offsetY = deltaY * factor * 0.05;
  
    return { offsetX, offsetY };
  }