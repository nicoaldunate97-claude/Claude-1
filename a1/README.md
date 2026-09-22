# Deutsch A1 — 30-Tage-Kurs

A modular, spaced-repetition German course app. No build step, no
framework — static HTML/CSS/JS (ES modules), synced across devices via
Firebase Realtime Database over plain REST (no SDK).

## Status

**Week 1 (days 1–7) is complete and fully tested end-to-end** — grammar
engine, all 4 exercise types, spaced review, Grammar reference, Mis
palabras, stats, cross-device sync, offline PWA. Weeks 2–4 (days 8–30)
are the next milestone; the architecture is built to make adding them
cheap (see below).

## Architecture

```
a1/
  index.html, css/style.css      — shell
  js/
    grammar-data.js              — canonical verb/preposition/article tables
                                    (the single source of truth — nothing
                                    conjugates or declines anywhere else)
    satzbau-engine.js            — assembles sentences from that data,
                                    so word order + conjugation are correct
                                    by construction
    exercise-engine.js           — 6 generic generators (conjugation,
                                    satzbau, preposition, article, negation,
                                    vocab/match) → the 4 exercise formats
    state.js                     — SRS state, streak, per-topic stats,
                                    "Mis palabras", schema versioning
    sync.js                      — Firebase REST sync via a pairing code
    day-composer.js              — turns a day + current SRS state into
                                    a concrete, shuffled exercise queue
    app.js                       — UI/router
  modules/a1/curriculum.js       — the A1 CONTENT: SKILLS (grammar rules,
                                    each pointing at a generator) + VOCAB +
                                    DAYS (30-day sequence, weekly tests)
```

**Adding A2 later** = a new `modules/a2/curriculum.js` with its own
SKILLS/VOCAB/DAYS, reusing every engine file untouched, plus extending
`grammar-data.js` with any new verbs/prepositions A2 needs. `app.js`
currently hardcodes the A1 module import; switching to a module picker
is a small, isolated change when A2 exists.

## The ID-stability rule

Every vocab word and skill has a permanent, stable ID (e.g. `"weil"`,
`"d5_hund"`). A user's progress is keyed by these IDs, never by day
number or array position. **This means improving a day's content later
(fixing a sentence, tweaking a generator) never resets anyone's
progress** — only introducing a genuinely new ID does. Never reuse an
existing ID for a different concept; never delete/rename one without
treating it as a deliberate, called-out migration.

## Firebase setup (already done for this deployment)

Realtime Database rules (paste under Database → Rules — restricts
read/write to `/sync/<code>`, closes everything else):

```json
{
  "rules": {
    "sync": {
      "$code": {
        ".read": true,
        ".write": true
      }
    },
    ".read": false,
    ".write": false
  }
}
```

Security model: anyone with a sync code can read/write that one
progress record. No login. Acceptable for personal study progress, not
a place for sensitive data.

## Local development / testing

Pure static files — `python3 -m http.server` from this folder and open
`index.html`. Service worker + "Add to Home Screen" require HTTPS (or
localhost), same as the earlier A1→A2 app.
