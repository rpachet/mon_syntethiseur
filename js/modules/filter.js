/**
 * modules/filter.js
 * BiquadFilter module — shapes the tone of the sound.
 */

export class FilterModule {
  constructor() {
    this.type = 'filter';
    this._frequency = 2000; // Hz
    this._resonance = 1;
    this._node = null;
  }

  static info() {
    return {
      icon: '🔮',
      label: 'Filtre',
      tooltip: '🔮 Je change la couleur du son ! Tourne le bouton pour rendre le son plus grave (sombre) ou plus aigu (brillant).',
    };
  }

  getAudioNode(ctx) {
    this._node = ctx.createBiquadFilter();
    this._node.type = 'lowpass';
    this._node.frequency.value = this._frequency;
    this._node.Q.value = this._resonance;
    return this._node;
  }

  renderControls() {
    return `
      <div class="knob-group">
        <webaudio-knob id="filter-freq-knob"
          min="80" max="18000" value="${this._frequency}"
          step="1" diameter="54"
          midilearn="false"
          tooltip="Fréquence de coupure"
          style="--knob-color:#a78bfa">
        </webaudio-knob>
        <label>Coupure</label>
        <span class="knob-value" id="filter-freq-val">${Math.round(this._frequency)} Hz</span>
      </div>
      <div class="knob-group">
        <webaudio-knob id="filter-res-knob"
          min="0.1" max="20" value="${this._resonance}"
          step="0.01" diameter="54"
          midilearn="false"
          tooltip="Résonance"
          style="--knob-color:#c4b5fd">
        </webaudio-knob>
        <label>Résonance</label>
        <span class="knob-value" id="filter-res-val">${this._resonance.toFixed(1)}</span>
      </div>`;
  }

  bindControls(card, onChange) {
    const freqKnob = card.querySelector('#filter-freq-knob');
    const resKnob  = card.querySelector('#filter-res-knob');

    if (freqKnob) {
      freqKnob.addEventListener('input', e => {
        this._frequency = parseFloat(e.target.value);
        const lbl = card.querySelector('#filter-freq-val');
        if (lbl) lbl.textContent = Math.round(this._frequency) + ' Hz';
        if (this._node) this._node.frequency.value = this._frequency;
        onChange();
      });
    }
    if (resKnob) {
      resKnob.addEventListener('input', e => {
        this._resonance = parseFloat(e.target.value);
        const lbl = card.querySelector('#filter-res-val');
        if (lbl) lbl.textContent = this._resonance.toFixed(1);
        if (this._node) this._node.Q.value = this._resonance;
        onChange();
      });
    }
  }
}
