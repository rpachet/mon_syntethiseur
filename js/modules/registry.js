/**
 * modules/registry.js
 * Central import of all available module classes.
 */

import { OscillatorModule } from './oscillator.js';
import { FilterModule     } from './filter.js';
import { EnvelopeModule   } from './envelope.js';
import { LfoModule        } from './lfo.js';
import { ReverbModule     } from './reverb.js';
import { DelayModule      } from './delay.js';
import { VolumeModule     } from './volume.js';

export const MODULE_REGISTRY = {
  oscillator: OscillatorModule,
  filter:     FilterModule,
  envelope:   EnvelopeModule,
  lfo:        LfoModule,
  reverb:     ReverbModule,
  delay:      DelayModule,
  volume:     VolumeModule,
};
