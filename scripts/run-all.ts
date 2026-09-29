import { runFullPipeline, getPipelineStatus } from "../src/server/jobs/pipeline";
import { getSqlite } from "../src/server/db";

async function main() {
  console.log("=== AGENTIC DATING: AUTONOMOUS PIPELINE ===");
  const statusBefore = getPipelineStatus();
  console.log(`Initial Candidates: ${statusBefore.peopleCount}`);

  const res = await runFullPipeline("collect");
  if (!res.success) {
    console.error("Pipeline failed:", res.error);
    process.exit(1);
  }

  const finalStatus = getPipelineStatus();
  const sqlite = getSqlite();
  const rankingRows = sqlite.prepare("SELECT COUNT(*) as c FROM rankings").get() as any;

  console.log("\n=== PIPELINE EXECUTION COMPLETED ===");
  console.log(`- Profiles Analyzed: ${finalStatus.readyCount}`);
  console.log(`- Round 1 Speed Dates Completed: ${finalStatus.round1Count} / ${finalStatus.round1Total}`);
  console.log(`- Round 2 Deep Dates Completed: ${finalStatus.round2Count} / ${finalStatus.round2Total}`);
  console.log(`- Total Ranking Entries: ${rankingRows.c}`);
  console.log(`- Total LLM Cost (USD): $${finalStatus.totalCostUsd}`);
}

main().catch(console.error);
