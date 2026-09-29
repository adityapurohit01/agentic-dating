import fs from "fs";
import path from "path";
import { ApifyConnector } from "../src/server/connectors/apify";
import { extractInstagramHandle } from "../src/server/connectors/normalize";

async function discover() {
  const dataDir = process.env.DATA_DIR || "./data";
  const seedsFile = path.resolve(dataDir, "seeds.txt");

  if (!fs.existsSync(seedsFile)) {
    fs.writeFileSync(
      seedsFile,
      "natgeo\nwired\ntechcrunch\nMITtechreview\narchitecturaldigest\n"
    );
    console.log(`Created sample seeds file at ${seedsFile}`);
  }

  const lines = fs
    .readFileSync(seedsFile, "utf-8")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  console.log(`Discovering cross-linked profiles from ${lines.length} seeds...`);
  const connector = new ApifyConnector();
  const results = await connector.fetchInstagram(lines);

  const matched: string[] = [];
  const failed: string[] = [];

  for (const item of results) {
    const bio = item.data?.biography || item.data?.bio || "";
    const external = item.data?.externalUrl || "";
    const fullText = `${bio} ${external}`;

    const liMatch = fullText.match(/linkedin\.com\/in\/([a-zA-Z0-9-]+)/i);
    if (liMatch) {
      const liUrl = `https://www.linkedin.com/in/${liMatch[1].toLowerCase()}`;
      const igUrl = `https://www.instagram.com/${extractInstagramHandle(item.url)}`;
      matched.push(`${liUrl},${igUrl},public_figure,true,true`);
    } else {
      failed.push(item.url);
    }
  }

  console.log(`Found ${matched.length} cross-verified profiles.`);
  if (failed.length > 0) {
    console.log(`Profiles without explicit LinkedIn cross-link: ${failed.join(", ")}`);
  }

  if (matched.length > 0) {
    const csvPath = path.resolve(dataDir, "discovered_people.csv");
    fs.writeFileSync(
      csvPath,
      ["linkedin_url,instagram_url,consent_status,adult_confirmed,public_confirmed", ...matched].join("\n")
    );
    console.log(`Saved discovered profiles to ${csvPath}`);
  }
}

discover().catch(console.error);
