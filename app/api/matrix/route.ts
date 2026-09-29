import { NextResponse } from "next/server";
import { getSqlite } from "@/server/db";

export async function GET() {
  const sqlite = getSqlite();

  const people = sqlite.prepare(`
    SELECT id, name, headline
    FROM people
    WHERE status != 'pending' AND status NOT LIKE 'error%'
  `).all() as any[];

  if (people.length === 0) {
    return NextResponse.json({ candidates: [], matrix: {} });
  }

  // Get all dates and scores
  const scoreRows = sqlite.prepare(`
    SELECT d.id as date_id, d.a_id, d.b_id, d.round, s.a_to_b, s.b_to_a, s.mutual
    FROM dates d
    JOIN scores s ON s.date_id = d.id
  `).all() as any[];

  const matrix: Record<string, Record<string, { score: number; mutual: number; dateId: string; round: number }>> = {};

  for (const p of people) {
    matrix[p.id] = {};
  }

  for (const s of scoreRows) {
    // Prefer Round 2 over Round 1 if available
    const existingAtoB = matrix[s.a_id]?.[s.b_id];
    if (!existingAtoB || s.round >= existingAtoB.round) {
      if (matrix[s.a_id]) {
        matrix[s.a_id][s.b_id] = { score: s.a_to_b, mutual: s.mutual, dateId: s.date_id, round: s.round };
      }
    }

    const existingBtoA = matrix[s.b_id]?.[s.a_id];
    if (!existingBtoA || s.round >= existingBtoA.round) {
      if (matrix[s.b_id]) {
        matrix[s.b_id][s.a_id] = { score: s.b_to_a, mutual: s.mutual, dateId: s.date_id, round: s.round };
      }
    }
  }

  // Calculate average score per candidate to sort rows
  const candidatesWithAvg = people.map((p) => {
    const scores = Object.values(matrix[p.id] || {}).map((c) => c.score);
    const avg = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
    return { ...p, avgScore: Number(avg.toFixed(1)) };
  });

  candidatesWithAvg.sort((a, b) => b.avgScore - a.avgScore);

  return NextResponse.json({
    candidates: candidatesWithAvg,
    matrix,
  });
}
