// Web Audio API ambient sound generator and meditation chime

class SoundEngine {
  private ctx: AudioContext | null = null;
  private rainGain: GainNode | null = null;
  private rainSource: AudioBufferSourceNode | null = null;
  private oceanGain: GainNode | null = null;
  private oceanInterval: number | null = null;
  private singingBowlGain: GainNode | null = null;
  private whiteNoiseGain: GainNode | null = null;
  private whiteNoiseSource: AudioBufferSourceNode | null = null;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Soft Tibetan singing bowl meditation chime
  public playChime(freq = 432, duration = 3.5) {
    try {
      this.initContext();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const oscHarmonic = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      oscHarmonic.type = 'sine';
      oscHarmonic.frequency.setValueAtTime(freq * 1.5, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.25, this.ctx.currentTime + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

      osc.connect(gain);
      oscHarmonic.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(this.ctx.currentTime);
      oscHarmonic.start(this.ctx.currentTime);
      osc.stop(this.ctx.currentTime + duration);
      oscHarmonic.stop(this.ctx.currentTime + duration);
    } catch (e) {
      console.warn("Audio chime not supported or muted", e);
    }
  }

  // Inhale cue chime (higher soothing tone)
  public playInhaleChime() {
    this.playChime(528, 2.5); // 528 Hz Love/Calm solfeggio
  }

  // Exhale cue chime (deep grounding tone)
  public playExhaleChime() {
    this.playChime(396, 3.0); // 396 Hz Grounding solfeggio
  }

  // Rain sound generator using pink-filtered buffer
  public setRainVolume(volume: number) {
    this.initContext();
    if (!this.ctx) return;

    if (volume <= 0) {
      if (this.rainGain) {
        this.rainGain.gain.setValueAtTime(0, this.ctx.currentTime);
      }
      return;
    }

    if (!this.rainGain) {
      this.rainGain = this.ctx.createGain();
      this.rainGain.connect(this.ctx.destination);
    }
    this.rainGain.gain.setValueAtTime(volume * 0.25, this.ctx.currentTime);

    if (!this.rainSource) {
      const bufferSize = this.ctx.sampleRate * 2;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.05;
        b6 = white * 0.115926;
      }

      this.rainSource = this.ctx.createBufferSource();
      this.rainSource.buffer = buffer;
      this.rainSource.loop = true;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(900, this.ctx.currentTime);

      this.rainSource.connect(filter);
      filter.connect(this.rainGain);
      this.rainSource.start();
    }
  }

  // Ocean Waves gentle swell
  public setOceanVolume(volume: number) {
    this.initContext();
    if (!this.ctx) return;

    if (volume <= 0) {
      if (this.oceanGain) {
        this.oceanGain.gain.setValueAtTime(0, this.ctx.currentTime);
      }
      if (this.oceanInterval) {
        window.clearInterval(this.oceanInterval);
        this.oceanInterval = null;
      }
      return;
    }

    if (!this.oceanGain) {
      this.oceanGain = this.ctx.createGain();
      this.oceanGain.connect(this.ctx.destination);
    }
    this.oceanGain.gain.setValueAtTime(volume * 0.3, this.ctx.currentTime);

    if (!this.oceanInterval) {
      const swell = () => {
        if (!this.ctx || !this.oceanGain) return;
        try {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          const filter = this.ctx.createBiquadFilter();

          osc.type = 'triangle';
          osc.frequency.setValueAtTime(55, this.ctx.currentTime);

          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(250, this.ctx.currentTime);

          gain.gain.setValueAtTime(0.001, this.ctx.currentTime);
          gain.gain.linearRampToValueAtTime(0.2, this.ctx.currentTime + 3.0);
          gain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 6.5);

          osc.connect(filter);
          filter.connect(gain);
          gain.connect(this.oceanGain);

          osc.start(this.ctx.currentTime);
          osc.stop(this.ctx.currentTime + 7.0);
        } catch (e) {
          // ignore
        }
      };

      swell();
      this.oceanInterval = window.setInterval(swell, 7500);
    }
  }

  // Gentle Lo-Fi drone/Binaural Alpha Wave (432 Hz + 440 Hz = 8 Hz Alpha brainwave for deep relaxation)
  public setAlphaDroneVolume(volume: number) {
    this.initContext();
    if (!this.ctx) return;

    if (volume <= 0) {
      if (this.singingBowlGain) {
        this.singingBowlGain.gain.setValueAtTime(0, this.ctx.currentTime);
      }
      return;
    }

    if (!this.singingBowlGain) {
      this.singingBowlGain = this.ctx.createGain();
      this.singingBowlGain.connect(this.ctx.destination);

      const oscLeft = this.ctx.createOscillator();
      const oscRight = this.ctx.createOscillator();

      oscLeft.type = 'sine';
      oscLeft.frequency.setValueAtTime(216, this.ctx.currentTime); // 216 Hz

      oscRight.type = 'sine';
      oscRight.frequency.setValueAtTime(224, this.ctx.currentTime); // 224 Hz -> 8Hz Alpha beat

      oscLeft.connect(this.singingBowlGain);
      oscRight.connect(this.singingBowlGain);

      oscLeft.start();
      oscRight.start();
    }

    this.singingBowlGain.gain.setValueAtTime(volume * 0.15, this.ctx.currentTime);
  }

  // Stop all sounds
  public stopAll() {
    if (this.ctx) {
      if (this.rainGain) this.rainGain.gain.setValueAtTime(0, this.ctx.currentTime);
      if (this.oceanGain) this.oceanGain.gain.setValueAtTime(0, this.ctx.currentTime);
      if (this.singingBowlGain) this.singingBowlGain.gain.setValueAtTime(0, this.ctx.currentTime);
      if (this.oceanInterval) {
        window.clearInterval(this.oceanInterval);
        this.oceanInterval = null;
      }
    }
  }
}

export const soundEngine = new SoundEngine();
