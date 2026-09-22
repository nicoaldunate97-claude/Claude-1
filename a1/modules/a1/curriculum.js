// ============================================================
// CURRICULUM-A1.JS — the A1 module: 30 days, grouped in 4 weeks
// + weekly tests + a closing review/final test.
// Owns WHAT is taught and WHEN; the engines in /js own HOW
// exercises are generated. Every vocab/skill id is a permanent
// contract — see README-CONTENT.md for the id-stability rule.
// ============================================================
import { VERBS, PREPOSITIONS, ARTICLES } from "../../js/grammar-data.js";
import * as SB from "../../js/satzbau-engine.js";

// ---- small reusable people pool for varied sentence subjects ----
const PEOPLE = [
  { de: "ich", en: "I", person: "ich" },
  { de: "du", en: "you", person: "du" },
  { de: "er", en: "he", person: "er" },
  { de: "Anna", en: "Anna", person: "er" },
  { de: "sie", en: "she", person: "er" },
  { de: "wir", en: "we", person: "wir" },
  { de: "ihr", en: "you (pl.)", person: "ihr" },
];
function people(n){ return EE_sample(PEOPLE, n); }
function EE_sample(arr, n){
  const a = arr.slice();
  for(let i=a.length-1;i>0;i--){ const j = Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; }
  return a.slice(0, n);
}

// ============================================================
// VOCAB — id: { de, en, pos, exampleDe?, exampleEn? }
// exampleDe uses {{word}} to mark the fill-in-the-blank answer.
// ============================================================
export const VOCAB = {
  // ---- Day 1: Begrüßung ----
  d1_hallo:      { de: "Hallo",            en: "hello",              pos: "phrase" },
  d1_guten_tag:  { de: "Guten Tag",        en: "good day / hello (formal)", pos: "phrase" },
  d1_guten_morgen:{ de:"Guten Morgen",     en: "good morning",       pos: "phrase" },
  d1_guten_abend:{ de: "Guten Abend",      en: "good evening",       pos: "phrase" },
  d1_auf_wiedersehen:{ de:"Auf Wiedersehen", en:"goodbye (formal)",  pos: "phrase" },
  d1_tschuess:   { de: "Tschüss",          en: "bye (informal)",     pos: "phrase" },
  d1_danke:      { de: "Danke",            en: "thank you",          pos: "phrase" },
  d1_bitte:      { de: "Bitte",            en: "please / you're welcome", pos: "phrase" },
  d1_entschuldigung:{ de:"Entschuldigung", en: "excuse me / sorry",  pos: "phrase" },
  d1_ja:         { de: "ja",               en: "yes",                pos: "phrase" },
  d1_nein:       { de: "nein",             en: "no",                 pos: "phrase" },
  d1_muede:      { de: "müde",             en: "tired",              pos: "adj", exampleDe: "Ich bin {{müde}}.", exampleEn: "I am tired." },

  // ---- Day 2: haben, Zahlen, erste Nomen ----
  d2_tisch:      { de: "der Tisch",  gender:"der", en: "table",  pos: "noun" },
  d2_stuhl:      { de: "der Stuhl",  gender:"der", en: "chair",  pos: "noun" },
  d2_buch:       { de: "das Buch",   gender:"das", en: "book",   pos: "noun" },
  d2_tuer:       { de: "die Tür",    gender:"die", en: "door",   pos: "noun" },
  d2_fenster:    { de: "das Fenster",gender:"das", en: "window", pos: "noun" },
  d2_handy:      { de: "das Handy",  gender:"das", en: "cell phone", pos: "noun" },
  d2_tasche:     { de: "die Tasche", gender:"die", en: "bag",    pos: "noun" },
  d2_zeit:       { de: "die Zeit",   gender:"die", en: "time",   pos: "noun", exampleDe: "Ich habe keine {{Zeit}}.", exampleEn: "I don't have time." },
  d2_geld:       { de: "das Geld",   gender:"das", en: "money",  pos: "noun" },
  d2_frage:      { de: "die Frage",  gender:"die", en: "question", pos: "noun" },

  // ---- Day 3: Verben im Präsens ----
  d3_lernen:     { de: "lernen",  en: "to learn",  pos: "verb" },
  d3_wohnen:     { de: "wohnen",  en: "to live (reside)", pos: "verb" },
  d3_spielen:    { de: "spielen", en: "to play",   pos: "verb" },
  d3_machen:     { de: "machen",  en: "to do / make", pos: "verb" },
  d3_sprechen:   { de: "sprechen",en: "to speak",  pos: "verb" },
  d3_essen:      { de: "essen",   en: "to eat",    pos: "verb" },
  d3_lesen:      { de: "lesen",   en: "to read",   pos: "verb" },
  d3_sehen:      { de: "sehen",   en: "to see",    pos: "verb" },
  d3_schlafen:   { de: "schlafen",en: "to sleep",  pos: "verb" },
  d3_helfen:     { de: "helfen",  en: "to help",   pos: "verb" },

  // ---- Day 4: sich vorstellen, aus, W-Fragen ----
  d4_name:       { de: "der Name",  gender:"der", en: "name",  pos: "noun" },
  d4_chile:      { de: "Chile",         en: "Chile",       pos: "noun" },
  d4_deutschland:{ de: "Deutschland",   en: "Germany",     pos: "noun" },
  d4_nett:       { de: "nett",  en: "nice / kind", pos: "adj", exampleDe: "Du bist sehr {{nett}}.", exampleEn: "You are very nice." },
  d4_beruf:      { de: "der Beruf", gender:"der", en: "occupation / job", pos: "noun", exampleDe: "Was ist dein {{Beruf}}?", exampleEn: "What's your occupation?" },
  d4_alter:      { de: "das Alter", gender:"das", en: "age", pos: "noun", exampleDe: "Das {{Alter}} spielt keine Rolle.", exampleEn: "Age doesn't matter." },
  d4_verheiratet:{ de: "verheiratet", en: "married", pos: "adj", exampleDe: "Sie ist seit zwei Jahren {{verheiratet}}.", exampleEn: "She has been married for two years." },
  d4_ledig:      { de: "ledig", en: "single (unmarried)", pos: "adj", exampleDe: "Ich bin noch {{ledig}}.", exampleEn: "I'm still single." },
  d4_adresse:    { de: "die Adresse", gender:"die", en: "address", pos: "noun", exampleDe: "Kannst du mir deine {{Adresse}} geben?", exampleEn: "Can you give me your address?" },
  d4_telefonnummer:{ de: "die Telefonnummer", gender:"die", en: "phone number", pos: "noun", exampleDe: "Ich habe meine {{Telefonnummer}} vergessen.", exampleEn: "I forgot my phone number." },

  // ---- Day 5: Beschreiben, Akkusativ ----
  d5_gross:      { de: "groß",    en: "big / tall", pos: "adj" },
  d5_klein:      { de: "klein",   en: "small",       pos: "adj" },
  d5_neu:        { de: "neu",     en: "new",         pos: "adj" },
  d5_alt:        { de: "alt",     en: "old",         pos: "adj" },
  d5_schoen:     { de: "schön",   en: "beautiful",   pos: "adj" },
  d5_billig:     { de: "billig",  en: "cheap",       pos: "adj" },
  d5_teuer:      { de: "teuer",   en: "expensive",   pos: "adj" },
  d5_hund:       { de: "der Hund",  gender:"der", en: "dog",  pos: "noun" },
  d5_katze:      { de: "die Katze", gender:"die", en: "cat",  pos: "noun" },
  d5_auto:       { de: "das Auto",  gender:"das", en: "car",  pos: "noun" },

  // ---- Day 6: Tagesablauf, Uhrzeit ----
  d6_uhrzeit:    { de: "die Uhrzeit", gender:"die", en: "time (of day)", pos: "noun" },
  d6_stunde:     { de: "die Stunde",  gender:"die", en: "hour",  pos: "noun" },
  d6_morgens:    { de: "morgens", en: "in the morning(s)", pos: "adv" },
  d6_mittags:    { de: "mittags", en: "at noon",     pos: "adv" },
  d6_abends:     { de: "abends",  en: "in the evening(s)", pos: "adv" },
  d6_fruehstueck:{ de: "das Frühstück", gender:"das", en: "breakfast", pos: "noun" },
  d6_arbeit:     { de: "die Arbeit", gender:"die", en: "work", pos: "noun" },
  d6_aufstehen:  { de: "aufstehen", en: "to get up", pos: "verb" },
  d6_fruehstuecken:{ de: "frühstücken", en: "to have breakfast", pos: "verb" },
  d6_anfangen:   { de: "anfangen", en: "to start / begin", pos: "verb" },
};

// ---- helper: build a VOCAB subset by array of ids ---------------
export function vocabByIds(ids){ return ids.map(id => ({ id, ...VOCAB[id] })); }
export function vocabByDayPrefix(prefix){
  return Object.keys(VOCAB).filter(id => id.startsWith(prefix)).map(id => ({ id, ...VOCAB[id] }));
}

// ============================================================
// SKILLS — every grammar rule taught. `exerciseType` tells the
// day-composer which generic generator (see exercise-engine.js)
// to call; `params` supplies the data that generator needs.
// ============================================================
export const SKILLS = {
  "sein": {
    title: "sein (to be) — Präsens",
    category: "Verben", day: 1,
    explanation: "\"sein\" is irregular and one of the most important verbs. You need it for names, origin, and characteristics: \"Ich bin müde\" (I am tired), \"Er ist nett\" (He is nice).",
    examples: ["Ich bin müde.", "Du bist nett.", "Er ist hier.", "Wir sind zu Hause."],
    exerciseType: "conjugation",
    params: { verbIds: ["sein"], opts: { count: 8 } },
  },
  "haben": {
    title: "haben (to have) — Präsens",
    category: "Verben", day: 2,
    explanation: "\"haben\" is also irregular. Watch out with \"du\" and \"er/sie/es\": the -b- drops (du hast, er hat).",
    examples: ["Ich habe Zeit.", "Du hast ein Buch.", "Wir haben Geld."],
    exerciseType: "conjugation",
    params: { verbIds: ["haben"], opts: { count: 8 } },
  },
  "verben-praesens": {
    title: "Regelmäßige & unregelmäßige Verben im Präsens",
    category: "Verben", day: 3,
    explanation: "Most verbs are regular: stem + e/st/t/en/t/en (ich lerne, du lernst...). Some change their vowel for \"du\" and \"er/sie/es\": e→i (sprechen→du sprichst), e→ie (sehen→du siehst), a→ä (schlafen→du schläfst).",
    examples: ["Ich lerne Deutsch.", "Du sprichst gut Deutsch.", "Er liest ein Buch.", "Sie schläft viel."],
    exerciseType: "conjugation",
    params: { verbIds: ["lernen","wohnen","spielen","machen","sprechen","essen","lesen","sehen","schlafen","helfen"], opts: { count: 14 } },
  },
  "w-fragen": {
    title: "W-Fragen",
    category: "Satzbau", day: 4,
    explanation: "Question words (wer, wie, wo, woher, wann, warum) come first, immediately followed by the conjugated verb, then the subject: question word + verb + subject + rest.",
    examples: ["Wie heißt du?", "Wo wohnst du?", "Woher kommst du?", "Wie alt bist du?"],
    exerciseType: "satzbau",
    params: { recipesFn: buildWFragenRecipes },
  },
  "prep-aus": {
    title: "Präposition: aus (Herkunft)",
    category: "Präpositionen", day: 4,
    explanation: PREPOSITIONS.aus.rule,
    examples: ["Ich komme aus Chile.", "Sie kommt aus Deutschland.", "Wir kommen aus Spanien."],
    exerciseType: "preposition",
    params: { itemsFn: buildAusItems },
  },
  "akkusativ": {
    title: "Akkusativ (direktes Objekt)",
    category: "Artikel & Akkusativ", day: 5,
    explanation: "The direct object takes the accusative case. Only \"der\" becomes \"den\" (and \"ein\" becomes \"einen\") — \"die\" and \"das\" don't change. Typical verbs: haben, brauchen, nehmen, kaufen.",
    examples: ["Ich habe einen Hund.", "Ich brauche die Tasche.", "Wir kaufen das Auto."],
    exerciseType: "article",
    params: { nounsFn: () => [...vocabByDayPrefix("d2_"), ...vocabByDayPrefix("d5_")].filter(v=>v.gender), opts: { indefinite: true, count: 6 } },
  },
  "uhrzeit-satzbau": {
    title: "Tagesablauf & Satzbau mit Zeitangaben",
    category: "Satzbau", day: 6,
    explanation: "Even when a time expression starts the sentence, the verb stays in position 2: \"Um sieben Uhr stehe ich auf.\" (not: \"Um sieben Uhr ich stehe auf.\")",
    examples: ["Ich stehe um sieben Uhr auf.", "Um sieben Uhr stehe ich auf.", "Die Arbeit fängt um neun Uhr an."],
    exerciseType: "satzbau",
    params: { recipesFn: buildUhrzeitRecipes },
  },
};

// ---- recipe builders (use the Satzbau engine + small pools) ------
function buildWFragenRecipes(){
  const items = [
    { frageDe:"Wie", frageEn:"what", subjectDe:"du", subjectEn:"you", person:"du", verbId:"heissen", enOverride:"What is your name?" },
    { frageDe:"Wo", frageEn:"where", subjectDe:"du", subjectEn:"you", person:"du", verbId:"wohnen", enOverride:"Where do you live?" },
    { frageDe:"Woher", frageEn:"where from", subjectDe:"du", subjectEn:"you", person:"du", verbId:"kommen", enOverride:"Where are you from?" },
    { frageDe:"Was", frageEn:"what", subjectDe:"du", subjectEn:"you", person:"du", verbId:"machen", enOverride:"What do you do?" },
    { frageDe:"Wo", frageEn:"where", subjectDe:"Anna", subjectEn:"Anna", person:"er", verbId:"wohnen", enOverride:"Where does Anna live?" },
    { frageDe:"Woher", frageEn:"where from", subjectDe:"er", subjectEn:"he", person:"er", verbId:"kommen", enOverride:"Where does he come from?" },
    { frageDe:"Wie", frageEn:"what", subjectDe:"sie", subjectEn:"she", person:"er", verbId:"heissen", enOverride:"What is her name?" },
    { frageDe:"Wo", frageEn:"where", subjectDe:"ihr", subjectEn:"you (pl.)", person:"ihr", verbId:"wohnen", enOverride:"Where do you (pl.) live?" },
  ];
  return items.map(it => SB.buildWFrage(it));
}
function buildAusItems(){
  const countries = [
    { de:"Chile", en:"Chile" }, { de:"Deutschland", en:"Germany" }, { de:"Spanien", en:"Spain" },
    { de:"Argentinien", en:"Argentina" }, { de:"Mexiko", en:"Mexico" }, { de:"Österreich", en:"Austria" },
  ];
  const subjects = [
    { de:"Ich", en:"I", person:"ich" }, { de:"Du", en:"you", person:"du" },
    { de:"Er", en:"He", person:"er" }, { de:"Wir", en:"We", person:"wir" },
  ];
  const out = [];
  countries.forEach(c => {
    const s = subjects[Math.floor(Math.random()*subjects.length)];
    const verbForm = SB.conjugate("kommen", s.person);
    out.push({
      prepId: "aus",
      sentence: `${s.de} ${verbForm} ___ ${c.de}.`,
      en: `${s.en} come${s.person==="er"?"s":""} from ${c.en}.`,
    });
  });
  return out;
}
function buildUhrzeitRecipes(){
  const times = [
    { de: "sieben Uhr", en: "seven o'clock" }, { de: "acht Uhr", en: "eight o'clock" },
    { de: "neun Uhr", en: "nine o'clock" }, { de: "zehn Uhr", en: "ten o'clock" },
  ];
  const verbs = ["aufstehen","fruehstuecken","anfangen"];
  const out = [];
  verbs.forEach(verbId => {
    const t = times[Math.floor(Math.random()*times.length)];
    out.push(SB.buildStatement({
      subjectDe: "ich", subjectEn: "I", person: "ich", verbId,
      rest: [{ de: `um ${t.de}`, en: `at ${t.en}` }],
      enOverride: `I ${verbId==="aufstehen"?"get up":verbId==="fruehstuecken"?"have breakfast":"start"} at ${t.en}.`,
    }));
    out.push(SB.buildStatement({
      subjectDe: "ich", subjectEn: "I", person: "ich", verbId,
      rest: [],
      fronted: { de: `Um ${t.de}`, en: `At ${t.en}` },
      enOverride: `At ${t.en} I ${verbId==="aufstehen"?"get up":verbId==="fruehstuecken"?"have breakfast":"start"}.`,
    }));
  });
  return out;
}

// ============================================================
// DAYS — 30 days, 4 weeks of 7 (day 7/14/21/28 = test), + 29/30 close.
// ============================================================
export const DAYS = [
  {
    id: 1, week: 1, isTest: false,
    title: "Begrüßung & sein",
    theme: "Basic greetings and the verb 'sein' (to be).",
    newSkillIds: ["sein"],
    newVocabIds: Object.keys(VOCAB).filter(k=>k.startsWith("d1_")),
  },
  {
    id: 2, week: 1, isTest: false,
    title: "haben & erste Nomen",
    theme: "The verb 'haben' (to have) and your first gendered nouns.",
    newSkillIds: ["haben"],
    newVocabIds: Object.keys(VOCAB).filter(k=>k.startsWith("d2_")),
  },
  {
    id: 3, week: 1, isTest: false,
    title: "Verben im Präsens",
    theme: "Regular and irregular present-tense conjugation.",
    newSkillIds: ["verben-praesens"],
    newVocabIds: Object.keys(VOCAB).filter(k=>k.startsWith("d3_")),
  },
  {
    id: 4, week: 1, isTest: false,
    title: "Sich vorstellen & W-Fragen",
    theme: "Introducing yourself, saying where you're from, questions with what/where/where-from.",
    newSkillIds: ["w-fragen","prep-aus"],
    newVocabIds: Object.keys(VOCAB).filter(k=>k.startsWith("d4_")),
  },
  {
    id: 5, week: 1, isTest: false,
    title: "Beschreiben & Akkusativ",
    theme: "Describing things/people and the accusative case.",
    newSkillIds: ["akkusativ"],
    newVocabIds: Object.keys(VOCAB).filter(k=>k.startsWith("d5_")),
  },
  {
    id: 6, week: 1, isTest: false,
    title: "Tagesablauf & Uhrzeit",
    theme: "Your daily routine and telling the time.",
    newSkillIds: ["uhrzeit-satzbau"],
    newVocabIds: Object.keys(VOCAB).filter(k=>k.startsWith("d6_")),
  },
  {
    id: 7, week: 1, isTest: true,
    title: "Test — Woche 1",
    theme: "Combined review: sein, haben, present-tense verbs, W-Fragen, aus, Akkusativ, time.",
    newSkillIds: [],
    newVocabIds: [],
    testSkillIds: ["sein","haben","verben-praesens","w-fragen","prep-aus","akkusativ","uhrzeit-satzbau"],
    testVocabPrefixes: ["d1_","d2_","d3_","d4_","d5_","d6_"],
  },
];

export const MODULE_META = {
  id: "a1", title: "A1 — Grundstufe 1", totalDays: 30,
  weeks: 4,
};
