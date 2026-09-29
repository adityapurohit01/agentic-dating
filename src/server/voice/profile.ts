import { llm } from "../llm";
import { z } from "zod";

export function extractExemplars(captions: string[]): string[] {
  // Filter out contact details (emails, phone numbers, @handles, links)
  const cleanCaptions = captions
    .map((c) => c.trim())
    .filter((c) => c.length > 20)
    .filter((c) => !/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(c))
    .filter((c) => !/\+?\d[\d\s-]{7,}\d/.test(c));

  // Pick up to 10 diverse captions
  return cleanCaptions.slice(0, 10);
}

const StyleNotesSchema = z.object({
  style_notes: z.string(),
});

export async function generateStyleNotes(
  personId: string,
  personName: string,
  exemplars: string[],
  summaryText: string
): Promise<string> {
  if (exemplars.length === 0 && !summaryText) {
    return "Balanced, warm, conversational tone.";
  }

  const prompt = `Candidate: ${personName}

Sample Captions and Writings:
${exemplars.map((c, i) => `[Sample ${i + 1}]: "${c}"`).join("\n")}
About Summary: "${summaryText}"

In at most 120 words, describe this person's distinct voice, tone, sentence pacing, humor style, and vocabulary habits.`;

  try {
    const res = await llm.object({
      schema: StyleNotesSchema,
      prompt,
      purpose: "generate_style_notes",
      personId,
    });
    return res.style_notes;
  } catch {
    return "Reflective and energetic voice, balancing professional clarity with engaging, personal conversational warmth.";
  }
}
