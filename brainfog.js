// brainfog.js
import { $, showScreen, logEvent, state } from './utils.js';
import { startPANAS } from './panas.js';
import { endTask }    from './results.js';

const ITEMS = [
      { key: "clarity", en: "How clear-headed do you feel right now?", ru: "Насколько ясно вы себя чувствуете?", labels: ["Extremely foggy\nКрайне затуманено", "Somewhat clear\nУмеренно ясно", "Completely clear\nПолностью ясно"] },
      { key: "energy", en: "How mentally energetic do you feel right now?", ru: "Насколько энергично вы себя чувствуете?", labels: ["Totally exhausted\nПолностью истощен", "Moderately energetic\nУмеренно бодр", "Very energetic\nОчень бодр"] },
      { key: "concentration", en: "How easy is it for you to concentrate right now?", ru: "Насколько легко вам сосредоточиться?", labels: ["Very difficult\nОчень трудно", "Moderate effort\nСреднее усилие", "Effortless\nБез усилий"] },
      { key: "memory", en: "How confident are you in your memory for new information?", ru: "Насколько вы уверены в своей памяти?", labels: ["Very forgetful\nОчень забывчив", "Moderate confidence\nУмеренная уверенность", "Very confident\nОчень уверен"] },
      { key: "focus", en: "How stable is your focus right now?", ru: "Насколько устойчиво ваше внимание?", labels: ["Mind constantly wanders\nПостоянно отвлекаюсь", "Some drifting\nИногда отвлекаюсь", "Very stable\nОчень устойчиво"] }
    ];

export function initBrainFog() {
  $('#start-brainfog-btn').addEventListener('click', () => {
    state.isCombinedTest = false;
    startBrainFog();
  });
  $('#start-combined-btn').addEventListener('click', () => {
    state.isCombinedTest = true;
    startBrainFog();
  });
}

export function startBrainFog() {
  state.brainFogResponses  = [];
  state.currentBrainFogIndex = 0;
  state._EVENTS = [];
  showScreen('#brainfog-screen');
  state.brainFogStartTime = Date.now();
  showNext();
}

function showNext() {
  const item = ITEMS[state.currentBrainFogIndex];
  $('#brainfog-question-en').textContent = item.en;
  $('#brainfog-question-ru').textContent = item.ru;
  $('#label-left').textContent  = `0 – ${item.labels[0]}`;
  $('#label-right').textContent = `10 – ${item.labels[2]}`;
  $('#brainfog-mid-label').textContent = `5 – ${item.labels[1]}`;

  const container = $('#brainfog-options');
  container.innerHTML = '';
  for (let i=0; i<=10; i++) {
    const btn = document.createElement('button');
    btn.textContent = i;
    btn.className = 'brainfog-option-btn';
    btn.addEventListener('click', () => recordResponse(i));
    container.appendChild(btn);
  }
}

function recordResponse(val) {
  const item = ITEMS[state.currentBrainFogIndex];
  state.brainFogResponses.push([item.key, val, Date.now() - state.brainFogStartTime]);
  logEvent('brainfog_' + item.key);
  state.currentBrainFogIndex++;
  if (state.currentBrainFogIndex >= ITEMS.length) {
    $('#brainfog-screen').style.display = 'none';
    return state.isCombinedTest ? startPANAS() : endTask();
  }
  showNext();
}
