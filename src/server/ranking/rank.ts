import { getSqlite } from "../db";
import { runPairwiseTiebreak } from "./tiebreak";
import crypto from "crypto";

export interface CandidateScoreRecord {
  targetId: string;
  targetName: string;
  r1Score: number;
  r2Score: number | null;
  combinedScore: number;
  r1Rank: number;
  r2Rank: number | null;
  finalRank: number;
  whyFit: string;
  friction: string;
  bestTurns: number[];
}

export async function calculateAllRankings(): Promise<void> {
  const sqlite = getSqlite();

  // 1. Get all eligible people
  const people = sqlite.prepare("SELECT id, name FROM people WHERE status != 'pending' AND status NOT LIKE 'error%'").all() as { id: string; name: string }[];
  if (people.length < 2) return;

  // Clear previous rankings
  sqlite.prepare("DELETE FROM rankings").run();

  for (const person of people) {
    const records: Array<{
      targetId: string;
      targetName: string;
      r1Score: number;
      r2Score: number | null;
      combinedScore: number;
      r1Rank?: number;
      r2Rank?: number;
      whyFit: string;
      friction: string;
      bestTurns: number[];
    }> = [];

    // Find all dates where person was involved
    for (const target of people) {
      if (target.id === person.id) continue;

      // Find Round 1 date
      const r1Date = sqlite.prepare(`
        SELECT d.id, s.a_to_b, s.b_to_a, d.a_id, r.review_json
        FROM dates d
        JOIN scores s ON s.date_id = d.id
        LEFT JOIN date_reviews r ON r.date_id = d.id AND r.review_type = 'judge'
        WHERE ((d.a_id = ? AND d.b_id = ?) OR (d.a_id = ? AND d.b_id = ?)) AND d.round = 1
      `).get(person.id, target.id, target.id, person.id) as any;

      if (!r1Date) continue;

      const r1Score = r1Date.a_id === person.id ? r1Date.a_to_b : r1Date.b_to_a;

      // Find Round 2 date if exists
      const r2Date = sqlite.prepare(`
        SELECT d.id, s.a_to_b, s.b_to_a, d.a_id, r.review_json
        FROM dates d
        JOIN scores s ON s.date_id = d.id
        LEFT JOIN date_reviews r ON r.date_id = d.id AND r.review_type = 'judge'
        WHERE ((d.a_id = ? AND d.b_id = ?) OR (d.a_id = ? AND d.b_id = ?)) AND d.round = 2
      `).get(person.id, target.id, target.id, person.id) as any;

      const r2Score = r2Date ? (r2Date.a_id === person.id ? r2Date.a_to_b : r2Date.b_to_a) : null;

      // Calculate combined score
      // People with Round 2 date: 0.35*R1 + 0.65*R2; else R1
      const combinedScore = r2Score !== null
        ? Number((0.35 * r1Score + 0.65 * r2Score).toFixed(1))
        : r1Score;

      const judgeInfo = r2Date?.review_json ? JSON.parse(r2Date.review_json) : (r1Date.review_json ? JSON.parse(r1Date.review_json) : null);
      const judgeReview = judgeInfo?.judge || {};

      records.push({
        targetId: target.id,
        targetName: target.name,
        r1Score,
        r2Score,
        combinedScore,
        whyFit: judgeReview.rationale || "Shared lifestyle alignment and high conversation reciprocity.",
        friction: (judgeReview.friction || []).join("; ") || "Minor weekday schedule differences.",
        bestTurns: judgeReview.best_turns || [2, 3],
      });
    }

    // Sort by Round 1 score to determine R1 ranks
    records.sort((a, b) => b.r1Score - a.r1Score);
    records.forEach((r, idx) => {
      r.r1Rank = idx + 1;
    });

    // Sort by Round 2 score for those who had R2
    const r2Records = records.filter((r) => r.r2Score !== null);
    r2Records.sort((a, b) => (b.r2Score || 0) - (a.r2Score || 0));
    r2Records.forEach((r, idx) => {
      r.r2Rank = idx + 1;
    });

    // Final sorting:
    // 1. People with Round 2 date first (ordered by combinedScore)
    // 2. Everyone else ordered by R1 score
    records.sort((a, b) => {
      const aHasR2 = a.r2Score !== null;
      const bHasR2 = b.r2Score !== null;

      if (aHasR2 && !bHasR2) return -1;
      if (!aHasR2 && bHasR2) return 1;

      return b.combinedScore - a.combinedScore;
    });

    // Optional tie-break if ENABLE_PAIRWISE_TIEBREAK
    const enableTiebreak = process.env.ENABLE_PAIRWISE_TIEBREAK !== "false";
    if (enableTiebreak) {
      for (let i = 0; i < records.length - 1; i++) {
        const curr = records[i];
        const next = records[i + 1];
        if (Math.abs(curr.combinedScore - next.combinedScore) <= 3) {
          const pref = await runPairwiseTiebreak(
            person.name,
            curr.targetName,
            next.targetName,
            curr.whyFit,
            next.whyFit,
            person.id
          );
          if (pref === "B") {
            // Swap
            records[i] = next;
            records[i + 1] = curr;
          }
        }
      }
    }

    // Insert into rankings table
    records.forEach((rec, idx) => {
      const rank = idx + 1;
      sqlite.prepare(`
        INSERT INTO rankings (id, person_id, target_id, rank, score, r1_rank, r2_rank, rationale_json, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        crypto.randomUUID(),
        person.id,
        rec.targetId,
        rank,
        rec.combinedScore,
        rec.r1Rank || null,
        rec.r2Rank || null,
        JSON.stringify({
          why_fit: rec.whyFit,
          friction: rec.friction,
          best_turns: rec.bestTurns,
        }),
        Date.now()
      );
    });
  }
}
