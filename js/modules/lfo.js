/** modules/lfo.js — global, no ES modules */

function LfoModule() {
  this.type = 'lfo';
  this._rate  = 4;
  this._depth = 20;
  this._node  = null;
  this._gain  = null;
}

LfoModule.info = function () {
  return {
    icon: '🌊',
    label: 'LFO (Vibrato)',
    tooltip: '🌊 Je fais trembler ou vibrer le son ! Plus le bouton "Vitesse" est grand, plus ça tremble vite.',
  };
};

LfoModule.prototype.getAudioNode = function (ctx) {
  this._node = ctx.createOscillator();
  this._node.frequency.value = this._rate;
  this._gain = ctx.createGain();
  this._gain.gain.value = this._depth;
  this._node.connect(this._gain);
  this._node.start();
  var passthrough = ctx.createGain();
  passthrough.gain.value = 1;
  return passthrough;
};

LfoModule.prototype.renderControls = function () {
  return '<div class="knob-group">' +
    '<webaudio-knob id="lfo-rate-knob" min="0.1" max="20" value="' + this._rate + '" step="0.1" diameter="54" midilearn="false"></webaudio-knob>' +
    '<label>Vitesse</label><span class="knob-value" id="lfo-rate-val">' + this._rate.toFixed(1) + ' Hz</span></div>' +
    '<div class="knob-group">' +
    '<webaudio-knob id="lfo-depth-knob" min="0" max="200" value="' + this._depth + '" step="1" diameter="54" midilearn="false"></webaudio-knob>' +
    '<label>Intensité</label><span class="knob-value" id="lfo-depth-val">' + this._depth + ' ¢</span></div>';
};

LfoModule.prototype.bindControls = function (card, onChange) {
  var self = this;
  var rk = card.querySelector('#lfo-rate-knob');
  var dk = card.querySelector('#lfo-depth-knob');
  if (rk) rk.addEventListener('input', function (e) {
    self._rate = parseFloat(e.target.value);
    if (self._node) self._node.frequency.value = self._rate;
    var lbl = card.querySelector('#lfo-rate-val');
    if (lbl) lbl.textContent = self._rate.toFixed(1) + ' Hz';
    onChange();
  });
  if (dk) dk.addEventListener('input', function (e) {
    self._depth = parseFloat(e.target.value);
    if (self._gain) self._gain.gain.value = self._depth;
    var lbl = card.querySelector('#lfo-depth-val');
    if (lbl) lbl.textContent = self._depth + ' ¢';
    onChange();
  });
};
