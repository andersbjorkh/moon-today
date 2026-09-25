import { test } from 'node:test';
import assert from 'node:assert/strict';
import { elongation, illumination, litPath, moonInfo, nextPhase, phaseForDay } from './moon.js';

const MIN = 60000;
const near = (actual, expected, tolMin, label) => {
  const diff = Math.abs(actual - expected) / MIN;
  assert.ok(diff <= tolMin, `${label}: off by ${diff.toFixed(1)} min (${actual.toISOString()})`);
};

// Published times (UTC) from the US Naval Observatory / timeanddate.com.
const KNOWN = [
  ['new', 0, '2024-01-11T11:57Z'],
  ['full', 180, '2024-01-25T17:54Z'],
  ['new', 0, '2024-04-08T18:21Z'],
  ['first', 90, '2024-04-15T19:13Z'],
  ['full', 180, '2024-04-23T23:49Z'],
  ['last', 270, '2024-05-01T11:27Z'],
  ['full', 180, '2025-03-14T06:55Z'],
];

for (const [key, angle, iso] of KNOWN) {
  test(`finds ${key} moon of ${iso.slice(0, 10)}`, () => {
    const expected = new Date(iso);
    const from = new Date(expected.getTime() - 5 * 86400000);
    near(nextPhase(angle, from), expected, 10, key);
  });
}

test('illumination is 0 at new, 1 at full, half at quarters', () => {
  assert.equal(illumination(0), 0);
  assert.equal(illumination(180), 1);
  assert.ok(Math.abs(illumination(90) - 0.5) < 1e-12);
  assert.ok(Math.abs(elongation(new Date('2024-01-25T17:54Z')) - 180) < 1);
});

test('principal phase names the whole local day it falls on', () => {
  // Full moon 2024-04-23T23:49Z falls on the 24th in Oslo (UTC+2), so the
  // whole of Oslo's 24th is "Full Moon" and the 23rd is not.
  assert.equal(phaseForDay(new Date('2024-04-24T21:00Z')).key, 'full');
  assert.equal(phaseForDay(new Date('2024-04-23T20:00Z')).key, 'waxing-gibbous');
  assert.equal(phaseForDay(new Date('2024-04-19T12:00Z')).key, 'waxing-gibbous');
  assert.equal(phaseForDay(new Date('2024-04-11T12:00Z')).key, 'waxing-crescent');
  assert.equal(phaseForDay(new Date('2024-04-27T12:00Z')).key, 'waning-gibbous');
  assert.equal(phaseForDay(new Date('2024-05-04T12:00Z')).key, 'waning-crescent');
});

test('moonInfo lists the next four phases in order', () => {
  const info = moonInfo(new Date('2024-04-10T00:00Z'));
  assert.deepEqual(info.upcoming.map((p) => p.key), ['first', 'full', 'last', 'new']);
  assert.ok(info.waxing);
  assert.ok(info.age > 1 && info.age < 2);
});

test('lit path: right side when waxing, left when waning', () => {
  assert.equal(litPath(45), 'M 0 -100 A 100 100 0 0 1 0 100 A 70.711 100 0 0 0 0 -100 Z');
  assert.equal(litPath(135), 'M 0 -100 A 100 100 0 0 1 0 100 A 70.711 100 0 0 1 0 -100 Z');
  assert.equal(litPath(225), 'M 0 -100 A 100 100 0 0 0 0 100 A 70.711 100 0 0 0 0 -100 Z');
  assert.equal(litPath(315), 'M 0 -100 A 100 100 0 0 0 0 100 A 70.711 100 0 0 1 0 -100 Z');
});
