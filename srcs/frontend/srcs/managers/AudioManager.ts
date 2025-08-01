interface SoundConfig 
{
    url: string;
    volume: number;
    loop?: boolean;
}

const SOUNDS_CONFIG: Record<string, SoundConfig> = 
{
    paddleHit: 
    {
        url: "/assets/sounds/pongecho.mp3",
        volume: 0.7
    },
    wallBounce: 
    {
        url: "/assets/sounds/wallecho.mp3",
        volume: 0.7
    },
    backgroundMusic: 
    {
        url: "/assets/sounds/background.mp3",
        volume: 0.3,
        loop: true 
    },
    trailer: 
    {
        url: "/assets/sounds/trailer.mp3",
        volume: 0.7
    },
    cinematicBoom: 
    {
        url: "/assets/sounds/cinematic-boom.mp3",
        volume: 0.8
    },
    missed:
    {
        url: "/assets/sounds/miss.mp3",
        volume: 0.7
    },
};

export default class AudioManager
{
    private _audioContext: AudioContext | null = null;
    private _audioBuffers: Map<string, AudioBuffer> = new Map();
    private _masterGainNode: GainNode | null = null;
    private _masterVolume: number = 1.0; //ui user
    private _enabled: boolean = true;
    private _isLoading: boolean = false;
    private _soundsLoadedPromise: Promise<void> | null = null;
    private static _globalInstance: AudioManager | null = null;

    private _backgroundMusicNode: AudioBufferSourceNode | null = null;
    private _backgroundMusicGainNode: GainNode | null = null;

    constructor() 
    {
        if (AudioManager._globalInstance) 
        {
            return AudioManager._globalInstance;
        }
        AudioManager._globalInstance = this;
        
        this.initializeAudioContext();
        this._soundsLoadedPromise = this.loadSounds(); 
    }

    public static getInstance(): AudioManager | null 
    {
        return AudioManager._globalInstance;
    }

    // Create AudioContext (system audio)
    private initializeAudioContext(): void 
    {
        if (this._audioContext === null) 
        {
            // Check for browser compatibility, use webkitAudioContext for older Safari
            this._audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
            
            this._masterGainNode = this._audioContext.createGain();
            this._masterGainNode.connect(this._audioContext.destination);
            this.setMasterVolume(this._masterVolume);

        }
    }

    // again autoplay policies, wait for an user interaction
    public async resumeAudioContext(): Promise<void> 
    {
        if (this._audioContext && this._audioContext.state === 'suspended') 
        {
            await this._audioContext.resume();
        }
    }

    //Loads all sounds into AudioBuffers.
    private async loadSounds(): Promise<void> 
    {
        if (this._isLoading) 
            return this._soundsLoadedPromise || Promise.resolve(); 
        this._isLoading = true;
        const loadPromises: Promise<void>[] = [];
        for (const [soundName, config] of Object.entries(SOUNDS_CONFIG)) 
        {
            loadPromises.push(this.loadSoundIntoBuffer(soundName, config));
        }
        try 
        {
            await Promise.all(loadPromises);
        } 
        catch (error) 
        {
            console.error("❌ Erreur lors du chargement d'un ou plusieurs sons:", error);
        } 
        finally 
        {
            this._isLoading = false; 
        }
    }

    // mp3 -> AudioBuffer
    private async loadSoundIntoBuffer(soundName: string, config: SoundConfig): Promise<void> 
    {
        if (!this._audioContext) 
        {
            this.initializeAudioContext(); 
            if (!this._audioContext) 
            {
                return Promise.reject("AudioContext non disponible.");
            }
        }
        try 
        {
            const response = await fetch(config.url);
            if (!response.ok)
            {
                throw new Error(`HTTP error! status: ${response.status} for ${config.url}`);
            }
            const arrayBuffer = await response.arrayBuffer();
            const audioBuffer = await this._audioContext.decodeAudioData(arrayBuffer);
            this._audioBuffers.set(soundName, audioBuffer);

        } 
        catch (error) 
        {
            console.error(`Erreur de chargement/décodage pour ${soundName} (${config.url}):`, error);
            throw error;
        }
    }

    /**
     * Plays a sound using Web Audio API from its AudioBuffer.
     */
    private playBufferSound(soundName: string, volume?: number,  loop?: boolean): AudioBufferSourceNode | null 
    {
        if (!this._enabled || !this._audioContext || this._audioContext.state !== 'running' || !this._masterGainNode)
        {
            console.warn(` AudioManager désactivé ou AudioContext non prêt. Impossible de jouer ${soundName}.`);
            return null;
        }

        const audioBuffer = this._audioBuffers.get(soundName);
        if (!audioBuffer) 
        {
            console.warn(` AudioBuffer introuvable pour: ${soundName}.`);
            return null;
        }

        const source = this._audioContext.createBufferSource();
        source.buffer = audioBuffer;
        const gainNode = this._audioContext.createGain();
        gainNode.gain.value = (volume !== undefined) ? volume : 1.0;
        
        source.connect(gainNode);
        if (soundName !== "backgroundMusic") 
        {
            gainNode.connect(this._masterGainNode); 
        }
        // loop (background)
        if (loop !== undefined) 
        {
            source.loop = loop;
        } 
        else if (SOUNDS_CONFIG[soundName]?.loop) 
        {
            source.loop = true;
        }
        // Sound ending to disconnect and clean up nodes
        source.onended = () => 
        {
            source.disconnect();
            gainNode.disconnect();
            if (soundName === "backgroundMusic") 
            {
                if (this._backgroundMusicNode === source) {
                    this._backgroundMusicNode = null;
                    this._backgroundMusicGainNode = null;
                }
            }
        };
        try 
        {
            source.start(0); // Play immediately
            return source;
        } 
        catch (error) 
        {
            return null;
        }
    }

    // --- Public methods for playing specific game sounds ---

    public playPaddleHit(intensity: number = 1): void 
    {
        const volume = 0.6 + (intensity * 0.2);
        this.playBufferSound("paddleHit", volume);
    }

    public playWallBounce(velocity: number = 1): void 
    {
        const volume = Math.min(0.8, 0.3 + (velocity * 0.3));
        this.playBufferSound("wallBounce", volume);
    }

    public playMissedSound(volume?: number): void {
        const finalVolume = volume !== undefined ? volume : SOUNDS_CONFIG.missed.volume;
        this.playBufferSound("missed", finalVolume);
    }

    // --- Background Music Control ---

    public async playBackgroundMusic(targetVolume?: number, duration: number = 2): Promise<void> 
    {
        if (!this._enabled || !this._audioContext || !this._masterGainNode) 
        {
            return;
        }

        if (this._audioContext.state === 'suspended') 
        {
            await this.resumeAudioContext();
        }
        if (this._audioContext.state !== 'running') 
        {
            return;
        }
        let audioBuffer = this._audioBuffers.get("backgroundMusic");
        if (!audioBuffer && this._isLoading && this._soundsLoadedPromise) 
        {
            try
            {
                await this._soundsLoadedPromise; 
                audioBuffer = this._audioBuffers.get("backgroundMusic"); 
            }
             catch (error) 
            {
                return;
            }
        }
        if (!audioBuffer)
           return;
        
        const finalVolume = targetVolume !== undefined ? targetVolume : SOUNDS_CONFIG.backgroundMusic.volume;

        if (this._backgroundMusicNode)
        { 
            if (this._backgroundMusicGainNode) 
            { 
                const now = this._audioContext.currentTime;
                this._backgroundMusicGainNode.gain.cancelScheduledValues(now); 
                this._backgroundMusicGainNode.gain.linearRampToValueAtTime(finalVolume, now + duration);
            }
            return;
        }

        // if music not running, create and run 
        this._backgroundMusicNode = this._audioContext.createBufferSource();
        this._backgroundMusicNode.buffer = audioBuffer;
        this._backgroundMusicNode.loop = true;

        this._backgroundMusicGainNode = this._audioContext.createGain();
        this._backgroundMusicNode.connect(this._backgroundMusicGainNode);
        this._backgroundMusicGainNode.connect(this._masterGainNode); 

        const now = this._audioContext.currentTime;
        this._backgroundMusicGainNode.gain.setValueAtTime(0, now); 
        this._backgroundMusicGainNode.gain.linearRampToValueAtTime(finalVolume, now + duration);

        try 
        {
            this._backgroundMusicNode.start(0);
        } catch (error) 
        {
            console.error("❌ Erreur lors du démarrage de la musique de fond:", error);
        }
    }


    public stopBackgroundMusic(duration: number = 2): void 
    {
        if (!this._backgroundMusicNode || !this._backgroundMusicGainNode || !this._audioContext) 
        {
            return;
        }

        const now = this._audioContext.currentTime;
        this._backgroundMusicGainNode.gain.cancelScheduledValues(now);
        this._backgroundMusicGainNode.gain.linearRampToValueAtTime(0, now + duration);

        this._backgroundMusicNode.stop(now + duration);

        this._backgroundMusicNode = null;
        this._backgroundMusicGainNode = null;
    }

    // --- Global Control methods ---

    public stopAllSounds(): void 
    {
        this.stopBackgroundMusic(0.5); 
        if (this._audioContext) 
        {
            this._audioContext.suspend();
        }
    }

    public setEnabled(enabled: boolean): void 
    {
        this._enabled = enabled;
        if (!enabled) 
        {
            this.stopAllSounds();
        }
        else 
        {
            this.resumeAudioContext();
        }
    }

    public setMasterVolume(volume: number): void 
    {
        this._masterVolume = Math.max(0, Math.min(1, volume));
        if (this._masterGainNode) 
        {
            this._masterGainNode.gain.value = this._masterVolume;
        }
    }

    public async unmuteAll(): Promise<void> 
    {
        if (this._audioContext) {
            await this.resumeAudioContext();
            this.setEnabled(true);
        }
    }

    public dispose(): void
    {
        this.stopAllSounds();
        if (this._audioContext) {
            this._audioContext.close(); 
            this._audioContext = null;
        }
        this._audioBuffers.clear();
        this._masterGainNode = null;
        this._backgroundMusicNode = null;
        this._backgroundMusicGainNode = null;
        AudioManager._globalInstance = null;
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

    public get soundsLoadedPromise(): Promise<void> | null {
        return this._soundsLoadedPromise;
    }
}
