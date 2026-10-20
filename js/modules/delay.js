/**
 * modules/delay.js
 * DelayNode — creates an echo effect.
 */

export class DelayModule {
  constructor() {
    this.type = 'delay';
    this._time     = 0.3;  // seconds
    this._feedback = 0.4;
    this._node     = null;
    this._fbGain   = null;
  }

  static info() {
    return {
      icon: '🔁',
      label: 'Écho',
      tooltip: '🔁 Je répète le son comme un écho dans une montagne ! Le bouton "Temps" contrôle quand l\'écho arrive, et "Répétition" dit combien de fois il revient.',
    };
  }

  getAudioNode(ctx) {
    this._node   = ctx.createDelay(2.0);
    this._node.delayTime.value = this._time;
    this._fbGain = ctx.createGain();
    this._fbGain.gain.value = this._feedback;
    // feedback loop
    this._node.connect(this._fbGain);
    this._fbGain.connect(this._node);
    return this._node;
  }

  renderControls() {
    return `
      <div class="knob-group">
        <webaudio-knob id="delay-time-knob"
          min="0.01" max="1.5" value="${this._time}"
          step="0.01" diameter="54"
          midilearn="false"
          style="--knob-color:#fb923c">
        </webaudio-knob>
        <label>Temps</label>
        <span class="knob-value" id="delay-time-val">${(this._time * 1000).toFixed(0)} ms</span>
      </div>
      <div class="knob-group">
        <webaudio-knob id="delay-fb-knob"
          min="0" max="0.95" value="${this._feedback}"
          step="0.01" diameter="54"
          midilearn="false"
          style="--knob-color:#fdba74">
        </webaudio-knob>
        <label>Répétitions</label>
        <span class="knob-value" id="delay-fb-val">${Math.round(this._feedback * 100)}%</span>
      </div>`;
  }

  bindControls(card, onChange) {
    card.querySelector('#delay-time-knob')?.addEventListener('input', e => {
      this._time = parseFloat(e.target.value);
      if (this._node) this._node.delayTime.value = this._time;
      const lbl = card.querySelector('#delay-time-val');
      if (lbl) lbl.textContent = (this._time * 1000).toFixed(0) + ' ms';
      onChange();
    });
    card.querySelector('#delay-fb-knob')?.addEventListener('input', e => {
      this._feedback = parseFloat(e.target.value);
      if (this._fbGain) this._fbGain.gain.value = this._feedback;
      const lbl = card.querySelector('#delay-fb-val');
      if (lbl) lbl.textContent = Math.round(this._feedback * 100) + '%';
      onChange();
    });
  }
}
