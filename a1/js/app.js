// ============================================================
// APP.JS — UI shell: routing, rendering, exercise session flow,
// Gramática reference, Mis palabras, stats, settings, sync setup.
// ============================================================
import { SKILLS, VOCAB, DAYS, MODULE_META, vocabByIds, vocabByDayPrefix } from "../modules/a1/curriculum.js";
import * as EE from "./exercise-engine.js";
import * as ST from "./state.js";
import * as DC from "./day-composer.js";
import * as SYNC from "./sync.js";

// ---- persistence: local cache + remote sync -------------------------
const LOCAL_CACHE_KEY = "deutschA1.state";
let STATE = loadLocalState();
let SYNC_CODE = SYNC.getLocalSyncCode();
let syncStatus = "idle"; // idle | syncing | ok | error | offline

function loadLocalState(){
  try {
    const raw = localStorage.getItem(LOCAL_CACHE_KEY);
    if(raw) return ST.migrateState(JSON.parse(raw));
  } catch(e){}
  return ST.defaultState();
}
function saveLocalState(){
  try { localStorage.setItem(LOCAL_CACHE_KEY, JSON.stringify(STATE)); } catch(e){}
}
function persist(){
  // Snapshot the live exercise queue/position into STATE whenever we're
  // mid-session, so leaving (back arrow, force-quit, phone call...) and
  // coming back resumes at the same question instead of a fresh queue.
  if(SESSION && SESSION.view === "session" && SESSION.exercises && SESSION.pos < SESSION.exercises.length){
    STATE.inProgressSession = { dayId: SESSION.dayId, exercises: SESSION.exercises, pos: SESSION.pos, score: SESSION.score };
  }
  saveLocalState();
  if(SYNC_CODE){
    syncStatus = "syncing"; renderSyncBadge();
    SYNC.schedulePush(SYNC_CODE, () => STATE, (result) => {
      syncStatus = result.ok ? "ok" : "error";
      renderSyncBadge();
    });
  }
}
function renderSyncBadge(){
  const el = document.getElementById("syncBadge");
  if(!el) return;
  const map = { idle:"", syncing:"⏳", ok:"☁️", error:"⚠️", offline:"📴" };
  el.textContent = SYNC_CODE ? map[syncStatus] : "";
  el.title = SYNC_CODE ? ("Sync: " + syncStatus) : "";
}

// ============================================================
// APP ROOT / ROUTER
// ============================================================
const app = document.getElementById("app");
let SESSION = null; // transient UI state for the current view

function render(){
  if(!SYNC_CODE) return renderSyncSetup();
  const view = SESSION ? SESSION.view : "home";
  const views = {
    home: renderHome, day_grammar: renderDayGrammar,
    session: renderSession, summary: renderSummary, grammar_ref: renderGrammarRef,
    my_words: renderMyWords, stats: renderStats, settings: renderSettings,
  };
  (views[view] || renderHome)();
  renderSyncBadge();
}
function goHome(){ SESSION = null; render(); }
function nav(view, extra){ SESSION = { view, ...extra }; render(); }

// ============================================================
// SYNC SETUP (first load on a device)
// ============================================================
function renderSyncSetup(){
  app.innerHTML = `
    ${header(false)}
    <main>
      <div class="card center">
        <div class="big-emoji">🔗</div>
        <h2>Fortschritt verbinden</h2>
        <p>Damit dein Fortschritt zwischen Geräten synchronisiert wird, brauchst du einen Sync-Code.</p>
      </div>
      <div class="card">
        <h2>Neues Gerät, neuer Start</h2>
        <p>Erstelle einen neuen Code und gib ihn später auf deinem anderen Gerät ein.</p>
        <button class="btn" onclick="App.createNewCode()">Neuen Code erstellen</button>
      </div>
      <div class="card">
        <h2>Ich habe schon einen Code</h2>
        <input type="text" id="codeInput" placeholder="xxxx-xxxx" autocomplete="off" autocapitalize="none" style="text-transform:lowercase;">
        <button class="btn secondary" onclick="App.useExistingCode()">Verbinden</button>
      </div>
    </main>`;
}
async function createNewCode(){
  const code = SYNC.generateSyncCode();
  SYNC.setLocalSyncCode(code);
  SYNC_CODE = code;
  try { await SYNC.pushState(code, STATE); } catch(e){}
  alert("Dein Sync-Code lautet: " + code + "\n\nSchreib ihn dir auf — du brauchst ihn, um dein anderes Gerät zu verbinden. (Findest du auch jederzeit in den Einstellungen.)");
  render();
}
async function useExistingCode(){
  const input = document.getElementById("codeInput");
  const code = input.value.trim().toLowerCase();
  if(!code){ alert("Bitte gib einen Code ein."); return; }
  try {
    const remote = await SYNC.pullState(code);
    if(remote){
      STATE = ST.migrateState(remote);
      saveLocalState();
    }
    SYNC.setLocalSyncCode(code);
    SYNC_CODE = code;
    render();
  } catch(e){
    alert("Verbindung fehlgeschlagen. Prüfe deine Internetverbindung und den Code.");
  }
}

// ============================================================
// HEADER
// ============================================================
function header(showBack){
  const streak = STATE.streak.count || 0;
  return `
  <header class="top">
    ${showBack
      ? `<button class="icon" onclick="App.goHome()" aria-label="Zurück">←</button>`
      : `<div class="brand">🇩🇪 A1 <span id="syncBadge" class="syncbadge"></span></div>`}
    <div class="stats">
      <span class="flame">🔥</span><b>${streak}</b>
      <span>·</span><span>✨ <b>${STATE.xp||0}</b></span>
      <button class="icon" onclick="App.nav('settings')">⚙️</button>
    </div>
  </header>`;
}

// ============================================================
// HOME
// ============================================================
function renderHome(){
  const dayId = STATE.currentDay;
  const day = DAYS.find(d => d.id === dayId);
  const totalDays = DAYS.length;
  const doneCount = Object.keys(STATE.completedDays).length;
  const pct = Math.round((doneCount / totalDays) * 100);
  const dueVocab = ST.dueItemIds(STATE, "vocab:").length;

  let dayCard;
  if(day){
    const isTest = day.isTest;
    const resuming = STATE.inProgressSession && STATE.inProgressSession.dayId === day.id
      && STATE.inProgressSession.pos < STATE.inProgressSession.exercises.length;
    const label = resuming
      ? `Weiter (Frage ${STATE.inProgressSession.pos+1} / ${STATE.inProgressSession.exercises.length})`
      : (isTest ? "Test starten" : "Tag starten");
    dayCard = `
      <div class="card">
        <span class="badge">${isTest ? "WOCHENTEST" : "TAG " + day.id + " / " + totalDays}</span>
        <h2>${esc(day.title)}</h2>
        <p>${esc(day.theme)}</p>
        <button class="btn" onclick="App.startDay(${day.id})">${label}</button>
      </div>`;
  } else {
    dayCard = `
      <div class="card center">
        <div class="big-emoji">🏆</div>
        <h2>A1 abgeschlossen!</h2>
        <p>Du hast alle ${totalDays} Tage geschafft. A2 kommt als nächstes Modul.</p>
      </div>`;
  }

  app.innerHTML = `
    ${header(false)}
    <main>
      ${dayCard}
      ${dueVocab > 0 ? `<div class="card"><span class="badge">WIEDERHOLUNG</span><p>${dueVocab} Vokabeln sind heute fällig — sie werden automatisch in deine heutige Sitzung eingebaut.</p></div>` : ""}
      <div class="card">
        <span class="badge">FORTSCHRITT</span>
        <div class="progress"><div style="width:${pct}%"></div></div>
        <p>${doneCount} von ${totalDays} Tagen abgeschlossen</p>
      </div>
      <div class="grid2">
        <button class="btn secondary" onclick="App.nav('grammar_ref')">📖 Grammatik</button>
        <button class="btn secondary" onclick="App.nav('my_words')">💾 Meine Wörter</button>
        <button class="btn secondary" onclick="App.nav('stats')">📊 Statistik</button>
        <button class="btn secondary" onclick="App.nav('settings')">⚙️ Einstellungen</button>
      </div>
    </main>`;
}

// ============================================================
// DAY INTRO → GRAMMAR (if new skills) → SESSION
// ============================================================
function startDay(dayId){
  const saved = STATE.inProgressSession;
  if(saved && saved.dayId === dayId && saved.pos < saved.exercises.length){
    nav("session", {
      dayId, exercises: saved.exercises, pos: saved.pos, score: saved.score, total: saved.exercises.length,
      answered: false, current: null,
    });
    return;
  }
  const day = DAYS.find(d => d.id === dayId);
  const newSkills = (day.newSkillIds || []).filter(id => SKILLS[id]);
  if(newSkills.length){
    nav("day_grammar", { dayId, grammarIdx: 0, skillIds: newSkills });
  } else {
    beginSession(dayId);
  }
}
function renderDayGrammar(){
  const { dayId, grammarIdx, skillIds } = SESSION;
  const day = DAYS.find(d => d.id === dayId);
  const skillId = skillIds[grammarIdx];
  const skill = SKILLS[skillId];
  const isLast = grammarIdx >= skillIds.length - 1;
  app.innerHTML = `
    ${header(true)}
    <main>
      <div class="steps-progress">Neue Grammatik ${grammarIdx+1} / ${skillIds.length} — Tag ${day.id}</div>
      <div class="card">
        <span class="badge">${esc(skill.category)}</span>
        <h2>${esc(skill.title)}</h2>
        <p>${esc(skill.explanation)}</p>
        <ul class="examples-list">${skill.examples.map(e=>`<li>${esc(e)}</li>`).join("")}</ul>
      </div>
      <button class="btn" onclick="App.${isLast ? "finishDayGrammar" : "nextDayGrammar"}()">
        ${isLast ? "Weiter zu den Übungen →" : "Weiter →"}
      </button>
    </main>`;
}
function nextDayGrammar(){ SESSION.grammarIdx++; render(); }
function finishDayGrammar(){ beginSession(SESSION.dayId); }

function beginSession(dayId){
  const day = DAYS.find(d => d.id === dayId);
  const exercises = DC.composeDaySession({ day, state: STATE, SKILLS, VOCAB, vocabByIds, vocabByDayPrefix });
  nav("session", {
    dayId, exercises, pos: 0, score: 0, total: exercises.length,
    answered: false, current: null,
  });
  persist(); // snapshot this freshly generated queue immediately, so leaving right away still resumes it (not a new one)
}

// ============================================================
// EXERCISE SESSION — renders one of: mc, mc-order, fill, reorder, match
// ============================================================
function currentExercise(){
  if(SESSION.pos >= SESSION.exercises.length) return null;
  return SESSION.exercises[SESSION.pos];
}
// One extra pass at the end of the session covering everything missed,
// instead of only resurfacing wrong answers days later via spaced review.
// Only ever fires once per session (retryDone), so a wrong answer on the
// retry itself doesn't loop forever — it just stays queued for the normal
// spaced review like any other miss.
function maybeAppendRetryRound(){
  if(SESSION.retryDone) return false;
  SESSION.retryDone = true;
  const missed = SESSION.missedItemIds ? [...SESSION.missedItemIds] : [];
  if(!missed.length) return false;
  const retryExercises = missed
    .map(itemId => DC.regenerateForItem({ itemId, SKILLS, VOCAB, vocabByIds }))
    .filter(Boolean);
  if(!retryExercises.length) return false;
  SESSION.exercises = SESSION.exercises.concat(retryExercises);
  SESSION.total = SESSION.exercises.length;
  persist();
  return true;
}
function renderSession(){
  const ex = currentExercise();
  if(!ex){
    if(maybeAppendRetryRound()) return renderSession();
    return finishSession();
  }
  SESSION.answered = false;
  const day = DAYS.find(d => d.id === SESSION.dayId);
  const progress = `${SESSION.pos+1} / ${SESSION.total}`;

  let body;
  if(ex.type === "mc") body = renderMC(ex);
  else if(ex.type === "mc-order") body = renderMCOrder(ex);
  else if(ex.type === "fill") body = renderFill(ex);
  else if(ex.type === "reorder") body = renderReorder(ex);
  else if(ex.type === "match") body = renderMatch(ex);

  app.innerHTML = `
    ${header(true)}
    <main>
      <div class="steps-progress">${esc(day.title)} · ${progress}</div>
      <div class="card">${body}</div>
    </main>`;
}

function saveWordButton(vocabId){
  if(!vocabId || !VOCAB[vocabId]) return "";
  const saved = ST.isWordSaved(STATE, vocabId);
  return `<button class="btn ghost small" onclick="App.toggleSaveWord('${vocabId}')">${saved ? "💾 Gespeichert ✓" : "💾 Wort speichern"}</button>`;
}
function vocabIdFromItemId(itemId){
  return itemId && itemId.startsWith("vocab:") ? itemId.slice(6) : null;
}

function renderMC(ex){
  const vocabId = vocabIdFromItemId(ex.itemId);
  return `
    <div class="qtext">${esc(ex.prompt)}</div>
    <div class="options" id="opts">
      ${ex.options.map((o,i)=>`<div class="opt" id="opt${i}" onclick="App.answerMC(${i})">${esc(o)}</div>`).join("")}
    </div>
    <div id="fb"></div>
    ${saveWordButton(vocabId)}
    <button class="btn" id="nextBtn" style="display:none" onclick="App.nextExercise()">Weiter →</button>`;
}
function renderMCOrder(ex){
  return `
    <div class="qtext">${esc(ex.prompt)}</div>
    <div class="options" id="opts">
      ${ex.options.map((o,i)=>`<div class="opt" id="opt${i}" onclick="App.answerMCOrder(${i})">${esc(o)}</div>`).join("")}
    </div>
    ${ex.translation ? `<p class="translation">🇬🇧 ${esc(ex.translation)}</p>` : ""}
    <div id="fb"></div>
    <button class="btn" id="nextBtn" style="display:none" onclick="App.nextExercise()">Weiter →</button>`;
}
function renderFill(ex){
  const vocabId = vocabIdFromItemId(ex.itemId);
  return `
    <div class="qtext">${esc(ex.prompt)}</div>
    <p class="sentence">${esc(ex.sentence)}</p>
    ${ex.hint ? `<p class="hint">💡 ${esc(ex.hint)}</p>` : ""}
    ${ex.translation ? `<p class="translation">🇬🇧 ${esc(ex.translation)}</p>` : ""}
    <input type="text" id="fillInput" autocomplete="off" autocapitalize="none" autocorrect="off" placeholder="Antwort eingeben..." onkeydown="if(event.key==='Enter')App.checkFill()">
    <div id="fb"></div>
    ${saveWordButton(vocabId)}
    <button class="btn" id="checkBtn" onclick="App.checkFill()">Prüfen</button>
    <button class="btn" id="nextBtn" style="display:none" onclick="App.nextExercise()">Weiter →</button>`;
}
function renderReorder(ex){
  if(!SESSION.buildState || SESSION.buildStateFor !== SESSION.pos){
    SESSION.buildState = { bank: EE.shuffle(ex.tokens.map((t,i)=>({t,i}))), answer: [] };
    SESSION.buildStateFor = SESSION.pos;
  }
  const b = SESSION.buildState;
  return `
    <div class="qtext">${esc(ex.prompt)}</div>
    ${ex.translation ? `<p class="translation">🇬🇧 ${esc(ex.translation)}</p>` : ""}
    <div class="answer" id="answerZone">
      ${b.answer.map((tok,ai)=>`<span class="chip" onclick="App.buildRemove(${ai})">${esc(tok.t)}</span>`).join("")}
    </div>
    <div class="bank" id="bankZone">
      ${b.bank.map((tok,bi)=>`<span class="chip ${tok.used?'used':''}" onclick="App.buildAdd(${bi})">${esc(tok.t)}</span>`).join("")}
    </div>
    <div id="fb"></div>
    <div class="row">
      <button class="btn secondary" onclick="App.buildClear()">Leeren</button>
      <button class="btn" id="checkBtn" onclick="App.checkReorder()">Prüfen</button>
    </div>
    <button class="btn" id="nextBtn" style="display:none" onclick="App.nextExercise()">Weiter →</button>`;
}
function renderMatch(ex){
  if(!SESSION.matchState || SESSION.matchStateFor !== SESSION.pos){
    SESSION.matchState = {
      rightOrder: EE.shuffle(ex.pairs.map((p,i)=>i)),
      selectedLeft: null, matched: {}, wrong: null,
    };
    SESSION.matchStateFor = SESSION.pos;
  }
  const m = SESSION.matchState;
  const leftItems = ex.pairs.map((p,i)=>({...p, i}));
  return `
    <div class="qtext">${esc(ex.prompt)}</div>
    <div class="match-grid">
      <div class="match-col">
        ${leftItems.map(p => `<div class="match-item ${m.matched[p.i]?'matched':''} ${m.selectedLeft===p.i?'selected':''}" onclick="App.matchSelectLeft(${p.i})">${esc(p.left)}</div>`).join("")}
      </div>
      <div class="match-col">
        ${m.rightOrder.map(i => `<div class="match-item ${m.matched[i]?'matched':''} ${m.wrong===i?'wrong':''}" onclick="App.matchSelectRight(${i})">${esc(ex.pairs[i].right)}</div>`).join("")}
      </div>
    </div>
    <div id="fb"></div>
    <button class="btn" id="nextBtn" style="display:none" onclick="App.nextExercise()">Weiter →</button>`;
}

// ---- grading -----------------------------------------------------
function gradeAndMaybeStats(ex, isCorrect){
  ST.gradeSrsItem(STATE, ex.itemId, isCorrect);
  ST.recordSkillAttempt(STATE, ex.skillId, isCorrect);
  if(isCorrect){ SESSION.score++; STATE.xp = (STATE.xp||0) + 5; }
  else trackMissed(ex.itemId);
  persist();
}
// Missed items get one more shot at the end of the session (a fresh
// exercise on the same word/skill, not the literal same question) instead
// of only resurfacing days later via spaced review.
function trackMissed(itemId){
  if(!SESSION.missedItemIds) SESSION.missedItemIds = new Set();
  SESSION.missedItemIds.add(itemId);
}
function showFeedback(correct, correctText){
  document.getElementById("fb").innerHTML =
    `<div class="feedback ${correct?'good':'bad'}">${correct?'✓ Richtig!':'✗ Richtig wäre: '+esc(correctText)}</div>`;
  const nb = document.getElementById("nextBtn"); if(nb) nb.style.display = "block";
  const cb = document.getElementById("checkBtn"); if(cb) cb.style.display = "none";
}

function answerMC(i){
  if(SESSION.answered) return; SESSION.answered = true;
  const ex = currentExercise();
  const correct = ex.options[i] === ex.correct;
  ex.options.forEach((o,idx) => {
    const el = document.getElementById("opt"+idx);
    if(o === ex.correct) el.classList.add("correct");
    else if(idx===i) el.classList.add("wrong");
  });
  showFeedback(correct, ex.correct);
  gradeAndMaybeStats(ex, correct);
}
function answerMCOrder(i){
  if(SESSION.answered) return; SESSION.answered = true;
  const ex = currentExercise();
  const correct = ex.options[i] === ex.correct;
  ex.options.forEach((o,idx) => {
    const el = document.getElementById("opt"+idx);
    if(o === ex.correct) el.classList.add("correct");
    else if(idx===i) el.classList.add("wrong");
  });
  showFeedback(correct, ex.correct);
  gradeAndMaybeStats(ex, correct);
}
function checkFill(){
  if(SESSION.answered) return; SESSION.answered = true;
  const ex = currentExercise();
  const input = document.getElementById("fillInput");
  const correct = EE.normalize(input.value) === EE.normalize(ex.correct) && input.value.trim().length>0;
  input.classList.add(correct?"correct":"wrong");
  input.disabled = true;
  showFeedback(correct, ex.correct);
  gradeAndMaybeStats(ex, correct);
}
function buildAdd(bi){
  if(SESSION.answered) return;
  const b = SESSION.buildState;
  if(b.bank[bi].used) return;
  b.bank[bi].used = true; b.answer.push(b.bank[bi]);
  render();
}
function buildRemove(ai){
  if(SESSION.answered) return;
  const b = SESSION.buildState;
  // b.answer[ai] IS the same object reference as its entry in b.bank (buildAdd
  // pushes the object itself), so flip its flag directly — indexing back into
  // b.bank by `.i` (the ORIGINAL pre-shuffle token position) was the bug: since
  // b.bank is shuffled, that position holds an unrelated tile, so the tile you
  // actually removed stayed marked "used" forever and could never be re-picked.
  b.answer[ai].used = false;
  b.answer.splice(ai,1);
  render();
}
function buildClear(){
  if(SESSION.answered) return;
  const b = SESSION.buildState;
  b.bank.forEach(t=>t.used=false); b.answer = [];
  render();
}
function checkReorder(){
  if(SESSION.answered) return; SESSION.answered = true;
  const ex = currentExercise();
  const b = SESSION.buildState;
  const built = b.answer.map(t=>t.t).join(" ");
  const target = ex.tokens.join(" ");
  const correct = built === target;
  showFeedback(correct, target);
  document.getElementById("checkBtn").style.display = "none";
  gradeAndMaybeStats(ex, correct);
}
function matchSelectLeft(i){
  if(SESSION.matchState.matched[i]) return;
  SESSION.matchState.selectedLeft = i;
  render();
}
function matchSelectRight(i){
  const m = SESSION.matchState;
  if(m.matched[i] || m.selectedLeft == null) return;
  const ex = currentExercise();
  if(m.selectedLeft === i){
    m.matched[i] = true;
    m.selectedLeft = null;
    ST.gradeSrsItem(STATE, "vocab:"+ex.pairs[i].vocabId, true);
    ST.recordSkillAttempt(STATE, "vokabular", true);
    persist();
    const allMatched = ex.pairs.every((_,idx) => m.matched[idx]);
    render();
    if(allMatched){
      SESSION.answered = true;
      document.getElementById("fb").innerHTML = `<div class="feedback good">✓ Alle Paare richtig!</div>`;
      document.getElementById("nextBtn").style.display = "block";
      SESSION.score++;
    }
  } else {
    m.wrong = i;
    ST.gradeSrsItem(STATE, "vocab:"+ex.pairs[m.selectedLeft].vocabId, false);
    ST.recordSkillAttempt(STATE, "vokabular", false);
    trackMissed("vocab:"+ex.pairs[m.selectedLeft].vocabId);
    persist();
    render();
    setTimeout(() => { m.wrong = null; render(); }, 600);
  }
}
function toggleSaveWord(vocabId){
  if(ST.isWordSaved(STATE, vocabId)) ST.unsaveWord(STATE, vocabId);
  else ST.saveWord(STATE, vocabId, SESSION.dayId);
  persist();
  render();
}
function nextExercise(){
  SESSION.pos++; SESSION.buildState = null; SESSION.matchState = null;
  persist();
  render();
}

// ============================================================
// SUMMARY
// ============================================================
function finishSession(){
  ST.touchStreak(STATE);
  const day = DAYS.find(d => d.id === SESSION.dayId);
  const wasNewDay = STATE.currentDay === day.id;
  let xpBonus = 0;
  if(!day.isTest){
    xpBonus = 20;
    STATE.xp = (STATE.xp||0) + xpBonus;
  }
  STATE.completedDays[day.id] = { completedAt: ST.todayStr(), score: SESSION.score, total: SESSION.total };
  if(wasNewDay) STATE.currentDay = day.id + 1;
  STATE.inProgressSession = null;
  persist();

  const weakSkills = day.isTest ? weakestSkillsForDay(day) : [];
  nav("summary", { dayId: day.id, score: SESSION.score, total: SESSION.total, xpBonus, isTest: day.isTest, weakSkills });
}
function weakestSkillsForDay(day){
  return (day.testSkillIds || [])
    .map(id => ({ id, title: SKILLS[id].title, ...(STATE.skillStats[id] || {correct:0,total:0}) }))
    .filter(s => s.total > 0)
    .map(s => ({ ...s, pct: Math.round((s.correct/s.total)*100) }))
    .sort((a,b) => a.pct - b.pct)
    .slice(0, 3);
}
function renderSummary(){
  const { score, total, xpBonus, isTest, weakSkills } = SESSION;
  const pct = total>0 ? Math.round((score/total)*100) : 100;
  app.innerHTML = `
    ${header(true)}
    <main>
      <div class="card center">
        <div class="big-emoji">${pct>=80?'🎉':pct>=50?'👍':'💪'}</div>
        <h2>${isTest ? "Test abgeschlossen!" : "Tag abgeschlossen!"}</h2>
        <p>${score} von ${total} richtig (${pct}%)</p>
        ${xpBonus ? `<p>+${xpBonus} Bonus-XP</p>` : ""}
        ${weakSkills.length ? `
          <div class="weak-list">
            <p><b>Am meisten zum Üben:</b></p>
            <ul>${weakSkills.map(s=>`<li>${esc(s.title)} — ${s.pct}%</li>`).join("")}</ul>
          </div>` : ""}
        <button class="btn" onclick="App.goHome()">Zur Startseite</button>
      </div>
    </main>`;
}

// ============================================================
// GRAMÁTICA REFERENCE (available anytime, not just day of intro)
// ============================================================
function renderGrammarRef(){
  const unlockedDay = STATE.currentDay;
  const bySkillCategory = {};
  Object.entries(SKILLS).forEach(([id, s]) => {
    if(s.day > unlockedDay) return; // not unlocked yet
    (bySkillCategory[s.category] ||= []).push({ id, ...s });
  });
  const cats = Object.keys(bySkillCategory);
  app.innerHTML = `
    ${header(true)}
    <main>
      <h2 class="page-title">📖 Grammatik</h2>
      ${cats.length === 0 ? `<div class="card"><p>Noch keine Grammatik freigeschaltet.</p></div>` : ""}
      ${cats.map(cat => `
        <div class="card">
          <span class="badge">${esc(cat)}</span>
          ${bySkillCategory[cat].map(s => `
            <div class="grammar-entry">
              <h3>${esc(s.title)}</h3>
              <p>${esc(s.explanation)}</p>
              <ul class="examples-list">${s.examples.map(e=>`<li>${esc(e)}</li>`).join("")}</ul>
            </div>`).join("<hr class='divider'>")}
        </div>`).join("")}
    </main>`;
}

// ============================================================
// MIS PALABRAS
// ============================================================
const POS_LABELS = { noun: "Nomen", verb: "Verb", adj: "Adjektiv", adv: "Adverb", phrase: "Phrase" };
const GENDER_CLASS = { der: "gender-der", die: "gender-die", das: "gender-das" };
let myWordsFilter = "all";

function renderMyWords(){
  const ids = Object.keys(STATE.savedWords);
  const words = ids.map(id => ({ id, ...VOCAB[id], ...STATE.savedWords[id] })).filter(w => w.de);
  const presentPos = [...new Set(words.map(w => w.pos).filter(Boolean))];
  const filtered = myWordsFilter === "all" ? words : words.filter(w => w.pos === myWordsFilter);

  app.innerHTML = `
    ${header(true)}
    <main>
      <h2 class="page-title">💾 Meine Wörter</h2>
      ${words.length === 0 ? `<div class="card"><p>Noch keine Wörter gespeichert. Tippe während einer Übung auf "Wort speichern".</p></div>` : `
        <div class="filter-row">
          <span class="filter-chip ${myWordsFilter==='all'?'active':''}" onclick="App.setMyWordsFilter('all')">Alle (${words.length})</span>
          ${presentPos.map(p => {
            const count = words.filter(w=>w.pos===p).length;
            return `<span class="filter-chip ${myWordsFilter===p?'active':''}" onclick="App.setMyWordsFilter('${p}')">${esc(POS_LABELS[p]||p)} (${count})</span>`;
          }).join("")}
        </div>
      `}
      ${filtered.map(w => `
        <div class="card word-card">
          <div>
            <div class="word-de">
              ${w.gender ? `<span class="gender-badge ${GENDER_CLASS[w.gender]||''}">${esc(w.gender)}</span>` : ""}
              ${esc(w.gender ? w.de.replace(/^(der|die|das)\s+/, "") : w.de)}
            </div>
            <div class="word-en">${esc(w.en)}</div>
            ${w.pos ? `<span class="badge word-pos-badge">${esc(POS_LABELS[w.pos]||w.pos)}</span>` : ""}
          </div>
          <button class="btn ghost small" onclick="App.toggleSaveWordAndRefresh('${w.id}')">🗑️</button>
        </div>`).join("")}
    </main>`;
}
function setMyWordsFilter(pos){
  myWordsFilter = pos;
  render();
}
function toggleSaveWordAndRefresh(vocabId){
  ST.unsaveWord(STATE, vocabId);
  persist();
  render();
}

// ============================================================
// STATS
// ============================================================
function renderStats(){
  const byCat = ST.accuracyByCategory(STATE, SKILLS);
  const cats = Object.keys(byCat);
  const doneCount = Object.keys(STATE.completedDays).length;
  app.innerHTML = `
    ${header(true)}
    <main>
      <h2 class="page-title">📊 Statistik</h2>
      <div class="card">
        <div class="grid2">
          <div class="stat-box"><div class="n">${STATE.streak.count||0}</div><div class="l">Serie</div></div>
          <div class="stat-box"><div class="n">${STATE.streak.longest||0}</div><div class="l">Längste Serie</div></div>
          <div class="stat-box"><div class="n">${STATE.xp||0}</div><div class="l">XP</div></div>
          <div class="stat-box"><div class="n">${doneCount}/${DAYS.length}</div><div class="l">Tage</div></div>
        </div>
      </div>
      <div class="card">
        <span class="badge">GENAUIGKEIT NACH THEMA</span>
        ${cats.length === 0 ? `<p>Noch keine Daten — leg los!</p>` : cats.map(cat => {
          const c = byCat[cat];
          const pct = c.total ? Math.round((c.correct/c.total)*100) : 0;
          return `<div class="skill-bar-row">
            <div class="skill-bar-label">${esc(cat)} <span>${pct}%</span></div>
            <div class="progress"><div style="width:${pct}%; background:${pct<60?'var(--bad)':pct<80?'#e8a33d':'var(--good)'}"></div></div>
          </div>`;
        }).join("")}
      </div>
    </main>`;
}

// ============================================================
// SETTINGS
// ============================================================
function renderSettings(){
  app.innerHTML = `
    ${header(true)}
    <main>
      <h2 class="page-title">⚙️ Einstellungen</h2>
      <div class="card">
        <h2>Sync-Code</h2>
        <p>Gib diesen Code auf deinem anderen Gerät ein, um deinen Fortschritt zu verbinden:</p>
        <p class="sync-code">${esc(SYNC_CODE || "—")}</p>
        <button class="btn secondary" onclick="App.copySyncCode()">Code kopieren</button>
      </div>
      <div class="card">
        <h2>Daten sichern</h2>
        <p>Zusätzliches Backup als Datei, unabhängig vom Sync.</p>
        <button class="btn secondary" onclick="App.exportData()">Fortschritt exportieren (.json)</button>
        <input type="file" id="importFile" accept="application/json" style="display:none" onchange="App.importData(event)">
        <button class="btn secondary" onclick="document.getElementById('importFile').click()">Fortschritt importieren</button>
      </div>
      <div class="card">
        <h2>Zurücksetzen</h2>
        <p>Löscht deinen gesamten Fortschritt unwiderruflich (auf diesem Sync-Code).</p>
        <button class="btn bad" onclick="App.resetProgress()">Fortschritt löschen</button>
      </div>
      <button class="btn ghost" onclick="App.goHome()">← Zur Startseite</button>
    </main>`;
}
function copySyncCode(){
  if(!SYNC_CODE) return;
  navigator.clipboard?.writeText(SYNC_CODE).then(
    () => alert("Code kopiert: " + SYNC_CODE),
    () => alert("Dein Code: " + SYNC_CODE)
  );
}
function exportData(){
  const blob = new Blob([JSON.stringify(STATE, null, 2)], {type:"application/json"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = "deutsch-a1-fortschritt-" + ST.todayStr() + ".json";
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
function importData(event){
  const file = event.target.files[0];
  if(!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result);
      STATE = ST.migrateState(data);
      persist();
      alert("Fortschritt importiert.");
      render();
    } catch(err){ alert("Datei konnte nicht gelesen werden."); }
  };
  reader.readAsText(file);
}
function resetProgress(){
  if(confirm("Wirklich den gesamten Fortschritt löschen?")){
    STATE = ST.defaultState();
    persist();
    goHome();
  }
}

// ============================================================
// UTIL
// ============================================================
function esc(s){
  return String(s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
}

// ---- expose event handlers for inline onclick (no build step) -------
window.App = {
  nav, goHome, startDay, nextDayGrammar, finishDayGrammar,
  answerMC, answerMCOrder, checkFill, buildAdd, buildRemove, buildClear, checkReorder,
  matchSelectLeft, matchSelectRight, toggleSaveWord, toggleSaveWordAndRefresh, nextExercise,
  createNewCode, useExistingCode, copySyncCode, exportData, importData, resetProgress,
  setMyWordsFilter,
};

window.__DEBUG__ = () => SESSION; // read-only introspection hook, used by automated tests

render();

if("serviceWorker" in navigator){
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("service-worker.js").then((reg) => {
      reg.update().catch(()=>{}); // check for a newer version right away, don't wait for the browser's own schedule
    }).catch(()=>{});
  });
  // The service worker always skipWaiting()+clients.claim()s a new version
  // as soon as it installs, so this fires whenever an update lands. Reload
  // once so the page actually runs the new JS, instead of leaving stale
  // code running until the user manually force-quits the app. Safe to do
  // mid-session now: the exercise queue/position persists (see persist()),
  // so a reload just resumes exactly where you were.
  let reloadedForUpdate = false;
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if(reloadedForUpdate) return;
    reloadedForUpdate = true;
    window.location.reload();
  });
}
