/**
 * modules/oscillator.js
 * Source oscillator module — generates the basic waveform.
 */

export class OscillatorModule {
  constructor() {
    this.type = 'oscillator';
    this._waveform = 'sine';
  }

  static info() {
    return {
      icon: '🎵',
      label: 'Oscillateur',
      tooltip: '🎵 Je crée le son de base ! Choisis si tu veux un son doux, carré, triangulaire ou en dents de scie.',
    };
  }

  getWaveform() { return this._waveform; }
  getAudioNode() { return null; } // handled by audio-engine directly

  renderControls() {
    return `
      <div class="knob-group">
        <label>Forme du son</label>
        <div class="wave-selector">
          ${['sine','square','triangle','sawtooth'].map(w =>
            `<button class="wave-btn ${w === this._waveform ? 'active' : ''}" data-wave="${w}" title="${waveLabel(w)}">${waveIcon(w)}</button>`
          ).join('')}
        </div>
        <span class="knob-value" id="osc-wave-label">${waveLabel(this._waveform)}</span>
      </div>`;
  }

  bindControls(card, onChange) {
    card.querySelectorAll('.wave-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this._waveform = btn.dataset.wave;
        card.querySelectorAll('.wave-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const lbl = card.querySelector('#osc-wave-label');
        if (lbl) lbl.textContent = waveLabel(this._waveform);
        onChange();
      });
    });
  }
}

function waveLabel(w) {
  return { sine: 'Douce 🌊', square: 'Carrée ⬛', triangle: 'Triangle △', sawtooth: 'Dents de scie 🔪' }[w] || w;
}
function waveIcon(w) {
  return { sine: '〰️', square: '⬛', triangle: '🔺', sawtooth: '📐' }[w] || w;
}
