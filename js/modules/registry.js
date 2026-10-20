/**
 * modules/registry.js — maps type strings to global constructors
 * No ES modules — relies on global scope from loaded scripts.
 */

var MODULE_REGISTRY = {
  oscillator: OscillatorModule,
  filter:     FilterModule,
  envelope:   EnvelopeModule,
  lfo:        LfoModule,
  reverb:     ReverbModule,
  delay:      DelayModule,
  volume:     VolumeModule,
};
