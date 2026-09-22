// ============================================================
// CURRICULUM-A1.JS — the A1 module: 30 days, grouped in 4 weeks
// + weekly tests + a closing review/final test.
// Owns WHAT is taught and WHEN; the engines in /js own HOW
// exercises are generated. Every vocab/skill id is a permanent
// contract — see README-CONTENT.md for the id-stability rule.
// ============================================================
import { VERBS, PREPOSITIONS, ARTICLES } from "../../js/grammar-data.js";
import * as SB from "../../js/satzbau-engine.js";
import { sample } from "../../js/exercise-engine.js";

// ============================================================
// VOCAB — id: { de, en, pos, exampleDe?, exampleEn? }
// exampleDe uses {{word}} to mark the fill-in-the-blank answer.
// ============================================================
export const VOCAB = {
  // ---- Day 1: Begrüßung ----
  d1_hallo:      { de: "Hallo",            en: "hello",              pos: "phrase", exampleDe: "{{Hallo}}, wie geht's?", exampleEn: "Hello, how's it going?" },
  d1_guten_tag:  { de: "Guten Tag",        en: "good day / hello (formal)", pos: "phrase", exampleDe: "{{Guten Tag}}, Frau Müller.", exampleEn: "Good day, Mrs. Müller." },
  d1_guten_morgen:{ de:"Guten Morgen",     en: "good morning",       pos: "phrase", exampleDe: "{{Guten Morgen}}, Anna!", exampleEn: "Good morning, Anna!" },
  d1_guten_abend:{ de: "Guten Abend",      en: "good evening",       pos: "phrase", exampleDe: "{{Guten Abend}}, Herr Schmidt.", exampleEn: "Good evening, Mr. Schmidt." },
  d1_auf_wiedersehen:{ de:"Auf Wiedersehen", en:"goodbye (formal)",  pos: "phrase", exampleDe: "{{Auf Wiedersehen}}, bis morgen.", exampleEn: "Goodbye, see you tomorrow." },
  d1_tschuess:   { de: "Tschüss",          en: "bye (informal)",     pos: "phrase", exampleDe: "{{Tschüss}}, bis später!", exampleEn: "Bye, see you later!" },
  d1_danke:      { de: "Danke",            en: "thank you",          pos: "phrase", exampleDe: "{{Danke}} für deine Hilfe!", exampleEn: "Thanks for your help!" },
  d1_bitte:      { de: "Bitte",            en: "please / you're welcome", pos: "phrase", exampleDe: "Ein Kaffee, {{bitte}}.", exampleEn: "A coffee, please." },
  d1_entschuldigung:{ de:"Entschuldigung", en: "excuse me / sorry",  pos: "phrase", exampleDe: "{{Entschuldigung}}, wo ist der Bahnhof?", exampleEn: "Excuse me, where's the train station?" },
  d1_ja:         { de: "ja",               en: "yes",                pos: "phrase", exampleDe: "Hast du Zeit? – {{Ja}}.", exampleEn: "Do you have time? – Yes." },
  d1_nein:       { de: "nein",             en: "no",                 pos: "phrase", exampleDe: "Hast du Zeit? – {{Nein}}.", exampleEn: "Do you have time? – No." },
  d1_muede:      { de: "müde",             en: "tired",              pos: "adj", exampleDe: "Ich bin {{müde}}.", exampleEn: "I am tired." },
  d1_gut:        { de: "gut",              en: "good",               pos: "adj", exampleDe: "Das ist {{gut}}.", exampleEn: "That's good." },
  d1_schlecht:   { de: "schlecht",         en: "bad",                pos: "adj", exampleDe: "Mir geht es {{schlecht}}.", exampleEn: "I'm not doing well." },
  d1_vielleicht: { de: "vielleicht",       en: "maybe",              pos: "adv", exampleDe: "{{Vielleicht}} komme ich später.", exampleEn: "Maybe I'll come later." },
  d1_auch:       { de: "auch",             en: "also / too",         pos: "adv", exampleDe: "Ich bin müde. Du bist {{auch}} müde.", exampleEn: "I am tired. You are also tired." },

  // ---- Day 2: haben, Zahlen, erste Nomen ----
  // (all these examples stay nominative or use ein/eine — accusative endings
  // like "einen Tisch" aren't taught until day 5, see the akkusativ skill)
  d2_tisch:      { de: "der Tisch",  gender:"der", en: "table",  pos: "noun", exampleDe: "{{Der Tisch}} ist hier.", exampleEn: "The table is here." },
  d2_stuhl:      { de: "der Stuhl",  gender:"der", en: "chair",  pos: "noun", exampleDe: "{{Der Stuhl}} ist gut.", exampleEn: "The chair is good." },
  d2_buch:       { de: "das Buch",   gender:"das", en: "book",   pos: "noun", exampleDe: "Ich habe {{ein Buch}}.", exampleEn: "I have a book." },
  d2_tuer:       { de: "die Tür",    gender:"die", en: "door",   pos: "noun", exampleDe: "{{Die Tür}} ist hier.", exampleEn: "The door is here." },
  d2_fenster:    { de: "das Fenster",gender:"das", en: "window", pos: "noun", exampleDe: "{{Das Fenster}} ist hier.", exampleEn: "The window is here." },
  d2_handy:      { de: "das Handy",  gender:"das", en: "cell phone", pos: "noun", exampleDe: "Ich habe {{ein Handy}}.", exampleEn: "I have a cell phone." },
  d2_tasche:     { de: "die Tasche", gender:"die", en: "bag",    pos: "noun", exampleDe: "Ich habe {{eine Tasche}}.", exampleEn: "I have a bag." },
  d2_zeit:       { de: "die Zeit",   gender:"die", en: "time",   pos: "noun", exampleDe: "Ich habe keine {{Zeit}}.", exampleEn: "I don't have time." },
  d2_geld:       { de: "das Geld",   gender:"das", en: "money",  pos: "noun", exampleDe: "Ich habe {{Geld}}.", exampleEn: "I have money." },
  d2_frage:      { de: "die Frage",  gender:"die", en: "question", pos: "noun", exampleDe: "Ich habe {{eine Frage}}.", exampleEn: "I have a question." },
  d2_lampe:      { de: "die Lampe",  gender:"die", en: "lamp",   pos: "noun", exampleDe: "{{Die Lampe}} ist gut.", exampleEn: "The lamp is good." },
  d2_computer:   { de: "der Computer", gender:"der", en: "computer", pos: "noun", exampleDe: "{{Der Computer}} ist gut.", exampleEn: "The computer is good." },
  d2_bett:       { de: "das Bett",   gender:"das", en: "bed",    pos: "noun", exampleDe: "{{Das Bett}} ist gut.", exampleEn: "The bed is good." },
  d2_wand:       { de: "die Wand",   gender:"die", en: "wall",   pos: "noun", exampleDe: "{{Die Wand}} ist hier.", exampleEn: "The wall is here." },

  // ---- Day 3: Verben im Präsens ----
  // (every blanked form here is cross-checked against VERBS in grammar-data.js)
  d3_lernen:     { de: "lernen",  en: "to learn",  pos: "verb", exampleDe: "Ich {{lerne}} Deutsch.", exampleEn: "I learn German." },
  d3_wohnen:     { de: "wohnen",  en: "to live (reside)", pos: "verb", exampleDe: "Du {{wohnst}} hier.", exampleEn: "You live here." },
  d3_spielen:    { de: "spielen", en: "to play",   pos: "verb", exampleDe: "Wir {{spielen}} hier.", exampleEn: "We play here." },
  d3_machen:     { de: "machen",  en: "to do / make", pos: "verb", exampleDe: "Was {{machst}} du?", exampleEn: "What do you do?" },
  d3_sprechen:   { de: "sprechen",en: "to speak",  pos: "verb", exampleDe: "Er {{spricht}} Deutsch.", exampleEn: "He speaks German." },
  d3_essen:      { de: "essen",   en: "to eat",    pos: "verb", exampleDe: "Ich {{esse}} hier.", exampleEn: "I eat here." },
  d3_lesen:      { de: "lesen",   en: "to read",   pos: "verb", exampleDe: "Er {{liest}} ein Buch.", exampleEn: "He reads a book." },
  d3_sehen:      { de: "sehen",   en: "to see",    pos: "verb", exampleDe: "Wir {{sehen}} das.", exampleEn: "We see that." },
  d3_schlafen:   { de: "schlafen",en: "to sleep",  pos: "verb", exampleDe: "Er {{schläft}} viel.", exampleEn: "He sleeps a lot." },
  d3_helfen:     { de: "helfen",  en: "to help",   pos: "verb", exampleDe: "Sie {{hilft}} hier.", exampleEn: "She helps here." },
  d3_kaufen:     { de: "kaufen",  en: "to buy",    pos: "verb", exampleDe: "Ich {{kaufe}} ein Handy.", exampleEn: "I buy a cell phone." },
  d3_arbeiten:   { de: "arbeiten",en: "to work",   pos: "verb", exampleDe: "Du {{arbeitest}} hier.", exampleEn: "You work here." },
  d3_gehen:      { de: "gehen",   en: "to go (on foot)", pos: "verb", exampleDe: "Er {{geht}} nach Hause.", exampleEn: "He goes home." },
  d3_fragen:     { de: "fragen",  en: "to ask",    pos: "verb", exampleDe: "Wir {{fragen}} hier.", exampleEn: "We ask here." },

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
  d4_nationalitaet:{ de: "die Nationalität", gender:"die", en: "nationality", pos: "noun", exampleDe: "Meine {{Nationalität}} ist chilenisch.", exampleEn: "My nationality is Chilean." },
  d4_muttersprache:{ de: "die Muttersprache", gender:"die", en: "native language", pos: "noun", exampleDe: "Meine {{Muttersprache}} ist Spanisch.", exampleEn: "My native language is Spanish." },
  d4_nachbar:    { de: "der Nachbar", gender:"der", en: "neighbor", pos: "noun", exampleDe: "Mein {{Nachbar}} ist sehr freundlich.", exampleEn: "My neighbor is very friendly." },
  d4_freuen:     { de: "sich freuen", en: "to be glad / happy", pos: "phrase", exampleDe: "Ich {{freue}} mich, dich kennenzulernen.", exampleEn: "I'm glad to meet you." },

  // ---- Day 5: Beschreiben, Akkusativ ----
  // (hund/katze/auto use "einen/eine/ein" on purpose — that's this day's own
  // new rule, unlike day 2/3's examples which stay ahead of it)
  d5_gross:      { de: "groß",    en: "big / tall", pos: "adj", exampleDe: "Das Auto ist {{groß}}.", exampleEn: "The car is big." },
  d5_klein:      { de: "klein",   en: "small",       pos: "adj", exampleDe: "Die Katze ist {{klein}}.", exampleEn: "The cat is small." },
  d5_neu:        { de: "neu",     en: "new",         pos: "adj", exampleDe: "Der Computer ist {{neu}}.", exampleEn: "The computer is new." },
  d5_alt:        { de: "alt",     en: "old",         pos: "adj", exampleDe: "Das Buch ist {{alt}}.", exampleEn: "The book is old." },
  d5_schoen:     { de: "schön",   en: "beautiful",   pos: "adj", exampleDe: "Die Tasche ist {{schön}}.", exampleEn: "The bag is beautiful." },
  d5_billig:     { de: "billig",  en: "cheap",       pos: "adj", exampleDe: "Der Tisch ist {{billig}}.", exampleEn: "The table is cheap." },
  d5_teuer:      { de: "teuer",   en: "expensive",   pos: "adj", exampleDe: "Das Auto ist {{teuer}}.", exampleEn: "The car is expensive." },
  d5_hund:       { de: "der Hund",  gender:"der", en: "dog",  pos: "noun", exampleDe: "Ich habe {{einen Hund}}.", exampleEn: "I have a dog." },
  d5_katze:      { de: "die Katze", gender:"die", en: "cat",  pos: "noun", exampleDe: "Ich habe {{eine Katze}}.", exampleEn: "I have a cat." },
  d5_auto:       { de: "das Auto",  gender:"das", en: "car",  pos: "noun", exampleDe: "Ich habe {{ein Auto}}.", exampleEn: "I have a car." },
  d5_schnell:    { de: "schnell",   en: "fast",        pos: "adj", exampleDe: "Das Auto ist {{schnell}}.", exampleEn: "The car is fast." },
  d5_langsam:    { de: "langsam",   en: "slow",        pos: "adj", exampleDe: "Die Katze ist {{langsam}}.", exampleEn: "The cat is slow." },
  d5_interessant:{ de: "interessant", en: "interesting", pos: "adj", exampleDe: "Das Buch ist {{interessant}}.", exampleEn: "The book is interesting." },
  d5_wichtig:    { de: "wichtig",   en: "important",   pos: "adj", exampleDe: "Die Frage ist {{wichtig}}.", exampleEn: "The question is important." },
  d5_haesslich:  { de: "hässlich",  en: "ugly",        pos: "adj", exampleDe: "Das Auto ist {{hässlich}}.", exampleEn: "The car is ugly." },
  d5_einfach:    { de: "einfach",   en: "simple / easy", pos: "adj", exampleDe: "Die Frage ist {{einfach}}.", exampleEn: "The question is easy." },
  d5_schwierig:  { de: "schwierig", en: "difficult",   pos: "adj", exampleDe: "Die Frage ist {{schwierig}}.", exampleEn: "The question is difficult." },
  d5_praktisch:  { de: "praktisch", en: "practical",   pos: "adj", exampleDe: "Das Handy ist {{praktisch}}.", exampleEn: "The cell phone is practical." },

  // ---- Day 6: Tagesablauf, Uhrzeit ----
  d6_uhrzeit:    { de: "die Uhrzeit", gender:"die", en: "time (of day)", pos: "noun", exampleDe: "Die {{Uhrzeit}} ist wichtig.", exampleEn: "The time is important." },
  d6_stunde:     { de: "die Stunde",  gender:"die", en: "hour",  pos: "noun", exampleDe: "Eine {{Stunde}} hat sechzig Minuten.", exampleEn: "An hour has sixty minutes." },
  d6_morgens:    { de: "morgens", en: "in the morning(s)", pos: "adv", exampleDe: "{{Morgens}} stehe ich auf.", exampleEn: "In the morning(s) I get up." },
  d6_mittags:    { de: "mittags", en: "at noon",     pos: "adv", exampleDe: "{{Mittags}} esse ich.", exampleEn: "At noon I eat." },
  d6_abends:     { de: "abends",  en: "in the evening(s)", pos: "adv", exampleDe: "{{Abends}} bin ich müde.", exampleEn: "In the evening(s) I am tired." },
  d6_fruehstueck:{ de: "das Frühstück", gender:"das", en: "breakfast", pos: "noun", exampleDe: "{{Frühstück}} ist wichtig.", exampleEn: "Breakfast is important." },
  d6_arbeit:     { de: "die Arbeit", gender:"die", en: "work", pos: "noun", exampleDe: "Die {{Arbeit}} fängt um neun Uhr an.", exampleEn: "Work starts at nine o'clock." },
  d6_aufstehen:  { de: "aufstehen", en: "to get up", pos: "verb", exampleDe: "Ich {{stehe}} um sieben Uhr auf.", exampleEn: "I get up at seven o'clock." },
  d6_fruehstuecken:{ de: "frühstücken", en: "to have breakfast", pos: "verb", exampleDe: "Wir {{frühstücken}} um acht Uhr.", exampleEn: "We have breakfast at eight o'clock." },
  d6_anfangen:   { de: "anfangen", en: "to start / begin", pos: "verb", exampleDe: "Der Film {{fängt}} um acht Uhr an.", exampleEn: "The movie starts at eight o'clock." },
  d6_minute:     { de: "die Minute", gender:"die", en: "minute", pos: "noun", exampleDe: "Ich habe {{eine Minute}}.", exampleEn: "I have a minute." },
  d6_nachts:     { de: "nachts",  en: "at night",    pos: "adv", exampleDe: "{{Nachts}} schlafe ich.", exampleEn: "At night I sleep." },
  d6_spaet:      { de: "spät",    en: "late",        pos: "adj", exampleDe: "Es ist schon {{spät}}.", exampleEn: "It's already late." },
  d6_frueh:      { de: "früh",    en: "early",       pos: "adj", exampleDe: "Ich stehe {{früh}} auf.", exampleEn: "I get up early." },
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
    params: { verbIds: ["sein"], opts: { count: 10 } },
  },
  "sein-satzbau": {
    title: "Sätze mit sein bilden",
    category: "Satzbau", day: 1,
    explanation: "Practice using \"sein\" in a full sentence, not just its isolated form: Subjekt + sein + Adjektiv/Ort.",
    examples: ["Ich bin müde.", "Du bist hier.", "Wir sind zu Hause."],
    exerciseType: "satzbau",
    params: { recipesFn: buildSeinSatzbauRecipes },
  },
  "haben": {
    title: "haben (to have) — Präsens",
    category: "Verben", day: 2,
    explanation: "\"haben\" is also irregular. Watch out with \"du\" and \"er/sie/es\": the -b- drops (du hast, er hat).",
    examples: ["Ich habe Zeit.", "Du hast ein Buch.", "Wir haben Geld."],
    exerciseType: "conjugation",
    params: { verbIds: ["haben"], opts: { count: 10 } },
  },
  "haben-satzbau": {
    title: "Sätze mit haben bilden",
    category: "Satzbau", day: 2,
    explanation: "Practice using \"haben\" in a full sentence: Subjekt + haben + Objekt.",
    examples: ["Ich habe Zeit.", "Du hast ein Buch.", "Er hat Geld."],
    exerciseType: "satzbau",
    params: { recipesFn: buildHabenSatzbauRecipes },
  },
  "verben-praesens": {
    title: "Regelmäßige & unregelmäßige Verben im Präsens",
    category: "Verben", day: 3,
    explanation: "Most verbs are regular: stem + e/st/t/en/t/en (ich lerne, du lernst...). Some change their vowel for \"du\" and \"er/sie/es\": e→i (sprechen→du sprichst), e→ie (sehen→du siehst), a→ä (schlafen→du schläfst).",
    examples: ["Ich lerne Deutsch.", "Du sprichst gut Deutsch.", "Er liest ein Buch.", "Sie schläft viel."],
    exerciseType: "conjugation",
    params: { verbIds: ["lernen","wohnen","spielen","machen","sprechen","essen","lesen","sehen","schlafen","helfen","kaufen","arbeiten","gehen","fragen"], opts: { count: 26 } },
  },
  "verben-praesens-satzbau": {
    title: "Sätze mit Präsensverben bilden",
    category: "Satzbau", day: 3,
    explanation: "Same rule as always: Subjekt + Verb(Position 2) + Rest. Now with a wider range of verbs.",
    examples: ["Ich lerne Deutsch.", "Er liest ein Buch.", "Du arbeitest hier."],
    exerciseType: "satzbau",
    params: { recipesFn: buildVerbenPraesensSatzbauRecipes },
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

// Every combo here is hand-checked to avoid needing Akkusativ endings
// (no der-noun direct objects) — that rule isn't taught until day 5, so
// these statements stick to predicate adjectives/adverbs, die/das objects
// with ein/eine (identical in nominative and accusative, so nothing wrong
// gets modeled), or plain intransitive use.
function buildSeinSatzbauRecipes(){
  const subjects = [
    { de:"ich", en:"I", person:"ich" }, { de:"du", en:"you", person:"du" },
    { de:"er", en:"he", person:"er" }, { de:"das", en:"that", person:"er" },
    { de:"wir", en:"we", person:"wir" }, { de:"ihr", en:"you (pl.)", person:"ihr" },
  ];
  const predicates = [
    { de:"müde", en:"tired" }, { de:"gut", en:"good" }, { de:"schlecht", en:"bad" },
    { de:"hier", en:"here" }, { de:"zu Hause", en:"at home" },
  ];
  const out = [];
  subjects.forEach(s => {
    sample(predicates, 2).forEach(p => {
      out.push(SB.buildStatement({ subjectDe:s.de, subjectEn:s.en, person:s.person, verbId:"sein", rest:[p] }));
    });
  });
  return out;
}
function buildHabenSatzbauRecipes(){
  const subjects = [
    { de:"ich", en:"I", person:"ich" }, { de:"du", en:"you", person:"du" },
    { de:"er", en:"he", person:"er" }, { de:"wir", en:"we", person:"wir" },
    { de:"ihr", en:"you (pl.)", person:"ihr" }, { de:"sie", en:"they", person:"sie_pl" },
  ];
  const objects = [
    { de:"Zeit", en:"time" }, { de:"Geld", en:"money" }, { de:"eine Frage", en:"a question" },
    { de:"ein Buch", en:"a book" }, { de:"eine Tasche", en:"a bag" }, { de:"ein Handy", en:"a cell phone" },
  ];
  const out = [];
  subjects.forEach(s => {
    sample(objects, 2).forEach(o => {
      out.push(SB.buildStatement({ subjectDe:s.de, subjectEn:s.en, person:s.person, verbId:"haben", rest:[o] }));
    });
  });
  return out;
}
function buildVerbenPraesensSatzbauRecipes(){
  const items = [
    { verbId:"lernen", subjectDe:"ich", subjectEn:"I", person:"ich", rest:[{de:"Deutsch",en:"German"}] },
    { verbId:"wohnen", subjectDe:"du", subjectEn:"you", person:"du", rest:[{de:"hier",en:"here"}], enOverride:"You live here." },
    { verbId:"spielen", subjectDe:"wir", subjectEn:"we", person:"wir", rest:[] },
    { verbId:"machen", subjectDe:"ihr", subjectEn:"you (pl.)", person:"ihr", rest:[{de:"das",en:"that"}], enOverride:"You (pl.) do that." },
    { verbId:"sprechen", subjectDe:"sie", subjectEn:"they", person:"sie_pl", rest:[{de:"Deutsch",en:"German"}] },
    { verbId:"essen", subjectDe:"du", subjectEn:"you", person:"du", rest:[] },
    { verbId:"lesen", subjectDe:"er", subjectEn:"he", person:"er", rest:[{de:"ein Buch",en:"a book"}] },
    { verbId:"sehen", subjectDe:"wir", subjectEn:"we", person:"wir", rest:[{de:"das",en:"that"}] },
    { verbId:"schlafen", subjectDe:"ihr", subjectEn:"you (pl.)", person:"ihr", rest:[] },
    { verbId:"helfen", subjectDe:"sie", subjectEn:"she", person:"er", rest:[] },
    { verbId:"kaufen", subjectDe:"ich", subjectEn:"I", person:"ich", rest:[{de:"ein Handy",en:"a cell phone"}] },
    { verbId:"arbeiten", subjectDe:"du", subjectEn:"you", person:"du", rest:[{de:"hier",en:"here"}] },
    { verbId:"gehen", subjectDe:"er", subjectEn:"he", person:"er", rest:[{de:"nach Hause",en:"home"}], enOverride:"He goes home." },
    { verbId:"fragen", subjectDe:"wir", subjectEn:"we", person:"wir", rest:[] },
  ];
  return items.map(it => SB.buildStatement(it));
}

function buildWFragenRecipes(){
  const items = [
    { frageDe:"Wie", frageEn:"what", subjectDe:"du", subjectEn:"you", person:"du", verbId:"heissen", enOverride:"What is your name?" },
    { frageDe:"Wo", frageEn:"where", subjectDe:"du", subjectEn:"you", person:"du", verbId:"wohnen", enOverride:"Where do you live?" },
    { frageDe:"Woher", frageEn:"where from", subjectDe:"du", subjectEn:"you", person:"du", verbId:"kommen", enOverride:"Where are you from?" },
    { frageDe:"Was", frageEn:"what", subjectDe:"du", subjectEn:"you", person:"du", verbId:"machen", enOverride:"What do you do?" },
    { frageDe:"Wie alt", frageEn:"how old", subjectDe:"du", subjectEn:"you", person:"du", verbId:"sein", enOverride:"How old are you?" },
    { frageDe:"Wo", frageEn:"where", subjectDe:"Anna", subjectEn:"Anna", person:"er", verbId:"wohnen", enOverride:"Where does Anna live?" },
    { frageDe:"Woher", frageEn:"where from", subjectDe:"er", subjectEn:"he", person:"er", verbId:"kommen", enOverride:"Where does he come from?" },
    { frageDe:"Wie", frageEn:"what", subjectDe:"sie", subjectEn:"she", person:"er", verbId:"heissen", enOverride:"What is her name?" },
    { frageDe:"Wie alt", frageEn:"how old", subjectDe:"er", subjectEn:"he", person:"er", verbId:"sein", enOverride:"How old is he?" },
    { frageDe:"Was", frageEn:"what", subjectDe:"sie", subjectEn:"she", person:"er", verbId:"machen", enOverride:"What does she do?" },
    { frageDe:"Wo", frageEn:"where", subjectDe:"ihr", subjectEn:"you (pl.)", person:"ihr", verbId:"wohnen", enOverride:"Where do you (pl.) live?" },
    { frageDe:"Woher", frageEn:"where from", subjectDe:"ihr", subjectEn:"you (pl.)", person:"ihr", verbId:"kommen", enOverride:"Where are you (pl.) from?" },
    { frageDe:"Wo", frageEn:"where", subjectDe:"sie", subjectEn:"they", person:"sie_pl", verbId:"wohnen", enOverride:"Where do they live?" },
    { frageDe:"Woher", frageEn:"where from", subjectDe:"sie", subjectEn:"they", person:"sie_pl", verbId:"kommen", enOverride:"Where are they from?" },
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
  // two passes over the country list (with a fresh random subject each time)
  // for more repetitions without hand-typing more sentences.
  for(let pass=0; pass<2; pass++){
    countries.forEach(c => {
      const s = subjects[Math.floor(Math.random()*subjects.length)];
      const verbForm = SB.conjugate("kommen", s.person);
      out.push({
        prepId: "aus",
        sentence: `${s.de} ${verbForm} ___ ${c.de}.`,
        en: `${s.en} come${s.person==="er"?"s":""} from ${c.en}.`,
      });
    });
  }
  return out;
}
function buildUhrzeitRecipes(){
  const times = [
    { de: "sieben Uhr", en: "seven o'clock" }, { de: "acht Uhr", en: "eight o'clock" },
    { de: "neun Uhr", en: "nine o'clock" }, { de: "zehn Uhr", en: "ten o'clock" },
    { de: "elf Uhr", en: "eleven o'clock" }, { de: "zwölf Uhr", en: "twelve o'clock" },
  ];
  const verbLabel = { aufstehen: "get up", fruehstuecken: "have breakfast", anfangen: "start", aufhoeren: "finish" };
  const verbs = ["aufstehen","fruehstuecken","anfangen","aufhoeren"];
  const out = [];
  verbs.forEach(verbId => {
    for(let rep=0; rep<2; rep++){
    const t = times[Math.floor(Math.random()*times.length)];
    out.push(SB.buildStatement({
      subjectDe: "ich", subjectEn: "I", person: "ich", verbId,
      rest: [{ de: `um ${t.de}`, en: `at ${t.en}` }],
      enOverride: `I ${verbLabel[verbId]} at ${t.en}.`,
    }));
    out.push(SB.buildStatement({
      subjectDe: "ich", subjectEn: "I", person: "ich", verbId,
      rest: [],
      fronted: { de: `Um ${t.de}`, en: `At ${t.en}` },
      enOverride: `At ${t.en} I ${verbLabel[verbId]}.`,
    }));
    }
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
    newSkillIds: ["sein", "sein-satzbau"],
    newVocabIds: Object.keys(VOCAB).filter(k=>k.startsWith("d1_")),
  },
  {
    id: 2, week: 1, isTest: false,
    title: "haben & erste Nomen",
    theme: "The verb 'haben' (to have) and your first gendered nouns.",
    newSkillIds: ["haben", "haben-satzbau"],
    newVocabIds: Object.keys(VOCAB).filter(k=>k.startsWith("d2_")),
  },
  {
    id: 3, week: 1, isTest: false,
    title: "Verben im Präsens",
    theme: "Regular and irregular present-tense conjugation.",
    newSkillIds: ["verben-praesens", "verben-praesens-satzbau"],
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
    testSkillIds: ["sein","sein-satzbau","haben","haben-satzbau","verben-praesens","verben-praesens-satzbau","w-fragen","prep-aus","akkusativ","uhrzeit-satzbau"],
    testVocabPrefixes: ["d1_","d2_","d3_","d4_","d5_","d6_"],
  },
];

export const MODULE_META = {
  id: "a1", title: "A1 — Grundstufe 1", totalDays: 30,
  weeks: 4,
};
