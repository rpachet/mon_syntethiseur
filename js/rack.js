/**
 * rack.js
 * Handles drag-and-drop of modules from palette into the rack.
 * Calls audioEngine.setModules() whenever the rack changes.
 */

import { audioEngine } from './audio-engine.js';
import { MODULE_REGISTRY } from './modules/registry.js';

let rackModules = []; // ordered array of SynthModule instances

export function initRack() {
  const palette = document.getElementById('palette');
  const rack    = document.getElementById('rack');

  // Populate palette cards
  for (const [type, ModClass] of Object.entries(MODULE_REGISTRY)) {
    const card = makePaletteCard(type, ModClass);
    palette.appendChild(card);
  }

  // Drop zone on rack
  rack.addEventListener('dragover', e => { e.preventDefault(); rack.classList.add('drag-over'); });
  rack.addEventListener('dragleave', () => rack.classList.remove('drag-over'));
  rack.addEventListener('drop', e => {
    e.preventDefault();
    rack.classList.remove('drag-over');
    const type    = e.dataTransfer.getData('module-type');
    const fromIdx = e.dataTransfer.getData('rack-index');

    if (fromIdx !== '') {
      // Reordering within rack — handled by the module cards themselves
      return;
    }

    if (type && MODULE_REGISTRY[type]) {
      addModuleToRack(type);
    }
  });

  // Initialise with default chain: oscillator → envelope → volume
  addModuleToRack('oscillator');
  addModuleToRack('envelope');
  addModuleToRack('volume');
}

function makePaletteCard(type, ModClass) {
  const info = ModClass.info();
  const card = document.createElement('div');
  card.className = 'palette-card';
  card.draggable = true;
  card.dataset.type = type;
  card.innerHTML = `<span class="mod-icon">${info.icon}</span><span class="mod-name">${info.label}</span>`;

  // Tooltip
  const tip = document.createElement('div');
  tip.className = 'tooltip';
  tip.textContent = info.tooltip;
  card.appendChild(tip);

  card.addEventListener('dragstart', e => {
    e.dataTransfer.setData('module-type', type);
    e.dataTransfer.setData('rack-index', '');
    card.classList.add('dragging');
  });
  card.addEventListener('dragend', () => card.classList.remove('dragging'));
  return card;
}

function addModuleToRack(type) {
  const ModClass = MODULE_REGISTRY[type];
  if (!ModClass) return;
  const mod = new ModClass();
  rackModules.push(mod);
  renderRack();
  syncEngine();
}

function removeModuleFromRack(idx) {
  rackModules.splice(idx, 1);
  renderRack();
  syncEngine();
}

function moveModule(fromIdx, toIdx) {
  if (fromIdx === toIdx) return;
  const [mod] = rackModules.splice(fromIdx, 1);
  rackModules.splice(toIdx, 0, mod);
  renderRack();
  syncEngine();
}

function renderRack() {
  const rack = document.getElementById('rack');
  rack.innerHTML = '';

  if (rackModules.length === 0) {
    rack.innerHTML = '<div class="rack-empty">🎛️ Glisse ici tes modules pour créer ton son !</div>';
    return;
  }

  rackModules.forEach((mod, idx) => {
    const info  = mod.constructor.info();
    const card  = document.createElement('div');
    card.className = 'rack-card';
    card.dataset.type = mod.type;
    card.draggable = true;

    // Header
    const header = document.createElement('div');
    header.className = 'rack-card-header';
    header.innerHTML = `<span>${info.icon} ${info.label}</span>`;

    // Tooltip
    const tip = document.createElement('div');
    tip.className = 'tooltip';
    tip.textContent = info.tooltip;
    header.appendChild(tip);

    // Remove button
    const removeBtn = document.createElement('button');
    removeBtn.className = 'remove-btn';
    removeBtn.title = 'Enlever ce module';
    removeBtn.textContent = '✕';
    removeBtn.addEventListener('click', () => removeModuleFromRack(idx));
    header.appendChild(removeBtn);

    // Controls from the module
    const controls = document.createElement('div');
    controls.className = 'rack-card-controls';
    controls.innerHTML = mod.renderControls();

    card.appendChild(header);
    card.appendChild(controls);

    // Drag within rack to reorder
    card.addEventListener('dragstart', e => {
      e.dataTransfer.setData('rack-index', idx);
      e.dataTransfer.setData('module-type', '');
      card.classList.add('dragging');
    });
    card.addEventListener('dragend', () => card.classList.remove('dragging'));
    card.addEventListener('dragover', e => { e.preventDefault(); card.classList.add('drag-over-card'); });
    card.addEventListener('dragleave', () => card.classList.remove('drag-over-card'));
    card.addEventListener('drop', e => {
      e.stopPropagation();
      e.preventDefault();
      card.classList.remove('drag-over-card');
      const fromIdx = parseInt(e.dataTransfer.getData('rack-index'));
      if (!isNaN(fromIdx) && fromIdx !== idx) moveModule(fromIdx, idx);
    });

    rack.appendChild(card);

    // Bind control events after DOM insertion
    mod.bindControls(card, () => syncEngine());
  });
}

function syncEngine() {
  audioEngine.setModules(rackModules);
  audioEngine.updateMasterVolume();
}
