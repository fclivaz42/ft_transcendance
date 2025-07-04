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
                url: "/assets/sounds/bounce.mp3",
                poolSize: 3,
                volume: 0.8
            },
            
            // Son pour les collisions avec les murs (même fichier que paddle)
            wallBounce: {
                url: "/assets/sounds/bounce.mp3",
                poolSize: 2,
                volume: 0.6
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
            
            punch: {
                url: "/assets/sounds/punch.mp3",
                poolSize: 2,
                volume: 0.8
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

            console.log(`🎵 Création du pool HTML5 pour: ${soundName} depuis ${config.url}`);

            for (let i = 0; i < config.poolSize; i++) {
                const audio = new HTMLAudioElement();
                audio.src = config.url;
                audio.volume = config.volume * this._masterVolume;
                audio.loop = config.loop || false;
                audio.preload = 'auto';

                audio.addEventListener('canplaythrough', () => {
                    console.log(`✅ Audio HTML5 chargé: ${soundName}_${i}`);
                    loadedCount++;
                    if (loadedCount === config.poolSize && !hasError) {
                        this._html5SoundPools.set(soundName, pool);
                        console.log(`🎉 Pool HTML5 complet pour ${soundName}: ${loadedCount}/${config.poolSize} instances`);
                        resolve();
                    }
                }, { once: true });

                audio.addEventListener('error', (e) => {
                    console.error(`❌ Erreur chargement HTML5 pour ${soundName}_${i}:`, e);
                    hasError = true;
                    reject(new Error(`Failed to load ${soundName}_${i}`));
                }, { once: true });

                pool.instances.push(audio);
                
                // Déclencher le chargement
                audio.load();
            }

            // Timeout au cas où le chargement traîne
            setTimeout(() => {
                if (loadedCount < config.poolSize && !hasError) {
                    console.warn(`⚠️ Timeout pour ${soundName}, chargé seulement ${loadedCount}/${config.poolSize}`);
                    if (loadedCount > 0) {
                        this._html5SoundPools.set(soundName, pool);
                        resolve();
                    } else {
                        reject(new Error(`Timeout loading ${soundName}`));
                    }
                }
            }, 10000);
        });
    }

    // Méthode principale pour jouer un son
    public playSound(soundName: string, volume?: number, playbackRate?: number): void {

        // Utiliser HTML5 Audio uniquement
        this.playHtml5Sound(soundName, volume, playbackRate);
    }

    private playHtml5Sound(soundName: string, volume?: number, playbackRate?: number): void {
        const pool = this._html5SoundPools.get(soundName);
        if (!pool) {
            console.warn(`⚠️ Pool HTML5 introuvable pour: ${soundName}`);
            console.log(`🔍 Pools HTML5 disponibles:`, Array.from(this._html5SoundPools.keys()));
            return;
        }

        const audio = this.getNextAvailableHtml5Audio(pool);
        if (!audio) {
            console.warn(`⚠️ Aucune instance HTML5 disponible pour: ${soundName}`);
            return;
        }

        try {
            // Réinitialiser à zéro pour pouvoir rejouer
            audio.currentTime = 0;
            
            // Appliquer le volume si spécifié
            if (volume !== undefined) {
                audio.volume = Math.max(0, Math.min(1, volume * this._masterVolume));
            }

            // Appliquer le playback rate si spécifié (HTML5 Audio support)
            if (playbackRate !== undefined && audio.playbackRate !== undefined) {
                audio.playbackRate = playbackRate;
            }

            // Jouer le son
            const playPromise = audio.play();
            
            if (playPromise !== undefined) {
                playPromise
                    .then(() => {
                        console.log(`✅ Son HTML5 joué avec succès: ${soundName}`);
                    })
                    .catch(error => {
                        console.error(`❌ Erreur lecture HTML5 pour ${soundName}:`, error);
                    });
            }
        } catch (error) {
            console.error(`❌ Exception lors de la lecture HTML5 de ${soundName}:`, error);
        }
    }

    private getNextAvailableHtml5Audio(pool: Html5SoundPool): HTMLAudioElement | null {
        if (pool.instances.length === 0) {
            return null;
        }

        // Trouver la prochaine instance disponible (pas en cours de lecture)
        for (let i = 0; i < pool.instances.length; i++) {
            const currentIndex = (pool.currentIndex + i) % pool.instances.length;
            const audio = pool.instances[currentIndex];
            
            if (audio.paused || audio.ended) {
                pool.currentIndex = (currentIndex + 1) % pool.instances.length;
                return audio;
            }
        }

        // Si toutes les instances sont occupées, utiliser la prochaine en round-robin
        const audio = pool.instances[pool.currentIndex];
        pool.currentIndex = (pool.currentIndex + 1) % pool.instances.length;
        return audio;
    }

    // Méthodes spécialisées pour le jeu
    public playPaddleHit(intensity: number = 1): void {
        // Varier légèrement le volume et la vitesse selon l'intensité
        const volume = 0.6 + (intensity * 0.2);
        const playbackRate = 0.9 + (intensity * 0.2);
        this.playSound("paddleHit", volume, playbackRate);
    }

    public playWallBounce(velocity: number = 1): void {
        // Volume basé sur la vélocité de la balle
        const volume = Math.min(0.8, 0.3 + (velocity * 0.3));
        this.playSound("wallBounce", volume);
    }

    // Méthodes pour les tests depuis l'interface
    public testHtml5Sound(soundName: string): Promise<string> {
        return new Promise((resolve) => {
            const pool = this._html5SoundPools.get(soundName);
            if (!pool) {
                resolve(`❌ Pool HTML5 non trouvé pour: ${soundName}`);
                return;
            }

            if (pool.instances.length === 0) {
                resolve(`❌ Aucune instance dans le pool pour: ${soundName}`);
                return;
            }

            const audio = pool.instances[0];
            
            try {
                audio.currentTime = 0;
                const playPromise = audio.play();
                
                if (playPromise !== undefined) {
                    playPromise
                        .then(() => {
                            resolve(`✅ Test HTML5 réussi pour: ${soundName}`);
                        })
                        .catch(error => {
                            resolve(`❌ Erreur test HTML5 pour ${soundName}: ${error.message}`);
                        });
                } else {
                    resolve(`✅ Test HTML5 lancé pour: ${soundName}`);
                }
            } catch (error) {
                resolve(`❌ Exception test HTML5 pour ${soundName}: ${error}`);
            }
        });
    }

    // Test des fichiers audio directement depuis les assets
    public testDirectAudioFile(fileName: string): Promise<string> {
        return new Promise((resolve) => {
            const fileUrl = `/assets/sounds/${fileName}`;
            console.log(`🎵 Test direct HTML5 audio: ${fileUrl}`);
            
            const audio = new Audio(fileUrl);
            audio.volume = 0.5;
            
            const cleanup = () => {
                audio.removeEventListener('canplaythrough', onCanPlay);
                audio.removeEventListener('error', onError);
            };
            
            const onCanPlay = () => {
                console.log(`✅ ${fileName} - Peut être lu`);
                cleanup();
                
                audio.play()
                    .then(() => {
                        console.log(`▶️ ${fileName} - Lecture démarrée`);
                        resolve(`✅ Test direct réussi pour: ${fileName}`);
                    })
                    .catch(err => {
                        console.error(`❌ ${fileName} - Erreur de lecture:`, err);
                        resolve(`❌ Erreur de lecture pour ${fileName}: ${err.message}`);
                    });
            };
            
            const onError = (e: any) => {
                console.error(`❌ ${fileName} - Erreur de chargement:`, e);
                cleanup();
                resolve(`❌ Erreur de chargement pour ${fileName}`);
            };
            
            audio.addEventListener('canplaythrough', onCanPlay, { once: true });
            audio.addEventListener('error', onError, { once: true });
            
            // Timeout de sécurité
            setTimeout(() => {
                cleanup();
                resolve(`⏰ Timeout pour ${fileName}`);
            }, 5000);
        });
    }

    // Arrêter tous les sons
    public stopAllSounds(): void {
        console.log("🛑 Arrêt de tous les sons...");
        
        this._html5SoundPools.forEach(pool => {
            pool.instances.forEach(audio => {
                audio.pause();
                audio.currentTime = 0;
            });
        });
    }

    // Arrêter un son spécifique
    public stopSound(soundName: string): void {
        const pool = this._html5SoundPools.get(soundName);
        if (pool) {
            pool.instances.forEach(audio => {
                audio.pause();
                audio.currentTime = 0;
            });
        }
    }

    // Activer/désactiver l'audio
    public setEnabled(enabled: boolean): void {
        this._enabled = enabled;
        if (!enabled) {
            this.stopAllSounds();
        }
        console.log(`🔊 Audio ${enabled ? 'activé' : 'désactivé'}`);
    }

    // Changer le volume global
    public setMasterVolume(volume: number): void {
        this._masterVolume = Math.max(0, Math.min(1, volume));
        
        // Appliquer le nouveau volume à tous les sons HTML5
        this._html5SoundPools.forEach(pool => {
            pool.instances.forEach(audio => {
                audio.volume = audio.volume * this._masterVolume;
            });
        });
        
        console.log(`🔊 Volume global défini à: ${this._masterVolume}`);
    }

    // Obtenir des informations sur les pools
    public getPoolInfo(): string {
        const html5Info = Array.from(this._html5SoundPools.entries()).map(([name, pool]) => {
            return `${name}: ${pool.instances.length} instances HTML5`;
        });

        return `Pools chargés:\n${html5Info.join('\n')}`;
    }

    // Nettoyer les ressources
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
