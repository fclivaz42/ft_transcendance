import AudioManager from "../managers/audioManager.js";

/**
 * Précharge les sons audio dès le lancement du site
 * À appeler dans le main ou à l'initialisation de l'application
 */
export function preloadAudio(): void {
    console.log("🚀 Démarrage du préchargement audio...");
    
    // Attendre que l'utilisateur interagisse avant de charger les sons
    // (requis par les navigateurs modernes)
    const enableAudioOnFirstInteraction = () => {
        console.log("👆 Première interaction détectée, chargement des sons...");
        
        // Précharger les sons
        AudioManager.preloadSounds();
        
        // Supprimer les listeners après la première interaction
        document.removeEventListener('click', enableAudioOnFirstInteraction);
        document.removeEventListener('keydown', enableAudioOnFirstInteraction);
        document.removeEventListener('touchstart', enableAudioOnFirstInteraction);
    };
    
    // Écouter la première interaction
    document.addEventListener('click', enableAudioOnFirstInteraction, { once: true });
    document.addEventListener('keydown', enableAudioOnFirstInteraction, { once: true });
    document.addEventListener('touchstart', enableAudioOnFirstInteraction, { once: true });
    
    console.log("⏳ En attente de la première interaction utilisateur pour charger les sons...");
}
