// ============================================================
// SATZBAU-ENGINE.JS — assembles grammatically correct German
// sentences from data (never hand-typed prose), so conjugation
// and word order are correct BY CONSTRUCTION, not by careful typing.
// ============================================================
import { VERBS } from "./grammar-data.js";

export const PERSON_INDEX = { ich:0, du:1, er:2, sie_f:2, es:2, wir:3, ihr:4, sie_pl:5, Sie:5 };

function resolvePerson(personKey){
  const idx = typeof personKey === "number" ? personKey : PERSON_INDEX[personKey];
  if(idx == null) throw new Error("Unknown person: " + personKey);
  return idx;
}
export function conjugate(verbId, personKey){
  const v = VERBS[verbId];
  if(!v) throw new Error("Unknown verb: " + verbId);
  return v.pres[resolvePerson(personKey)];
}

export function verbInfinitive(verbId){
  const v = VERBS[verbId];
  return v.de || verbId;
}

function cap(s){ return s.charAt(0).toUpperCase() + s.slice(1); }

// Minimal English present-tense helper, keyed by the resolved person INDEX
// (0-5) so it can get "be" (am/is/are) and "have" (has/have) fully right
// across every person, not just 3rd singular — those two are common enough
// in generated statements that getting only "is/has" right isn't good enough
// (an earlier version returned "I be tired" for ich+sein). Everything else
// still just gets the regular English -s for 3rd-person singular.
function conjugateEnglish(verbEn, personIdx){
  const base = verbEn.replace(/^to /, "");
  if(base === "be") return personIdx === 0 ? "am" : personIdx === 2 ? "is" : "are";
  if(base === "have") return personIdx === 2 ? "has" : "have";
  if(personIdx !== 2) return base;
  if(/[sxz]$|[cs]h$/.test(base)) return base + "es";
  if(/[^aeiou]y$/.test(base)) return base.slice(0,-1) + "ies";
  return base + "s";
}

// English word order frequently diverges from German (modal frames,
// questions with do-support, stranded prepositions). `enOverride` lets a
// recipe supply the natural English sentence by hand when the naive
// concatenation of `enParts` would read wrong; it never touches the
// German assembly, which stays 100% table-driven either way.
function finalize(tokens, punctuation, enParts, enOverride){
  const clean = tokens.filter(t => t !== null && t !== undefined && t !== "");
  clean[0] = cap(clean[0]);
  const de = clean.join(" ") + punctuation;
  let en;
  if(enOverride){
    en = enOverride;
  } else if(enParts){
    const enClean = enParts.filter(t => t !== null && t !== undefined && t !== "");
    en = cap(enClean.join(" ")) + punctuation;
  }
  return { tokens: clean, de, en, punctuation };
}

// ---- Statement: Subjekt + Verb(2) + Rest ------------------------
// rest: array of { de, en } phrase pieces already in correct German order
export function buildStatement({ subjectDe, subjectEn, person, verbId, rest = [], fronted = null, enOverride }){
  const v = VERBS[verbId];
  const verbForm = conjugate(verbId, person);
  const restDe = rest.map(r => r.de);
  const tokens = fronted
    ? [fronted.de, verbForm, subjectDe, ...restDe]
    : [subjectDe, verbForm, ...restDe];
  if(v.sep) tokens.push(v.sep);
  const verbEn = conjugateEnglish(v.en, resolvePerson(person));
  const enParts = fronted
    ? [fronted.en, subjectEn, verbEn, ...rest.map(r=>r.en)]
    : [subjectEn, verbEn, ...rest.map(r=>r.en)];
  return { ...finalize(tokens, ".", enParts, enOverride), skillHint: "satzbau-statement" };
}

// ---- Modal frame: Subjekt + Modal(2) + Rest + Infinitiv(final) --
// German: Subjekt + Modal + Rest + Infinitiv(final). English default order
// differs (Subjekt + Modal + Infinitiv + Rest), which is what native
// speakers actually say, so that's the default — not a literal transcription.
export function buildModal({ subjectDe, subjectEn, person, modalId, rest = [], infinitiveDe, infinitiveEn, enOverride }){
  const v = VERBS[modalId];
  const modalForm = conjugate(modalId, person);
  const tokens = [subjectDe, modalForm, ...rest.map(r=>r.de), infinitiveDe];
  const modalEn = v.enShort; // e.g. "can", "must", "would like to" — the dictionary .en is too verbose for a sentence
  if(!modalEn) throw new Error("Modal verb " + modalId + " needs an enShort gloss for sentence assembly");
  const enParts = [subjectEn, modalEn, infinitiveEn, ...rest.map(r=>r.en)];
  return { ...finalize(tokens, ".", enParts, enOverride), skillHint: "satzbau-modal" };
}

// ---- W-Frage: Fragewort + Verb(2) + Subjekt + Rest + ? ----------
// English questions often need do-support / different word order than a
// literal transcription, so recipes should normally pass `enOverride` here.
export function buildWFrage({ frageDe, frageEn, subjectDe, subjectEn, person, verbId, rest = [], enOverride }){
  const v = VERBS[verbId];
  const verbForm = conjugate(verbId, person);
  const tokens = [frageDe, verbForm, subjectDe, ...rest.map(r=>r.de)];
  if(v.sep) tokens.push(v.sep);
  const verbEn = conjugateEnglish(v.en, resolvePerson(person));
  const enParts = [frageEn, subjectEn, verbEn, ...rest.map(r=>r.en)];
  return { ...finalize(tokens, "?", enParts, enOverride), skillHint: "satzbau-w-frage" };
}

// ---- Ja/Nein-Frage: Verb(1) + Subjekt + Rest + ? -----------------
// Same caveat as buildWFrage — pass `enOverride` for natural English.
export function buildJaNein({ subjectDe, subjectEn, person, verbId, rest = [], enOverride }){
  const v = VERBS[verbId];
  const verbForm = conjugate(verbId, person);
  const tokens = [verbForm, subjectDe, ...rest.map(r=>r.de)];
  if(v.sep) tokens.push(v.sep);
  const verbEn = conjugateEnglish(v.en, resolvePerson(person));
  const enParts = [verbEn, subjectEn, ...rest.map(r=>r.en)];
  return { ...finalize(tokens, "?", enParts, enOverride), skillHint: "satzbau-ja-nein" };
}

// ---- weil-Satz: weil + Subjekt + Rest + Verb(final) --------------
export function buildWeil({ subjectDe, subjectEn, person, verbId, rest = [], enOverride }){
  const verbForm = conjugate(verbId, person);
  const verbEn = conjugateEnglish(VERBS[verbId].en, resolvePerson(person));
  const tokens = ["weil", subjectDe, ...rest.map(r=>r.de), verbForm];
  const enParts = ["because", subjectEn, verbEn, ...rest.map(r=>r.en)];
  return { ...finalize(tokens, ".", enParts, enOverride), skillHint: "satzbau-weil" };
}

// ---- Trennbares Verb (statement): Subjekt + Stamm(2) + Rest + Präfix(final)
export function buildTrennbar(args){
  return buildStatement(args); // buildStatement already appends v.sep at the end when present
}
