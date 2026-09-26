// UI text in English and Norwegian (bokmål). Phase names are keyed by the
// `key` from moon.js, so the astronomy stays language-free.

export const LANGS = ['en', 'no'];

export const STRINGS = {
  en: {
    htmlLang: 'en',
    appName: 'Moon Today',
    prev: 'Previous day',
    next: 'Next day',
    backToToday: 'Back to today',
    today: 'Today',
    illuminated: 'Illuminated',
    moonAge: 'Moon age',
    trend: 'Trend',
    waxing: 'Waxing ↑',
    waning: 'Waning ↓',
    comingUp: 'Coming up',
    footer: 'Computed in your browser · times in your local time zone',
    exactAt: (time) => `Exact at ${time}`,
    inHours: (h) => `in ${h} h`,
    tomorrow: 'tomorrow',
    inDays: (d) => `in ${d} days`,
    phases: {
      new: 'New Moon',
      'waxing-crescent': 'Waxing Crescent',
      first: 'First Quarter',
      'waxing-gibbous': 'Waxing Gibbous',
      full: 'Full Moon',
      'waning-gibbous': 'Waning Gibbous',
      last: 'Last Quarter',
      'waning-crescent': 'Waning Crescent',
    },
  },
  no: {
    htmlLang: 'nb',
    appName: 'Månen i dag',
    prev: 'Forrige dag',
    next: 'Neste dag',
    backToToday: 'Tilbake til i dag',
    today: 'I dag',
    illuminated: 'Opplyst',
    moonAge: 'Månens alder',
    trend: 'Retning',
    waxing: 'Voksende ↑',
    waning: 'Minkende ↓',
    comingUp: 'Kommende faser',
    footer: 'Beregnet i nettleseren · tider i din lokale tidssone',
    exactAt: (time) => `Nøyaktig kl. ${time}`,
    inHours: (h) => `om ${h} t`,
    tomorrow: 'i morgen',
    inDays: (d) => `om ${d} dager`,
    phases: {
      new: 'Nymåne',
      'waxing-crescent': 'Voksende månesigd',
      first: 'Første kvarter',
      'waxing-gibbous': 'Voksende måne',
      full: 'Fullmåne',
      'waning-gibbous': 'Minkende måne',
      last: 'Siste kvarter',
      'waning-crescent': 'Minkende månesigd',
    },
  },
};

// Norwegian for nb, nn and no browser languages; English for everything else.
export function detectLang(languages = []) {
  for (const l of languages) {
    const base = l.toLowerCase().split('-')[0];
    if (base === 'nb' || base === 'nn' || base === 'no') return 'no';
    if (base === 'en') return 'en';
  }
  return 'en';
}
