// 
import { $, showScreen, state, customFormatter } from './utils.js';
import { stopProgress } from './pvt.js';

export function endTask() {
  clearTimeout(state.stimulusTimeout);
  clearTimeout(state.taskEndTimeout);
  stopProgress();

  showScreen('#end-screen');
  state.CLICK_NOW = false;

  const resultsEl       = $('#results');
  const fullResultsEl   = $('#full-reaction-times');
  const data            = buildPVT_PANAS_Result();
  const json            = customFormatter(data);

  resultsEl.textContent     = data.summaryText;
  fullResultsEl.textContent = `Full Results:\n${json}`;

  navigator.clipboard.writeText(json).catch(()=>{});
  window.sendMessage(json, [data.test_type, 'json']);

  state.isCombinedTest = false;
}

function buildPVT_PANAS_Result() {
  const out = {
    test_datetime: new Date().toLocaleString(),
    events: state._EVENTS
  };

  // PVT metrics
  if (state.reactionTimes.length) {
    const sorted = [...state.reactionTimes].sort((a,b)=>a-b);
    const filtered = sorted.slice(
      Math.ceil(sorted.length*0.05),
      Math.floor(sorted.length*0.95)
    );
    const avg = filtered.reduce((a,b)=>a+b,0)/filtered.length;
    out.test_type           = state.isCombinedTest?'PANAS+PVT':'PVT';
    out.averageReactionTime = `${avg.toFixed(2)} ms`;
    out.testDuration        = `${state.testDuration} s`;
    out.minRestDuration     = `${state.minDelay} ms`;
    out.maxRestDuration     = `${state.maxDelay} ms`;
    out.totalTrials         = state.reactionTimes.length;
    out.filteredTrials      = filtered.length;
    out.reactionTimes       = state.reactionTimes;
    out.summaryText         = `Average RT: ${avg.toFixed(2)} ms ( ${filtered.length} of ${state.reactionTimes.length} trials )`;
  }

  // PANAS metrics
  if (state.panasResponses.length) {
    const posList = ["Interested","Excited","Strong","Enthusiastic","Proud","Alert","Inspired","Determined","Attentive","Active"];
    const negList = ["Distressed","Upset","Guilty","Scared","Hostile","Irritable","Ashamed","Nervous","Jittery","Afraid"];
    const pos = posList.reduce((sum,word)=>{
      const r = state.panasResponses.find(r=>r[0]===word);
      return sum + (r?r[1]:0);
    },0)/10;
    const neg = negList.reduce((sum,word)=>{
      const r = state.panasResponses.find(r=>r[0]===word);
      return sum + (r?r[1]:0);
    },0)/10;
    out.test_type         = state.reactionTimes.length?'PANAS+PVT':'PANAS';
    out.panasResponses    = state.panasResponses;
    out.panasPositiveScore= pos.toFixed(2);
    out.panasNegativeScore= neg.toFixed(2);
    if (!state.reactionTimes.length)
      out.summaryText = `PANAS – +:${pos.toFixed(2)}, -:${neg.toFixed(2)}`;
  }

  // BrainFog
  if (state.brainFogResponses.length) {
    out.brainFogResponses = state.brainFogResponses;
  }

  return out;
}

export function endPhq9() {
  showScreen('#end-screen');
  const total = state.phq9Responses.reduce((s,r)=>s+r[1],0);
  const data  = {
    test_datetime: new Date().toLocaleString(),
    test_type: 'PHQ-9',
    phq9Responses: state.phq9Responses,
    phq9TotalScore: total
  };
  $('#results').textContent = `PHQ-9 Total Score: ${total} / 27`;
  const json = customFormatter(data);
  $('#full-reaction-times').textContent = `Full Results:\n${json}`;
  navigator.clipboard.writeText(json).catch(()=>{});
  window.sendMessage(json, ['PHQ-9','json']);
}
