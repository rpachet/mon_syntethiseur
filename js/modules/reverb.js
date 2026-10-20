/** modules/reverb.js — global, no ES modules */

function ReverbModule() {
  this.type = 'reverb';
  this._roomSize = 2.5;
  this._wetMix   = 0.5;
  this._convolver = null;
  this._wetGain   = null;
  this._dryGain   = null;
}

ReverbModule.info = function () {
  return {
    icon: '🏔️',
    label: 'Réverb',
    tooltip: "🏔️ Je donne l'impression que tu joues dans une grande salle ou une caverne ! Plus la taille est grande, plus ça résonne longtemps.",
  };
};

ReverbModule.prototype._buildIR = function (ctx) {
  var sr     = ctx.sampleRate;
  var length = Math.floor(sr * this._roomSize);
  var ir     = ctx.createBuffer(2, length, sr);
  for (var c = 0; c < 2; c++) {
    var data = ir.getChannelData(c);
    for (var i = 0; i < length; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 2);
    }
  }
  return ir;
};

ReverbModule.prototype.getAudioNode = function (ctx) {
  this._convolver = ctx.createConvolver();
  this._convolver.buffer = this._buildIR(ctx);
  this._wetGain = ctx.createGain();
  this._wetGain.gain.value = this._wetMix;
  this._dryGain = ctx.createGain();
  this._dryGain.gain.value = 1 - this._wetMix;
  var merger = ctx.createGain();
  this._convolver.connect(this._wetGain);
  this._wetGain.connect(merger);
  this._dryGain.connect(merger);
  return merger;
};

ReverbModule.prototype.renderControls = function () {
  return '<div class="knob-group">' +
    '<webaudio-knob id="rev-size-knob" min="0.2" max="6" value="' + this._roomSize + '" step="0.1" diameter="54" midilearn="false"></webaudio-knob>' +
    '<label>Taille de salle</label><span class="knob-value" id="rev-size-val">' + this._roomSize.toFixed(1) + ' s</span></div>' +
    '<div class="knob-group">' +
    '<webaudio-knob id="rev-wet-knob" min="0" max="1" value="' + this._wetMix + '" step="0.01" diameter="54" midilearn="false"></webaudio-knob>' +
    '<label>Mélange</label><span class="knob-value" id="rev-wet-val">' + Math.round(this._wetMix * 100) + '%</span></div>';
};

ReverbModule.prototype.bindControls = function (card, onChange) {
  var self = this;
  var sk = card.querySelector('#rev-size-knob');
  var wk = card.querySelector('#rev-wet-knob');
  if (sk) sk.addEventListener('input', function (e) {
    self._roomSize = parseFloat(e.target.value);
    var lbl = card.querySelector('#rev-size-val');
    if (lbl) lbl.textContent = self._roomSize.toFixed(1) + ' s';
    onChange();
  });
  if (wk) wk.addEventListener('input', function (e) {
    self._wetMix = parseFloat(e.target.value);
    if (self._wetGain) self._wetGain.gain.value = self._wetMix;
    if (self._dryGain) self._dryGain.gain.value = 1 - self._wetMix;
    var lbl = card.querySelector('#rev-wet-val');
    if (lbl) lbl.textContent = Math.round(self._wetMix * 100) + '%';
    onChange();
  });
};
