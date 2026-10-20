/**
 * keyboard.js
 * Renders a 2-octave piano keyboard and handles note triggering
 * via mouse/touch and computer keyboard (AZERTY-friendly).
 */

import { audioEngine } from './audio-engine.js';

// Note frequencies C3 to B4
const BASE_FREQ = 130.813; // C3

const NOTE_NAMES = ['Do', 'Do#', 'Ré', 'Ré#', 'Mi', 'Fa', 'Fa#', 'Sol', 'Sol#', 'La', 'La#', 'Si'];
const IS_BLACK   = [false, true, false, true, false, false, true, false, true, false, true, false];

// AZERTY mapping for 2 octaves (24 notes: chromatic C3–B4)
// White keys row: a z e r t y u i o p
// Black keys row: &  é       (  -  è _  ^
const KEY_MAP_LOWER = {
  // Octave 1 (C3–B3) white: a z e r t y u i
  'a': 0,  'z': 2,  'e': 4,  'r': 5,  't': 7,  'y': 9,  'u': 11,
  // Octave 2 (C4–B4) white: i o p
  'i': 12, 'o': 14, 'p': 16, 'q': 17, 's': 19, 'd': 21, 'f': 23,
  // Black keys (sharps)
  '&': 1,  'é': 3,
  '"': 6,  "'": 8,  '(': 10,
  'j': 13, 'k': 15,
  'l': 18, 'm': 20, '%': 22,
};

function noteFreq(semitone) {
  return BASE_FREQ * Math.pow(2, semitone / 12);
}

export function initKeyboard() {
  const keyboardEl = document.getElementById('keyboard');
  const keys = [];

  for (let oct = 0; oct < 2; oct++) {
    for (let n = 0; n < 12; n++) {
      const semitone = oct * 12 + n;
      const freq = noteFreq(semitone);
      const isBlack = IS_BLACK[n];
      const label = NOTE_NAMES[n];

      const key = document.createElement('div');
      key.className = isBlack ? 'key black' : 'key white';
      key.dataset.freq = freq;
      key.dataset.semitone = semitone;

      if (!isBlack) {
        key.innerHTML = `<span class="key-label">${label}</span>`;
      }

      key.addEventListener('pointerdown', e => { e.preventDefault(); triggerNote(freq, key); });
      key.addEventListener('pointerup',   () => releaseNote(freq, key));
      key.addEventListener('pointerleave',() => releaseNote(freq, key));

      keyboardEl.appendChild(key);
      keys.push({ semitone, freq, isBlack, el: key });
    }
  }

  // Build reverse map: semitone -> key element
  const semiToEl = {};
  keys.forEach(k => { semiToEl[k.semitone] = k.el; });

  // Keyboard events
  const pressed = new Set();
  document.addEventListener('keydown', e => {
    if (e.repeat) return;
    const semitone = KEY_MAP_LOWER[e.key];
    if (semitone === undefined) return;
    pressed.add(e.key);
    const freq = noteFreq(semitone);
    const el = semiToEl[semitone];
    triggerNote(freq, el);
  });
  document.addEventListener('keyup', e => {
    const semitone = KEY_MAP_LOWER[e.key];
    if (semitone === undefined) return;
    pressed.delete(e.key);
    const freq = noteFreq(semitone);
    const el = semiToEl[semitone];
    releaseNote(freq, el);
  });
}

function triggerNote(freq, el) {
  audioEngine.noteOn(freq);
  el?.classList.add('active');
  showNoteFlash(el);
}

function releaseNote(freq, el) {
  audioEngine.noteOff(freq);
  el?.classList.remove('active');
}

function showNoteFlash(el) {
  if (!el) return;
  el.classList.add('flash');
  setTimeout(() => el.classList.remove('flash'), 200);
}
