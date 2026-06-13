class SoundManager {
    constructor() {
        this.muted = false;
        this.volume = 0.5;
    }

    playSound(type) {
        if (this.muted) return;

        // Using Web Audio API for sound effects
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            gainNode.gain.setValueAtTime(this.volume, audioContext.currentTime);

            switch (type) {
                case 'dice':
                    oscillator.frequency.value = 800;
                    oscillator.start();
                    oscillator.stop(audioContext.currentTime + 0.1);
                    break;
                case 'move':
                    oscillator.frequency.value = 600;
                    oscillator.start();
                    oscillator.stop(audioContext.currentTime + 0.2);
                    break;
                case 'win':
                    oscillator.frequency.value = 1000;
                    oscillator.start();
                    oscillator.stop(audioContext.currentTime + 0.5);
                    break;
                case 'trap':
                    oscillator.frequency.value = 200;
                    oscillator.start();
                    oscillator.stop(audioContext.currentTime + 0.3);
                    break;
                case 'bonus':
                    oscillator.frequency.value = 900;
                    oscillator.start();
                    oscillator.stop(audioContext.currentTime + 0.2);
                    break;
            }
        } catch (e) {
            console.log('Audio not available');
        }
    }

    toggle() {
        this.muted = !this.muted;
        return this.muted;
    }
}
