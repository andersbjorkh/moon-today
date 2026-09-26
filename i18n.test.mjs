import { test } from 'node:test';
import assert from 'node:assert/strict';
import { LANGS, STRINGS, detectLang } from './i18n.js';
import { phaseForDay } from './moon.js';

test('every language has the same strings as English', () => {
  const keys = (o) => Object.keys(o).sort();
  for (const lang of LANGS) {
    assert.deepEqual(keys(STRINGS[lang]), keys(STRINGS.en), lang);
    assert.deepEqual(keys(STRINGS[lang].phases), keys(STRINGS.en.phases), `${lang} phases`);
  }
});

test('every phase key from moon.js has a name', () => {
  const days = Array.from({ length: 30 }, (_, i) => new Date(2024, 3, 1 + i, 12));
  for (const d of days) {
    const { key } = phaseForDay(d);
    for (const lang of LANGS) assert.ok(STRINGS[lang].phases[key], `${lang}: ${key}`);
  }
});

test('Norwegian relative times', () => {
  const no = STRINGS.no;
  assert.equal(no.inDays(3), 'om 3 dager');
  assert.equal(no.inHours(5), 'om 5 t');
  assert.equal(no.phases.full, 'Fullmåne');
});

test('detectLang picks Norwegian for nb, nn and no', () => {
  assert.equal(detectLang(['nb-NO']), 'no');
  assert.equal(detectLang(['nn']), 'no');
  assert.equal(detectLang(['no', 'en']), 'no');
  assert.equal(detectLang(['en-GB', 'nb']), 'en');
  assert.equal(detectLang(['de-DE', 'nb']), 'no');
  assert.equal(detectLang(['de-DE']), 'en');
  assert.equal(detectLang([]), 'en');
});
