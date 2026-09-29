import { getSqlite } from "../src/server/db";
import { getRealPersona } from "../src/server/reader/real-personas";
import { deriveMockSideReview } from "../src/server/dating/review";
import { deriveMockJudgeReview } from "../src/server/dating/judge";
import { computeScores } from "../src/server/dating/scorer";
import { moderateDateScene } from "../src/server/dating/moderator";
import { calculateAllRankings } from "../src/server/ranking/rank";
import crypto from "crypto";

async function main() {
  const sqlite = getSqlite();
  console.log("=== Starting Transcript-Based Rescore Pipeline ===");

  // 1. Upgrade all candidate personas in the DB with real, authentic personas
  const people = sqlite.prepare("SELECT id, name, headline FROM people").all() as any[];
  console.log(`Found ${people.length} candidates in database.`);

  let personasUpdated = 0;
  for (const person of people) {
    const realPersona = getRealPersona(person.id, person.name);
    if (realPersona) {
      const existingPersona = sqlite.prepare("SELECT id FROM personas WHERE person_id = ?").get(person.id);
      if (existingPersona) {
        sqlite.prepare("UPDATE personas SET persona_json = ? WHERE person_id = ?").run(
          JSON.stringify(realPersona),
          person.id
        );
      } else {
        sqlite.prepare(`
          INSERT INTO personas (id, person_id, version, model, persona_json, facts_json, created_at)
          VALUES (?, ?, 1, 'verified_real', ?, '[]', ?)
        `).run(crypto.randomUUID(), person.id, JSON.stringify(realPersona), Date.now());
      }

      if (realPersona.identity.headline && realPersona.identity.headline !== person.headline) {
        sqlite.prepare("UPDATE people SET headline = ? WHERE id = ?").run(
          realPersona.identity.headline,
          person.id
        );
      }
      personasUpdated++;
    }
  }
  console.log(`Updated ${personasUpdated} candidate personas with authentic profiles.`);

  // 2. Fetch all dates and rescore using transcript-derived reviews
  const dates = sqlite.prepare("SELECT * FROM dates").all() as any[];
  console.log(`Found ${dates.length} total dates to rescore from transcripts.`);

  let datesRescored = 0;
  for (const d of dates) {
    const personA = people.find((p) => p.id === d.a_id);
    const personB = people.find((p) => p.id === d.b_id);
    if (!personA || !personB) continue;

    const personaA = getRealPersona(personA.id, personA.name)!;
    const personaB = getRealPersona(personB.id, personB.name)!;
    if (!personaA || !personaB) continue;

    // Fetch the actual transcript turns
    const turns = sqlite.prepare(
      "SELECT turn_number as turnNumber, message, speaker_id FROM date_turns WHERE date_id = ? ORDER BY turn_number ASC"
    ).all(d.id) as any[];

    const transcript = turns.map((t) => ({
      turnNumber: t.turnNumber,
      speakerName: t.speaker_id === personA.id ? personaA.identity.name : personaB.identity.name,
      message: t.message,
    }));

    // Update scene if it was a default
    let scene = d.scene_json ? JSON.parse(d.scene_json) : null;
    if (!scene || scene.scene.includes("quiet artisan coffee roastery")) {
      scene = await moderateDateScene(d.id, personaA, personaB);
      sqlite.prepare("UPDATE dates SET scene_json = ? WHERE id = ?").run(JSON.stringify(scene), d.id);
    }

    // Generate transcript-derived reviews
    const reviewA = deriveMockSideReview(personaA, personaB, transcript, d.round);
    const reviewB = deriveMockSideReview(personaB, personaA, transcript, d.round);
    const judgeReview = deriveMockJudgeReview(personaA, personaB, transcript);

    // Compute scores using the PURE scorer
    const scores = computeScores(reviewA, reviewB, judgeReview);

    // Update date_reviews
    sqlite.prepare("DELETE FROM date_reviews WHERE date_id = ?").run(d.id);

    sqlite.prepare(`
      INSERT INTO date_reviews (id, date_id, reviewer_id, review_type, review_json, created_at)
      VALUES (?, ?, ?, 'side', ?, ?)
    `).run(crypto.randomUUID(), d.id, personA.id, JSON.stringify(reviewA), Date.now());

    sqlite.prepare(`
      INSERT INTO date_reviews (id, date_id, reviewer_id, review_type, review_json, created_at)
      VALUES (?, ?, ?, 'side', ?, ?)
    `).run(crypto.randomUUID(), d.id, personB.id, JSON.stringify(reviewB), Date.now());

    sqlite.prepare(`
      INSERT INTO date_reviews (id, date_id, reviewer_id, review_type, review_json, created_at)
      VALUES (?, ?, 'judge', 'judge', ?, ?)
    `).run(crypto.randomUUID(), d.id, JSON.stringify({ judge: judgeReview, factCheck: { unsupported_claims: [] } }), Date.now());

    // Update scores table
    sqlite.prepare("DELETE FROM scores WHERE date_id = ?").run(d.id);

    sqlite.prepare(`
      INSERT INTO scores (id, date_id, a_to_b, b_to_a, mutual, created_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(
      crypto.randomUUID(),
      d.id,
      scores.scoreAToB,
      scores.scoreBToA,
      scores.mutualScore,
      Date.now()
    );

    datesRescored++;
  }
  console.log(`Rescored ${datesRescored} dates using transcript-derived reviews!`);

  // 3. Recalculate all rankings
  console.log("Recalculating all rankings...");
  await calculateAllRankings();
  console.log("Rankings recalculated successfully!");

  // Verify score distribution
  const distinctScores = sqlite.prepare(
    "SELECT count(DISTINCT mutual) as c, min(mutual) as minS, max(mutual) as maxS, avg(mutual) as avgS FROM scores"
  ).get() as any;
  console.log("Score distribution summary:", distinctScores);

  const sampleRankings = sqlite.prepare(
    "SELECT r.rank, r.score, r.r1_rank, r.r2_rank, p.name as target FROM rankings r JOIN people p ON p.id = r.target_id WHERE r.person_id = ? ORDER BY r.rank ASC LIMIT 5"
  ).all(people[0]?.id) as any[];
  console.log(`Top 5 rankings for ${people[0]?.name}:`, sampleRankings);
}

main().catch(console.error);
