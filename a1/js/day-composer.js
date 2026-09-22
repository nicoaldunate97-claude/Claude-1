// ============================================================
// DAY-COMPOSER.JS — turns a DAY definition + current SRS state
// into a concrete, shuffled exercise queue: new content first
// (grammar already shown separately by the UI before this runs),
// then a spaced-repetition review batch pulled from earlier days.
// Test days pull a larger mixed batch instead, ignoring due-dates.
// ============================================================
import {
  genConjugationExercises, genSatzbauExercises, genPrepositionExercises,
  genArticleExercises, genNegationExercises, genVocabExercises, genMatchExercise, sample,
} from "./exercise-engine.js";

const MATCH_GROUP_SIZE = 6;
const MATCH_MIN_GROUP = 4;
const MATCH_MAX_ROUNDS = 3;
import { dueItemIds } from "./state.js";

const REVIEW_VOCAB_CAP = 18;
const REVIEW_SKILLS_CAP = 6;
const REVIEW_EXERCISES_PER_SKILL = 3;
const TEST_EXERCISES_PER_SKILL = 4;
const TEST_VOCAB_CAP = 20;

// Splits vocabList into several non-overlapping match rounds (instead of
// just one) once there's enough vocab to fill more than one round — more
// reinforcement without repeating the same pairs in the same sitting.
function addMatchRounds(exercises, vocabList){
  if(vocabList.length < MATCH_MIN_GROUP) return;
  const shuffled = sample(vocabList, vocabList.length); // shuffled copy, no repeats across rounds
  const rounds = Math.min(MATCH_MAX_ROUNDS, Math.floor(shuffled.length / MATCH_MIN_GROUP));
  for(let r = 0; r < rounds; r++){
    const group = shuffled.slice(r * MATCH_GROUP_SIZE, r * MATCH_GROUP_SIZE + MATCH_GROUP_SIZE);
    if(group.length >= MATCH_MIN_GROUP) exercises.push(genMatchExercise(group));
  }
}

export function generateForSkill(SKILLS, skillId){
  const skill = SKILLS[skillId];
  if(!skill) throw new Error("Unknown skill: " + skillId);
  switch(skill.exerciseType){
    case "conjugation": return genConjugationExercises(skillId, skill.params.verbIds, skill.params.opts);
    case "satzbau":     return genSatzbauExercises(skillId, skill.params.recipesFn(), skill.params.opts);
    case "preposition": return genPrepositionExercises(skillId, skill.params.itemsFn());
    case "article":     return genArticleExercises(skillId, skill.params.nounsFn(), skill.params.opts);
    case "negation":    return genNegationExercises(skillId, skill.params.itemsFn());
    default: throw new Error("Unknown exerciseType for skill " + skillId + ": " + skill.exerciseType);
  }
}

export function composeDaySession({ day, state, SKILLS, VOCAB, vocabByIds, vocabByDayPrefix }){
  let exercises = [];

  if(day.isTest){
    (day.testSkillIds || []).forEach(id => {
      exercises.push(...sample(generateForSkill(SKILLS, id), TEST_EXERCISES_PER_SKILL));
    });
    const weekVocab = (day.testVocabPrefixes || []).flatMap(p => vocabByDayPrefix(p));
    if(weekVocab.length){
      exercises.push(...genVocabExercises(sample(weekVocab, Math.min(TEST_VOCAB_CAP, weekVocab.length))));
      addMatchRounds(exercises, weekVocab);
    }
    return shuffleStable(exercises);
  }

  // 1) new skills introduced today — full drill set
  (day.newSkillIds || []).forEach(id => exercises.push(...generateForSkill(SKILLS, id)));

  // 2) new vocab introduced today
  const newVocab = vocabByIds(day.newVocabIds || []);
  if(newVocab.length) exercises.push(...genVocabExercises(newVocab));
  addMatchRounds(exercises, newVocab);

  // 3) spaced-repetition review batch — vocab/skills from EARLIER days that are due
  const newVocabIdSet = new Set(day.newVocabIds || []);
  const dueVocabIds = dueItemIds(state, "vocab:")
    .map(id => id.slice("vocab:".length))
    .filter(id => VOCAB[id] && !newVocabIdSet.has(id));
  if(dueVocabIds.length){
    const chosen = sample(dueVocabIds, Math.min(REVIEW_VOCAB_CAP, dueVocabIds.length));
    exercises.push(...genVocabExercises(vocabByIds(chosen)));
  }

  const newSkillIdSet = new Set(day.newSkillIds || []);
  const dueSkillIds = new Set();
  dueItemIds(state).forEach(itemId => {
    if(itemId.startsWith("vocab:")) return;
    const skillId = itemId.split("|")[0];
    if(SKILLS[skillId] && !newSkillIdSet.has(skillId)) dueSkillIds.add(skillId);
  });
  sample([...dueSkillIds], Math.min(REVIEW_SKILLS_CAP, dueSkillIds.size)).forEach(id => {
    exercises.push(...sample(generateForSkill(SKILLS, id), REVIEW_EXERCISES_PER_SKILL));
  });

  return shuffleStable(exercises);
}

function shuffleStable(arr){
  const a = arr.slice();
  for(let i=a.length-1;i>0;i--){ const j = Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; }
  return a;
}
