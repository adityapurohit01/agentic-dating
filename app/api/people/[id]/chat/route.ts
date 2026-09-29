import { NextResponse } from "next/server";
import { getSqlite } from "@/server/db";
import { llm } from "@/server/llm";
import { Persona } from "@/server/reader/schemas";
import { buildSystemPrompt } from "@/server/dating/agent";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { message, history } = await req.json();

  const sqlite = getSqlite();
  const person = sqlite.prepare("SELECT * FROM people WHERE id = ?").get(id) as any;
  if (!person) {
    return NextResponse.json({ error: "Person not found" }, { status: 404 });
  }

  const personaRow = sqlite.prepare("SELECT persona_json FROM personas WHERE person_id = ?").get(id) as any;
  const voiceRow = sqlite.prepare("SELECT * FROM voice WHERE person_id = ?").get(id) as any;

  const persona: Persona = personaRow ? JSON.parse(personaRow.persona_json) : {
    identity: { name: person.name || "Candidate", headline: "", location: "", current_role: "", company: "", education: [] },
    summary: "Curious professional.",
    needs: [{ need: "Mutual respect", kind: "inferred", weight: 5, confidence: 0.9, evidence: [] }],
    hobbies: [], interests: [], values: [],
    lifestyle: { rhythm: "", social_energy: "", travel: "", fitness: "", food: "", other: "" },
    ambition: { level: "Medium", direction: "", evidence: [] },
    humor: { style: "Warm", evidence: [] },
    communication_style: { summary: "Direct", evidence: [] },
    relationship_signals: [], friction_points: [], green_flags: [], unknowns: [],
  };

  const voiceNotes = voiceRow?.style_notes || "Conversational, natural, and expressive.";
  const exemplars = voiceRow?.exemplars_json ? JSON.parse(voiceRow.exemplars_json) : [];
  const metrics = voiceRow?.metrics_json ? JSON.parse(voiceRow.metrics_json) : {};

  const system = buildSystemPrompt(
    {
      persona,
      voiceNotes,
      exemplars,
      metrics,
      maxWords: 80,
    },
    "User",
    false
  );

  const messages: any[] = (history || []).map((h: any) => ({
    role: h.role === "assistant" ? "assistant" : "user",
    content: h.content,
  }));
  messages.push({ role: "user", content: message });

  try {
    const reply = await llm.text({
      system,
      messages,
      purpose: "voice_chat_demo",
      personId: id,
    });

    return NextResponse.json({ reply });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
