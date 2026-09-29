import { z } from "zod";
import { llm } from "../llm";

const TiebreakSchema = z.object({
  preferred_option: z.enum(["A", "B"]),
  rationale: z.string(),
});

export async function runPairwiseTiebreak(
  personName: string,
  targetAName: string,
  targetBName: string,
  summaryA: string,
  summaryB: string,
  personId: string
): Promise<"A" | "B"> {
  // Query in both orders to cancel position bias
  const promptOrder1 = `Agent for ${personName}:
Option A: Date with ${targetAName} - ${summaryA}
Option B: Date with ${targetBName} - ${summaryB}

Which date did you genuinely prefer based on your personal needs and chemistry? Return A or B.`;

  const promptOrder2 = `Agent for ${personName}:
Option A: Date with ${targetBName} - ${summaryB}
Option B: Date with ${targetAName} - ${summaryA}

Which date did you genuinely prefer based on your personal needs and chemistry? Return A or B.`;

  try {
    const res1 = await llm.object({
      schema: TiebreakSchema,
      prompt: promptOrder1,
      purpose: "tiebreak_order1",
      personId,
      temperature: 0,
    });

    const res2 = await llm.object({
      schema: TiebreakSchema,
      prompt: promptOrder2,
      purpose: "tiebreak_order2",
      personId,
      temperature: 0,
    });

    // Check consistency
    const pref1 = res1.preferred_option === "A" ? targetAName : targetBName;
    const pref2 = res2.preferred_option === "A" ? targetBName : targetAName;

    if (pref1 === targetAName && pref2 === targetAName) return "A";
    if (pref1 === targetBName && pref2 === targetBName) return "B";
    return "A"; // Default
  } catch {
    return "A";
  }
}
