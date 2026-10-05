import { z } from "zod";
import { getSqlite } from "../db";
import { recallMemory, addMemoryItem } from "../memory/store";
import { runFullPipeline } from "../jobs/pipeline";

export const ToolRegistry = {
  get_profile: {
    description: "Fetch complete structured persona and facts for a candidate by ID or name",
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: false,
      title: "Get candidate profile",
    },
    schema: z.object({
      person_id: z.string().describe("Candidate ID or name"),
    }),
    handler: async (args: { person_id: string }) => {
      const sqlite = getSqlite();
      const person = sqlite.prepare("SELECT * FROM people WHERE id = ? OR name LIKE ?").get(args.person_id, `%${args.person_id}%`) as any;
      if (!person) return { error: "Person not found" };

      const personaRow = sqlite.prepare("SELECT * FROM personas WHERE person_id = ?").get(person.id) as any;
      const voiceRow = sqlite.prepare("SELECT * FROM voice WHERE person_id = ?").get(person.id) as any;

      return {
        id: person.id,
        name: person.name,
        headline: person.headline,
        persona: personaRow ? JSON.parse(personaRow.persona_json) : null,
        voice: voiceRow ? JSON.parse(voiceRow.metrics_json) : null,
      };
    },
  },

  recall_memory: {
    description: "Search candidate's memory store using BM25 FTS5 search",
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: false,
      title: "Recall candidate memory",
    },
    schema: z.object({
      person_id: z.string(),
      query: z.string().describe("Keyword search term"),
      k: z.number().optional().default(5),
    }),
    handler: async (args: { person_id: string; query: string; k?: number }) => {
      return recallMemory(args.person_id, args.query, args.k || 5);
    },
  },

  write_memory: {
    description: "Store an episodic lesson or fact in the candidate's memory",
    annotations: {
      readOnlyHint: false,
      destructiveHint: false,
      idempotentHint: false,
      openWorldHint: false,
      title: "Write candidate memory",
    },
    schema: z.object({
      person_id: z.string(),
      content: z.string(),
      kind: z.enum(["semantic", "episodic", "lesson"]).default("lesson"),
      source_ref: z.string().optional(),
    }),
    handler: async (args: { person_id: string; content: string; kind?: any; source_ref?: string }) => {
      const id = addMemoryItem({
        personId: args.person_id,
        content: args.content,
        kind: args.kind || "lesson",
        sourceRef: args.source_ref,
      });
      return { success: true, memory_id: id };
    },
  },

  list_rankings: {
    description: "Retrieve compatibility rankings for a given candidate",
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: false,
      title: "List compatibility rankings",
    },
    schema: z.object({
      person_id: z.string(),
    }),
    handler: async (args: { person_id: string }) => {
      const sqlite = getSqlite();
      const rows = sqlite.prepare(`
        SELECT r.rank, r.score, r.r1_rank, r.r2_rank, r.rationale_json, p.name as target_name, p.headline as target_headline
        FROM rankings r
        JOIN people p ON p.id = r.target_id
        WHERE r.person_id = ?
        ORDER BY r.rank ASC
      `).all(args.person_id) as any[];

      return rows.map((r) => ({
        rank: r.rank,
        target_name: r.target_name,
        target_headline: r.target_headline,
        score: r.score,
        r1_rank: r.r1_rank,
        r2_rank: r.r2_rank,
        rationale: JSON.parse(r.rationale_json),
      }));
    },
  },

  get_date: {
    description: "Get full date transcript, reviews, and judge analysis by date ID",
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: false,
      title: "Get date analysis",
    },
    schema: z.object({
      date_id: z.string(),
    }),
    handler: async (args: { date_id: string }) => {
      const sqlite = getSqlite();
      const date = sqlite.prepare("SELECT * FROM dates WHERE id = ?").get(args.date_id) as any;
      if (!date) return { error: "Date not found" };

      const turns = sqlite.prepare("SELECT turn_number, speaker_id, message FROM date_turns WHERE date_id = ? ORDER BY turn_number ASC").all(args.date_id);
      const reviews = sqlite.prepare("SELECT reviewer_id, review_type, review_json FROM date_reviews WHERE date_id = ?").all(args.date_id) as any[];
      const score = sqlite.prepare("SELECT * FROM scores WHERE date_id = ?").get(args.date_id);

      return {
        date,
        turns,
        reviews: reviews.map((r) => ({ type: r.review_type, data: JSON.parse(r.review_json) })),
        score,
      };
    },
  },

  start_pipeline: {
    description: "Trigger the autonomous agentic dating pipeline",
    annotations: {
      readOnlyHint: false,
      destructiveHint: false,
      idempotentHint: false,
      openWorldHint: true,
      title: "Start dating pipeline",
    },
    schema: z.object({
      from_stage: z.enum(["collect", "read", "round1", "reflect", "round2", "rank"]).optional().default("collect"),
    }),
    handler: async (args: { from_stage?: any }) => {
      return runFullPipeline(args.from_stage || "collect");
    },
  },
};
