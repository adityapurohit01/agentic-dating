import { NextResponse } from "next/server";
import { getSqlite } from "@/server/db";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const sqlite = getSqlite();

  const person = sqlite.prepare("SELECT id, name, headline FROM people WHERE id = ?").get(id) as any;
  if (!person) {
    return NextResponse.json({ error: "Person not found" }, { status: 404 });
  }

  const rows = sqlite.prepare(`
    SELECT r.rank, r.score, r.r1_rank, r.r2_rank, r.rationale_json,
           p.id as target_id, p.name as target_name, p.headline as target_headline,
           d.id as date_id
    FROM rankings r
    JOIN people p ON p.id = r.target_id
    LEFT JOIN dates d ON ((d.a_id = r.person_id AND d.b_id = r.target_id) OR (d.a_id = r.target_id AND d.b_id = r.person_id)) AND d.round = (CASE WHEN r.r2_rank IS NOT NULL THEN 2 ELSE 1 END)
    WHERE r.person_id = ?
    ORDER BY r.rank ASC
  `).all(id) as any[];

  const rankings = rows.map((r) => {
    const mover = r.r1_rank ? r.r1_rank - r.rank : 0; // positive = moved up
    return {
      rank: r.rank,
      score: r.score,
      r1Rank: r.r1_rank,
      r2Rank: r.r2_rank,
      mover,
      targetId: r.target_id,
      targetName: r.target_name,
      targetHeadline: r.target_headline,
      dateId: r.date_id,
      rationale: JSON.parse(r.rationale_json),
    };
  });

  return NextResponse.json({ person, rankings });
}
