// ============================================================
// SYNC.JS — cross-device sync via Firebase Realtime Database,
// over plain REST (no SDK, no build step). Each device stores a
// "sync code" locally; both devices using the same code share
// one progress record at /sync/{code}.json.
//
// Security model (by design, not accidental): the database rules
// only allow read/write under /sync/$code — nothing else is
// reachable, and the root itself is closed. Anyone who has the
// code can read/write that one slot; that's an accepted trade-off
// for a zero-login personal study app, not a place for sensitive data.
// ============================================================
const FIREBASE_URL = "https://deutsch-a1-693fd-default-rtdb.firebaseio.com";
const DEVICE_CODE_KEY = "deutschA1.syncCode";

export function getLocalSyncCode(){
  try { return localStorage.getItem(DEVICE_CODE_KEY); } catch(e){ return null; }
}
export function setLocalSyncCode(code){
  try { localStorage.setItem(DEVICE_CODE_KEY, code); } catch(e){}
}

export function generateSyncCode(){
  // Short, easy to type on a phone keyboard, case-insensitive.
  const alphabet = "abcdefghjkmnpqrstuvwxyz23456789"; // no 0/O/1/l/i ambiguity
  let code = "";
  for(let i=0; i<8; i++) code += alphabet[Math.floor(Math.random()*alphabet.length)];
  return code.slice(0,4) + "-" + code.slice(4);
}

async function req(method, code, body){
  const url = `${FIREBASE_URL}/sync/${encodeURIComponent(code)}.json`;
  const opts = { method };
  if(body !== undefined) opts.body = JSON.stringify(body);
  const res = await fetch(url, opts);
  if(!res.ok) throw new Error("Firebase " + method + " failed: " + res.status);
  return res.json();
}

export async function pullState(code){
  return req("GET", code);
}
export async function pushState(code, state){
  return req("PUT", code, state);
}

// Debounced, best-effort push: swallows network errors (offline-friendly)
// and flags `pendingSync` so the UI can show a small indicator.
let pushTimer = null;
export function schedulePush(code, getState, onResult){
  if(!code) return;
  clearTimeout(pushTimer);
  pushTimer = setTimeout(async () => {
    try {
      await pushState(code, getState());
      onResult && onResult({ ok: true });
    } catch(e){
      onResult && onResult({ ok: false, error: e.message });
    }
  }, 800);
}
