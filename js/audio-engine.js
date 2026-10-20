/**
 * audio-engine.js — moteur audio global (pas d'import/export)
 * Compatible avec ouverture directe file:// dans le navigateur.
 */

var AudioEngine = (function () {
  function AudioEngine() {
    this._ctx = null;
    this._modules = [];
    this._masterGain = null;
    this._activeNotes = new Map();
  }

  AudioEngine.prototype._getCtx = function () {
    if (!this._ctx) {
      this._ctx = new (window.AudioContext || window.webkitAudioContext)();
      this._masterGain = this._ctx.createGain();
      this._masterGain.gain.value = 0.5;
      this._masterGain.connect(this._ctx.destination);
    }
    return this._ctx;
  };

  AudioEngine.prototype.resume = function () {
    if (this._ctx && this._ctx.state === 'suspended') this._ctx.resume();
  };

  AudioEngine.prototype.setModules = function (modules) {
    this._modules = modules;
  };

  AudioEngine.prototype._getOscModule = function () {
    return this._modules.find(function (m) { return m.type === 'oscillator'; });
  };

  AudioEngine.prototype.noteOn = function (frequency) {
    this.resume();
    if (this._activeNotes.has(frequency)) return;
    var ctx = this._getCtx();

    var osc = ctx.createOscillator();
    var oscMod = this._getOscModule();
    osc.type = oscMod ? oscMod.getWaveform() : 'sine';
    osc.frequency.value = frequency;

    var envGain = ctx.createGain();
    var envMod = this._modules.find(function (m) { return m.type === 'envelope'; });
    var attack  = envMod ? envMod.getAttack()  : 0.01;
    var release = envMod ? envMod.getRelease() : 0.3;

    envGain.gain.setValueAtTime(0, ctx.currentTime);
    envGain.gain.linearRampToValueAtTime(1, ctx.currentTime + attack);

    var chain = [osc, envGain];

    // Chain optional effect modules
    for (var i = 0; i < this._modules.length; i++) {
      var mod = this._modules[i];
      if (mod.type === 'oscillator' || mod.type === 'envelope' || mod.type === 'volume') continue;
      var node = mod.getAudioNode(ctx);
      if (node) chain.push(node);
    }

    chain.push(this._masterGain);

    for (var j = 0; j < chain.length - 1; j++) {
      chain[j].connect(chain[j + 1]);
    }

    osc.start();
    this._activeNotes.set(frequency, { osc: osc, envGain: envGain, release: release });
  };

  AudioEngine.prototype.noteOff = function (frequency) {
    var note = this._activeNotes.get(frequency);
    if (!note) return;
    var ctx = this._getCtx();
    note.envGain.gain.cancelScheduledValues(ctx.currentTime);
    note.envGain.gain.setValueAtTime(note.envGain.gain.value, ctx.currentTime);
    note.envGain.gain.linearRampToValueAtTime(0, ctx.currentTime + note.release);
    note.osc.stop(ctx.currentTime + note.release + 0.05);
    this._activeNotes.delete(frequency);
  };

  AudioEngine.prototype.noteOffAll = function () {
    var self = this;
    this._activeNotes.forEach(function (_, freq) { self.noteOff(freq); });
  };

  AudioEngine.prototype.stopAll = function () {
    var context = this._ctx;
    if (!context) return;

    this._activeNotes.forEach(function (note) {
      try { note.osc.stop(); } catch (error) {}
    });
    this._activeNotes.clear();
    this._ctx = null;
    this._masterGain = null;
    context.close().catch(function () {});
  };

  AudioEngine.prototype.updateMasterVolume = function () {
    var volMod = this._modules.find(function (m) { return m.type === 'volume'; });
    if (this._masterGain) {
      this._masterGain.gain.value = volMod ? volMod.getVolume() : 0.5;
    }
  };

  return AudioEngine;
})();

// Singleton global
var audioEngine = new AudioEngine();
