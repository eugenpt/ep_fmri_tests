export const $  = s => document.querySelector(s);
export const $$ = s => Array.from(document.querySelectorAll(s));

export function showScreen(selector) {
  $$('.container').forEach(c => c.style.display = 'none');
  $(selector).style.display = 'block';
}

export function logEvent(name) {
  const { taskStartTime, _EVENTS } = state;
  _EVENTS.push([name, Date.now() - taskStartTime]);
}

// super-compact JSON encoder
export function customFormatter(obj) {
  function formatValue(value, indent = '') {
    if (Array.isArray(value)) {
      const items = value.map(item => formatValue(item, indent)).join(', ');
      return `[${items}]`;
    }
    if (typeof value === 'object' && value !== null) {
      const nextIndent = indent + '  ';
      const items = Object.entries(value).map(([key, val]) => 
        `${nextIndent}"${key}": ${formatValue(val, nextIndent)}`
      ).join(',\n');
      return `{\n${items}\n${indent}}`;
    }
    if (typeof value === 'string') return `"${value}"`;
    return value;
  }
  return formatValue(obj);
}

export const state = {
  reactionTimes: [],
  delays: [],
  clickTimes: [],
  _EVENTS: [],
  testDuration: 60,
  minDelay: 2000,
  maxDelay: 10000,
  startTime: null,
  stimulusTimeout: null,
  taskEndTimeout: null,
  taskStartTime: null,
  CLICK_NOW: false,
  isCombinedTest: false,
  panasResponses: [],
  currentPanasIndex: 0,
  phq9Responses: [],
  currentPhq9Index: 0,
  brainFogResponses: [],
  currentBrainFogIndex: 0,
  brainFogStartTime: null,
  panasStartTime: null,
  phq9StartTime: null
};
