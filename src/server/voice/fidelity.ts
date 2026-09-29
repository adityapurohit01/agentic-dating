import { llm } from "../llm";
import { z } from "zod";

const FakeCaptionSchema = z.object({
  fake_caption: z.string(),
});

const JudgeDiscriminationSchema = z.object({
  chosen_index: z.number().min(0).max(1),
  confidence: z.number().min(0).max(1),
  rationale: z.string(),
});

export async function evaluateVoiceFidelity(
  personId: string,
  styleNotes: string,
  realCaptions: string[]
): Promise<number | null> {
  if (realCaptions.length < 3) {
    return null; // Not enough data as specified
  }

  const testCaptions = realCaptions.slice(0, 3);
  let correctGuesses = 0;

  for (const realCaption of testCaptions) {
    try {
      // 1. Generate fake caption on same topic
      const fakeRes = await llm.object({
        schema: FakeCaptionSchema,
        prompt: `Voice Notes: "${styleNotes}"\nReal Caption: "${realCaption}"\n\nGenerate a fake Instagram caption on the same topic, mimicking this person's voice and style.`,
        purpose: "generate_fake_caption",
        personId,
      });

      // 2. Shuffle pair
      const isRealFirst = Math.random() < 0.5;
      const options = isRealFirst
        ? [realCaption, fakeRes.fake_caption]
        : [fakeRes.fake_caption, realCaption];
      const realIndex = isRealFirst ? 0 : 1;

      // 3. Judge model discriminates
      const judgeRes = await llm.object({
        schema: JudgeDiscriminationSchema,
        prompt: `Voice Description: "${styleNotes}"\n\nPair:\n[Option 0]: "${options[0]}"\n[Option 1]: "${options[1]}"\n\nWhich option was written by the real human? Return 0 or 1 with rationale.`,
        purpose: "judge_fidelity",
        personId,
        temperature: 0,
      });

      if (judgeRes.chosen_index === realIndex) {
        correctGuesses++;
      }
    } catch {
      // Default to chance level if error
      correctGuesses += 0.5;
    }
  }

  const accuracy = correctGuesses / testCaptions.length;
  // If judge is guessing near 0.5, fidelity is high. fidelity = 1 - 2*|accuracy - 0.5|
  const fidelity = Math.max(0, Math.min(1.0, 1 - 2 * Math.abs(accuracy - 0.5)));
  return Number(fidelity.toFixed(2));
}
