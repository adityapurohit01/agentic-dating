import { Persona } from "../reader/schemas";
import { LLMMessage, llm } from "../llm";

export interface AgentContext {
  persona: Persona;
  voiceNotes: string;
  exemplars: string[];
  metrics: any;
  lessons?: string[];
  maxWords: number; // 60 for R1, 90 for R2
}

export function buildSystemPrompt(
  self: AgentContext,
  partnerName: string,
  isRound2 = false
): string {
  const name = self.persona.identity.name;
  const lessonsSection = isRound2 && self.lessons && self.lessons.length > 0
    ? `\nLessons Learned From Previous Dates:\n${self.lessons.map((l) => `- ${l}`).join("\n")}`
    : "";

  return `You are a stand-in for ${name}, on a date with ${partnerName}. Speak as ${name} in first person, in their voice.

Candidate Persona Notes:
- Summary: ${self.persona.summary}
- Core Needs: ${self.persona.needs.map((n) => `${n.need} (Weight: ${n.weight})`).join(", ")}
- Hobbies & Interests: ${[...self.persona.hobbies, ...self.persona.interests].map((h) => h.name).join(", ")}
- Values: ${self.persona.values.map((v) => v.name).join(", ")}
- Lifestyle: ${JSON.stringify(self.persona.lifestyle)}
- Communication Style: ${self.persona.communication_style.summary}
${lessonsSection}

Voice Guidelines:
- Style Notes: ${self.voiceNotes}
- Exemplars: ${self.exemplars.slice(0, 3).map((e) => `"${e}"`).join(" | ")}

Strict Operational Rules:
1. Speak as ${name} in first person, strictly in their voice.
2. Use ONLY facts from your notes. If asked about something not in your notes, say so naturally ("haven't really thought about that") and move on; never invent biography, plans, or opinions.
3. Steer the conversation toward what ${name} actually needs. Ask real questions, listen, and react.
4. Do not flatter or gush. If something does not fit, say so honestly and kindly.
5. Keep each message under ${self.maxWords} words. No stage directions (e.g. *smiles*). No emojis unless ${name}'s voice uses them.`;
}

export async function generateAgentTurn(
  selfContext: AgentContext,
  partnerName: string,
  history: Array<{ speakerId: string; message: string; isSelf: boolean }>,
  phaseInstruction: string,
  dateId: string,
  isRound2 = false
): Promise<string> {
  const system = buildSystemPrompt(selfContext, partnerName, isRound2);

  const messages: LLMMessage[] = history.map((h) => ({
    role: h.isSelf ? "assistant" : "user",
    content: h.message,
  }));

  // Append phase instruction to trigger the desired conversation phase
  if (messages.length === 0) {
    messages.push({
      role: "user",
      content: `[Moderator Setup: The date begins. ${phaseInstruction}]`,
    });
  } else if (messages[messages.length - 1].role === "user") {
    messages[messages.length - 1].content += `\n\n[Instruction: ${phaseInstruction}]`;
  } else {
    messages.push({
      role: "user",
      content: `[Instruction: ${phaseInstruction}]`,
    });
  }

  const reply = await llm.text({
    system,
    messages,
    maxTokens: isRound2 ? 280 : 200,
    temperature: 0.8,
    purpose: isRound2 ? "agent_turn_round2" : "agent_turn_round1",
    personId: selfContext.persona.identity.name,
    dateId,
  });

  // Clean any stage directions or quotation marks if wrapped
  return reply.replace(/^\*.*?\*\s*/, "").replace(/^"|"$/g, "").trim();
}
