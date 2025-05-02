// 
import { initPVT }       from './pvt.js';
import { initPANAS }     from './panas.js';
import { initPHQ9 }      from './phq9.js';
import { initBrainFog }  from './brainfog.js';
import { showScreen }    from './utils.js';

document.addEventListener('DOMContentLoaded', () => {
  // hide all, show start
  showScreen('#start-screen');

  // wire up each module
  initPVT();
  initPANAS();
  initPHQ9();
  initBrainFog();

  // restart button
  document.getElementById('restart-btn')
          .addEventListener('click', ()=> showScreen('#start-screen'));
});
