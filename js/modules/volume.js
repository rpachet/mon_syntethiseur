/** modules/volume.js — global, no ES modules */

function VolumeModule() {
  this.type = 'volume';
  this._volume = 0.7;
}

VolumeModule.info = function () {
  return {
    icon: '🔊',
    label: 'Volume',
    tooltip: '🔊 Je contrôle si le son est très fort ou très doux ! Tourne le bouton vers la droite pour monter le volume.',
  };
};

VolumeModule.prototype.getVolume    = function () { return this._volume; };
VolumeModule.prototype.getAudioNode = function () { return null; };

VolumeModule.prototype.renderControls = function () {
  return '<div class="knob-group">' +
    '<webaudio-knob id="vol-knob" min="0" max="1" value="' + this._volume + '" step="0.01" diameter="64" midilearn="false"></webaudio-knob>' +
    '<label>Volume</label><span class="knob-value" id="vol-val">' + Math.round(this._volume * 100) + '%</span></div>';
};

VolumeModule.prototype.bindControls = function (card, onChange) {
  var self = this;
  var vk = card.querySelector('#vol-knob');
  if (vk) vk.addEventListener('input', function (e) {
    self._volume = parseFloat(e.target.value);
    var lbl = card.querySelector('#vol-val');
    if (lbl) lbl.textContent = Math.round(self._volume * 100) + '%';
    onChange();
  });
};
