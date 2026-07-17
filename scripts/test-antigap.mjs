#!/usr/bin/env node
// Test de propiedades del generador anti-huecos (PBU.antiGapSlots).
// Ejecuta:  node scripts/test-antigap.mjs
//
// Comprueba, sobre los 560 escenarios de la demo (6 sedes × 10 días × boxes ×
// 4 duraciones) más fixtures adversariales:
//   1. Ningún slot ofrecido solapa una reserva existente.
//   2. Ningún slot sale de la ventana [open, close].
//   3. CERO huecos muertos: todo hueco que deja un slot ofrecido es exactamente
//      rellenable con las duraciones reservables {45, 60, 90, 120}.
//   4. Simetría de anclas: si cabe pegado al inicio de una reserva sin dejar
//      hueco muerto, se ofrece.

import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
globalThis.window = {};
eval(readFileSync(resolve(root, 'utils.js'), 'utf8'));
const PBU = window.PBU;

const OPEN = 600, CLOSE = 1380;
const DURATIONS = [45, 60, 90, 120];

// Rellenabilidad exacta (referencia independiente del código bajo test)
const fill = new Array(CLOSE - OPEN + 1).fill(false);
fill[0] = true;
for (let g = 1; g < fill.length; g++) fill[g] = DURATIONS.some(d => g - d >= 0 && fill[g - d]);
const isDead = (g) => g > 0 && !fill[g];

// Misma disponibilidad determinista que usa Screen3Book
const seeded = (seed) => {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) { h ^= seed.charCodeAt(i); h = Math.imul(h, 16777619); }
  return () => {
    h = Math.imul(h ^ (h >>> 15), 2246822519);
    h = Math.imul(h ^ (h >>> 13), 3266489917);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
};
const mockExisting = (venueId, dayIdx, boxIdx) => {
  const rnd = seeded(`${venueId}-${dayIdx}-${boxIdx}`);
  const count = 2 + Math.floor(rnd() * 3);
  const slots = [];
  for (let i = 0; i < count; i++) {
    const s = OPEN + Math.floor(rnd() * ((CLOSE - OPEN - 120) / 30)) * 30;
    const dur = [60, 90, 90, 120][Math.floor(rnd() * 4)];
    const e = Math.min(s + dur, CLOSE);
    if (!slots.some(r => !(e <= r.s || s >= r.e))) slots.push({ s, e });
  }
  return slots.sort((a, b) => a.s - b.s);
};

const gapsOf = (existing, s, dur) => {
  const e = s + dur;
  const prev = existing.filter(r => r.e <= s).sort((a, b) => b.e - a.e)[0];
  const next = existing.filter(r => r.s >= e).sort((a, b) => a.s - b.s)[0];
  return [s - (prev ? prev.e : OPEN), (next ? next.s : CLOSE) - e];
};

const VENUES = { 'mad-salamanca': 2, 'mad-malasana': 3, 'mad-retiro': 2, 'bcn-gracia': 2, 'bcn-eixample': 3, 'vlc-ruzafa': 2 };
const FIXTURES = [
  [],                                               // día vacío
  [{ s: 600, e: 660 }],                             // una reserva al abrir
  [{ s: 1290, e: 1380 }],                           // una reserva al cierre
  [{ s: 630, e: 720 }, { s: 765, e: 855 }],         // hueco de 45 entre medias
  [{ s: 600, e: 1290 }],                            // día casi lleno (90 libres al final)
  [{ s: 690, e: 780 }, { s: 810, e: 900 }, { s: 930, e: 1020 }, { s: 1050, e: 1140 }], // peine de huecos de 30
];

let scenarios = 0, offers = 0, fails = [];
const runCase = (existing, label) => {
  for (const dur of DURATIONS) {
    scenarios++;
    const slots = PBU.antiGapSlots({ existing, duration: dur, open: OPEN, close: CLOSE, durations: DURATIONS });
    offers += slots.length;
    for (const s of slots) {
      const e = s + dur;
      if (existing.some(r => !(e <= r.s || s >= r.e))) fails.push(`${label}/d${dur}: slot ${s} SOLAPA`);
      if (s < OPEN || e > CLOSE) fails.push(`${label}/d${dur}: slot ${s} FUERA DE VENTANA`);
      const [gb, ga] = gapsOf(existing, s, dur);
      if (isDead(gb) || isDead(ga)) fails.push(`${label}/d${dur}: slot ${s} crea hueco muerto (${gb}/${ga})`);
    }
    // simetría: pegado-por-detrás válido debe ofrecerse
    for (const r of existing) {
      const s = r.s - dur;
      if (s < OPEN) continue;
      const e = s + dur;
      if (existing.some(x => !(e <= x.s || s >= x.e))) continue;
      const [gb, ga] = gapsOf(existing, s, dur);
      if (!isDead(gb) && !isDead(ga) && gb >= 0 && ga >= 0 && !slots.includes(s)) {
        fails.push(`${label}/d${dur}: candidato pegado ${s} no ofrecido (gaps ${gb}/${ga})`);
      }
    }
  }
};

for (const [v, boxes] of Object.entries(VENUES))
  for (let day = 0; day < 10; day++)
    for (let box = 0; box < boxes; box++)
      runCase(mockExisting(v, day, box), `${v}#${day}b${box}`);
FIXTURES.forEach((f, i) => runCase(f, `fixture${i}`));

if (fails.length) {
  console.error(`✗ ${fails.length} fallos en ${scenarios} escenarios:`);
  fails.slice(0, 12).forEach(f => console.error('  ' + f));
  process.exit(1);
}
console.log(`✓ anti-gap OK: ${scenarios} escenarios, ${offers} slots ofrecidos, 0 solapes, 0 fuera de ventana, 0 huecos muertos, anclas simétricas`);
