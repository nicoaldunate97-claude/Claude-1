// ============================================================
// STATE.JS — SRS state, streak, per-topic stats, "Mis palabras",
// and schema versioning so future app updates never destroy
// progress. IDs (vocab/skill) are the only key that matters —
// see modules/a1/curriculum.js header comment.
// ============================================================
export const SCHEMA_VERSION = 1;
export const BOX_INTERVALS = [1, 2, 4, 7, 14, 30]; // days until next review, by box (0-5)

export function todayStr(){
  const d = new Date();
  return d.getFullYear() + "-" + String(d.getMonth()+1).padStart(2,"0") + "-" + String(d.getDate()).padStart(2,"0");
}
export function addDays(dateStr, n){
  const [y,m,d] = dateStr.split("-").map(Number);
  const dt = new Date(y, m-1, d);
  dt.setDate(dt.getDate() + n);
  return dt.getFullYear() + "-" + String(dt.getMonth()+1).padStart(2,"0") + "-" + String(dt.getDate()).padStart(2,"0");
}

export function defaultState(){
  return {
    version: SCHEMA_VERSION,
    xp: 0,
    streak: { count: 0, longest: 0, lastActiveDate: null },
    currentDay: 1,
    completedDays: {},        // { [dayId]: { completedAt, score, total } }
    srs: {},                  // { [itemId]: { box, due, seen, correct } }  itemId = "vocab:x" or a skillId
    skillStats: {},           // { [skillId]: { correct, total } }  — cumulative, for the topic-accuracy dashboard
    savedWords: {},           // { [vocabId]: { addedAt, fromDay } }  — "Mis palabras"
    inProgressSession: null,  // { dayId, exercises, pos, score } — lets leaving mid-day resume at the same question
  };
}

// Migrate an older/foreign state object forward. Each future schema bump
// adds one `if(s.version < N)` block here — never a silent reset.
export function migrateState(raw){
  if(!raw || typeof raw !== "object") return defaultState();
  let s = { ...defaultState(), ...raw };
  if(!s.version || s.version < 1){
    s.version = 1;
  }
  // future: if(s.version < 2){ ...upgrade...; s.version = 2; }
  return s;
}

// ---- SRS ----------------------------------------------------------
export function ensureSrsItem(state, itemId){
  if(!state.srs[itemId]){
    state.srs[itemId] = { box: 0, due: todayStr(), seen: 0, correct: 0 };
  }
  return state.srs[itemId];
}
export function gradeSrsItem(state, itemId, isCorrect){
  const item = ensureSrsItem(state, itemId);
  item.seen++;
  if(isCorrect){
    item.correct++;
    item.box = Math.min(5, item.box + 1);
  } else {
    item.box = 0;
  }
  item.due = addDays(todayStr(), BOX_INTERVALS[item.box]);
  return item;
}
export function dueItemIds(state, prefix){
  const today = todayStr();
  return Object.keys(state.srs).filter(id =>
    state.srs[id].due <= today && (!prefix || id.startsWith(prefix))
  );
}

// ---- Skill accuracy stats (per-topic dashboard) --------------------
export function recordSkillAttempt(state, skillId, isCorrect){
  if(!skillId) return;
  if(!state.skillStats[skillId]) state.skillStats[skillId] = { correct: 0, total: 0 };
  state.skillStats[skillId].total++;
  if(isCorrect) state.skillStats[skillId].correct++;
}
export function accuracyByCategory(state, SKILLS){
  const byCat = {};
  Object.keys(state.skillStats).forEach(skillId => {
    const skill = SKILLS[skillId];
    const cat = skill ? skill.category : "Vokabular";
    if(!byCat[cat]) byCat[cat] = { correct: 0, total: 0 };
    byCat[cat].correct += state.skillStats[skillId].correct;
    byCat[cat].total += state.skillStats[skillId].total;
  });
  return byCat;
}

// ---- Streak ---------------------------------------------------------
export function touchStreak(state){
  const today = todayStr();
  if(state.streak.lastActiveDate === today) return;
  const yesterday = addDays(today, -1);
  if(state.streak.lastActiveDate === yesterday){ state.streak.count++; }
  else { state.streak.count = 1; }
  state.streak.lastActiveDate = today;
  state.streak.longest = Math.max(state.streak.longest || 0, state.streak.count);
}

// ---- Mis palabras -----------------------------------------------------
export function saveWord(state, vocabId, dayId){
  if(!state.savedWords[vocabId]){
    state.savedWords[vocabId] = { addedAt: todayStr(), fromDay: dayId };
  }
}
export function unsaveWord(state, vocabId){
  delete state.savedWords[vocabId];
}
export function isWordSaved(state, vocabId){
  return !!state.savedWords[vocabId];
}
