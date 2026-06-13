// Sound Manager - Handles all game audio
class SoundManager {
    constructor() {
        this.sounds = {};
        this.isMuted = false;
        this.volume = 0.7;
        this.initSounds();
    }

    initSounds() {
        // Create audio context
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        // Create oscillators for sound effects
        this.createAllSounds();
    }

    createAllSounds() {
        // These will use Web Audio API to create sounds programmatically
        this.sounds = {
            diceRoll: () => this.playTone(400, 0.1),
            moveSuccess: () => this.playTone(800, 0.15),
            powerUpCollect: () => this.playTone(1200, 0.2),
            trapHit: () => this.playTone(200, 0.25),
            candyCollect: () => this.playTone(600, 0.12),
            gameWin: () => this.playWinSound(),
            buttonClick: () => this.playTone(500, 0.08)
        };
    }

    playTone(frequency, duration) {
        if (this.isMuted) return;

        const now = this.audioContext.currentTime;
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.frequency.value = frequency;
        oscillator.type = 'sine';

        gainNode.gain.setValueAtTime(this.volume, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + duration);

        oscillator.start(now);
        oscillator.stop(now + duration);
    }

    playWinSound() {
        if (this.isMuted) return;

        const now = this.audioContext.currentTime;
        const frequencies = [523, 659, 784, 1047]; // C, E, G, C (higher octave)

        frequencies.forEach((freq, index) => {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);

            oscillator.frequency.value = freq;
            oscillator.type = 'sine';

            const startTime = now + index * 0.15;
            gainNode.gain.setValueAtTime(this.volume, startTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.5);

            oscillator.start(startTime);
            oscillator.stop(startTime + 0.5);
        });
    }

    play(soundName) {
        if (this.sounds[soundName]) {
            this.sounds[soundName]();
        }
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        return this.isMuted;
    }

    setVolume(level) {
        this.volume = Math.max(0, Math.min(1, level));
    }
}