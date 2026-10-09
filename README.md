# Tbilisi Coffee Map

A phone-first map of specialty coffee shops in Tbilisi. It shows what's open now and what's near you, and it works offline once opened.

## Editing the shop list

Everything about the shops lives in `shops.json`. Add, remove or change a shop there and the app picks it up. You never need to touch `index.html` for data.

Each shop looks like this:

```json
{
  "id": "short-unique-name",
  "name": "Shop Name",
  "area": "Vera",
  "address": "12 Some St",
  "coords": [41.7041, 44.7840],
  "hours": ["08:00-21:00", "08:00-21:00", "08:00-21:00", "08:00-21:00", "08:00-21:00", "09:00-21:00", ""],
  "roasts": true,
  "beans": true,
  "laptop": false,
  "brew": ["espresso", "v60"],
  "note": "One honest sentence."
}
```

- **id** must be unique, lowercase, with no spaces.
- **coords**: in Google Maps, right-click (or long-press) the spot and copy the two numbers.
- **hours** run Monday to Sunday. Use `""` for a closed day and `24:00` for midnight. A time like `09:00-02:00` means the shop closes after midnight.
- **brew** can include any of: `espresso`, `v60`, `batch`, `aeropress`, `chemex`.
- **rating** (optional): a number like `4.7`. It shows as ★ next to the opening hours.
- **own** (optional): add `"own": true` to show the "Ours" tag.
- Change `"updated"` at the top of the file to today's date when you edit it.

## Publishing on GitHub Pages

1. Create a new public repository on GitHub, for example `tbilisi-coffee-map`.
2. Upload everything in this folder to it.
3. In the repository, go to **Settings → Pages**. Under "Branch", pick `main` and `/ (root)`, then save.
4. After a minute or two the app is live at `https://<your-username>.github.io/tbilisi-coffee-map/`.

On a phone, open that link, then choose **Add to Home Screen** (Safari share menu, or Chrome's ⋮ menu).

## Offline mode

`sw.js` saves the app on first visit, so it opens with no signal. The shop list and page are fetched fresh whenever there's a connection. Map areas you've already looked at stay available offline.

If you change `index.html`, the icons or anything in `vendor/` (map library, fonts), raise `VERSION` in `sw.js` (for example from `"v1"` to `"v2"`) so phones pick up the new files. Edits to `shops.json` alone don't need this.

## Credits

Map data © OpenStreetMap contributors. Map library: Leaflet (license in `vendor/leaflet/LICENSE`).
Fonts: Archivo Black and IBM Plex Mono, bundled in `vendor/fonts/` (SIL Open Font License; license files included).
