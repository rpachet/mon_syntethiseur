/** modules/envelope.js — global, no ES modules */

function EnvelopeModule() {
  this.type = 'envelope';
  this._attack  = 0.02;
  this._release = 0.4;
}

EnvelopeModule.info = function () {
  return {
    icon: '📈',
    label: 'Enveloppe',
    tooltip: "📈 Je décide comment le son démarre et comment il s'arrête ! Une attaque rapide = le son arrive d'un coup. Un relâchement long = le son disparaît doucement.",
  };
};

EnvelopeModule.prototype.getAttack  = function () { return this._attack; };
EnvelopeModule.prototype.getRelease = function () { return this._release; };
EnvelopeModule.prototype.getAudioNode = function () { return null; };

EnvelopeModule.prototype.renderControls = function () {
  return '<div class="knob-group">' +
    '<webaudio-knob id="env-attack-knob" min="0.001" max="2" value="' + this._attack + '" step="0.001" diameter="54" midilearn="false"></webaudio-knob>' +
    '<label>Attaque</label><span class="knob-value" id="env-attack-val">' + (this._attack * 1000).toFixed(0) + ' ms</span></div>' +
    '<div class="knob-group">' +
    '<webaudio-knob id="env-release-knob" min="0.01" max="4" value="' + this._release + '" step="0.01" diameter="54" midilearn="false"></webaudio-knob>' +
    '<label>Relâchement</label><span class="knob-value" id="env-release-val">' + (this._release * 1000).toFixed(0) + ' ms</span></div>';
};

EnvelopeModule.prototype.bindControls = function (card, onChange) {
  var self = this;
  var ak = card.querySelector('#env-attack-knob');
  var rk = card.querySelector('#env-release-knob');
  if (ak) ak.addEventListener('input', function (e) {
    self._attack = parseFloat(e.target.value);
    var lbl = card.querySelector('#env-attack-val');
    if (lbl) lbl.textContent = (self._attack * 1000).toFixed(0) + ' ms';
    onChange();
  });
  if (rk) rk.addEventListener('input', function (e) {
    self._release = parseFloat(e.target.value);
    var lbl = card.querySelector('#env-release-val');
    if (lbl) lbl.textContent = (self._release * 1000).toFixed(0) + ' ms';
    onChange();
  });
};
