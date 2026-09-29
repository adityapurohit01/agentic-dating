import { NextResponse } from "next/server";
import { getSqlite } from "@/server/db";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const sqlite = getSqlite();

  const date = sqlite.prepare(`
    SELECT d.id, d.a_id, d.b_id, d.round, d.status, d.scene_json, d.started_at, d.completed_at,
           pa.name as a_name, pb.name as b_name,
           s.a_to_b, s.b_to_a, s.mutual
    FROM dates d
    JOIN people pa ON pa.id = d.a_id
    JOIN people pb ON pb.id = d.b_id
    LEFT JOIN scores s ON s.date_id = d.id
    WHERE d.id = ?
  `).get(id) as any;

  if (!date) {
    return NextResponse.json({ error: "Date not found" }, { status: 404 });
  }

  const turns = sqlite.prepare(`
    SELECT id, turn_number, speaker_id, message, created_at
    FROM date_turns
    WHERE date_id = ?
    ORDER BY turn_number ASC
  `).all(id) as any[];

  const reviews = sqlite.prepare(`
    SELECT reviewer_id, review_type, review_json
    FROM date_reviews
    WHERE date_id = ?
  `).all(id) as any[];

  let reviewA: any = null;
  let reviewB: any = null;
  let judgeReview: any = null;
  let factCheck: any = null;

  for (const r of reviews) {
    const data = JSON.parse(r.review_json);
    if (r.review_type === "side") {
      if (r.reviewer_id === date.a_id) reviewA = data;
      else reviewB = data;
    } else if (r.review_type === "judge") {
      judgeReview = data.judge;
      factCheck = data.factCheck;
    }
  }

  return NextResponse.json({
    date: {
      id: date.id,
      aId: date.a_id,
      bId: date.b_id,
      aName: date.a_name,
      bName: date.b_name,
      round: date.round,
      status: date.status,
      scene: date.scene_json ? JSON.parse(date.scene_json) : null,
      scoreAToB: date.a_to_b,
      scoreBToA: date.b_to_a,
      mutualScore: date.mutual,
      startedAt: date.started_at,
      completedAt: date.completed_at,
    },
    turns: turns.map((t) => ({
      id: t.id,
      turnNumber: t.turn_number,
      speakerId: t.speaker_id,
      speakerName: t.speaker_id === date.a_id ? date.a_name : date.b_name,
      message: t.message,
      createdAt: t.created_at,
    })),
    reviewA,
    reviewB,
    judgeReview,
    factCheck,
  });
}
