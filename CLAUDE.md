# Tbilisi Coffee Map — rules for Claude

Phone-first web app of specialty coffee shops in Tbilisi. Static site on GitHub Pages
(https://l33va.github.io/tbilisi-coffee-map/), no build step. Owner: Levan (l33va).
More than one Claude chat works on this repo (one for shop data, one for design).

## Files
- `shops.json` — all shop data. Most changes happen here.
- `index.html` — the whole app (HTML, CSS, JS in one file).
- `sw.js` — offline support and updates.
- `photos/` — shop photos (WebP).
- `vendor/` — Leaflet and bundled fonts.

## Before any change
- `git pull --rebase origin main` first. Another chat may have pushed.

## After changing index.html, icons or anything in vendor/
- Raise `VERSION` in `sw.js` by exactly 1 from the value currently in the file
  (read it after pulling; never assume). Without this, installed apps don't update.
- `shops.json` and `photos/` changes don't need a version bump.
- New vendor files must be added to `SHELL_FILES` in `sw.js`; a missing file breaks the update.

## Languages
- English and Georgian. Any new text in the app needs both: `tr("English", "ქართული")`.
  Static HTML text uses `data-t` keys with Georgian in the `KA` table.
- Shop names and addresses always stay in English.
- New areas need a Georgian name in `AREA_KA` in index.html.

## Shop data rules
- Every shop has `note` (English) and `note_ka` (Georgian): one honest sentence or two, no hype.
- `hours`: Mon..Sun, "HH:MM-HH:MM", "" = closed.
- `prices` in GEL: `espresso`, `cappuccino`, `batch`; a number or two sizes `[9, 13]`.
  Only from a menu or Levan's confirmation. Never guess.
- `pets`, `laptop`, `beans`, `roasts`, `roaster`: only set when confirmed. Say what's unconfirmed.
- `place_id`: Google place ID (for the reviews link). `instagram`: handle without @.
- Never copy Google ratings or review text into the app.
- Bump `"updated"` at the top of shops.json to today's date.

## Photos
- `convert in.jpg -auto-orient -resize "1400x1400>" -strip -quality 78 photos/<id>-<n>.webp`
- Location data stripped (`-strip`). Blur faces and number plates.
- Add to the shop as `{"src": "photos/<id>-<n>.webp", "alt": "..."}`.

## Checks before pushing
- `shops.json` parses; the app's script passes `node --check`.
- For UI changes, look at it at phone width in both English and Georgian, dark and light.

## Commits
- Small, plain-English commit messages. Push to `main` (GitHub Pages deploys from it).
