/** modules/delay.js — global, no ES modules */

function DelayModule() {
  this.type = 'delay';
  this._time     = 0.3;
  this._feedback = 0.4;
  this._node     = null;
  this._fbGain   = null;
}

DelayModule.info = function () {
  return {
    icon: '🔁',
    label: 'Écho',
    tooltip: "🔁 Je répète le son comme un écho dans une montagne ! Le bouton \"Temps\" contrôle quand l'écho arrive, et \"Répétition\" dit combien de fois il revient.",
  };
};

DelayModule.prototype.getAudioNode = function (ctx) {
  this._node = ctx.createDelay(2.0);
  this._node.delayTime.value = this._time;
  this._fbGain = ctx.createGain();
  this._fbGain.gain.value = this._feedback;
  this._node.connect(this._fbGain);
  this._fbGain.connect(this._node);
  return this._node;
};

DelayModule.prototype.renderControls = function () {
  return '<div class="knob-group">' +
    '<webaudio-knob id="delay-time-knob" min="0.01" max="1.5" value="' + this._time + '" step="0.01" diameter="54" midilearn="false"></webaudio-knob>' +
    '<label>Temps</label><span class="knob-value" id="delay-time-val">' + (this._time * 1000).toFixed(0) + ' ms</span></div>' +
    '<div class="knob-group">' +
    '<webaudio-knob id="delay-fb-knob" min="0" max="0.95" value="' + this._feedback + '" step="0.01" diameter="54" midilearn="false"></webaudio-knob>' +
    '<label>Répétitions</label><span class="knob-value" id="delay-fb-val">' + Math.round(this._feedback * 100) + '%</span></div>';
};

DelayModule.prototype.bindControls = function (card, onChange) {
  var self = this;
  var tk = card.querySelector('#delay-time-knob');
  var fk = card.querySelector('#delay-fb-knob');
  if (tk) tk.addEventListener('input', function (e) {
    self._time = parseFloat(e.target.value);
    if (self._node) self._node.delayTime.value = self._time;
    var lbl = card.querySelector('#delay-time-val');
    if (lbl) lbl.textContent = (self._time * 1000).toFixed(0) + ' ms';
    onChange();
  });
  if (fk) fk.addEventListener('input', function (e) {
    self._feedback = parseFloat(e.target.value);
    if (self._fbGain) self._fbGain.gain.value = self._feedback;
    var lbl = card.querySelector('#delay-fb-val');
    if (lbl) lbl.textContent = Math.round(self._feedback * 100) + '%';
    onChange();
  });
};
