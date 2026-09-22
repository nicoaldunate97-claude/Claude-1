// ============================================================
// GRAMMAR-DATA.JS — canonical, hand-verified source of truth.
// Every exercise in the app is GENERATED from these tables —
// nothing here is duplicated as loose prose elsewhere, so a
// fix here fixes every exercise that uses it.
// ============================================================

// ---- VERBS ---------------------------------------------------
// pres: [ich, du, er/sie/es, wir, ihr, sie/Sie]
// type: 'irregular' | 'regular' | 'stem-e-i' | 'stem-e-ie' | 'stem-a-ä' | 'modal'
// sep: separable prefix (string) or null
// reflexive: true if used with a reflexive pronoun (sich ...)
// drillable: false => don't generate a 6-person conjugation drill
//            (impersonal / fixed-phrase verbs read oddly in all persons)
export const VERBS = {
  sein:        { en: "to be",            type: "irregular", sep: null,   pres: ["bin","bist","ist","sind","seid","sind"] },
  haben:       { en: "to have",          type: "irregular", sep: null,   pres: ["habe","hast","hat","haben","habt","haben"] },
  heissen:     { de: "heißen", en: "to be called", type: "regular", sep: null, pres: ["heiße","heißt","heißt","heißen","heißt","heißen"] },
  wohnen:      { en: "to live (reside)", type: "regular", sep: null,   pres: ["wohne","wohnst","wohnt","wohnen","wohnt","wohnen"] },
  kommen:      { en: "to come",          type: "regular", sep: null,   pres: ["komme","kommst","kommt","kommen","kommt","kommen"] },
  lernen:      { en: "to learn",         type: "regular", sep: null,   pres: ["lerne","lernst","lernt","lernen","lernt","lernen"] },
  spielen:     { en: "to play",          type: "regular", sep: null,   pres: ["spiele","spielst","spielt","spielen","spielt","spielen"] },
  machen:      { en: "to do / make",     type: "regular", sep: null,   pres: ["mache","machst","macht","machen","macht","machen"] },
  kaufen:      { en: "to buy",           type: "regular", sep: null,   pres: ["kaufe","kaufst","kauft","kaufen","kauft","kaufen"] },
  sprechen:    { en: "to speak",         type: "stem-e-i", sep: null,  pres: ["spreche","sprichst","spricht","sprechen","sprecht","sprechen"] },
  essen:       { en: "to eat",           type: "stem-e-i", sep: null,  pres: ["esse","isst","isst","essen","esst","essen"] },
  lesen:       { en: "to read",          type: "stem-e-ie", sep: null, pres: ["lese","liest","liest","lesen","lest","lesen"] },
  sehen:       { en: "to see",           type: "stem-e-ie", sep: null, pres: ["sehe","siehst","sieht","sehen","seht","sehen"] },
  fahren:      { en: "to drive / go (vehicle)", type: "stem-a-ä", sep: null, pres: ["fahre","fährst","fährt","fahren","fahrt","fahren"] },
  schlafen:    { en: "to sleep",         type: "stem-a-ä", sep: null,  pres: ["schlafe","schläfst","schläft","schlafen","schlaft","schlafen"] },
  treffen:     { en: "to meet",          type: "stem-e-i", sep: null,  pres: ["treffe","triffst","trifft","treffen","trefft","treffen"] },
  helfen:      { en: "to help",          type: "stem-e-i", sep: null,  pres: ["helfe","hilfst","hilft","helfen","helft","helfen"] },
  geben:       { en: "to give",          type: "stem-e-i", sep: null,  pres: ["gebe","gibst","gibt","geben","gebt","geben"] },
  nehmen:      { en: "to take",          type: "stem-e-i", sep: null,  pres: ["nehme","nimmst","nimmt","nehmen","nehmt","nehmen"] },
  tragen:      { en: "to wear / carry",  type: "stem-a-ä", sep: null,  pres: ["trage","trägst","trägt","tragen","tragt","tragen"] },

  koennen:     { de: "können", en: "can / to be able to",  enShort: "can",           type: "modal", sep: null, pres: ["kann","kannst","kann","können","könnt","können"] },
  muessen:     { de: "müssen", en: "must / to have to",    enShort: "must",          type: "modal", sep: null, pres: ["muss","musst","muss","müssen","müsst","müssen"] },
  wollen:      { en: "to want to",                          enShort: "want to",       type: "modal", sep: null, pres: ["will","willst","will","wollen","wollt","wollen"] },
  duerfen:     { de: "dürfen", en: "to be allowed to / may", enShort: "may",          type: "modal", sep: null, pres: ["darf","darfst","darf","dürfen","dürft","dürfen"] },
  sollen:      { en: "should / to be supposed to",          enShort: "should",        type: "modal", sep: null, pres: ["soll","sollst","soll","sollen","sollt","sollen"] },
  moegen:      { de: "mögen", en: "to like",                enShort: "like",          type: "modal", sep: null, pres: ["mag","magst","mag","mögen","mögt","mögen"] },
  moechten:    { de: "möchten", en: "would like to",        enShort: "would like to", type: "modal", sep: null, pres: ["möchte","möchtest","möchte","möchten","möchtet","möchten"] },

  aufstehen:   { en: "to get up",        type: "irregular", sep: "auf",  pres: ["stehe","stehst","steht","stehen","steht","stehen"] },
  fruehstuecken:{ de:"frühstücken", en: "to have breakfast", type: "regular", sep: null, pres: ["frühstücke","frühstückst","frühstückt","frühstücken","frühstückt","frühstücken"] },
  arbeiten:    { en: "to work",          type: "regular-t", sep: null,  pres: ["arbeite","arbeitest","arbeitet","arbeiten","arbeitet","arbeiten"] },
  anfangen:    { en: "to start / begin", type: "stem-a-ä", sep: "an",   pres: ["fange","fängst","fängt","fangen","fangt","fangen"] },
  aufhoeren:   { de: "aufhören", en: "to stop / finish",   type: "regular", sep: "auf",  pres: ["höre","hörst","hört","hören","hört","hören"] },
  einkaufen:   { en: "to shop / buy groceries", type: "regular", sep: "ein", pres: ["kaufe","kaufst","kauft","kaufen","kauft","kaufen"] },
  fernsehen:   { en: "to watch TV",      type: "stem-e-ie", sep: "fern", pres: ["sehe","siehst","sieht","sehen","seht","sehen"] },
  anrufen:     { en: "to call (phone)",  type: "regular", sep: "an",    pres: ["rufe","rufst","ruft","rufen","ruft","rufen"] },
  aufraeumen:  { de: "aufräumen", en: "to tidy up",        type: "regular", sep: "auf",  pres: ["räume","räumst","räumt","räumen","räumt","räumen"] },
  anprobieren: { en: "to try on",        type: "regular", sep: "an",    pres: ["probiere","probierst","probiert","probieren","probiert","probieren"] },

  passen:      { en: "to fit",           type: "regular", sep: null,    pres: ["passe","passt","passt","passen","passt","passen"] },
  kosten:      { en: "to cost",          type: "regular-t", sep: null,  pres: ["koste","kostest","kostet","kosten","kostet","kosten"] },
  bestellen:   { en: "to order",         type: "regular", sep: null,    pres: ["bestelle","bestellst","bestellt","bestellen","bestellt","bestellen"] },
  bringen:     { en: "to bring",         type: "regular", sep: null,    pres: ["bringe","bringst","bringt","bringen","bringt","bringen"] },
  bezahlen:    { en: "to pay",           type: "regular", sep: null,    pres: ["bezahle","bezahlst","bezahlt","bezahlen","bezahlt","bezahlen"] },
  fragen:      { en: "to ask",           type: "regular", sep: null,    pres: ["frage","fragst","fragt","fragen","fragt","fragen"] },

  gehen:       { en: "to go (on foot)",  type: "regular", sep: null,    pres: ["gehe","gehst","geht","gehen","geht","gehen"] },
  stehen:      { en: "to stand",         type: "regular", sep: null,    pres: ["stehe","stehst","steht","stehen","steht","stehen"] },
  liegen:      { en: "to lie / be located", type: "regular", sep: null, pres: ["liege","liegst","liegt","liegen","liegt","liegen"] },
  haengen:     { de: "hängen", en: "to hang (be hanging)", type: "regular", sep: null, pres: ["hänge","hängst","hängt","hängen","hängt","hängen"] },

  tun:         { en: "to do", type: "irregular", sep: null, drillable: false, pres: ["tue","tust","tut","tun","tut","tun"] },
  fuehlen:     { de: "fühlen", en: "to feel", type: "regular", sep: null, reflexive: true, pres: ["fühle","fühlst","fühlt","fühlen","fühlt","fühlen"] },
};

// ---- PRONOUNS --------------------------------------------------
export const SUBJECT_PRONOUNS = ["ich","du","er/sie/es","wir","ihr","sie/Sie"];
export const SUBJECT_PRONOUNS_SIMPLE = ["ich","du","er","wir","ihr","sie"];
export const REFLEXIVE_PRONOUNS = ["mich","dich","sich","uns","euch","sich"];
export const ACCUSATIVE_PRONOUNS = { ich:"mich", du:"dich", er:"ihn", sie_f:"sie", es:"es", wir:"uns", ihr:"euch", sie_pl:"sie" };

// ---- ARTICLES / ACCUSATIVE -------------------------------------
// Only masculine changes in the accusative — this table IS the rule.
export const ARTICLES = {
  der: { nom: "der", akk: "den", indef_nom: "ein",  indef_akk: "einen" },
  die: { nom: "die", akk: "die", indef_nom: "eine", indef_akk: "eine"  },
  das: { nom: "das", akk: "das", indef_nom: "ein",  indef_akk: "ein"   },
};

// ---- POSSESSIVES (nominative, for simple "my/your X is..." drills) --
export const POSSESSIVES = {
  ich: "mein", du: "dein", er: "sein", sie_f: "ihr", wir: "unser", ihr: "euer", sie_pl: "ihr",
};

// ---- PREPOSITIONS -----------------------------------------------
// rule: short explanation of when to use it (shown in the Grammar reference)
export const PREPOSITIONS = {
  aus:  { en: "from / out of (origin, country or city)", rule: "Herkunft: Woher kommst du? — Ich komme aus + Land/Stadt (kein Artikel bei den meisten Ländern)." },
  von:  { en: "from (a specific starting point)",         rule: "Ausgangspunkt: von + Dativ — Ich komme von der Arbeit / von zu Hause." },
  nach: { en: "to (a city/country, no article)",           rule: "Richtung ohne Artikel: nach + Stadt/Land — Ich fahre nach Berlin / nach Deutschland." },
  zu:   { en: "to (a place with an article, or a person)", rule: "Richtung zu einer Person oder einem Ort mit Artikel: zu + Dativ (zum = zu dem, zur = zu der) — Ich gehe zum Arzt / zur Schule / zu meiner Freundin." },
  in:   { en: "in / into (enclosed place)",                rule: "Ort innerhalb eines Raumes: in + Dativ (wo?) / in + Akkusativ (wohin?) — im = in dem — Ich bin im Büro. / Ich gehe ins Büro." },
  bei:  { en: "at (someone's place / a company)",          rule: "Bei einer Person oder Firma: bei + Dativ (beim = bei dem) — Ich bin bei meiner Oma. / Ich arbeite beim Supermarkt." },
  auf:  { en: "on (a surface) / at (an event)",             rule: "Auf einer Fläche oder bei einer Veranstaltung: auf + Dativ/Akkusativ — Das Buch liegt auf dem Tisch. / Ich bin auf einer Party." },
};

// ---- NUMBERS (0-100, generated then hand-checked) ----------------
const NUM_ONES = ["null","eins","zwei","drei","vier","fünf","sechs","sieben","acht","neun"];
const NUM_TEENS = ["zehn","elf","zwölf","dreizehn","vierzehn","fünfzehn","sechzehn","siebzehn","achtzehn","neunzehn"];
const NUM_TENS = ["","zehn","zwanzig","dreißig","vierzig","fünfzig","sechzig","siebzig","achtzig","neunzig"];
function germanNumber(n){
  if(n < 10) return NUM_ONES[n];
  if(n < 20) return NUM_TEENS[n-10];
  if(n === 100) return "hundert";
  const tens = Math.floor(n/10), ones = n%10;
  if(ones === 0) return NUM_TENS[tens];
  return NUM_ONES[ones] + "und" + NUM_TENS[tens];
}
export const NUMBERS = Array.from({length:101}, (_,n) => ({ n, de: germanNumber(n) }));

// ---- QUESTION WORDS ------------------------------------------------
export const QUESTION_WORDS = [
  { de: "wer",   en: "who" },
  { de: "was",   en: "what" },
  { de: "wo",    en: "where (location)" },
  { de: "woher", en: "where from" },
  { de: "wohin", en: "where to" },
  { de: "wann",  en: "when" },
  { de: "warum", en: "why" },
  { de: "wie",   en: "how" },
  { de: "wie viel", en: "how much" },
  { de: "welche/r/s", en: "which" },
];
