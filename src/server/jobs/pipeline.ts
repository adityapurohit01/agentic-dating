import { getSqlite } from "../db";
import {
  handleCollect,
  handleRead,
  handleRound1Dates,
  handleReflection,
  handleRound2Dates,
} from "./handlers";
import { calculateAllRankings } from "../ranking/rank";
import { emitEvent } from "../events";

export interface PipelineStatus {
  currentStage: "idle" | "collect" | "read" | "round1" | "reflect" | "round2" | "rank" | "completed";
  peopleCount: number;
  readyCount: number;
  round1Count: number;
  round1Total: number;
  round2Count: number;
  round2Total: number;
  rankedCount: number;
  totalCostUsd: number;
  isMock: boolean;
}

declare global {
  var _pipelineRunning: boolean | undefined;
  var _pipelineStage: string | undefined;
}

export function getPipelineStatus(): PipelineStatus {
  const sqlite = getSqlite();

  const peopleCount = (sqlite.prepare("SELECT COUNT(*) as c FROM people").get() as any)?.c || 0;
  const readyCount = (sqlite.prepare("SELECT COUNT(*) as c FROM people WHERE status = 'ready'").get() as any)?.c || 0;

  const round1Total = (sqlite.prepare("SELECT COUNT(*) as c FROM dates WHERE round = 1").get() as any)?.c || 0;
  const round1Count = (sqlite.prepare("SELECT COUNT(*) as c FROM dates WHERE round = 1 AND status = 'done'").get() as any)?.c || 0;

  const round2Total = (sqlite.prepare("SELECT COUNT(*) as c FROM dates WHERE round = 2").get() as any)?.c || 0;
  const round2Count = (sqlite.prepare("SELECT COUNT(*) as c FROM dates WHERE round = 2 AND status = 'done'").get() as any)?.c || 0;

  const rankedCount = (sqlite.prepare("SELECT COUNT(DISTINCT person_id) as c FROM rankings").get() as any)?.c || 0;

  const costRow = sqlite.prepare("SELECT SUM(cost_usd) as total FROM llm_calls").get() as any;
  const totalCostUsd = Number((costRow?.total || 0).toFixed(4));

  const isMock = (process.env.LLM_PROVIDER || "mock") === "mock" || !process.env.GEMINI_API_KEY;

  return {
    currentStage: (global._pipelineStage as any) || (rankedCount > 0 ? "completed" : "idle"),
    peopleCount,
    readyCount,
    round1Count,
    round1Total,
    round2Count,
    round2Total,
    rankedCount,
    totalCostUsd,
    isMock,
  };
}

export async function runFullPipeline(fromStage: "collect" | "read" | "round1" | "reflect" | "round2" | "rank" = "collect") {
  if (global._pipelineRunning) {
    return { success: false, message: "Pipeline already running" };
  }

  global._pipelineRunning = true;
  const sqlite = getSqlite();

  try {
    const stages = ["collect", "read", "round1", "reflect", "round2", "rank"];
    const startIndex = stages.indexOf(fromStage);

    // Stage 1: Collect
    if (startIndex <= 0) {
      global._pipelineStage = "collect";
      emitEvent("pipeline:stage", { stage: "collect" });
      const pendingPeople = sqlite.prepare("SELECT id FROM people WHERE status = 'pending'").all() as { id: string }[];
      for (const p of pendingPeople) {
        await handleCollect(p.id);
      }
    }

    // Stage 2: Read
    if (startIndex <= 1) {
      global._pipelineStage = "read";
      emitEvent("pipeline:stage", { stage: "read" });
      const unreadPeople = sqlite.prepare("SELECT id FROM people WHERE status = 'reading'").all() as { id: string }[];
      for (const p of unreadPeople) {
        await handleRead(p.id);
      }
    }

    // Stage 3: Round 1 Speed Dates
    if (startIndex <= 2) {
      global._pipelineStage = "round1";
      emitEvent("pipeline:stage", { stage: "round1" });
      await handleRound1Dates();
    }

    // Stage 4: Reflection
    if (startIndex <= 3) {
      global._pipelineStage = "reflect";
      emitEvent("pipeline:stage", { stage: "reflect" });
      await handleReflection();
    }

    // Stage 5: Round 2 Deep Dates
    if (startIndex <= 4) {
      global._pipelineStage = "round2";
      emitEvent("pipeline:stage", { stage: "round2" });
      await handleRound2Dates();
    }

    // Stage 6: Ranking
    if (startIndex <= 5) {
      global._pipelineStage = "rank";
      emitEvent("pipeline:stage", { stage: "rank" });
      await calculateAllRankings();
    }

    global._pipelineStage = "completed";
    emitEvent("pipeline:stage", { stage: "completed" });
    return { success: true };
  } catch (err: any) {
    global._pipelineStage = "idle";
    return { success: false, error: err.message };
  } finally {
    global._pipelineRunning = false;
  }
}
