import { NextResponse } from "next/server";
import { getSqlite } from "@/server/db";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const round = searchParams.get("round");
  const status = searchParams.get("status");

  const sqlite = getSqlite();
  let query = `
    SELECT d.id, d.a_id, d.b_id, d.round, d.status, d.scene_json, d.started_at, d.completed_at,
           pa.name as a_name, pb.name as b_name,
           s.a_to_b, s.b_to_a, s.mutual
    FROM dates d
    JOIN people pa ON pa.id = d.a_id
    JOIN people pb ON pb.id = d.b_id
    LEFT JOIN scores s ON s.date_id = d.id
    WHERE 1=1
  `;
  const params: any[] = [];

  if (round) {
    query += " AND d.round = ?";
    params.push(Number(round));
  }
  if (status) {
    query += " AND d.status = ?";
    params.push(status);
  }

  query += " ORDER BY d.completed_at DESC, d.started_at DESC LIMIT 100";

  const rows = sqlite.prepare(query).all(...params) as any[];

  return NextResponse.json({
    dates: rows.map((r) => ({
      id: r.id,
      aId: r.a_id,
      bId: r.b_id,
      aName: r.a_name,
      bName: r.b_name,
      round: r.round,
      status: r.status,
      scene: r.scene_json ? JSON.parse(r.scene_json) : null,
      scoreAToB: r.a_to_b,
      scoreBToA: r.b_to_a,
      mutualScore: r.mutual,
      startedAt: r.started_at,
      completedAt: r.completed_at,
    })),
  });
}
