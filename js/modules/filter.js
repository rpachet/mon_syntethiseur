/** modules/filter.js — global, no ES modules */

function FilterModule() {
  this.type = 'filter';
  this._frequency = 2000;
  this._resonance = 1;
  this._node = null;
}

FilterModule.info = function () {
  return {
    icon: '🔮',
    label: 'Filtre',
    tooltip: '🔮 Je change la couleur du son ! Tourne le bouton pour rendre le son plus grave (sombre) ou plus aigu (brillant).',
  };
};

FilterModule.prototype.getAudioNode = function (ctx) {
  this._node = ctx.createBiquadFilter();
  this._node.type = 'lowpass';
  this._node.frequency.value = this._frequency;
  this._node.Q.value = this._resonance;
  return this._node;
};

FilterModule.prototype.renderControls = function () {
  return '<div class="knob-group">' +
    '<webaudio-knob id="filter-freq-knob" min="80" max="18000" value="' + this._frequency + '" step="1" diameter="54" midilearn="false"></webaudio-knob>' +
    '<label>Coupure</label><span class="knob-value" id="filter-freq-val">' + Math.round(this._frequency) + ' Hz</span></div>' +
    '<div class="knob-group">' +
    '<webaudio-knob id="filter-res-knob" min="0.1" max="20" value="' + this._resonance + '" step="0.01" diameter="54" midilearn="false"></webaudio-knob>' +
    '<label>Résonance</label><span class="knob-value" id="filter-res-val">' + this._resonance.toFixed(1) + '</span></div>';
};

FilterModule.prototype.bindControls = function (card, onChange) {
  var self = this;
  var freqKnob = card.querySelector('#filter-freq-knob');
  var resKnob  = card.querySelector('#filter-res-knob');
  if (freqKnob) freqKnob.addEventListener('input', function (e) {
    self._frequency = parseFloat(e.target.value);
    var lbl = card.querySelector('#filter-freq-val');
    if (lbl) lbl.textContent = Math.round(self._frequency) + ' Hz';
    if (self._node) self._node.frequency.value = self._frequency;
    onChange();
  });
  if (resKnob) resKnob.addEventListener('input', function (e) {
    self._resonance = parseFloat(e.target.value);
    var lbl = card.querySelector('#filter-res-val');
    if (lbl) lbl.textContent = self._resonance.toFixed(1);
    if (self._node) self._node.Q.value = self._resonance;
    onChange();
  });
};
