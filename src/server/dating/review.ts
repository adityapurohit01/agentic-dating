/**
 * review.ts — LLM-based side review generated FROM the persona + transcript.
 *
 * In real mode: sends persona + full transcript to LLM, gets structured review.
 * In mock mode: derives numbers deterministically from the transcript TEXT
 *   (word-count, sentiment words, turn references) so tests prove causality.
 */

import { z } from "zod";
import { llm } from "../llm";
import { Persona } from "../reader/schemas";
import { isMockMode } from "../llm";

export const SideReviewSchema = z.object({
  need_scores: z.array(
    z.object({
      need: z.string(),
      score: z.number().min(0).max(10),
      turns: z.array(z.number()),
    })
  ),
  values_alignment: z.number().min(0).max(10),
  chemistry: z.number().min(0).max(10),
  red_flags: z.array(
    z.object({
      text: z.string(),
      turns: z.array(z.number()),
    })
  ),
  green_flags: z.array(
    z.object({
      text: z.string(),
      turns: z.array(z.number()),
    })
  ),
  would_see_again: z.number().min(0).max(100),
  learned_about_principal: z.array(z.string()),
  summary: z.string(),
});
export type SideReview = z.infer<typeof SideReviewSchema>;

// ── Positive / negative sentiment lexicons (small, deterministic) ──
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
 * Derive a mock side review deterministically from the transcript text.
 * This ensures that scrambling or making the transcript hostile
 * changes the resulting scores by a meaningful amount.
 */
export function deriveMockSideReview(
  selfPersona: Persona,
  partnerPersona: Persona,
  transcript: Array<{ turnNumber: number; speakerName: string; message: string }>,
  round: number
): SideReview {
  // Count sentiment in partner's messages only (what self evaluates)
  const partnerMsgs = transcript.filter(
    (t) => t.speakerName === partnerPersona.identity.name
  );
  const selfMsgs = transcript.filter(
    (t) => t.speakerName === selfPersona.identity.name
  );

  const allPartnerText = partnerMsgs.map((m) => m.message).join(" ").toLowerCase();
  const allSelfText = selfMsgs.map((m) => m.message).join(" ").toLowerCase();
  const allText = transcript.map((m) => m.message).join(" ").toLowerCase();

  // Sentiment scoring
  let posCount = 0;
  let negCount = 0;
  for (const word of allPartnerText.split(/\s+/)) {
    const clean = word.replace(/[^a-z]/g, "");
    if (POS_WORDS.has(clean)) posCount++;
    if (NEG_WORDS.has(clean)) negCount++;
    // Prefix match for stems like "frustrat" matching "frustrated"
    for (const neg of NEG_WORDS) {
      if (clean.startsWith(neg) && clean.length > 3) negCount++;
    }
    for (const pos of POS_WORDS) {
      if (clean.startsWith(pos) && clean.length > 3) posCount++;
    }
  }

  const totalWords = allPartnerText.split(/\s+/).filter(Boolean).length || 1;
  const sentimentRatio = (posCount - negCount) / totalWords;
  // Clamp to [-0.3, 0.3] and map to [0, 1]
  const sentimentNorm = Math.max(0, Math.min(1, (sentimentRatio + 0.3) / 0.6));

  // Check keyword overlap: does partner mention things self cares about?
  const selfNeedKeywords = selfPersona.needs
    .flatMap((n) => n.need.toLowerCase().split(/\s+/).filter((w) => w.length > 3));
  let needMentions = 0;
  for (const kw of selfNeedKeywords) {
    if (allPartnerText.includes(kw) || allText.includes(kw)) needMentions++;
  }
  const needOverlapRatio = Math.min(1, needMentions / Math.max(1, selfNeedKeywords.length));

  // Engagement: longer, more varied responses = better chemistry
  const avgPartnerWordCount = totalWords / Math.max(1, partnerMsgs.length);
  const engagementNorm = Math.min(1, avgPartnerWordCount / 50); // 50 words = max engagement signal

  // Question marks in partner messages (shows interest in self)
  const questionCount = (allPartnerText.match(/\?/g) || []).length;
  const questionNorm = Math.min(1, questionCount / Math.max(1, partnerMsgs.length));

  // ── Compute scores ──
  const baseChemistry = 3 + sentimentNorm * 4 + engagementNorm * 1.5 + questionNorm * 1.5;
  const chemistry = Number(Math.max(1, Math.min(10, baseChemistry)).toFixed(1));

  const baseValuesAlignment = 3 + needOverlapRatio * 4 + sentimentNorm * 3;
  const valuesAlignment = Number(Math.max(1, Math.min(10, baseValuesAlignment)).toFixed(1));

  // Per-need scoring
  const needScores = selfPersona.needs.map((n) => {
    const needWords = n.need.toLowerCase().split(/\s+/).filter((w) => w.length > 3);
    let mentions = 0;
    const matchedTurns: number[] = [];
    for (const t of transcript) {
      const msgLower = t.message.toLowerCase();
      for (const kw of needWords) {
        if (msgLower.includes(kw)) {
          mentions++;
          if (!matchedTurns.includes(t.turnNumber)) {
            matchedTurns.push(t.turnNumber);
          }
        }
      }
    }
    const needScore = Math.max(1, Math.min(10,
      4 + mentions * 1.2 + sentimentNorm * 3
    ));
    return {
      need: n.need,
      score: Number(needScore.toFixed(1)),
      turns: matchedTurns.length > 0 ? matchedTurns.slice(0, 3) : [1],
    };
  });

  // Would-see-again: blended from all signals
  const meanNeedScore = needScores.length > 0
    ? needScores.reduce((s, n) => s + n.score, 0) / needScores.length
    : 5;

  const wouldSeeAgain = Math.max(0, Math.min(100, Math.round(
    sentimentNorm * 30 +
    needOverlapRatio * 20 +
    engagementNorm * 15 +
    questionNorm * 10 +
    (meanNeedScore / 10) * 25
  )));

  // Red/green flags from transcript
  const redFlags: Array<{ text: string; turns: number[] }> = [];
  const greenFlags: Array<{ text: string; turns: number[] }> = [];

  for (const t of partnerMsgs) {
    const lower = t.message.toLowerCase();
    let hasNeg = false;
    let hasPos = false;
    for (const neg of NEG_WORDS) {
      if (lower.includes(neg)) hasNeg = true;
    }
    for (const pos of POS_WORDS) {
      if (lower.includes(pos)) hasPos = true;
    }
    if (hasNeg && redFlags.length < 2) {
      redFlags.push({
        text: `Concerning tone in turn ${t.turnNumber}: "${t.message.slice(0, 60)}..."`,
        turns: [t.turnNumber],
      });
    }
    if (hasPos && greenFlags.length < 2) {
      greenFlags.push({
        text: `Positive engagement in turn ${t.turnNumber}: "${t.message.slice(0, 60)}..."`,
        turns: [t.turnNumber],
      });
    }
  }

  if (greenFlags.length === 0) {
    greenFlags.push({ text: "Engaged in conversation throughout", turns: [1] });
  }

  return {
    need_scores: needScores,
    values_alignment: valuesAlignment,
    chemistry,
    red_flags: redFlags,
    green_flags: greenFlags,
    would_see_again: wouldSeeAgain,
    learned_about_principal: [
      `Observed ${partnerPersona.identity.name}'s communication patterns across ${transcript.length} turns.`,
    ],
    summary: `Mock review derived from transcript analysis. Sentiment ratio: ${sentimentRatio.toFixed(3)}, need overlap: ${needOverlapRatio.toFixed(2)}, engagement: ${engagementNorm.toFixed(2)}.`,
  };
}

/**
 * Generate a side review using the LLM from the self persona + transcript.
 * Falls back to transcript-derived mock review on error.
 */
export async function generateSideReview(
  dateId: string,
  selfPersona: Persona,
  partnerPersona: Persona,
  transcript: Array<{ turnNumber: number; speakerName: string; message: string }>,
  round: number
): Promise<SideReview> {
  // In mock mode, derive review from transcript deterministically
  if (isMockMode()) {
    return deriveMockSideReview(selfPersona, partnerPersona, transcript, round);
  }

  const transcriptText = transcript
    .map((t) => `Turn ${t.turnNumber} [${t.speakerName}]: ${t.message}`)
    .join("\n");

  const needsList = selfPersona.needs
    .map((n) => `- "${n.need}" (Weight: ${n.weight}/5, ${n.kind})`)
    .join("\n");

  const prompt = `You are evaluating a simulated date strictly from the perspective of ${selfPersona.identity.name}.

## Your Persona (${selfPersona.identity.name})
Summary: ${selfPersona.summary}
Core Needs:
${needsList}
Values: ${selfPersona.values.map((v) => v.name).join(", ")}
Lifestyle: ${JSON.stringify(selfPersona.lifestyle)}
Communication Style: ${selfPersona.communication_style.summary}

## Partner: ${partnerPersona.identity.name}
Headline: ${partnerPersona.identity.headline || "N/A"}

## Full Date Transcript (${round === 2 ? "Round 2 Deep Date" : "Round 1 Speed Date"}):
${transcriptText}

## Instructions
Evaluate this date SOLELY based on what happened in the transcript above.
For each of your needs, score how well the partner addressed it (0-10) and cite the turn numbers.
Rate values_alignment (0-10) and chemistry (0-10) based on conversational evidence.
Identify specific red_flags and green_flags with turn numbers.
Calculate would_see_again (0-100) as your overall impression.
List what you learned about your own preferences from this interaction.
Write a brief summary of the date experience.

Return JSON matching SideReviewSchema.`;

  try {
    const res = await llm.object({
      schema: SideReviewSchema,
      prompt,
      purpose: round === 1 ? "side_review_r1" : "side_review_r2",
      dateId,
    });

    // Validate: if the LLM returned something clearly broken, try repair
    const validated = SideReviewSchema.safeParse(res);
    if (validated.success) {
      return validated.data;
    }

    // One repair attempt
    return deriveMockSideReview(selfPersona, partnerPersona, transcript, round);
  } catch {
    // Fallback: transcript-derived mock review (still causally linked)
    return deriveMockSideReview(selfPersona, partnerPersona, transcript, round);
  }
}
