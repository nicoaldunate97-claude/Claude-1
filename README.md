# Deutsch A1 → A2

A single-file, offline-friendly German learning app built for daily 30–45 min
sessions, aimed at taking you from Duolingo-A1 to a solid A2.

## What it is

- **One file, no build step, no server**: `index.html` contains everything
  (HTML/CSS/JS, all course content). Just open it in a browser.
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

## How to use it on your phone

Pick whichever is easiest for you:

1. **GitHub Pages (recommended — gives you a stable URL/bookmark)**
   Enable GitHub Pages for this repo (Settings → Pages → deploy from the
   branch that has `index.html`), then open the resulting URL on your phone
   and add it to your home screen for an app-like icon.
2. **Direct file**: AirDrop / email / cloud-drive the `index.html` file to
   your phone and open it with your browser.

⚠️ Progress is saved per browser, on that one device — it won't sync if you
switch browsers or phones, and clearing the browser's site data will erase
it. Use **Settings (⚙️) → Daten sichern** in the app to export a JSON backup
occasionally, and import it again if you ever need to restore.

## Daily flow

- Open the app. The home screen shows two actions: a **review session**
  (spaced-repetition words due today) and the **next lesson** (grammar +
  vocab + practice for a new unit).
- Doing both most days is roughly 30–45 minutes and keeps your streak alive.
