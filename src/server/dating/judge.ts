/**
 * judge.ts — Neutral judge review generated from transcript.
 *
 * Real mode: strong model at temperature 0 evaluates the transcript.
 * Mock mode: derives mutual_score from combined transcript sentiment/engagement.
 */

import { z } from "zod";
import { llm } from "../llm";
import { Persona } from "../reader/schemas";
import { isMockMode } from "../llm";

export const JudgeReviewSchema = z.object({
  mutual_score: z.number().min(0).max(100),
  rationale: z.string(),
  shared_ground: z.array(z.string()),
  friction: z.array(z.string()),
  best_turns: z.array(z.number()),
  verdict: z.string(),
});
export type JudgeReview = z.infer<typeof JudgeReviewSchema>;

// ── Sentiment lexicons (mirrors review.ts for consistency) ──
const POS_WORDS = new Set([
  "great", "love", "enjoy", "wonderful", "amazing", "fantastic", "appreciate",
  "inspiring", "brilliant", "awesome", "fascinating", "excited", "curious",
  "agree", "beautiful", "perfect", "happy", "delighted", "thrilled", "passion",
  "genuine", "thoughtful", "insightful", "warm", "creative", "excellent",
  "outstanding", "remarkable", "admire", "connect", "resonate", "aligned",
  "meaningful", "profound", "lovely", "calm", "peaceful", "energized",
]);

const NEG_WORDS = new Set([
  "disagree", "unfortunately", "difficult", "struggle", "frustrat", "concern",
  "worry", "conflict", "tension", "annoyed", "boring", "superficial", "shallow",
  "rigid", "stubborn", "dismissive", "hostile", "rude", "cold", "distant",
  "awkward", "uncomfortable", "disappointed", "hate", "dislike", "terrible",
  "awful", "exhausting", "draining", "stressful", "toxic",
]);

/**
 * Derive a mock judge review deterministically from the transcript text.
 */
export function deriveMockJudgeReview(
  personA: Persona,
  personB: Persona,
  transcript: Array<{ turnNumber: number; speakerName: string; message: string }>
): JudgeReview {
  const allText = transcript.map((t) => t.message).join(" ").toLowerCase();
  const words = allText.split(/\s+/).filter(Boolean);
  const totalWords = words.length || 1;

  // Sentiment
  let posCount = 0;
  let negCount = 0;
  for (const word of words) {
    const clean = word.replace(/[^a-z]/g, "");
    if (POS_WORDS.has(clean)) posCount++;
    if (NEG_WORDS.has(clean)) negCount++;
    for (const neg of NEG_WORDS) {
      if (clean.startsWith(neg) && clean.length > 3) negCount++;
    }
    for (const pos of POS_WORDS) {
      if (clean.startsWith(pos) && clean.length > 3) posCount++;
    }
  }

  const sentimentRatio = (posCount - negCount) / totalWords;
  const sentimentNorm = Math.max(0, Math.min(1, (sentimentRatio + 0.3) / 0.6));

  // Reciprocity: balanced turn lengths
  const aMsgs = transcript.filter((t) => t.speakerName === personA.identity.name);
  const bMsgs = transcript.filter((t) => t.speakerName === personB.identity.name);
  const aWordCount = aMsgs.reduce((s, t) => s + t.message.split(/\s+/).length, 0);
  const bWordCount = bMsgs.reduce((s, t) => s + t.message.split(/\s+/).length, 0);
  const reciprocityRatio = 1 - Math.abs(aWordCount - bWordCount) / Math.max(1, aWordCount + bWordCount);

  // Question reciprocity
  const aQuestions = aMsgs.reduce((s, t) => s + (t.message.match(/\?/g) || []).length, 0);
  const bQuestions = bMsgs.reduce((s, t) => s + (t.message.match(/\?/g) || []).length, 0);
  const questionEngagement = Math.min(1, (aQuestions + bQuestions) / Math.max(1, transcript.length));

  // Total engagement (more words = deeper conversation)
  const engagementNorm = Math.min(1, totalWords / (transcript.length * 40));

  // Shared keyword detection
  const aKeywords = new Set(
    aMsgs.flatMap((t) =>
      t.message.toLowerCase().split(/\s+/).filter((w) => w.length > 4)
    )
  );
  const bKeywords = new Set(
    bMsgs.flatMap((t) =>
      t.message.toLowerCase().split(/\s+/).filter((w) => w.length > 4)
    )
  );
  let sharedCount = 0;
  const sharedTopics: string[] = [];
  for (const k of aKeywords) {
    if (bKeywords.has(k) && k.length > 5) {
      sharedCount++;
      if (sharedTopics.length < 3) sharedTopics.push(k);
    }
  }
  const sharedNorm = Math.min(1, sharedCount / 10);

  // Mutual score: weighted blend
  const mutualScore = Math.max(0, Math.min(100, Math.round(
    sentimentNorm * 35 +
    reciprocityRatio * 15 +
    questionEngagement * 15 +
    engagementNorm * 15 +
    sharedNorm * 20
  )));

  // Find best turns (highest sentiment turns)
  const turnScores = transcript.map((t) => {
    const tw = t.message.toLowerCase().split(/\s+/);
    let tp = 0;
    let tn = 0;
    for (const w of tw) {
      const c = w.replace(/[^a-z]/g, "");
      if (POS_WORDS.has(c)) tp++;
      if (NEG_WORDS.has(c)) tn++;
    }
    return { turn: t.turnNumber, score: tp - tn };
  });
  turnScores.sort((a, b) => b.score - a.score);
  const bestTurns = turnScores.slice(0, 2).map((t) => t.turn);

  // Friction detection
  const frictionTopics: string[] = [];
  for (const t of transcript) {
    const lower = t.message.toLowerCase();
    for (const neg of NEG_WORDS) {
      if (lower.includes(neg) && frictionTopics.length < 2) {
        frictionTopics.push(`Tension detected in turn ${t.turnNumber}: topic around "${neg}"`);
        break;
      }
    }
  }
  if (frictionTopics.length === 0) {
    frictionTopics.push("No significant friction detected in the conversation");
  }

  const verdict = mutualScore >= 75
    ? "Strong mutual compatibility with genuine conversational rapport."
    : mutualScore >= 50
      ? "Moderate compatibility with some areas of misalignment."
      : "Low compatibility with significant conversational friction.";

  return {
    mutual_score: mutualScore,
    rationale: `Mock judge analysis: sentiment ratio ${sentimentRatio.toFixed(3)}, reciprocity ${reciprocityRatio.toFixed(2)}, shared topics ${sharedCount}. ${
      mutualScore >= 70
        ? `${personA.identity.name} and ${personB.identity.name} showed natural conversational flow.`
        : `Notable divergences emerged between ${personA.identity.name} and ${personB.identity.name}.`
    }`,
    shared_ground: sharedTopics.length > 0
      ? sharedTopics.map((t) => `Shared discussion of "${t}"`)
      : ["General conversational engagement"],
    friction: frictionTopics,
    best_turns: bestTurns.length > 0 ? bestTurns : [1, 2],
    verdict,
  };
}

/**
 * Generate a judge review using the LLM from the transcript.
 * Uses the strong model at temperature 0.
 * Falls back to transcript-derived mock on error.
 */
export async function evaluateJudgeReview(
  dateId: string,
  personA: Persona,
  personB: Persona,
  transcript: Array<{ turnNumber: number; speakerName: string; message: string }>
): Promise<JudgeReview> {
  // In mock mode, derive from transcript deterministically
  if (isMockMode()) {
    return deriveMockJudgeReview(personA, personB, transcript);
  }

  const transcriptText = transcript
    .map((t) => `Turn ${t.turnNumber} [${t.speakerName}]: ${t.message}`)
    .join("\n");

  const prompt = `You are an impartial, expert relationship psychologist acting as a neutral judge.

## Candidate A: ${personA.identity.name}
Summary: ${personA.summary}
Values: ${personA.values.map((v) => v.name).join(", ")}
Lifestyle: ${JSON.stringify(personA.lifestyle)}
Key Needs: ${personA.needs.slice(0, 3).map((n) => n.need).join("; ")}

## Candidate B: ${personB.identity.name}
Summary: ${personB.summary}
Values: ${personB.values.map((v) => v.name).join(", ")}
Lifestyle: ${JSON.stringify(personB.lifestyle)}
Key Needs: ${personB.needs.slice(0, 3).map((n) => n.need).join("; ")}

## Date Transcript:
${transcriptText}

## Instructions
Evaluate the mutual compatibility of this pairing based SOLELY on the transcript above.
- mutual_score (0-100): overall mutual compatibility demonstrated in conversation
- rationale: cite specific turns and quotes that support your score
- shared_ground: concrete topics both engaged positively on
- friction: concrete points of disagreement or misalignment from the conversation
- best_turns: turn numbers with the strongest positive chemistry
- verdict: a one-sentence analytical summary

Return JSON matching JudgeReviewSchema.`;

  try {
    const res = await llm.object({
      schema: JudgeReviewSchema,
      prompt,
      purpose: "judge_evaluation",
      dateId,
      temperature: 0,
      model: process.env.LLM_MODEL_STRONG || undefined,
    });

    const validated = JudgeReviewSchema.safeParse(res);
    if (validated.success) {
      return validated.data;
    }

    return deriveMockJudgeReview(personA, personB, transcript);
  } catch {
    return deriveMockJudgeReview(personA, personB, transcript);
  }
}
