/**
 * modules/lfo.js
 * Low-Frequency Oscillator — makes the sound wobble or vibrate.
 */

export class LfoModule {
  constructor() {
    this.type = 'lfo';
    this._rate  = 4;   // Hz
    this._depth = 20;  // semitone cents
    this._node  = null;
    this._gain  = null;
  }

  static info() {
    return {
      icon: '🌊',
      label: 'LFO (Vibrato)',
      tooltip: '🌊 Je fais trembler ou vibrer le son ! Plus le bouton "Vitesse" est grand, plus ça tremble vite. Le bouton "Intensité" contrôle à quel point ça tremble.',
    };
  }

  getAudioNode(ctx) {
    this._node = ctx.createOscillator();
    this._node.frequency.value = this._rate;
    this._gain = ctx.createGain();
    this._gain.gain.value = this._depth;
    this._node.connect(this._gain);
    this._node.start();
    // The LFO gain is connected to the destination oscillator's frequency in the engine
    // For simplicity we return a passthrough gain that also acts as the target modulation
    const passthrough = ctx.createGain();
    passthrough.gain.value = 1;
    // Attach lfoGain as a side-effect modulator on next connect
    passthrough._lfoGain = this._gain;
    return passthrough;
  }

  renderControls() {
    return `
      <div class="knob-group">
        <webaudio-knob id="lfo-rate-knob"
          min="0.1" max="20" value="${this._rate}"
          step="0.1" diameter="54"
          midilearn="false"
          style="--knob-color:#38bdf8">
        </webaudio-knob>
        <label>Vitesse</label>
        <span class="knob-value" id="lfo-rate-val">${this._rate.toFixed(1)} Hz</span>
      </div>
      <div class="knob-group">
        <webaudio-knob id="lfo-depth-knob"
          min="0" max="200" value="${this._depth}"
          step="1" diameter="54"
          midilearn="false"
          style="--knob-color:#7dd3fc">
        </webaudio-knob>
        <label>Intensité</label>
        <span class="knob-value" id="lfo-depth-val">${this._depth} ¢</span>
      </div>`;
  }

  bindControls(card, onChange) {
    card.querySelector('#lfo-rate-knob')?.addEventListener('input', e => {
      this._rate = parseFloat(e.target.value);
      if (this._node) this._node.frequency.value = this._rate;
      const lbl = card.querySelector('#lfo-rate-val');
      if (lbl) lbl.textContent = this._rate.toFixed(1) + ' Hz';
      onChange();
    });
    card.querySelector('#lfo-depth-knob')?.addEventListener('input', e => {
      this._depth = parseFloat(e.target.value);
      if (this._gain) this._gain.gain.value = this._depth;
      const lbl = card.querySelector('#lfo-depth-val');
      if (lbl) lbl.textContent = this._depth + ' ¢';
      onChange();
    });
  }
}
