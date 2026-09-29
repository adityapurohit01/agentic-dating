import fs from "fs";
import path from "path";
import { getSqlite } from "../src/server/db";
import crypto from "crypto";

const CAREERS = [
  { name: "Synthetic 01", title: "Software Architect & Trail Runner", company: "Apex Core Systems", bio: "Ultra-marathoner and distributed systems builder. Finding calm in long mountain climbs.", hobbies: ["Trail Running", "Coffee Roasting"], age: 31 },
  { name: "Synthetic 02", title: "Ceramic Artist & Botanical Archivist", company: "Studio Terra", bio: "Throwing porcelain, tending to rare ferns, and appreciating slow craftsmanship.", hobbies: ["Ceramics", "Botanical Foraging"], age: 28 },
  { name: "Synthetic 03", title: "Pediatric Emergency Nurse", company: "Metro Children's Hospital", bio: "High empathy, calm under pressure, and obsessed with baking sourdough on days off.", hobbies: ["Sourdough Baking", "Cycling"], age: 34 },
  { name: "Synthetic 04", title: "Marine Biologist & Coral Restorer", company: "Pacific Oceanographic Inst", bio: "Diving deep to protect coral reefs. Ocean lover, underwater photographer.", hobbies: ["Scuba Diving", "Underwater Photography"], age: 29 },
  { name: "Synthetic 05", title: "Quantitative Researcher & Jazz Pianist", company: "Vanguard Quant Labs", bio: "Probability models by day, modal jazz chords by night. Looking for genuine curiosity.", hobbies: ["Jazz Piano", "Chess"], age: 32 },
  { name: "Synthetic 06", title: "Documentary Filmmaker", company: "Reel Roots Media", bio: "Telling stories of indigenous communities and wilderness conservation.", hobbies: ["Film Editing", "Rock Climbing"], age: 36 },
  { name: "Synthetic 07", title: "Sommelier & Farm-to-Table Chef", company: "L'Etoile Bistro", bio: "Natural wines, fermented foods, and gathering good souls around long dinner tables.", hobbies: ["Natural Wine", "Gardening"], age: 35 },
  { name: "Synthetic 08", title: "Space Systems Engineer", company: "Orbital Dynamics", bio: "Propulsion mechanics, lunar payloads, and reading hard sci-fi under starry skies.", hobbies: ["Astronomy", "Amateur Radio"], age: 27 },
  { name: "Synthetic 09", title: "Landscape Architect & Urban Greener", company: "Verdant Cities Studio", bio: "Transforming concrete into public canopy. Bike commuter and weekend painter.", hobbies: ["Watercolor", "Bikepacking"], age: 30 },
  { name: "Synthetic 10", title: "Investigative Journalist", company: "The Daily Inquirer", bio: "Digging for truth in public records. Avid podcast listener and long-distance swimmer.", hobbies: ["Open Water Swimming", "Archival Research"], age: 33 },
  { name: "Synthetic 11", title: "High School History Teacher", company: "Oakridge Academy", bio: "Bringing civil war diaries to life. Board game strategist and community organizer.", hobbies: ["Board Games", "Woodworking"], age: 38 },
  { name: "Synthetic 12", title: "Clinical Psychologist & Meditation Teacher", company: "Mindful Health Collective", bio: "Exploring neuroplasticity and emotional resilience. Vipassana practitioner.", hobbies: ["Vipassana", "Tea Ceremony"], age: 39 },
  { name: "Synthetic 13", title: "Specialty Coffee Roaster", company: "Origin Roasters", bio: "Chasing single-origin Ethiopian varietals. Vinyl collector and road cyclist.", hobbies: ["Vinyl Collecting", "Espresso Profiling"], age: 26 },
  { name: "Synthetic 14", title: "Renewable Energy Policy Analyst", company: "Clean Grid Institute", bio: "Decarbonizing electricity grids with pragmatism. Gravel biker and dog parent.", hobbies: ["Gravel Biking", "Dog Training"], age: 31 },
  { name: "Synthetic 15", title: "Classical Cellist & Chamber Musician", company: "Symphony Orchestra", bio: "Bach suites, chamber music tours, and silent mornings with dark roast coffee.", hobbies: ["Cello", "Antique Book Hunting"], age: 30 },
  { name: "Synthetic 16", title: "Robotics Engineer & Drone Builder", company: "AeroAutonomous", bio: "Building perception algorithms for autonomous search-and-rescue quadcopters.", hobbies: ["FPV Drones", "3D Printing"], age: 25 },
  { name: "Synthetic 17", title: "Graphic Novelist & Illustrator", company: "Pantheon Press", bio: "Inking fantasy worlds with dip pens. Green tea lover and indie bookstore regular.", hobbies: ["Ink Drawing", "Manga Translation"], age: 29 },
  { name: "Synthetic 18", title: "Wildlife Photographer", company: "National Habitat Society", bio: "Waiting 14 hours in sub-zero blinds for snow leopards. Patient, observant, resilient.", hobbies: ["Backcountry Skiing", "Wildlife Tracking"], age: 37 },
  { name: "Synthetic 19", title: "Sustainable Fashion Designer", company: "EcoThread Atelier", bio: "Zero-waste pattern drafting, botanical dyes, and vintage textile restoration.", hobbies: ["Natural Dyeing", "Sewing"], age: 28 },
  { name: "Synthetic 20", title: "Sports Physical Therapist", company: "Elevate Performance Clinic", bio: "Helping marathoners cross finish lines pain-free. Kettlebell coach and cold plunge fan.", hobbies: ["Kettlebells", "Surfing"], age: 32 },
  { name: "Synthetic 21", title: "Cybersecurity Analyst", company: "Defensive Cyber Shield", bio: "Reverse-engineering malware and threat modeling. Mechanical keyboard enthusiast.", hobbies: ["Lockpicking", "Mechanical Keyboards"], age: 29 },
  { name: "Synthetic 22", title: "Bioethicist & Medical Humanities Fellow", company: "Institute of Biomedical Ethics", bio: "Questioning AI in genomic editing. Long philosopher walks and foreign cinema.", hobbies: ["Film Analysis", "Creative Nonfiction"], age: 36 },
  { name: "Synthetic 23", title: "Artisan Cheesemaker & Dairy Steward", company: "Valley Pastures Creamery", bio: "Aging clothbound cheddar and honoring alpine grass rhythms. Rustic food lover.", hobbies: ["Fermentation", "Cheese Tasting"], age: 41 },
  { name: "Synthetic 24", title: "Urban Planner & Transit Advocate", company: "Metropolitan Transit Bureau", bio: "Passionate about light rail corridors and walkable neighborhoods. Urban sketcher.", hobbies: ["Urban Sketching", "Transit Photography"], age: 33 },
  { name: "Synthetic 25", title: "Wilderness Survival Instructor", company: "Cascadia Survival School", bio: "Friction fires, shelter craft, and teaching people to feel safe in old-growth forests.", hobbies: ["Bushcraft", "Orienteering"], age: 43 },
];

export async function seedFixtures(insertIntoDb = true) {
  const dataDir = process.env.DATA_DIR || "./data";
  const fixtureDir = path.resolve(dataDir, "fixtures");
  if (!fs.existsSync(fixtureDir)) {
    fs.mkdirSync(fixtureDir, { recursive: true });
  }

  const sqlite = getSqlite();
  const seededPeople: any[] = [];

  for (let i = 0; i < CAREERS.length; i++) {
    const item = CAREERS[i];
    const numStr = String(i + 1).padStart(2, "0");
    const personId = `synthetic_${numStr}`;

    const liData = {
      name: `${item.name} (SYNTHETIC)`,
      headline: item.title,
      summary: `I am a dedicated professional with deep expertise in my field. ${item.bio}`,
      experience: [
        {
          title: item.title.split("&")[0].trim(),
          company: item.company,
          duration: "2019 - Present",
          description: `Leading key projects and mentoring team members at ${item.company}.`,
        },
      ],
      education: [
        {
          school: "State University",
          degree: "Bachelor of Science",
        },
      ],
      skills: [...item.hobbies, "Strategic Thinking", "Collaboration"],
    };

    const igData = {
      username: `synthetic_${numStr}`,
      biography: `${item.bio} | linkedin.com/in/synthetic-${numStr}`,
      externalUrl: `https://linkedin.com/in/synthetic-${numStr}`,
      followersCount: 1420 + i * 85,
      posts: [
        {
          id: `post_${numStr}_1`,
          caption: `Early morning start exploring ${item.hobbies[0]}. Feeling grateful for the space to create and reflect. #lifestyle #focus`,
        },
        {
          id: `post_${numStr}_2`,
          caption: `Diving deep into ${item.hobbies[1]} this weekend. The craft is in the patience and consistency.`,
        },
        {
          id: `post_${numStr}_3`,
          caption: `Work week wrapped up at ${item.company}. Time for good books, fresh air, and quality conversations.`,
        },
      ],
    };

    // Write fixture JSON files
    fs.writeFileSync(path.join(fixtureDir, `synthetic_${numStr}_linkedin.json`), JSON.stringify(liData, null, 2));
    fs.writeFileSync(path.join(fixtureDir, `synthetic_${numStr}_instagram.json`), JSON.stringify(igData, null, 2));

    if (insertIntoDb) {
      // Upsert into people table
      const existing = sqlite.prepare("SELECT id FROM people WHERE id = ?").get(personId);
      const now = Date.now();

      if (!existing) {
        sqlite.prepare(`
          INSERT INTO people (
            id, linkedin_url, instagram_url, name, headline,
            consent_status, adult_confirmed, public_confirmed, status,
            identity_match, identity_notes, created_at, updated_at
          ) VALUES (?, ?, ?, ?, ?, 'opted_in', 1, 1, 'pending', 0.95, 'Synthetic fixture verified cross-link', ?, ?)
        `).run(
          personId,
          `https://linkedin.com/in/synthetic-${numStr}`,
          `https://instagram.com/synthetic_${numStr}`,
          `${item.name} (SYNTHETIC)`,
          item.title,
          now,
          now
        );
      }
    }

    seededPeople.push({ id: personId, name: item.name });
  }

  // Also write sample people.csv
  const csvLines = [
    "linkedin_url,instagram_url,consent_status,adult_confirmed,public_confirmed",
    ...CAREERS.map((_, i) => {
      const numStr = String(i + 1).padStart(2, "0");
      return `https://linkedin.com/in/synthetic-${numStr},https://instagram.com/synthetic_${numStr},opted_in,true,true`;
    }),
  ];
  fs.writeFileSync(path.resolve(dataDir, "people.csv"), csvLines.join("\n"));

  return seededPeople;
}

if (require.main === module || process.argv[1]?.includes("seed-fixtures")) {
  seedFixtures().then((res) => {
    console.log(`Seeded ${res.length} synthetic candidates into fixtures and database.`);
  });
}
