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

const MATCH_GROUP_SIZE = 5;
const MATCH_MIN_GROUP = 4;
import { dueItemIds } from "./state.js";

const REVIEW_VOCAB_CAP = 12;
const REVIEW_SKILLS_CAP = 4;
const REVIEW_EXERCISES_PER_SKILL = 2;
const TEST_EXERCISES_PER_SKILL = 3;
const TEST_VOCAB_CAP = 15;

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
      if(weekVocab.length >= MATCH_MIN_GROUP){
        exercises.push(genMatchExercise(sample(weekVocab, Math.min(MATCH_GROUP_SIZE, weekVocab.length))));
      }
    }
    return shuffleStable(exercises);
  }

  // 1) new skills introduced today — full drill set
  (day.newSkillIds || []).forEach(id => exercises.push(...generateForSkill(SKILLS, id)));

  // 2) new vocab introduced today
  const newVocab = vocabByIds(day.newVocabIds || []);
  if(newVocab.length) exercises.push(...genVocabExercises(newVocab));
  if(newVocab.length >= MATCH_MIN_GROUP){
    exercises.push(genMatchExercise(sample(newVocab, Math.min(MATCH_GROUP_SIZE, newVocab.length))));
  }

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
