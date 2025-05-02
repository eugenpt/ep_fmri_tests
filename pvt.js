// pvt.js
import { $, $$, showScreen, logEvent, state } from './utils.js';
import { endTask } from './results.js';

let stimulus, progressBar, taskScreen, startScreen, inputs, presetButtons;
let progressInterval;

export function initPVT() {
  startScreen   = $('#start-screen');
  taskScreen    = $('#task-screen');
  stimulus      = $('#stimulus');
  progressBar   = $('#progress-bar');
  inputs = {
    duration: $('#test-duration'),
    minDelay: $('#min-delay'),
    maxDelay: $('#max-delay'),
  };
  presetButtons = $$('.preset-btn');

  $('#start-btn').addEventListener('click', startTask);
  presetButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const d   = +btn.dataset.duration;
      const mi  = +btn.dataset.minDelay;
      const ma  = +btn.dataset.maxDelay;
      inputs.duration.value = d;
      inputs.minDelay.value  = mi;
      inputs.maxDelay.value  = ma;
    });
  });

  taskScreen.addEventListener('mousedown', onTaskScreenMouseDown);
  $('#stop-btn').addEventListener('click', endTask);
}

function onTaskScreenMouseDown() {
  const now = Date.now();
  state.clickTimes.push(now - state.taskStartTime);
  if (state.CLICK_NOW) {
    logEvent('click');
    state.reactionTimes.push(now - state.startTime);
    scheduleStimulus();
  } else {
    logEvent('false_click');
  }
}

export function startTask() {
  state.testDuration = +inputs.duration.value || 60;
  state.minDelay     = +inputs.minDelay.value  || 2000;
  state.maxDelay     = +inputs.maxDelay.value  || 10000;

  state.reactionTimes = [];
  state.delays        = [];
  state.clickTimes    = [];
  state._EVENTS       = [];

  showScreen('#task-screen');
  state.taskStartTime = Date.now();
  logEvent('pvt_start');
  scheduleStimulus();
  startProgress();

  state.taskEndTimeout = setTimeout(endTask, state.testDuration * 1000);
}

function scheduleStimulus() {
  const delay = Math.random() * (state.maxDelay - state.minDelay) + state.minDelay;
  state.delays.push(Math.round(delay));

  stimulus.textContent = 'Get Ready…';
  stimulus.style.color = '';
  state.CLICK_NOW = false;

  clearTimeout(state.stimulusTimeout);
  state.stimulusTimeout = setTimeout(() => {
    stimulus.textContent = 'Click Now!';
    stimulus.style.color = 'red';
    state.CLICK_NOW = true;
    state.startTime = Date.now();
    logEvent('stimulus');
  }, delay);
}

function startProgress() {
  updateProgress();
  progressInterval = setInterval(updateProgress, 250);
}

function updateProgress() {
  const elapsed = (Date.now() - state.taskStartTime) / 1000;
  const pct     = Math.min(100, (elapsed / state.testDuration) * 100);
  progressBar.style.width = pct + '%';
}

export function stopProgress() {
  clearInterval(progressInterval);
  updateProgress();
}
