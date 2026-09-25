// Moon phase from low-precision Sun and Moon ecliptic longitudes (after Meeus,
// "Astronomical Algorithms", ch. 25 and 47, truncated). Good to a fraction of a
// degree, which puts new/full/quarter moon times within about half an hour.

const DAY_MS = 86400000;
const J2000_MS = Date.UTC(2000, 0, 1, 12); // JD 2451545.0
export const SYNODIC_DAYS = 29.530588853;

const rad = (deg) => (deg * Math.PI) / 180;
const norm = (deg) => ((deg % 360) + 360) % 360;

// Degrees the Moon is east of the Sun: 0 new, 90 first quarter, 180 full, 270 last quarter.
export function elongation(date) {
  const d = (date.getTime() - J2000_MS) / DAY_MS;

  const g = rad(357.528 + 0.9856003 * d);
  const sun = 280.46 + 0.9856474 * d + 1.915 * Math.sin(g) + 0.02 * Math.sin(2 * g);

  const L = 218.3165 + 13.17639648 * d; // Moon mean longitude
  const D = rad(297.8502 + 12.19074912 * d); // mean elongation
  const M = rad(357.5291 + 0.98560028 * d); // Sun mean anomaly
  const Mm = rad(134.9634 + 13.06499295 * d); // Moon mean anomaly
  const F = rad(93.272 + 13.2293502 * d); // argument of latitude
  const moon =
    L +
    6.289 * Math.sin(Mm) +
    1.274 * Math.sin(2 * D - Mm) +
    0.658 * Math.sin(2 * D) +
    0.214 * Math.sin(2 * Mm) -
    0.186 * Math.sin(M) -
    0.114 * Math.sin(2 * F) +
    0.059 * Math.sin(2 * D - 2 * Mm) +
    0.057 * Math.sin(2 * D - M - Mm) +
    0.053 * Math.sin(2 * D + Mm) +
    0.046 * Math.sin(2 * D - M) +
    0.041 * Math.sin(Mm - M) -
    0.035 * Math.sin(D) -
    0.031 * Math.sin(Mm + M);

  return norm(moon - sun);
}

// Fraction of the disc that is lit, 0..1.
export const illumination = (elong) => (1 - Math.cos(rad(elong))) / 2;

// Days since the last new moon, estimated from the elongation.
export const age = (elong) => (elong / 360) * SYNODIC_DAYS;

// First moment after `from` when the elongation reaches `target` degrees.
export function nextPhase(target, from) {
  const gap = (t) => norm(target - elongation(t)); // degrees still to go; jumps 0 -> 360 at the event
  let lo = from.getTime();
  let hi = lo;
  // Step forward until the remaining gap jumps up, meaning we passed the target.
  let prev = gap(new Date(lo));
  for (;;) {
    hi = lo + DAY_MS / 4;
    const g = gap(new Date(hi));
    if (g > prev + 90) break;
    lo = hi;
    prev = g;
  }
  while (hi - lo > 1000) {
    const mid = (lo + hi) / 2;
    if (gap(new Date(mid)) > 180) hi = mid;
    else lo = mid;
  }
  return new Date(Math.round((lo + hi) / 2));
}

export const PHASES = [
  { key: 'new', name: 'New Moon', angle: 0 },
  { key: 'first', name: 'First Quarter', angle: 90 },
  { key: 'full', name: 'Full Moon', angle: 180 },
  { key: 'last', name: 'Last Quarter', angle: 270 },
];

const startOfDay = (date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());
const addDays = (date, n) => new Date(date.getFullYear(), date.getMonth(), date.getDate() + n);

// The phase name for the local calendar day containing `date`. A principal phase
// (new, first quarter, full, last quarter) names the whole day it happens on;
// every other day gets the intermediate name.
export function phaseForDay(date) {
  const start = startOfDay(date);
  const end = addDays(start, 1);
  const from = new Date(start.getTime() - 1);
  for (const p of PHASES) {
    const at = nextPhase(p.angle, from);
    if (at < end) return { ...p, at };
  }
  const e = elongation(date);
  if (e < 90) return { key: 'waxing-crescent', name: 'Waxing Crescent' };
  if (e < 180) return { key: 'waxing-gibbous', name: 'Waxing Gibbous' };
  if (e < 270) return { key: 'waning-gibbous', name: 'Waning Gibbous' };
  return { key: 'waning-crescent', name: 'Waning Crescent' };
}

// Everything the page shows for one moment.
export function moonInfo(date) {
  const e = elongation(date);
  return {
    elongation: e,
    illumination: illumination(e),
    age: age(e),
    waxing: e < 180,
    phase: phaseForDay(date),
    upcoming: PHASES.map((p) => ({ ...p, at: nextPhase(p.angle, date) })).sort((a, b) => a.at - b.at),
  };
}

// SVG path for the lit part of a disc of radius r centred on the origin, as seen
// from the northern hemisphere (waxing moon lit on the right).
export function litPath(elong, r = 100) {
  const e = norm(elong);
  const rx = Math.abs(Math.cos(rad(e))) * r;
  const f = (n) => +n.toFixed(3);
  const waxing = e < 180;
  const limb = waxing ? 1 : 0;
  const term = waxing ? (e < 90 ? 0 : 1) : e < 270 ? 0 : 1;
  return `M 0 ${-r} A ${r} ${r} 0 0 ${limb} 0 ${r} A ${f(rx)} ${r} 0 0 ${term} 0 ${-r} Z`;
}
