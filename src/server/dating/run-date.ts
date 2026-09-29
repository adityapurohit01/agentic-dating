import { getSqlite } from "../db";
import { moderateDateScene } from "./moderator";
import { generateAgentTurn, AgentContext } from "./agent";
import { generateSideReview } from "./review";
import { evaluateJudgeReview } from "./judge";
import { checkGrounding } from "./factcheck";
import { computeScores } from "./scorer";
import { recallMemory } from "../memory/store";
import { emitEvent } from "../events";
import { Persona } from "../reader/schemas";
import crypto from "crypto";

import { getRealPersona } from "../reader/real-personas";

export async function executeDate(dateId: string): Promise<boolean> {
  const sqlite = getSqlite();

  // 1. Fetch date record
  const dateRecord = sqlite.prepare("SELECT * FROM dates WHERE id = ?").get(dateId) as any;
  if (!dateRecord) return false;
  if (dateRecord.status === "done") return true; // Idempotent skip

  // Mark in_progress
  sqlite.prepare("UPDATE dates SET status = 'in_progress', started_at = ? WHERE id = ?").run(Date.now(), dateId);
  emitEvent("date:started", { dateId, round: dateRecord.round, aId: dateRecord.a_id, bId: dateRecord.b_id });

  // 2. Fetch both candidates' persona, voice, and lessons
  const getCandidateData = (personId: string) => {
    const person = sqlite.prepare("SELECT * FROM people WHERE id = ?").get(personId) as any;
    const personaRow = sqlite.prepare("SELECT * FROM personas WHERE person_id = ?").get(personId) as any;
    const voiceRow = sqlite.prepare("SELECT * FROM voice WHERE person_id = ?").get(personId) as any;
    const lessonRows = sqlite.prepare("SELECT content FROM memory_items WHERE person_id = ? AND kind = 'lesson'").all(personId) as any[];

    const realP = getRealPersona(personId, person?.name);
    const persona: Persona = realP || (personaRow ? JSON.parse(personaRow.persona_json) : {
      identity: { name: person?.name || "Candidate", headline: "", location: "", current_role: "", company: "", education: [] },
      summary: "Friendly professional seeking authentic connection.",
      needs: [{ need: "Mutual respect", kind: "inferred", weight: 5, confidence: 0.9, evidence: [] }],
      hobbies: [], interests: [], values: [],
      lifestyle: { rhythm: "", social_energy: "", travel: "", fitness: "", food: "", other: "" },
      ambition: { level: "Medium", direction: "", evidence: [] },
      humor: { style: "Warm", evidence: [] },
      communication_style: { summary: "Direct", evidence: [] },
      relationship_signals: [], friction_points: [], green_flags: [], unknowns: [],
    });

    const voiceNotes = voiceRow?.style_notes || "Conversational and warm.";
    const exemplars = voiceRow?.exemplars_json ? JSON.parse(voiceRow.exemplars_json) : [];
    const metrics = voiceRow?.metrics_json ? JSON.parse(voiceRow.metrics_json) : {};
    const lessons = lessonRows.map((r) => r.content);

    return { person, persona, voiceNotes, exemplars, metrics, lessons };
  };

  const candA = getCandidateData(dateRecord.a_id);
  const candB = getCandidateData(dateRecord.b_id);

  // 3. Moderate Scene if not set
  let scene = dateRecord.scene_json ? JSON.parse(dateRecord.scene_json) : null;
  if (!scene) {
    scene = await moderateDateScene(dateId, candA.persona, candB.persona);
    sqlite.prepare("UPDATE dates SET scene_json = ? WHERE id = ?").run(JSON.stringify(scene), dateId);
  }

  const isRound2 = dateRecord.round === 2;
  const totalTurns = isRound2 ? 14 : 6;
  const maxWords = isRound2 ? 90 : 60;

  // ── Round 2: inject friction topic + lessons into agent contexts ──
  const contextA: AgentContext = {
    persona: candA.persona,
    voiceNotes: candA.voiceNotes,
    exemplars: candA.exemplars,
    metrics: candA.metrics,
    lessons: candA.lessons,
    maxWords,
  };

  const contextB: AgentContext = {
    persona: candB.persona,
    voiceNotes: candB.voiceNotes,
    exemplars: candB.exemplars,
    metrics: candB.metrics,
    lessons: candB.lessons,
    maxWords,
  };

  // 4. Conversation loop
  const history: Array<{ turnNumber: number; speakerId: string; speakerName: string; message: string }> = [];

  for (let turn = 1; turn <= totalTurns; turn++) {
    const isSpeakerA = turn % 2 !== 0;
    const currentSpeaker = isSpeakerA ? candA : candB;
    const partner = isSpeakerA ? candB : candA;
    const currentContext = isSpeakerA ? contextA : contextB;

    // Define phase instruction
    let phaseInstruction = "";
    if (!isRound2) {
      // Round 1 speed date: 6 turns
      if (turn <= 2) {
        phaseInstruction = `Phase: Open. The setting is: ${scene.scene}. Break the ice discussing ${scene.opening_topic}.`;
      } else if (turn <= 4) {
        const topNeed = currentContext.persona.needs[0]?.need || "shared passions";
        phaseInstruction = `Phase: Probe. Ask one genuine probing question tied to your core priority: "${topNeed}".`;
      } else {
        phaseInstruction = `Phase: Friction. Address the friction topic: "${scene.friction_topic}". Be polite but stay true to yourself.`;
      }
    } else {
      // Round 2 deep date: 14 turns
      // Inject the moderator's friction topic explicitly into every R2 phase
      if (turn <= 2) {
        phaseInstruction = `Phase: Reconnect. Welcome back. Revisit topics from your first date at ${scene.scene}. The moderator's friction topic for this date is: "${scene.friction_topic}".`;
      } else if (turn <= 7) {
        phaseInstruction = `Phase: Deep Probing. Dive into lifestyle values and mutual expectations. Keep in mind the moderator's friction area: "${scene.friction_topic}".`;
      } else if (turn <= 12) {
        phaseInstruction = `Phase: Friction & Realism. Navigate the moderator's friction topic directly: "${scene.friction_topic}". Test if your long-term goals align. Be honest about concerns.`;
      } else {
        phaseInstruction = `Phase: Closing. Reflect on how this conversation felt — especially around "${scene.friction_topic}" — and express an honest impression.`;
      }
    }

    // Round 2: Agents recall memory (lessons from reflect + memory store)
    if (isRound2 && turn > 1) {
      // Recall memories relevant to the friction topic
      const recalled = recallMemory(currentSpeaker.person.id, scene.friction_topic, 3);
      if (recalled.length > 0) {
        phaseInstruction += `\n\nInternal Memory Recall (from your previous dates and reflections):\n${recalled.map((r) => `- [${r.kind}] ${r.content}`).join("\n")}`;
      }

      // Inject lessons explicitly
      if (currentContext.lessons && currentContext.lessons.length > 0) {
        phaseInstruction += `\n\nLessons from your dating reflections:\n${currentContext.lessons.map((l) => `- ${l}`).join("\n")}`;
      }
    }

    const conversationHistory = history.map((h) => ({
      speakerId: h.speakerId,
      message: h.message,
      isSelf: h.speakerId === currentSpeaker.person.id,
    }));

    const message = await generateAgentTurn(
      currentContext,
      partner.persona.identity.name,
      conversationHistory,
      phaseInstruction,
      dateId,
      isRound2
    );

    // Save turn immediately
    const turnId = crypto.randomUUID();
    const now = Date.now();
    sqlite.prepare(`
      INSERT INTO date_turns (id, date_id, turn_number, speaker_id, role, message, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      turnId,
      dateId,
      turn,
      currentSpeaker.person.id,
      isSpeakerA ? "user" : "assistant",
      message,
      now
    );

    history.push({
      turnNumber: turn,
      speakerId: currentSpeaker.person.id,
      speakerName: currentSpeaker.persona.identity.name,
      message,
    });

    // Stream SSE event for live viewer
    emitEvent("date:turn", {
      dateId,
      turnNumber: turn,
      speakerId: currentSpeaker.person.id,
      speakerName: currentSpeaker.persona.identity.name,
      message,
    });
  }

  // 5. Post-Date Reviews — generated FROM the transcript
  const reviewA = await generateSideReview(dateId, candA.persona, candB.persona, history, dateRecord.round);
  const reviewB = await generateSideReview(dateId, candB.persona, candA.persona, history, dateRecord.round);
  const judgeReview = await evaluateJudgeReview(dateId, candA.persona, candB.persona, history);
  const factCheck = await checkGrounding(dateId, candA.persona, candB.persona, history);

  // Store reviews in date_reviews
  sqlite.prepare(`
    INSERT INTO date_reviews (id, date_id, reviewer_id, review_type, review_json, created_at)
    VALUES (?, ?, ?, 'side', ?, ?)
  `).run(crypto.randomUUID(), dateId, candA.person.id, JSON.stringify(reviewA), Date.now());

  sqlite.prepare(`
    INSERT INTO date_reviews (id, date_id, reviewer_id, review_type, review_json, created_at)
    VALUES (?, ?, ?, 'side', ?, ?)
  `).run(crypto.randomUUID(), dateId, candB.person.id, JSON.stringify(reviewB), Date.now());

  sqlite.prepare(`
    INSERT INTO date_reviews (id, date_id, reviewer_id, review_type, review_json, created_at)
    VALUES (?, ?, 'judge', 'judge', ?, ?)
  `).run(crypto.randomUUID(), dateId, JSON.stringify({ judge: judgeReview, factCheck }), Date.now());

  // 6. Calculate Blended Scores using PURE scorer
  const scores = computeScores(reviewA, reviewB, judgeReview);

  sqlite.prepare(`
    INSERT INTO scores (id, date_id, a_to_b, b_to_a, mutual, created_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(
    crypto.randomUUID(),
    dateId,
    scores.scoreAToB,
    scores.scoreBToA,
    scores.mutualScore,
    Date.now()
  );

  // Mark done
  sqlite.prepare("UPDATE dates SET status = 'done', completed_at = ? WHERE id = ?").run(Date.now(), dateId);

  emitEvent("date:completed", {
    dateId,
    round: dateRecord.round,
    scoreAToB: scores.scoreAToB,
    scoreBToA: scores.scoreBToA,
    mutual: scores.mutualScore,
  });

  return true;
}
