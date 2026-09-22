// ============================================================
// EXERCISE-ENGINE.JS — six generic generators that turn the
// canonical grammar/vocab data into concrete exercise objects.
//
// Every exercise carries a `skillId` (for per-topic accuracy stats)
// AND an `itemId` (the spaced-repetition scheduling key). itemId is
// always either "vocab:<vocabId>" or "<skillId>|<subkey>" — the
// "<skillId>|" prefix is load-bearing: day-composer.js recovers which
// skill a due review item belongs to by splitting on "|", so every
// generator below MUST keep that prefix even when it tracks finer
// sub-concepts (a verb, a preposition) separately within the skill.
// ============================================================
import { VERBS, ARTICLES, PREPOSITIONS, SUBJECT_PRONOUNS_SIMPLE } from "./grammar-data.js";

let uid = 0;
function nextId(){ return "ex" + (uid++); }

export function shuffle(arr){
  const a = arr.slice();
  for(let i=a.length-1;i>0;i--){
    const j = Math.floor(Math.random()*(i+1));
    [a[i],a[j]] = [a[j],a[i]];
  }
  return a;
}
export function sample(arr, n){ return shuffle(arr).slice(0, n); }
function pick(arr){ return arr[Math.floor(Math.random()*arr.length)]; }

// ============================================================
// 1) CONJUGATION DRILL
// ============================================================
const PERSON_LABEL = { 0:"ich", 1:"du", 2:"er/sie/es", 3:"wir", 4:"ihr", 5:"sie/Sie" };

// Builds the full (verb x person) grid and walks shuffled laps of it, instead
// of drawing independently at random each time. Independent random draws
// from a small grid (e.g. one verb x 6 persons) WILL repeat heavily by the
// pigeonhole principle, and can easily land the same item twice in a row -
// exactly what happened with "sein" at count:14 over only 6 possible forms.
// This guarantees every combination is used before any repeats, and a swap
// at each lap boundary keeps the same item from landing back-to-back.
function conjugationQueue(verbIds, count){
  const grid = [];
  verbIds.forEach(verbId => { for(let p=0; p<6; p++) grid.push({ verbId, personIdx: p }); });
  const queue = [];
  while(queue.length < count){
    const lap = shuffle(grid);
    const prev = queue[queue.length-1];
    if(prev && lap[0].verbId === prev.verbId && lap[0].personIdx === prev.personIdx && lap.length > 1){
      [lap[0], lap[1]] = [lap[1], lap[0]];
    }
    queue.push(...lap);
  }
  queue.length = count;
  return queue;
}

export function genConjugationExercises(skillId, verbIds, opts = {}){
  const count = opts.count || verbIds.length * 2;
  const out = [];
  const queue = conjugationQueue(verbIds, count);
  queue.forEach(({ verbId, personIdx }) => {
    const v = VERBS[verbId];
    const correctForm = v.pres[personIdx];
    const infinitive = v.de || verbId;
    const useType = pick(["mc","fill","fill"]); // fill takes longer (actual typing/recall), weighted 2:1 over tapping an MC option
    if(useType === "mc"){
      const distractorPool = v.pres.filter((f,idx) => idx !== personIdx && f !== correctForm);
      const distractors = sample(distractorPool, Math.min(3, distractorPool.length));
      while(distractors.length < 3){
        // borrow forms from a different verb of the same type to fill out options if needed
        const other = VERBS[pick(verbIds.filter(id => id !== verbId))] || v;
        const cand = pick(other.pres);
        if(!distractors.includes(cand) && cand !== correctForm) distractors.push(cand);
        else break;
      }
      out.push({
        id: nextId(), skillId, itemId: skillId + "|verb:" + verbId, type: "mc",
        prompt: `"${infinitive}" (${v.en}) — richtige Form für "${PERSON_LABEL[personIdx]}"?`,
        options: shuffle([correctForm, ...distractors]),
        correct: correctForm,
      });
    } else {
      out.push({
        id: nextId(), skillId, itemId: skillId + "|verb:" + verbId, type: "fill",
        prompt: "Ergänze die richtige Verbform:",
        sentence: `${PERSON_LABEL[personIdx]} ___ (${infinitive})`,
        correct: correctForm,
        hint: v.en,
      });
    }
  });
  return out;
}

// ============================================================
// 2) SATZBAU DRILL (from pre-built satzbau-engine sentences)
// ============================================================
// sentences: array of { tokens, de, en } objects from satzbau-engine builders
// NOTE: sentences are often built with some randomness (random subject,
// random time, etc.), so the *content* at index i is not stable across
// calls — only the skill itself is a stable concept. That's why every
// exercise here shares one itemId (the skillId): spaced-repetition tracks
// "do you have this skill down", not "do you remember this exact sentence".
export function genSatzbauExercises(skillId, sentences, opts = {}){
  return sentences.map((s) => {
    if(s.tokens.length >= 4 && (opts.reorderRatio == null || Math.random() < opts.reorderRatio)){
      return {
        id: nextId(), skillId, itemId: skillId + "|main", type: "reorder",
        prompt: "Bringe die Wörter in die richtige Reihenfolge:",
        tokens: s.tokens, translation: s.en,
      };
    }
    return {
      id: nextId(), skillId, itemId: skillId + "|main", type: "mc-order",
      prompt: "Welcher Satz ist richtig?",
      correct: s.de,
      options: shuffle([s.de, scrambleClause(s.tokens, s.punctuation)]),
      translation: s.en,
    };
  });
}
// produces one plausible-but-wrong ordering (swap two middle tokens) for MC judgment items
function scrambleClause(tokens, punctuation){
  const t = tokens.slice();
  // Bug this fixes: for a 2-word sentence ("Wir fragen."), the old version
  // returned early with the tokens UNCHANGED — the "wrong" option was
  // identical to the correct one, every single time (verified: 5 of the
  // day-3 Satzbau recipes are exactly 2 tokens, so this wasn't a rare
  // edge case). A 2-word sentence only has one possible swap at all
  // (subject <-> verb), so handle it explicitly instead of bailing out.
  if(t.length < 2) return t.join(" ") + punctuation;
  t[0] = t[0].charAt(0).toLowerCase() + t[0].slice(1);
  if(t.length === 2){
    [t[0], t[1]] = [t[1], t[0]];
  } else {
    [t[1], t[2]] = [t[2], t[1]];
  }
  t[0] = t[0].charAt(0).toUpperCase() + t[0].slice(1);
  return t.join(" ") + punctuation;
}

// ============================================================
// 3) PREPOSITION DRILL
// ============================================================
// items: [{ prepId, sentence: "Ich komme ___ Chile.", full: "Ich komme aus Chile.", en: "..." }]
// itemId is keyed by the preposition itself (stable) rather than array
// index (not stable — the pool is often built with a random subject/noun
// per call), so review tracks "do you know when to use 'aus'", not
// "do you remember this exact random sentence".
export function genPrepositionExercises(skillId, items){
  const allPreps = Object.keys(PREPOSITIONS);
  const out = [];
  items.forEach((it) => {
    const useType = pick(["mc","fill","fill"]); // fill takes longer (actual typing/recall), weighted 2:1 over tapping an MC option
    if(useType === "mc"){
      const distractors = sample(allPreps.filter(p => p !== it.prepId), 3);
      out.push({
        id: nextId(), skillId, itemId: skillId + "|prep:" + it.prepId, type: "mc",
        prompt: it.sentence,
        options: shuffle([it.prepId, ...distractors]),
        correct: it.prepId,
        translation: it.en,
      });
    } else {
      out.push({
        id: nextId(), skillId, itemId: skillId + "|prep:" + it.prepId, type: "fill",
        prompt: "Welche Präposition passt?",
        sentence: it.sentence,
        correct: it.prepId,
        hint: it.en,
      });
    }
  });
  return out;
}

// ============================================================
// 4) ARTICLE / AKKUSATIV DRILL
// ============================================================
// nouns: [{ de:"der Tisch", gender:"der", en:"table" }]
export function genArticleExercises(skillId, nouns, opts = {}){
  const out = [];
  nouns.forEach((n, i) => {
    const a = ARTICLES[n.gender];
    const bare = n.de.replace(/^(der|die|das)\s+/, "");
    const useType = pick(["mc","fill","fill"]); // fill takes longer (actual typing/recall), weighted 2:1 over tapping an MC option
    const templates = opts.templates || [
      { de: (art) => `Ich brauche ${art} ${bare}.`, en: (art) => `I need ${art==='den'||art==='einen'?'the':'a'} ${n.en}.` },
    ];
    const tpl = pick(templates);
    if(useType === "mc"){
      const correct = opts.indefinite ? a.indef_akk : a.akk;
      const wrongPool = [a.nom, a.indef_nom, ARTICLES.der.akk, ARTICLES.die.akk, ARTICLES.das.akk].filter(x => x !== correct);
      out.push({
        id: nextId(), skillId, itemId: skillId + "|noun:" + i, type: "mc",
        prompt: `${bare} (${n.en}) — richtiger Artikel im Akkusativ?`,
        options: shuffle([correct, ...sample(wrongPool, 3)]),
        correct,
      });
    } else {
      const correct = opts.indefinite ? a.indef_akk : a.akk;
      out.push({
        id: nextId(), skillId, itemId: skillId + "|noun:" + i, type: "fill",
        prompt: "Ergänze den richtigen Artikel (Akkusativ):",
        sentence: tpl.de("___"),
        correct,
        hint: n.en,
      });
    }
  });
  // itemId stays tied to noun POSITION in the full pool (stable for SRS)
  // regardless of how many of these actually get shown in one sitting —
  // opts.count only caps and samples the OUTPUT, generated after the fact.
  return opts.count ? sample(out, Math.min(opts.count, out.length)) : out;
}

// ============================================================
// 5) NEGATION DRILL (kein vs. nicht)
// ============================================================
// items: [{ sentence:"Ich habe ___ Zeit.", correct:"keine", en:"I don't have time.", hint:"Zeit = Nomen" }]
export function genNegationExercises(skillId, items){
  return items.map((it, i) => ({
    id: nextId(), skillId, itemId: skillId + "|neg:" + i, type: "mc",
    prompt: it.sentence,
    options: shuffle([it.correct, ...it.distractors]),
    correct: it.correct,
    translation: it.en,
  }));
}

// ============================================================
// 6) VOCAB DRILL (MC + Match + Fill from example sentences)
// ============================================================
// vocab: [{ id, de, en, exampleDe: "Ich {{trinke}} gern Kaffee.", exampleEn }]
export function genVocabExercises(vocabList, opts = {}){
  const out = [];
  vocabList.forEach((w) => {
    const useType = opts.type || pick(["mc","fill","fill"]); // fill (falls back to mc if no exampleDe) takes longer than tapping an option
    if(useType === "mc"){
      const pool = vocabList.filter(o => o.id !== w.id);
      const distractors = sample(pool, Math.min(3, pool.length)).map(o => o.en);
      const dir = Math.random() < 0.5 ? "de2en" : "en2de";
      if(dir === "de2en"){
        out.push({
          id: nextId(), skillId: "vokabular", itemId: "vocab:" + w.id, type: "mc",
          prompt: `Was bedeutet "${w.de}"?`,
          options: shuffle([w.en, ...distractors]),
          correct: w.en,
        });
      } else {
        const deDistractors = sample(pool, Math.min(3, pool.length)).map(o => o.de);
        out.push({
          id: nextId(), skillId: "vokabular", itemId: "vocab:" + w.id, type: "mc",
          prompt: `Wie sagt man "${w.en}" auf Deutsch?`,
          options: shuffle([w.de, ...deDistractors]),
          correct: w.de,
        });
      }
    } else if(w.exampleDe){
      const { blanked, answer, full } = parseTemplate(w.exampleDe);
      out.push({
        id: nextId(), skillId: "vokabular", itemId: "vocab:" + w.id, type: "fill",
        prompt: "Ergänze das fehlende Wort:",
        sentence: blanked,
        correct: answer,
        hint: w.en,
        translation: w.exampleEn,
      });
    } else {
      out.push({
        id: nextId(), skillId: "vokabular", itemId: "vocab:" + w.id, type: "mc",
        prompt: `Was bedeutet "${w.de}"?`,
        options: shuffle([w.en, ...sample(vocabList.filter(o=>o.id!==w.id),3).map(o=>o.en)]),
        correct: w.en,
      });
    }
  });
  return out;
}

// vocabList: same shape as genVocabExercises — each pair also carries the
// vocabId so grading can update that word's own SRS entry ("vocab:<id>"),
// same as an MC/fill exercise on that word would.
export function genMatchExercise(vocabList, opts = {}){
  const pairs = vocabList.map(w => ({ left: w.de, right: w.en, vocabId: w.id }));
  return {
    id: nextId(), skillId: "vokabular", itemId: "match:" + pairs.map(p=>p.vocabId).join(","), type: "match",
    prompt: opts.prompt || "Ordne die passenden Paare zu:",
    pairs,
  };
}

export function parseTemplate(ex){
  const m = ex.match(/\{\{(.+?)\}\}/);
  const answer = m ? m[1].trim() : "";
  const blanked = ex.replace(/\{\{(.+?)\}\}/, "___");
  const full = ex.replace(/\{\{(.+?)\}\}/g, "$1");
  return { answer, blanked, full };
}

export function normalize(s){
  return s.trim().toLowerCase().replace(/[.,!?;:]+$/,"").replace(/\s+/g," ");
}
