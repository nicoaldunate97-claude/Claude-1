# Deutsch A1 → A2

A single-file, offline-friendly German learning app built for daily 30–45 min
sessions, aimed at taking you from Duolingo-A1 to a solid A2.

## What it is

- **No build step, no backend**: static HTML/CSS/JS, all course content
  included. `index.html` is the app; `manifest.json` + `service-worker.js`
  + `icons/` make it installable as a Progressive Web App (PWA).
- **18 units**, each pairing one grammar point (A1 review → A2: Akkusativ,
  Dativ, Wechselpräpositionen, Perfekt, Nebensätze, Komparativ, Reflexivverben,
  Futur I, Imperativ, Genitiv, Konnektoren...) with ~14 everyday/work/travel
  vocabulary words and example sentences.
- **Spaced repetition (Leitner-style)**: every word you learn gets scheduled
  for review (1 → 2 → 4 → 7 → 14 → 30 days) based on whether you got it right.
- **Mixed exercises**: multiple choice, fill-in-the-blank, and sentence
  building (tap words into the correct order) — no speaking required.
- **Has memory**: your progress (words learned, review schedule, streak, XP,
  current lesson) is saved in the browser's `localStorage`, so closing and
  reopening the app picks up exactly where you left off.
- **Installable & works offline**: once you've opened it once over HTTPS, the
  service worker caches everything, so it keeps working with no signal —
  handy for the commute.

## How to use it on your phone

**Service workers (and therefore "Add to Home Screen" + offline support)
only work when the app is served over HTTPS or localhost — not from a file
opened directly off disk.** So:

1. **Enable GitHub Pages** for this repo: Settings → Pages → deploy from the
   branch that has `index.html` (root folder).
2. Open the resulting `https://…github.io/…` URL on your phone.
3. Use your browser's **"Add to Home Screen"** (Safari: Share → Add to Home
   Screen; Chrome: ⋮ menu → Add to Home Screen / it may prompt "Install app"
   automatically). You'll get a real icon that opens full-screen, and it'll
   keep working even offline after the first load.

If you'd rather skip GitHub Pages, you can still just open `index.html`
directly as a file — the learning app itself works fine that way — you'll
just get a plain browser tab instead of a home-screen icon, and no offline
caching.

⚠️ Progress is saved per browser, on that one device — it won't sync if you
switch browsers or phones, and clearing the browser's site data will erase
it. Use **Settings (⚙️) → Daten sichern** in the app to export a JSON backup
occasionally, and import it again if you ever need to restore.

## Daily flow

- Open the app. The home screen shows two actions: a **review session**
  (spaced-repetition words due today) and the **next lesson** (grammar +
  vocab + practice for a new unit).
- Doing both most days is roughly 30–45 minutes and keeps your streak alive.
