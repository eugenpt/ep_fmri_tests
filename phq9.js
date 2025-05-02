// phq9.js
import { $, showScreen, logEvent, state } from './utils.js';
import { endPhq9 } from './results.js';

const ITEMS = [
      { en: "Little interest or pleasure in doing things", ru: "Мало интереса или удовольствия от занятий" },
      { en: "Feeling down, depressed, or hopeless", ru: "Чувство уныния, депрессии или безнадежности" },
      { en: "Trouble falling or staying asleep, or sleeping too much", ru: "Проблемы с засыпанием, поддержанием сна или чрезмерный сон" },
      { en: "Feeling tired or having little energy", ru: "Чувство усталости или недостатка энергии" },
      { en: "Poor appetite or overeating", ru: "Плохой аппетит или переедание" },
      { en: "Feeling bad about yourself – or that you are a failure or have let yourself or your family down", ru: "Негативное мнение о себе или чувство провала перед собой и семьей" },
      { en: "Trouble concentrating on things, such as reading the newspaper or watching television", ru: "Трудности с концентрацией, например при чтении или просмотре ТВ" },
      { en: "Moving or speaking so slowly that other people could have noticed. Or the opposite – being fidgety or restless", ru: "Замедленные движения или речь, или наоборот – суетливость" },
      { en: "Thoughts that you would be better off dead or of hurting yourself", ru: "Мысли о том, что лучше умереть или навредить себе" }
];
const OPTIONS = [
  { value: 0, en: "Not at all",           ru: "Совсем не" },
  { value: 1, en: "Several days",         ru: "Несколько дней" },
  { value: 2, en: "More than half days",  ru: "Более половины дней" },
  { value: 3, en: "Nearly every day",     ru: "Почти каждый день" }
];

export function initPHQ9() {
  $('#start-phq9-btn').addEventListener('click', () => {
    state.isCombinedTest = false;
    startPHQ9();
  });
  // build options once
  const container = $('#phq9-options');
  container.innerHTML = OPTIONS.map(opt => `
    <button class="panas-option-btn" data-value="${opt.value}">
      ${opt.value}: ${opt.en}<br>${opt.ru}
    </button>
  `).join('');
  container.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', () => recordResponse(+btn.dataset.value));
  });
}

export function startPHQ9() {
  state.phq9Responses = [];
  state.currentPhq9Index = 0;
  state._EVENTS = [];
  showScreen('#phq9-screen');
  state.phq9StartTime = Date.now();
  showNext();
}

function showNext() {
  if (state.currentPhq9Index >= ITEMS.length) {
    $('#phq9-screen').style.display = 'none';
    return endPhq9();
  }
  const item = ITEMS[state.currentPhq9Index];
  $('#phq9-question-en').textContent = item.en;
  $('#phq9-question-ru').textContent = item.ru;
}

function recordResponse(val) {
  const item = ITEMS[state.currentPhq9Index];
  state.phq9Responses.push([item.en, val, Date.now() - state.phq9StartTime]);
  logEvent('phq9_' + item.en);
  state.currentPhq9Index++;
  showNext();
}
