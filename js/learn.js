/**
 * learn.js
 * Guided melody mode — highlights the next key to press,
 * rewards correct notes with confetti.
 */

const LEARN_BASE_FREQ = 130.813; // C3

function semitone(n) { return LEARN_BASE_FREQ * Math.pow(2, n / 12); }

const MELODIES = {
  frere_jacques: {
    label: 'Frère Jacques 🎶',
    notes: [0,2,4,0, 0,2,4,0, 4,5,7, 4,5,7, 7,9,7,5,4,0, 7,9,7,5,4,0, 0,7,0, 0,7,0],
  },
  au_clair: {
    label: 'Au clair de la lune 🌙',
    notes: [0,0,0,2,4,2, 0,4,2,2,0, 0,0,0,2,4,2, 0,4,2,2,0],
  },
  jingle: {
    label: 'Jingle Bells 🔔',
    notes: [
      7,4,2,0,7, 7,7,7,7,7,4,4,4,4,5,4,2,5,
      7,4,2,0,7, 7,7,7,7,7,4,4,4,4,5,4,2,0,
      4,4,4, 4,4,4, 4,7,0,2,4, 5,5,5,5,5,4,4,4,4,2,2,4,2,7,
    ],
  },
  pop_lumineuse: {
    label: 'Le robot rigolo 🤖',
    lyrics: 'Robot rigolo, danse dans le salon. Il tourne et saute, quelle drôle de chanson !',
    notes: [
      7,9,12,9,7,4,7,9, 7,9,12,14,12,9,7,4,
      5,7,9,7,5,2,5,7, 4,7,9,12,9,7,4,0,
    ],
  },
  electro_pulse: {
    label: 'Mission fusée 🚀',
    lyrics: 'On part dans l’espace, tout près des étoiles. La lune nous sourit, notre fusée décolle !',
    notes: [
      0,7,12,7, 2,9,14,9, 4,11,16,11, 7,14,19,14,
      4,11,16,11, 2,9,14,9, 0,7,12,7, 7,14,19,14,
    ],
  },
  lo_fi: {
    label: 'La récré des copains ⚽',
    lyrics: 'Dans la cour, on joue au ballon. On rit ensemble, quelle récréation !',
    notes: [
      0,4,7,9,7,4, 2,5,9,7,5,2,
      4,7,11,9,7,4, 0,4,7,12,9,7,
    ],
  },
};

let currentMelody = null;
let currentStep   = 0;
let isActive      = false;

function initLearnMode() {
  const toggleBtn  = document.getElementById('learn-toggle');
  const melodySelect = document.getElementById('melody-select');
  const learnPanel   = document.getElementById('learn-panel');

  // Populate melody select
  for (const [key, mel] of Object.entries(MELODIES)) {
    const opt = document.createElement('option');
    opt.value = key;
    opt.textContent = mel.label;
    melodySelect.appendChild(opt);
  }

  toggleBtn.addEventListener('click', () => {
    isActive = !isActive;
    toggleBtn.classList.toggle('active', isActive);
    learnPanel.classList.toggle('hidden', !isActive);
    if (isActive) startMelody(melodySelect.value);
    else          stopMelody();
  });

  melodySelect.addEventListener('change', () => {
    if (isActive) startMelody(melodySelect.value);
  });
}

function startMelody(key) {
  currentMelody = MELODIES[key];
  currentStep   = 0;
  document.getElementById('learn-lyrics').textContent = currentMelody.lyrics || '';
  highlightNext();
}

function stopMelody() {
  clearHighlights();
  document.getElementById('learn-lyrics').textContent = '';
  currentMelody = null;
  currentStep   = 0;
}

function checkLearnNote(freq) {
  if (!isActive || !currentMelody) return;
  const expected = semitone(currentMelody.notes[currentStep]);
  if (Math.abs(freq - expected) < 1) {
    onCorrect();
  } else {
    onWrong();
  }
}

function onCorrect() {
  spawnConfetti();
  currentStep++;
  if (currentStep >= currentMelody.notes.length) {
    currentStep = 0;
    showBravo();
  }
  setTimeout(highlightNext, 200);
}

function onWrong() {
  const active = document.querySelector('.key.guide');
  if (active) {
    active.classList.add('wrong');
    setTimeout(() => active.classList.remove('wrong'), 300);
  }
}

function highlightNext() {
  clearHighlights();
  if (!currentMelody) return;
  const semi = currentMelody.notes[currentStep];
  const el   = document.querySelector(`.key[data-semitone="${semi}"]`);
  if (el) el.classList.add('guide');
}

function clearHighlights() {
  document.querySelectorAll('.key.guide').forEach(el => el.classList.remove('guide'));
}

function spawnConfetti() {
  const colors = ['#ff6b6b','#ffd93d','#6bcb77','#4d96ff','#ff6bcd'];
  for (let i = 0; i < 24; i++) {
    const p = document.createElement('div');
    p.className = 'confetti-particle';
    p.style.cssText = `
      left:${20 + Math.random() * 60}%;
      background:${colors[Math.floor(Math.random() * colors.length)]};
      animation-duration:${0.6 + Math.random() * 0.8}s;
      animation-delay:${Math.random() * 0.2}s;
      width:${6 + Math.random() * 8}px;
      height:${6 + Math.random() * 8}px;
      border-radius:${Math.random() > 0.5 ? '50%' : '2px'};
    `;
    document.body.appendChild(p);
    p.addEventListener('animationend', () => p.remove());
  }
}

function showBravo() {
  const el = document.createElement('div');
  el.className = 'bravo-msg';
  el.textContent = '🎉 Bravo ! Tu l\'as fait !';
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 2500);
}
