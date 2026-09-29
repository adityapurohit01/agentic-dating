import { z } from "zod";
import { llm } from "../llm";
import { Persona } from "../reader/schemas";

export const FactCheckSchema = z.object({
  unsupported_claims: z.array(
    z.object({
      turn: z.number(),
      claim: z.string(),
      speaker: z.string(),
    })
  ),
});
export type FactCheckResult = z.infer<typeof FactCheckSchema>;

export async function checkGrounding(
  dateId: string,
  personA: Persona,
  personB: Persona,
  transcript: Array<{ turnNumber: number; speakerName: string; message: string }>
): Promise<FactCheckResult> {
  const prompt = `Fact-Check Verification:
Candidate A (${personA.identity.name}) Verified Notes:
${JSON.stringify({
  hobbies: personA.hobbies.map((h) => h.name),
  interests: personA.interests.map((i) => i.name),
  company: personA.identity.company,
  role: personA.identity.current_role,
})}

Candidate B (${personB.identity.name}) Verified Notes:
${JSON.stringify({
  hobbies: personB.hobbies.map((h) => h.name),
  interests: personB.interests.map((i) => i.name),
  company: personB.identity.company,
  role: personB.identity.current_role,
})}

Transcript:
${transcript.map((t) => `Turn ${t.turnNumber} [${t.speakerName}]: ${t.message}`).join("\n")}

Identify any specific factual biographical or activity claims made by either agent that are completely unsupported by their persona notes. Do not penalize natural conversational filler or general opinions. Return JSON matching FactCheckSchema.`;

  try {
    return await llm.object({
      schema: FactCheckSchema,
      prompt,
      purpose: "factcheck_turns",
      dateId,
    });
  } catch {
    return {
      unsupported_claims: [],
    };
  }
}
