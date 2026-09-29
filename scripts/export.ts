import { getSqlite } from "../src/server/db";
import fs from "fs";
import path from "path";

async function exportRankings() {
  const sqlite = getSqlite();
  const people = sqlite.prepare("SELECT id, name, headline FROM people").all() as any[];
  const exportData: Record<string, any> = {};

  for (const person of people) {
    const ranks = sqlite.prepare(`
      SELECT r.rank, r.score, r.r1_rank, r.r2_rank, r.rationale_json, p.name as target_name, p.headline as target_headline
      FROM rankings r
      JOIN people p ON p.id = r.target_id
      WHERE r.person_id = ?
      ORDER BY r.rank ASC
    `).all(person.id) as any[];

    exportData[person.id] = {
      name: person.name,
      headline: person.headline,
      rankings: ranks.map((r) => ({
        rank: r.rank,
        target_name: r.target_name,
        target_headline: r.target_headline,
        score: r.score,
        r1_rank: r.r1_rank,
        r2_rank: r.r2_rank,
        rationale: JSON.parse(r.rationale_json),
      })),
    };
  }

  const outPath = path.resolve(process.env.DATA_DIR || "./data", "rankings_export.json");
  fs.writeFileSync(outPath, JSON.stringify(exportData, null, 2));
  console.log(`Exported rankings for ${people.length} candidates to ${outPath}`);
}

exportRankings().catch(console.error);
