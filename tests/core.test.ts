import { describe, it, expect } from "vitest";
import { getSqlite } from "../src/server/db";
import { MockLLM } from "../src/server/llm/mock";
import { SceneSchema } from "../src/server/dating/moderator";
import { enqueueJob, dequeueNextJob, completeJob, resetStalledJobs } from "../src/server/jobs/queue";
import { cleanUrl, extractInstagramHandle, normalizeLinkedIn, normalizeInstagram } from "../src/server/connectors/normalize";
import { checkIdentityMatch } from "../src/server/connectors/identity";
import { sanitizeText } from "../src/server/reader/safety";
import { calculateVoiceMetrics } from "../src/server/voice/metrics";
import { addMemoryItem, recallMemory } from "../src/server/memory/store";
import { ToolRegistry } from "../src/server/tools/registry";

describe("Mock LLM Provider", () => {
  it("satisfies structured object generation with schema validation", async () => {
    const mock = new MockLLM();
    const result = await mock.object({
      schema: SceneSchema,
      prompt: "Two candidates are meeting.",
      purpose: "test_scene",
    });

    expect(result.scene).toBeDefined();
    expect(result.opening_topic).toBeDefined();
    expect(result.friction_topic).toBeDefined();
  });

  it("generates plausible text dialogues", async () => {
    const mock = new MockLLM();
    const text = await mock.text({
      messages: [{ role: "user", content: "Tell me about your favorite hikes" }],
      purpose: "test_dialogue",
    });
    expect(text.length).toBeGreaterThan(10);
  });
});

describe("Table-backed Job Queue", () => {
  it("enqueues and atomically dequeues jobs", () => {
    const id = enqueueJob("test_task", { testValue: 42 });
    expect(id).toBeDefined();

    const job = dequeueNextJob();
    expect(job).not.toBeNull();
    if (job) {
      expect(job.type).toBe("test_task");
      expect(job.payload.testValue).toBe(42);
      completeJob(job.id);
    }
  });

  it("resets stalled jobs after restart", () => {
    resetStalledJobs();
  });
});

describe("Connectors & Normalizers", () => {
  it("cleans URLs and strips tracking parameters", () => {
    const dirty = "https://www.linkedin.com/in/alex-smith/?utm_source=share&utm_medium=member_desktop";
    const cleaned = cleanUrl(dirty);
    expect(cleaned).toBe("https://www.linkedin.com/in/alex-smith");
  });

  it("extracts clean Instagram handle", () => {
    expect(extractInstagramHandle("https://instagram.com/alexsmith")).toBe("alexsmith");
    expect(extractInstagramHandle("@alexsmith")).toBe("alexsmith");
  });

  it("verifies identity when Instagram bio references LinkedIn", () => {
    const li = { name: "Alex Smith", company: "NextGen" };
    const ig = { name: "Alex Smith", bio: "Engineering lead at NextGen | linkedin.com/in/alexsmith" };
    const check = checkIdentityMatch(li, ig, "https://linkedin.com/in/alexsmith");
    expect(check.matchScore).toBeGreaterThanOrEqual(0.8);
  });
});

describe("Reader & Safety Guardrails", () => {
  it("strips protected traits terms from strings", () => {
    const raw = "Candidate is a christian and a democrat living in Seattle.";
    const cleaned = sanitizeText(raw);
    expect(cleaned).not.toContain("christian");
    expect(cleaned).not.toContain("democrat");
  });
});

describe("Voice Metrics", () => {
  it("calculates sentence length, emoji frequency and post lengths", () => {
    const texts = [
      "Loving the sunrise run this morning! Felt truly energizing.",
      "Dialing in my espresso grind. Consistency is key. #coffee",
    ];
    const metrics = calculateVoiceMetrics(texts);
    expect(metrics.avgSentenceLength).toBeGreaterThan(0);
    expect(metrics.hashtagRate).toBeGreaterThanOrEqual(0.5);
  });
});

describe("FTS5 Memory Store", () => {
  it("stores and recalls memory items", () => {
    const sqlite = getSqlite();
    let person = sqlite.prepare("SELECT id FROM people LIMIT 1").get() as any;

    if (!person) {
      sqlite.prepare(`
        INSERT INTO people (id, linkedin_url, instagram_url, name, status, created_at, updated_at)
        VALUES ('test_p1', 'https://linkedin.com/in/test', 'https://instagram.com/test', 'Test Person', 'ready', 0, 0)
      `).run();
      person = { id: 'test_p1' };
    }

    addMemoryItem({
      personId: person.id,
      kind: "lesson",
      content: "Learned that partner must enjoy backcountry mountaineering trips.",
    });

    const results = recallMemory(person.id, "mountaineering", 5);
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].content).toContain("mountaineering");
  });
});


describe("MCP tool registry", () => {
  it("declares all six tools with complete MCP behavior annotations", () => {
    const tools = {
      get_profile: ToolRegistry.get_profile,
      recall_memory: ToolRegistry.recall_memory,
      write_memory: ToolRegistry.write_memory,
      list_rankings: ToolRegistry.list_rankings,
      get_date: ToolRegistry.get_date,
      start_pipeline: ToolRegistry.start_pipeline,
    };

    expect(Object.keys(tools)).toHaveLength(6);

    for (const tool of Object.values(tools)) {
      expect(tool.description).toBeTruthy();
      expect(tool.annotations).toEqual(
        expect.objectContaining({
          readOnlyHint: expect.any(Boolean),
          destructiveHint: expect.any(Boolean),
          idempotentHint: expect.any(Boolean),
          openWorldHint: expect.any(Boolean),
        })
      );
    }

    expect(tools.get_profile.annotations.readOnlyHint).toBe(true);
    expect(tools.recall_memory.annotations.readOnlyHint).toBe(true);
    expect(tools.write_memory.annotations.readOnlyHint).toBe(false);
    expect(tools.list_rankings.annotations.readOnlyHint).toBe(true);
    expect(tools.get_date.annotations.readOnlyHint).toBe(true);
    expect(tools.start_pipeline.annotations.readOnlyHint).toBe(false);
    expect(tools.start_pipeline.annotations.openWorldHint).toBe(true);
  });
});
