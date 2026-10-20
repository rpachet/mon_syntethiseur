/**
 * modules/reverb.js
 * ConvolverNode — adds a room reverb effect using a synthesised impulse response.
 */

export class ReverbModule {
  constructor() {
    this.type = 'reverb';
    this._roomSize = 2.5; // seconds
    this._wetMix   = 0.5;
    this._convolver = null;
    this._wetGain   = null;
    this._dryGain   = null;
  }

  static info() {
    return {
      icon: '🏔️',
      label: 'Réverb',
      tooltip: '🏔️ Je donne l\'impression que tu joues dans une grande salle ou une caverne ! Plus la taille est grande, plus ça résonne longtemps.',
    };
  }

  /** Generates a synthetic impulse response buffer */
  _buildIR(ctx) {
    const sampleRate = ctx.sampleRate;
    const length     = Math.floor(sampleRate * this._roomSize);
    const ir         = ctx.createBuffer(2, length, sampleRate);
    for (let c = 0; c < 2; c++) {
      const data = ir.getChannelData(c);
      for (let i = 0; i < length; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 2);
      }
    }
    return ir;
  }

  getAudioNode(ctx) {
    this._convolver = ctx.createConvolver();
    this._convolver.buffer = this._buildIR(ctx);

    this._wetGain = ctx.createGain();
    this._wetGain.gain.value = this._wetMix;
    this._dryGain = ctx.createGain();
    this._dryGain.gain.value = 1 - this._wetMix;

    const merger = ctx.createGain();
    this._convolver.connect(this._wetGain);
    this._wetGain.connect(merger);
    this._dryGain.connect(merger);

    // We return the dryGain as input; we also route it through convolver
    this._dryGain._convolver = this._convolver;
    this._dryGain._merger    = merger;

    return merger; // chain receives dry+wet mixed
  }

  renderControls() {
    return `
      <div class="knob-group">
        <webaudio-knob id="rev-size-knob"
          min="0.2" max="6" value="${this._roomSize}"
          step="0.1" diameter="54"
          midilearn="false"
          style="--knob-color:#f472b6">
        </webaudio-knob>
        <label>Taille de salle</label>
        <span class="knob-value" id="rev-size-val">${this._roomSize.toFixed(1)} s</span>
      </div>
      <div class="knob-group">
        <webaudio-knob id="rev-wet-knob"
          min="0" max="1" value="${this._wetMix}"
          step="0.01" diameter="54"
          midilearn="false"
          style="--knob-color:#f9a8d4">
        </webaudio-knob>
        <label>Mélange</label>
        <span class="knob-value" id="rev-wet-val">${Math.round(this._wetMix * 100)}%</span>
      </div>`;
  }

  bindControls(card, onChange) {
    card.querySelector('#rev-size-knob')?.addEventListener('input', e => {
      this._roomSize = parseFloat(e.target.value);
      const lbl = card.querySelector('#rev-size-val');
      if (lbl) lbl.textContent = this._roomSize.toFixed(1) + ' s';
      onChange();
    });
    card.querySelector('#rev-wet-knob')?.addEventListener('input', e => {
      this._wetMix = parseFloat(e.target.value);
      if (this._wetGain) this._wetGain.gain.value = this._wetMix;
      if (this._dryGain) this._dryGain.gain.value = 1 - this._wetMix;
      const lbl = card.querySelector('#rev-wet-val');
      if (lbl) lbl.textContent = Math.round(this._wetMix * 100) + '%';
      onChange();
    });
  }
}
