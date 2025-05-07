// panas.js
import { $, showScreen, logEvent, state } from './utils.js';
import { startTask } from './pvt.js';
import { endTask } from './results.js';

const ITEMS = [
      { en: "Interested", ru: "Увлеченный" },
      { en: "Distressed", ru: "Подавленный" },
      { en: "Excited", ru: "Радостный" },
      { en: "Upset", ru: "Расстроенный" },
      { en: "Strong", ru: "Полный сил" },
      { en: "Guilty", ru: "Виноватый" },
      { en: "Scared", ru: "Испуганный" },
      { en: "Hostile", ru: "Злой" },
      { en: "Enthusiastic", ru: "Заинтересованный" },
      { en: "Proud", ru: "Уверенный" },
      { en: "Irritable", ru: "Раздраженный" },
      { en: "Alert", ru: "Сосредоточенный" },
      { en: "Ashamed", ru: "Стыдящийся" },
      { en: "Inspired", ru: "Вдохновленный" },
      { en: "Nervous", ru: "Нервный" },
      { en: "Determined", ru: "Решительный" },
      { en: "Attentive", ru: "Внимательный" },
      { en: "Jittery", ru: "Беспокойный" },
      { en: "Active", ru: "Бодрый" },
      { en: "Afraid", ru: "Тревожный" }
];
const OPTIONS = [
  { value: 1, en: "Very slightly or not at all", ru: "Почти или совсем нет" },
  { value: 2, en: "A little",                     ru: "Немного" },
  { value: 3, en: "Moderately",                   ru: "Умеренно" },
  { value: 4, en: "Quite a bit",                  ru: "Значительно" },
  { value: 5, en: "Extremely",                    ru: "Очень сильно" }
];

let currentItemIndex = 0;

let currentITEMS = [];

export function initPANAS() {
  $('#start-panas-btn').addEventListener('click', () => {
    state.isCombinedTest = false;
    startPANAS();
  });
  // build option buttons once
  const container = $('#panas-options');
  container.innerHTML = OPTIONS.map(opt => `
    <button class="panas-option-btn" data-value="${opt.value}">
      ${opt.value}: ${opt.en}<br>${opt.ru}
    </button>
  `).join('');
  container.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', () => recordResponse(+btn.dataset.value));
  });
}

export function startPANAS() {
  state.panasResponses = [];
  state.currentPanasIndex = 0;
  currentITEMS = ITEMS.sort(() => Math.random() - 0.5);
  state._EVENTS = [];
  showScreen('#panas-screen');
  state.panasStartTime = Date.now();
  showNext();
}

function showNext() {
  if (state.currentPanasIndex >= ITEMS.length) {
    $('#panas-screen').style.display = 'none';
    if (state.isCombinedTest) return startTask();
    return endTask();
  }
  const item = currentITEMS[state.currentPanasIndex];
  $('#panas-word-en').textContent = item.en;
  $('#panas-word-ru').textContent = item.ru;
}

function recordResponse(val) {
  const item = ITEMS[state.currentPanasIndex];
  state.panasResponses.push([item.en, val, Date.now() - state.panasStartTime]);
  logEvent('panas_' + item.en);
  state.currentPanasIndex++;
  showNext();
}
