import { Fact, Persona, PersonaSchema } from "./schemas";
import { sanitizePersona } from "./safety";
import { llm } from "../llm";
import { getRealPersona } from "./real-personas";

export async function generatePersona(
  personId: string,
  personName: string,
  facts: Fact[]
): Promise<Persona> {
  const realPersona = getRealPersona(personId, personName);
  if (realPersona) {
    return sanitizePersona(realPersona);
  }

  const systemPrompt = `You analyze two public sources about one person to help a compatibility system. Only state what the sources support. Every claim must cite source_ref values from the provided facts. Mark each need as stated (the person said it) or inferred (you concluded it). Do not infer or mention sexual orientation, religion, health, ethnicity, political views, or immigration status, even if hinted. Do not guess relationship goals with high confidence; two profiles rarely show them. List what you could not determine under unknowns. Be specific: avoid generic traits like 'passionate' or 'driven' unless the sources show concrete evidence.`;

  const factsText = facts
    .map((f) => `[${f.source_ref}] (${f.kind}): ${f.text}`)
    .join("\n");

  const prompt = `Candidate Name: ${personName}

Extracted Facts with Source References:
${factsText}

Generate a comprehensive Persona JSON conforming to the requested schema. Every element in needs, hobbies, interests, values, ambition, humor, communication_style, relationship_signals, friction_points, and green_flags MUST cite valid source_ref values from the facts above.`;

  try {
    const rawPersona = await llm.object({
      schema: PersonaSchema,
      system: systemPrompt,
      prompt,
      purpose: "generate_persona",
      personId,
    });

    return sanitizePersona(rawPersona);
  } catch (err: any) {
    // Attempt one repair call as mandated by the rules
    const repairPrompt = `Your previous output did not match the required JSON schema. Error: ${err.message}.
Please repair and return strictly valid JSON matching the PersonaSchema for Candidate ${personName} based on these facts:
${factsText}`;

    const repaired = await llm.object({
      schema: PersonaSchema,
      system: systemPrompt,
      prompt: repairPrompt,
      purpose: "repair_persona",
      personId,
    });

    return sanitizePersona(repaired);
  }
}
