/** modules/oscillator.js — global, no ES modules */

function OscillatorModule() {
  this.type = 'oscillator';
  this._waveform = 'sine';
}

OscillatorModule.info = function () {
  return {
    icon: '🎵',
    label: 'Oscillateur',
    tooltip: '🎵 Je crée le son de base ! Choisis si tu veux un son doux, carré, triangulaire ou en dents de scie.',
  };
};

OscillatorModule.prototype.getWaveform = function () { return this._waveform; };
OscillatorModule.prototype.getAudioNode = function () { return null; };

OscillatorModule.prototype.renderControls = function () {
  var self = this;
  var waves = ['sine', 'square', 'triangle', 'sawtooth'];
  var icons = { sine: '〰️', square: '⬛', triangle: '🔺', sawtooth: '📐' };
  var labels = { sine: 'Douce', square: 'Carrée', triangle: 'Triangle', sawtooth: 'Dents de scie' };
  var btns = waves.map(function (w) {
    return '<button class="wave-btn ' + (w === self._waveform ? 'active' : '') + '" data-wave="' + w + '" title="' + labels[w] + '">' + icons[w] + '</button>';
  }).join('');
  return '<div class="knob-group"><label>Forme du son</label><div class="wave-selector">' + btns + '</div><span class="knob-value" id="osc-wave-label">' + labels[self._waveform] + '</span></div>';
};

OscillatorModule.prototype.bindControls = function (card, onChange) {
  var self = this;
  var labels = { sine: 'Douce', square: 'Carrée', triangle: 'Triangle', sawtooth: 'Dents de scie' };
  card.querySelectorAll('.wave-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      self._waveform = btn.dataset.wave;
      card.querySelectorAll('.wave-btn').forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      var lbl = card.querySelector('#osc-wave-label');
      if (lbl) lbl.textContent = labels[self._waveform];
      onChange();
    });
  });
};
