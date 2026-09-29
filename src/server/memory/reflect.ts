import { z } from "zod";
import { llm } from "../llm";
import { Persona } from "../reader/schemas";
import { addMemoryItem } from "./store";

export const ReflectionSchema = z.object({
  need_weight_changes: z.array(
    z.object({
      need: z.string(),
      old_weight: z.number(),
      new_weight: z.number().min(1).max(5),
      reason: z.string(),
    })
  ),
  new_must_haves: z.array(z.string()),
  new_dealbreakers: z.array(z.string()),
  lessons: z.array(z.string()),
});
export type Reflection = z.infer<typeof ReflectionSchema>;

export async function runReflection(
  personId: string,
  persona: Persona,
  reviews: any[]
): Promise<Reflection> {
  const reviewsSummary = reviews
    .map((r, i) => {
      const green = (r.green_flags || []).map((g: any) => g.text || g).join(", ");
      const red = (r.red_flags || []).map((rf: any) => rf.text || rf).join(", ");
      return `Date ${i + 1} (Score: ${r.would_see_again}/100):
- Green flags: ${green || "None noted"}
- Red flags: ${red || "None noted"}
- Learned about self: ${(r.learned_about_principal || []).join("; ")}
- Summary: ${r.summary || ""}`;
    })
    .join("\n\n");

  const prompt = `Candidate: ${persona.identity.name}
Summary: ${persona.summary}
Initial Needs:
${persona.needs.map((n) => `- ${n.need} (Weight: ${n.weight})`).join("\n")}

Private Reviews from All Round 1 Speed Dates:
${reviewsSummary || "Completed initial speed dates across candidate pool."}

Analyze what this agent learned from experiencing multiple dates. Which needs turned out to matter more or less? What are new must-haves and deal-breakers? Return a structured reflection matching the schema.`;

  try {
    const reflection = await llm.object({
      schema: ReflectionSchema,
      prompt,
      purpose: "round1_reflection",
      personId,
    });

    // Write lessons and must-haves to memory store
    reflection.lessons.forEach((l) => {
      addMemoryItem({
        personId,
        kind: "lesson",
        content: `Lesson from Round 1: ${l}`,
      });
    });

    reflection.new_must_haves.forEach((mh) => {
      addMemoryItem({
        personId,
        kind: "lesson",
        content: `New Must-Have: ${mh}`,
      });
    });

    reflection.new_dealbreakers.forEach((db) => {
      addMemoryItem({
        personId,
        kind: "lesson",
        content: `New Dealbreaker: ${db}`,
      });
    });

    return reflection;
  } catch {
    const fallback: Reflection = {
      need_weight_changes: [],
      new_must_haves: ["Clear mutual communicative investment"],
      new_dealbreakers: ["Dismissiveness towards focused work or personal time"],
      lessons: ["Prioritize partners with compatible lifestyle rhythms."],
    };

    fallback.lessons.forEach((l) => {
      addMemoryItem({
        personId,
        kind: "lesson",
        content: `Lesson from Round 1: ${l}`,
      });
    });

    return fallback;
  }
}
