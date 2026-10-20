/**
 * modules/volume.js
 * Master volume GainNode.
 */

export class VolumeModule {
  constructor() {
    this.type = 'volume';
    this._volume = 0.7;
  }

  static info() {
    return {
      icon: '🔊',
      label: 'Volume',
      tooltip: '🔊 Je contrôle si le son est très fort ou très doux ! Tourne le bouton vers la droite pour monter le volume.',
    };
  }

  getVolume()    { return this._volume; }
  getAudioNode() { return null; } // handled by audio-engine masterGain

  renderControls() {
    return `
      <div class="knob-group">
        <webaudio-knob id="vol-knob"
          min="0" max="1" value="${this._volume}"
          step="0.01" diameter="64"
          midilearn="false"
          style="--knob-color:#facc15">
        </webaudio-knob>
        <label>Volume</label>
        <span class="knob-value" id="vol-val">${Math.round(this._volume * 100)}%</span>
      </div>`;
  }

  bindControls(card, onChange) {
    card.querySelector('#vol-knob')?.addEventListener('input', e => {
      this._volume = parseFloat(e.target.value);
      const lbl = card.querySelector('#vol-val');
      if (lbl) lbl.textContent = Math.round(this._volume * 100) + '%';
      onChange();
    });
  }
}
