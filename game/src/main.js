// main.js — entrypoint game: hidupkan mesin, lalu terapkan preset tangkapan
// layar bila URL membawa ?shot=... (dipakai hanya untuk membuat screenshots/).

import { initGame } from './game.js';
import { applyShot } from './shots.js';

initGame();
applyShot();
