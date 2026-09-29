import fs from "fs";
import path from "path";
import { getSqlite } from "../src/server/db";
import { cleanUrl } from "../src/server/connectors/normalize";
import { runFullPipeline } from "../src/server/jobs/pipeline";
import crypto from "crypto";

async function main() {
  const csvPath = path.resolve(process.env.DATA_DIR || "./data", "real_people.csv");
  if (!fs.existsSync(csvPath)) {
    console.error("File not found:", csvPath);
    return;
  }

  const lines = fs.readFileSync(csvPath, "utf-8").split("\n").map((l) => l.trim()).filter(Boolean);
  const sqlite = getSqlite();

  // Clear existing synthetic candidates to have clean real dataset
  sqlite.prepare("DELETE FROM people WHERE name LIKE '%SYNTHETIC%'").run();
  console.log("Purged previous synthetic candidates.");

  let added = 0;
  for (let i = 1; i < lines.length; i++) {
    const [rawLi, rawIg, consent] = lines[i].split(",").map((s) => s.trim());
    if (!rawLi || !rawIg) continue;

    const li = cleanUrl(rawLi);
    const ig = cleanUrl(rawIg);

    const existing = sqlite.prepare("SELECT id FROM people WHERE linkedin_url = ? OR instagram_url = ?").get(li, ig);
    if (!existing) {
      const handle = ig.split("/").pop() || `person_${i}`;
      const name = handle.replace(/[^a-zA-Z0-9]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
      const id = `real_${handle.toLowerCase().replace(/[^a-z0-9]/g, "_")}`;

      sqlite.prepare(`
        INSERT INTO people (
          id, linkedin_url, instagram_url, name, headline,
          consent_status, adult_confirmed, public_confirmed, status,
          created_at, updated_at
        ) VALUES (?, ?, ?, ?, 'Public Profile', ?, 1, 1, 'pending', ?, ?)
      `).run(
        id,
        li,
        ig,
        name,
        consent || "public_figure",
        Date.now(),
        Date.now()
      );
      added++;
    }
  }

  console.log(`Queued ${added} real people into database for Apify collection & dating.`);

  console.log("Triggering full autonomous pipeline (Collect -> Read -> Round 1 -> Reflect -> Round 2 -> Rank)...");
  const res = await runFullPipeline("collect");

  if (res.success) {
    console.log("Full pipeline completed successfully with real dataset!");
  } else {
    console.error("Pipeline finished with notice:", res.error);
  }
}

main().catch(console.error);
