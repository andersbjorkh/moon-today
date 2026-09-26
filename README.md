# Moon Today

Today's moon phase: a drawing of the moon as it looks tonight, its phase name, how much is lit, its age, and when the next new, quarter and full moons fall. One HTML page and one small script, with no dependencies and no build step.

**Live:** https://andersbjorkh.github.io/moon-today/

## Use

- The page opens on today and refreshes every minute.
- **‹ / ›** (or the arrow keys) step a day back or forward. **Back to today** (or `T`) returns.
- **Coming up** lists the next four principal phases with their local date and time.
- **EN / NO** switches between English and Norwegian (bokmål). The page starts in Norwegian if your browser prefers nb, nn or no, and remembers your choice.

## How it works

The phase is computed in the browser from the Sun's and Moon's ecliptic longitudes, using truncated series from Meeus, *Astronomical Algorithms*. It does not assume a fixed 29.5-day cycle. Computed phase times fall within about 6 minutes of published times.

A principal phase (New Moon, First Quarter, Full Moon, Last Quarter) names the whole local day it falls on, as calendars do. Every other day gets an in-between name such as Waxing Gibbous.

The drawing shows the moon as seen from the northern hemisphere, lit on the right while waxing.

## Run locally

Serve the folder over HTTP, since ES modules don't load from `file://`:

```sh
python3 -m http.server 8080   # then visit http://localhost:8080
```

## Files

- `moon.js`: the astronomy (elongation, illumination, age, phase times) and the SVG path for the lit part. It doesn't touch the page.
- `i18n.js`: the English and Norwegian text, with phase names keyed by `moon.js` phase keys.
- `index.html`: the UI.
- `moon.test.mjs`: tests for `moon.js`, checked against published phase times. `i18n.test.mjs` checks that both languages are complete. Run them with `TZ=Europe/Oslo node --test`.
