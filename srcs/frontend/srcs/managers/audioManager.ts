/*
Sons de feedback immédiat : Frontend.
-Collisions paddle/mur
-Effets sonores d'interface

Event global: Websockets.
-musique de fond
-sons de score, début/fin de jeu, victoire
-annonces de joueurs (rejoignent/quittent)
-ia qui prend le relais

*/

interface SoundConfig {
    url: string;
    poolSize: number;
    volume: number;
    loop?: boolean;
}

interface Html5SoundPool {
    instances: HTMLAudioElement[];
    currentIndex: number;
}

export default class AudioManager {
    private _html5SoundPools: Map<string, Html5SoundPool> = new Map();
    private _enabled: boolean = true;
    private _masterVolume: number = 1.0;
    private _isLoading: boolean = false;
    private static _globalInstance: AudioManager | null = null;

    constructor() {
        AudioManager._globalInstance = this;
        this.loadSounds();
    }

    // Méthode statique pour charger les sons avant même d'avoir une scène
    public static preloadSounds(): void {
        console.log("🎵 Préchargement des sons au lancement du site...");
        
        if (!AudioManager._globalInstance) {
            new AudioManager();
        }
    }

    public static getInstance(): AudioManager | null {
        return AudioManager._globalInstance;
    }

    private async loadSounds(): Promise<void> {
        this._isLoading = true;

        const soundConfigs: Record<string, SoundConfig> = {
            // Son principal pour les collisions paddle ET murs (bounce fonctionne)
            paddleHit: {
                url: "/assets/sounds/punch.mp3", // ✅ Utilise punch.mp3 pour paddle
                poolSize: 3,
                volume: 0.7
            },
            
            // Son pour les collisions avec les murs (même fichier que paddle)
            wallBounce: {
                url: "/assets/sounds/bounce.mp3", // ✅ Utilise bounce.mp3 pour wall
                poolSize: 2,
                volume: 0.7
            },
            
            // Test des autres fichiers audio
            gameStart: {
                url: "/assets/sounds/gamestart.mp3",
                poolSize: 1,
                volume: 0.7
            },
            
            backgroundMusic: {
                url: "/assets/sounds/background.mp3",
                poolSize: 1,
                volume: 0.3,
                loop: true
            },
            
            trailer: {
                url: "/assets/sounds/trailer.mp3",
                poolSize: 1,
                volume: 0.7
            },
            
            cinematicBoom: {
                url: "/assets/sounds/cinematic-boom.mp3",
                poolSize: 1,
                volume: 0.8
            }
        };

        const loadPromises: Promise<void>[] = [];

        for (const [soundName, config] of Object.entries(soundConfigs)) {
            loadPromises.push(this.createHtml5SoundPool(soundName, config));
        }

        try {
            await Promise.all(loadPromises);
            console.log("✅ Tous les pools de sons HTML5 ont été chargés avec succès");
        } catch (error) {
            console.error("❌ Erreur lors du chargement des pools de sons:", error);
        } finally {
            this._isLoading = false;
        }
    }

    private async createHtml5SoundPool(soundName: string, config: SoundConfig): Promise<void> {
        return new Promise((resolve, reject) => {
            const pool: Html5SoundPool = {
                instances: [],
                currentIndex: 0
            };

            let loadedCount = 0;
            let hasError = false;

            for (let i = 0; i < config.poolSize; i++) {
                const audio = new HTMLAudioElement();
                audio.src = config.url;
                audio.volume = config.volume * this._masterVolume;
                audio.loop = config.loop || false;
                audio.preload = 'auto';

                audio.addEventListener('canplaythrough', () => {
                    loadedCount++;
                    if (loadedCount === config.poolSize && !hasError) {
                        this._html5SoundPools.set(soundName, pool);
                        resolve();
                    }
                }, { once: true });

                audio.addEventListener('error', (e) => {
                    hasError = true;
                    reject(new Error(`Failed to load ${soundName}_${i}`));
                }, { once: true });

                pool.instances.push(audio);
                audio.load();
            }
        });
    }

    // ✅ FONCTION EXTRAITE DE PONGGAMEMANAGER
    /**
     * 🎵 LECTURE DIRECTE AVEC HTML5 - Méthode extraite de PongGameManager
     * @param url - URL du fichier audio
     * @param name - Nom unique pour l'audio
     */
    public playDirectAudioFile(url: string, name: string): void {
        if (!this._enabled) return;

        try {
            // Supprimer l'ancien audio s'il existe
            const existingAudio = document.getElementById(`direct-audio-${name}`) as HTMLAudioElement;
            if (existingAudio) {
                existingAudio.remove();
            }

            // Créer un nouvel élément audio HTML5
            const audio = document.createElement('audio');
            audio.id = `direct-audio-${name}`;
            audio.src = url;
            audio.volume = 0.7 * this._masterVolume;
            audio.preload = 'auto';

            // Ajouter les listeners d'événements
            audio.onloadstart = () => console.log(`📥 Début du chargement: ${name}`);
            audio.onloadeddata = () => console.log(`✅ Données chargées: ${name}`);
            audio.oncanplay = () => console.log(`▶️ Prêt à jouer: ${name}`);
            audio.onplay = () => console.log(`🎵 Lecture démarrée: ${name}`);
            audio.onended = () => console.log(`🏁 Lecture terminée: ${name}`);
            audio.onerror = (e) => console.error(`❌ Erreur audio pour ${name}:`, e);

            // Ajouter à la page et jouer
            document.body.appendChild(audio);
            
            audio.play()
                .then(() => console.log(`✅ Audio joué avec succès: ${name}`))
                .catch(error => console.error(`❌ Erreur lors de la lecture de ${name}:`, error));

        } catch (error) {
            console.error(`❌ Erreur création audio ${name}:`, error);
        }
    }

    // ✅ FONCTION EXTRAITE DE PONGGAMEMANAGER
    /**
     * 🏓 COLLISION RAQUETTE - Méthode extraite de PongGameManager
     * Joue le son de collision avec une raquette
     */
    public playPaddleCollisionSound(): void {
        console.log("🏓 PADDLE HIT! Lecture du son...");
        
        // Essayer d'abord avec le pool, sinon utiliser la méthode directe
        const pool = this._html5SoundPools.get('paddleHit');
        if (pool && pool.instances.length > 0) {
            this.playSound('paddleHit');
        } else {
            // Fallback vers la méthode directe de PongGameManager
            console.log("🔄 Pool indisponible, utilisation méthode directe");
            this.playDirectAudioFile("/assets/sounds/punch.mp3", "paddle-collision");
        }
    }

    // ✅ FONCTION EXTRAITE DE PONGGAMEMANAGER
    /**
     * 🧱 COLLISION MUR - Méthode extraite de PongGameManager  
     * Joue le son de collision avec un mur
     */
    public playWallCollisionSound(): void {
        console.log("🧱 WALL HIT! Lecture du son...");
        
        // Essayer d'abord avec le pool, sinon utiliser la méthode directe
        const pool = this._html5SoundPools.get('wallBounce');
        if (pool && pool.instances.length > 0) {
            this.playSound('wallBounce');
        } else {
            // Fallback vers la méthode directe de PongGameManager
            console.log("🔄 Pool indisponible, utilisation méthode directe");
            this.playDirectAudioFile("/assets/sounds/bounce.mp3", "wall-collision");
        }
    }

    // ✅ FONCTION EXTRAITE DE PONGGAMEMANAGER
    /**
     * 🧪 TEST RAQUETTE - Méthode extraite de PongGameManager
     * Test manuel du son de raquette
     */
    public testPaddleSound(): void {
        console.log("🧪 Test manuel son raquette");
        this.playDirectAudioFile("/assets/sounds/punch.mp3", "paddle-test");
    }

    // ✅ FONCTION EXTRAITE DE PONGGAMEMANAGER
    /**
     * 🧪 TEST MUR - Méthode extraite de PongGameManager
     * Test manuel du son de mur
     */
    public testWallSound(): void {
        console.log("🧪 Test manuel son mur");
        this.playDirectAudioFile("/assets/sounds/bounce.mp3", "wall-test");
    }

    // Méthode principale pour jouer un son
    public playSound(soundName: string, volume?: number, playbackRate?: number): void {
        if (!this._enabled) return;
        this.playHtml5Sound(soundName, volume, playbackRate);
    }

    private playHtml5Sound(soundName: string, volume?: number, playbackRate?: number): void {
        const pool = this._html5SoundPools.get(soundName);
        if (!pool) {
            console.warn(`⚠️ Pool HTML5 introuvable pour: ${soundName}`);
            return;
        }

        const audio = this.getNextAvailableHtml5Audio(pool);
        if (!audio) {
            console.warn(`⚠️ Aucune instance HTML5 disponible pour: ${soundName}`);
            return;
        }

        try {
            audio.currentTime = 0;
            
            if (volume !== undefined) {
                audio.volume = Math.max(0, Math.min(1, volume * this._masterVolume));
            }

            if (playbackRate !== undefined && audio.playbackRate !== undefined) {
                audio.playbackRate = playbackRate;
            }

            const playPromise = audio.play();
            
            if (playPromise !== undefined) {
                playPromise
                    .then(() => console.log(`✅ Son HTML5 joué avec succès: ${soundName}`))
                    .catch(error => console.error(`❌ Erreur lecture HTML5 pour ${soundName}:`, error));
            }
        } catch (error) {
            console.error(`❌ Exception lors de la lecture HTML5 de ${soundName}:`, error);
        }
    }

    private getNextAvailableHtml5Audio(pool: Html5SoundPool): HTMLAudioElement | null {
        if (pool.instances.length === 0) return null;

        for (let i = 0; i < pool.instances.length; i++) {
            const currentIndex = (pool.currentIndex + i) % pool.instances.length;
            const audio = pool.instances[currentIndex];
            
            if (audio.paused || audio.ended) {
                pool.currentIndex = (currentIndex + 1) % pool.instances.length;
                return audio;
            }
        }

        const audio = pool.instances[pool.currentIndex];
        pool.currentIndex = (pool.currentIndex + 1) % pool.instances.length;
        return audio;
    }

    public playPaddleHit(intensity: number = 1): void {
        const volume = 0.6 + (intensity * 0.2);
        const playbackRate = 0.9 + (intensity * 0.2);
        this.playSound("paddleHit", volume, playbackRate);
    }

    public playWallBounce(velocity: number = 1): void {
        const volume = Math.min(0.8, 0.3 + (velocity * 0.3));
        this.playSound("wallBounce", volume);
    }

    public stopAllSounds(): void {
        console.log("🛑 Arrêt de tous les sons...");
        
        // Arrêter les pools
        this._html5SoundPools.forEach(pool => {
            pool.instances.forEach(audio => {
                audio.pause();
                audio.currentTime = 0;
            });
        });

        // ✅ ARRÊTER LES AUDIOS DIRECTS (de playDirectAudioFile)
        document.querySelectorAll('audio[id^="direct-audio-"]').forEach(audio => {
            (audio as HTMLAudioElement).pause();
            audio.remove();
        });
    }

    public setEnabled(enabled: boolean): void {
        this._enabled = enabled;
        if (!enabled) {
            this.stopAllSounds();
        }
        console.log(`🔊 Audio ${enabled ? 'activé' : 'désactivé'}`);
    }

    public setMasterVolume(volume: number): void {
        this._masterVolume = Math.max(0, Math.min(1, volume));
        
        this._html5SoundPools.forEach(pool => {
            pool.instances.forEach(audio => {
                audio.volume = audio.volume * this._masterVolume;
            });
        });
        
        console.log(`🔊 Volume global défini à: ${this._masterVolume}`);
    }

    // ✅ FONCTION EXTRAITE DE PONGGAMEMANAGER
    /**
     * 🔓 DÉBLOQUAGE AUDIO - Contourne les restrictions navigateur
     * Les navigateurs bloquent l'audio jusqu'à interaction utilisateur
     */
    public unmuteAll(): void {
        console.log("🔓 Audio débloqué par interaction utilisateur");
        this.setEnabled(true);
    }

    public dispose(): void {
        this.stopAllSounds();
        this._html5SoundPools.clear();
        AudioManager._globalInstance = null;
        console.log("🗑️ AudioManager nettoyé");
    }

    // Getters
    public get isEnabled(): boolean {
        return this._enabled;
    }

    public get masterVolume(): number {
        return this._masterVolume;
    }

    public get isLoading(): boolean {
        return this._isLoading;
    }
}
