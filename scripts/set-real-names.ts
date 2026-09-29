import { getSqlite } from "../src/server/db";

const REAL_NAMES: Record<string, { name: string; headline: string }> = {
  real_satyanadella: { name: "Satya Nadella", headline: "Chairman and CEO at Microsoft" },
  real_sundarpichai: { name: "Sundar Pichai", headline: "CEO at Alphabet and Google" },
  real_reidhoffman: { name: "Reid Hoffman", headline: "Co-Founder LinkedIn, Partner at Greylock" },
  real_sama: { name: "Sam Altman", headline: "CEO at OpenAI" },
  real_lexfridman: { name: "Lex Fridman", headline: "Research Scientist at MIT & Podcaster" },
  real_andrew_y_ng: { name: "Andrew Ng", headline: "Founder of DeepLearning.AI, Managing General Partner AI Fund" },
  real_drfeifeili: { name: "Fei-Fei Li", headline: "Professor of CS at Stanford University, Co-Director Stanford HAI" },
  real_yannlecun: { name: "Yann LeCun", headline: "VP & Chief AI Scientist at Meta, Silver Professor at NYU" },
  real_demishassabis: { name: "Demis Hassabis", headline: "Co-founder & CEO at Google DeepMind" },
  real_benioff: { name: "Marc Benioff", headline: "Chair and CEO at Salesforce" },
  real_boztank: { name: "Andrew Bosworth", headline: "CTO at Meta" },
  real_mkbhd: { name: "Marques Brownlee", headline: "Tech Reviewer, Creator, and Professional Ultimate Frisbee Player" },
  real_tim_cook: { name: "Tim Cook", headline: "CEO at Apple" },
  real_jensenhuangnvidia: { name: "Jensen Huang", headline: "Founder and CEO at NVIDIA" },
  real_sherylsandberg: { name: "Sheryl Sandberg", headline: "Founder of LeanIn.Org, Former COO at Meta" },
  real_btaylor: { name: "Bret Taylor", headline: "Chairman at OpenAI, Co-founder of Sierra" },
  real_miramurati: { name: "Mira Murati", headline: "Former CTO at OpenAI, AI Researcher" },
  real_thegdb: { name: "Greg Brockman", headline: "President & Co-founder at OpenAI" },
  real_karpathy: { name: "Andrej Karpathy", headline: "Eureka Labs Founder, Former Director of AI at Tesla" },
  real_levelsio: { name: "Pieter Levels", headline: "Solo Founder Nomad List & Remote OK" },
  real_austen: { name: "Austen Allred", headline: "CEO & Co-founder at BloomTech" },
  real_rauchg: { name: "Guillermo Rauch", headline: "CEO at Vercel" },
  real_dylanfield: { name: "Dylan Field", headline: "Co-founder & CEO at Figma" },
  real_shwetakatti: { name: "Shweta Katti", headline: "Activist, Human Rights Advocate & Psychology Scholar" },
  real_sarablakely: { name: "Sara Blakely", headline: "Founder at SPANX, Entrepreneur & Investor" },
};

async function updateRealNames() {
  const sqlite = getSqlite();
  for (const [id, info] of Object.entries(REAL_NAMES)) {
    sqlite.prepare("UPDATE people SET name = ?, headline = ? WHERE id = ?").run(info.name, info.headline, id);

    // Also update the identity name in personas table
    const personaRow = sqlite.prepare("SELECT persona_json FROM personas WHERE person_id = ?").get(id) as any;
    if (personaRow) {
      const p = JSON.parse(personaRow.persona_json);
      p.identity.name = info.name;
      p.identity.headline = info.headline;
      sqlite.prepare("UPDATE personas SET persona_json = ? WHERE person_id = ?").run(JSON.stringify(p), id);
    }
  }
  console.log("Updated 25 candidates with real names and executive headlines.");
}

updateRealNames().catch(console.error);
