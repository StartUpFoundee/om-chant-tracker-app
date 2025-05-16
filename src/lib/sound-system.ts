
// Available sounds for completion alerts
export type CompletionSound = 'bell' | 'bowl' | 'chime' | 'none';

// Sound class to handle loading and playing sounds
export class SoundPlayer {
  private static instance: SoundPlayer;
  private sounds: Map<string, HTMLAudioElement> = new Map();
  private initialized: boolean = false;
  
  private constructor() {
    // Private constructor for singleton pattern
  }
  
  // Get the singleton instance
  public static getInstance(): SoundPlayer {
    if (!SoundPlayer.instance) {
      SoundPlayer.instance = new SoundPlayer();
    }
    return SoundPlayer.instance;
  }
  
  // Initialize sound system with preloaded sounds
  public initialize(): void {
    if (this.initialized) return;
    
    const soundFiles = {
      bell: '/sounds/bell.mp3',
      bowl: '/sounds/singing-bowl.mp3',
      chime: '/sounds/chime.mp3'
    };
    
    // Preload sounds
    Object.entries(soundFiles).forEach(([name, path]) => {
      const audio = new Audio();
      audio.src = path;
      audio.preload = 'auto';
      this.sounds.set(name, audio);
    });
    
    this.initialized = true;
  }
  
  // Play a specific sound
  public playSound(sound: CompletionSound): void {
    if (sound === 'none' || !this.initialized) return;
    
    const audio = this.sounds.get(sound);
    if (audio) {
      // Reset to beginning if already playing
      audio.currentTime = 0;
      audio.play().catch(err => {
        console.error('Error playing sound:', err);
      });
    }
  }
  
  // Play completion sound based on settings
  public playCompletionSound(): void {
    const settings = localStorage.getItem('mantraSettings');
    let completionChime: CompletionSound = 'bell';
    
    if (settings) {
      const parsedSettings = JSON.parse(settings);
      completionChime = parsedSettings.completionChime || 'bell';
    }
    
    this.playSound(completionChime);
  }
}

// Initialize sound system on import
export const soundPlayer = SoundPlayer.getInstance();
