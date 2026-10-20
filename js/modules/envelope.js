/**
 * modules/envelope.js
 * ADSR-style envelope — controls how the sound starts and fades.
 */

export class EnvelopeModule {
  constructor() {
    this.type = 'envelope';
    this._attack  = 0.02;
    this._release = 0.4;
  }

  static info() {
    return {
      icon: '📈',
      label: 'Enveloppe',
      tooltip: '📈 Je décide comment le son démarre et comment il s\'arrête ! Un attaque rapide = le son arrive d\'un coup. Un relâchement long = le son disparaît doucement.',
    };
  }

  getAttack()  { return this._attack;  }
  getRelease() { return this._release; }
  getAudioNode() { return null; } // Handled by audio-engine

  renderControls() {
    return `
      <div class="knob-group">
        <webaudio-knob id="env-attack-knob"
          min="0.001" max="2" value="${this._attack}"
          step="0.001" diameter="54"
          midilearn="false"
          style="--knob-color:#34d399">
        </webaudio-knob>
        <label>Attaque</label>
        <span class="knob-value" id="env-attack-val">${(this._attack * 1000).toFixed(0)} ms</span>
      </div>
      <div class="knob-group">
        <webaudio-knob id="env-release-knob"
          min="0.01" max="4" value="${this._release}"
          step="0.01" diameter="54"
          midilearn="false"
          style="--knob-color:#6ee7b7">
        </webaudio-knob>
        <label>Relâchement</label>
        <span class="knob-value" id="env-release-val">${(this._release * 1000).toFixed(0)} ms</span>
      </div>`;
  }

  bindControls(card, onChange) {
    const attackKnob  = card.querySelector('#env-attack-knob');
    const releaseKnob = card.querySelector('#env-release-knob');

    attackKnob?.addEventListener('input', e => {
      this._attack = parseFloat(e.target.value);
      const lbl = card.querySelector('#env-attack-val');
      if (lbl) lbl.textContent = (this._attack * 1000).toFixed(0) + ' ms';
      onChange();
    });
    releaseKnob?.addEventListener('input', e => {
      this._release = parseFloat(e.target.value);
      const lbl = card.querySelector('#env-release-val');
      if (lbl) lbl.textContent = (this._release * 1000).toFixed(0) + ' ms';
      onChange();
    });
  }
}
