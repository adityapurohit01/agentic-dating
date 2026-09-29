import { NextResponse } from "next/server";
import { getSqlite } from "@/server/db";

export async function GET() {
  const sqlite = getSqlite();

  const totalRow = sqlite.prepare(`
    SELECT COUNT(*) as calls_count,
           SUM(tokens_in) as total_tokens_in,
           SUM(tokens_out) as total_tokens_out,
           SUM(cost_usd) as total_cost_usd,
           SUM(duration_ms) as total_duration_ms
    FROM llm_calls
  `).get() as any;

  const byModel = sqlite.prepare(`
    SELECT model,
           COUNT(*) as calls,
           SUM(tokens_in) as tokens_in,
           SUM(tokens_out) as tokens_out,
           SUM(cost_usd) as cost_usd
    FROM llm_calls
    GROUP BY model
  `).all();

  const recentCalls = sqlite.prepare(`
    SELECT purpose, model, tokens_in, tokens_out, cost_usd, estimated, duration_ms, created_at
    FROM llm_calls
    ORDER BY created_at DESC
    LIMIT 25
  `).all();

  return NextResponse.json({
    totalCostUsd: Number((totalRow?.total_cost_usd || 0).toFixed(4)),
    totalTokensIn: totalRow?.total_tokens_in || 0,
    totalTokensOut: totalRow?.total_tokens_out || 0,
    callsCount: totalRow?.calls_count || 0,
    byModel,
    recentCalls,
  });
}
