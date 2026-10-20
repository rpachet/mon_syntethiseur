/**
 * audio-engine.js
 * Manages the Web Audio signal chain from active rack modules to destination.
 */

export class AudioEngine {
  constructor() {
    this._ctx = null;
    this._modules = []; // ordered list of active SynthModule instances
    this._masterGain = null;
    this._activeNotes = new Map(); // note -> { osc, gain }
  }

  get ctx() {
    if (!this._ctx) {
      this._ctx = new (window.AudioContext || window.webkitAudioContext)();
      this._masterGain = this._ctx.createGain();
      this._masterGain.gain.value = 0.5;
      this._masterGain.connect(this._ctx.destination);
    }
    return this._ctx;
  }

  resume() {
    if (this._ctx && this._ctx.state === 'suspended') this._ctx.resume();
  }

  setModules(modules) {
    this._modules = modules;
  }

  /** Find the oscillator module (must be first in chain) */
  _getOscModule() {
    return this._modules.find(m => m.type === 'oscillator');
  }

  /** Build the audio chain from current module list and play a note */
  noteOn(frequency) {
    this.resume();
    if (this._activeNotes.has(frequency)) return;

    const ctx = this.ctx;
    const nodes = [];

    // Always start with an oscillator
    const osc = ctx.createOscillator();
    const oscMod = this._getOscModule();
    osc.type = oscMod ? oscMod.getWaveform() : 'sine';
    osc.frequency.value = frequency;

    // Envelope gain
    const envGain = ctx.createGain();
    const envMod = this._modules.find(m => m.type === 'envelope');
    const attack  = envMod ? envMod.getAttack()  : 0.01;
    const release = envMod ? envMod.getRelease() : 0.3;

    envGain.gain.setValueAtTime(0, ctx.currentTime);
    envGain.gain.linearRampToValueAtTime(1, ctx.currentTime + attack);

    nodes.push(osc, envGain);

    // Chain optional modules
    for (const mod of this._modules) {
      if (mod.type === 'oscillator' || mod.type === 'envelope' || mod.type === 'volume') continue;
      const node = mod.getAudioNode(ctx);
      if (node) nodes.push(node);
    }

    // Master gain / volume
    nodes.push(this._masterGain);

    // Connect chain
    for (let i = 0; i < nodes.length - 1; i++) {
      nodes[i].connect(nodes[i + 1]);
    }

    osc.start();
    this._activeNotes.set(frequency, { osc, envGain, release, nodes });
  }

  noteOff(frequency) {
    const note = this._activeNotes.get(frequency);
    if (!note) return;
    const { osc, envGain, release } = note;
    const ctx = this.ctx;
    envGain.gain.cancelScheduledValues(ctx.currentTime);
    envGain.gain.setValueAtTime(envGain.gain.value, ctx.currentTime);
    envGain.gain.linearRampToValueAtTime(0, ctx.currentTime + release);
    osc.stop(ctx.currentTime + release + 0.05);
    this._activeNotes.delete(frequency);
  }

  noteOffAll() {
    for (const freq of this._activeNotes.keys()) this.noteOff(freq);
  }

  setMasterVolume(v) {
    const volMod = this._modules.find(m => m.type === 'volume');
    const vol = volMod ? volMod.getVolume() * v : v;
    if (this._masterGain) this._masterGain.gain.value = vol;
  }

  updateMasterVolume() {
    const volMod = this._modules.find(m => m.type === 'volume');
    if (this._masterGain) {
      this._masterGain.gain.value = volMod ? volMod.getVolume() : 0.5;
    }
  }
}

export const audioEngine = new AudioEngine();
