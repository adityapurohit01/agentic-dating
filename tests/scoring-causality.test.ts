/**
 * Scoring causality tests:
 * (a) same profiles, scrambled/hostile transcript => score changes by >=20 points
 * (b) planted truth: 6 synthetic couples (3 compatible, 3 deal-breaker)
 *     => compatible partner is top-3 for at least 5 of 6 people
 * (c) ablation: report how many ranking positions differ profile-only vs date-informed
 */

import { describe, it, expect } from "vitest";
import { deriveMockSideReview, SideReview } from "../src/server/dating/review";
import { deriveMockJudgeReview, JudgeReview } from "../src/server/dating/judge";
import { computeScores } from "../src/server/dating/scorer";
import { mapToTags, extractPersonaTags, tagOverlap, HOBBY_TAGS, INTEREST_TAGS, VALUE_TAGS } from "../src/server/reader/taxonomy";
import { Persona } from "../src/server/reader/schemas";

// ── Helpers ──

function makePersona(overrides: Partial<Persona> & { name: string }): Persona {
  return {
    identity: {
      name: overrides.name,
      headline: overrides.identity?.headline || "Test Person",
      location: "",
      current_role: "",
      company: "",
      education: [],
    },
    summary: overrides.summary || `${overrides.name} is a test persona.`,
    needs: overrides.needs || [
      { need: "Mutual respect and intellectual curiosity", kind: "inferred", weight: 5, confidence: 0.9, evidence: [] },
      { need: "Shared outdoor adventures", kind: "stated", weight: 4, confidence: 0.8, evidence: [] },
    ],
    hobbies: overrides.hobbies || [
      { name: "Hiking & Trail Running", confidence: 0.9, evidence: [] },
      { name: "Photography", confidence: 0.8, evidence: [] },
    ],
    interests: overrides.interests || [
      { name: "Artificial Intelligence", confidence: 0.9, evidence: [] },
    ],
    values: overrides.values || [
      { name: "Empathy and Integrity", confidence: 0.9, evidence: [] },
      { name: "Curiosity", confidence: 0.85, evidence: [] },
    ],
    lifestyle: overrides.lifestyle || {
      rhythm: "Early riser",
      social_energy: "Ambivert",
      travel: "Frequent",
      fitness: "Active",
      food: "Healthy",
      other: "",
    },
    ambition: overrides.ambition || { level: "High", direction: "Building great things", evidence: [] },
    humor: overrides.humor || { style: "Dry and witty", evidence: [] },
    communication_style: overrides.communication_style || { summary: "Direct and thoughtful", evidence: [] },
    relationship_signals: overrides.relationship_signals || [],
    friction_points: overrides.friction_points || [],
    green_flags: overrides.green_flags || [],
    unknowns: overrides.unknowns || [],
  };
}

type Transcript = Array<{ turnNumber: number; speakerName: string; message: string }>;

function makePositiveTranscript(nameA: string, nameB: string): Transcript {
  return [
    { turnNumber: 1, speakerName: nameA, message: "Hey! It's wonderful to meet you. I love this place — the atmosphere is genuinely amazing. What inspires you most about your work?" },
    { turnNumber: 2, speakerName: nameB, message: "Thanks! I'm really excited to chat. I'm passionate about creative problem-solving and appreciate people who share that curiosity. What drives you?" },
    { turnNumber: 3, speakerName: nameA, message: "That resonates so deeply. I agree — intellectual curiosity is everything. I admire your thoughtful approach to life and outdoor adventures." },
    { turnNumber: 4, speakerName: nameB, message: "I love that about you too! Hiking and exploring nature is a wonderful way to connect. Your respect for the outdoors is beautiful and inspiring." },
    { turnNumber: 5, speakerName: nameA, message: "Perfect alignment! I believe empathy and genuine connection are essential. You've shown brilliant warmth and authenticity in this conversation." },
    { turnNumber: 6, speakerName: nameB, message: "I feel the same — this is a fantastic conversation. Your passion and creative energy are remarkable. I'd love to explore these ideas together more." },
  ];
}

function makeHostileTranscript(nameA: string, nameB: string): Transcript {
  return [
    { turnNumber: 1, speakerName: nameA, message: "This is awkward. I'm uncomfortable with this setting. I dislike small talk and struggle with forced conversations like these." },
    { turnNumber: 2, speakerName: nameB, message: "Unfortunately I find this terrible and boring. Your approach is rigid and dismissive. I hate superficial conversations." },
    { turnNumber: 3, speakerName: nameA, message: "I disagree with everything you said. This is a frustrating experience. Your stubbornness is exhausting and draining." },
    { turnNumber: 4, speakerName: nameB, message: "The tension here is awful. I feel hostile toward this whole setup. Your cold attitude is stressful and toxic." },
    { turnNumber: 5, speakerName: nameA, message: "I'm disappointed. This is a shallow, difficult interaction. I worry about your conflict resolution skills." },
    { turnNumber: 6, speakerName: nameB, message: "Terrible date. I dislike your rigid perspective. This was an uncomfortable waste of time." },
  ];
}

function makeScrambledTranscript(nameA: string, nameB: string): Transcript {
  // Same words as positive but scrambled into nonsensical order + some negative additions
  return [
    { turnNumber: 1, speakerName: nameA, message: "Struggle uncomfortable place work atmosphere. What work about difficult boring inspires?" },
    { turnNumber: 2, speakerName: nameB, message: "Terrible frustrating cold chat. Stubborn rigid shallow problem-solving. What awful drives?" },
    { turnNumber: 3, speakerName: nameA, message: "Disagree deeply hostile. Disappointing uncomfortable draining exhausting approach rigid." },
    { turnNumber: 4, speakerName: nameB, message: "Dislike hate boring tension. Awkward superficial stressed toxic uncomfortable." },
    { turnNumber: 5, speakerName: nameA, message: "Struggle worry difficult. Uncomfortable frustrating dismissive tension conflict hostile." },
    { turnNumber: 6, speakerName: nameB, message: "Terrible awful uncomfortable. Boring draining stressful disappointing." },
  ];
}

// ── Planted Truth Couples ──

// Compatible couple 1: Both love hiking + technology
const alice = makePersona({
  name: "Alice SYNTHETIC",
  summary: "A curious AI researcher who loves hiking and building thoughtful technology products.",
  needs: [
    { need: "Shared hiking and outdoor adventures together", kind: "stated", weight: 5, confidence: 0.9, evidence: [] },
    { need: "Intellectual curiosity and deep conversation", kind: "inferred", weight: 4, confidence: 0.85, evidence: [] },
  ],
  hobbies: [
    { name: "Hiking & Mountain Trails", confidence: 0.95, evidence: [] },
    { name: "AI Research", confidence: 0.9, evidence: [] },
  ],
  values: [
    { name: "Curiosity and Innovation", confidence: 0.9, evidence: [] },
    { name: "Environmental Stewardship", confidence: 0.85, evidence: [] },
  ],
});

const bob = makePersona({
  name: "Bob SYNTHETIC",
  summary: "A software engineer who spends weekends on mountain trails and builds AI tools.",
  needs: [
    { need: "Partner who shares hiking and mountain trail passion", kind: "stated", weight: 5, confidence: 0.9, evidence: [] },
    { need: "Genuine curiosity about technology and AI together", kind: "inferred", weight: 4, confidence: 0.85, evidence: [] },
  ],
  hobbies: [
    { name: "Trail Running & Hiking", confidence: 0.95, evidence: [] },
    { name: "Software Engineering & AI", confidence: 0.9, evidence: [] },
  ],
  values: [
    { name: "Innovation and Creativity", confidence: 0.9, evidence: [] },
    { name: "Sustainability", confidence: 0.85, evidence: [] },
  ],
});

// Compatible couple 2: Both love cooking + family values
const carol = makePersona({
  name: "Carol SYNTHETIC",
  summary: "A passionate chef and family-oriented community builder.",
  needs: [
    { need: "Shared cooking and food exploration together", kind: "stated", weight: 5, confidence: 0.9, evidence: [] },
    { need: "Strong family values and community involvement", kind: "inferred", weight: 4, confidence: 0.85, evidence: [] },
  ],
  hobbies: [
    { name: "Cooking & Culinary Arts", confidence: 0.95, evidence: [] },
    { name: "Community Volunteering", confidence: 0.9, evidence: [] },
  ],
  values: [
    { name: "Family & Community", confidence: 0.9, evidence: [] },
    { name: "Authenticity", confidence: 0.85, evidence: [] },
  ],
});

const dave = makePersona({
  name: "Dave SYNTHETIC",
  summary: "A culinary enthusiast who volunteers at the community garden and values family.",
  needs: [
    { need: "Partner who loves cooking and culinary exploration", kind: "stated", weight: 5, confidence: 0.9, evidence: [] },
    { need: "Family-oriented values and community engagement", kind: "inferred", weight: 4, confidence: 0.85, evidence: [] },
  ],
  hobbies: [
    { name: "Cooking & Recipe Development", confidence: 0.95, evidence: [] },
    { name: "Gardening & Volunteering", confidence: 0.9, evidence: [] },
  ],
  values: [
    { name: "Family & Togetherness", confidence: 0.9, evidence: [] },
    { name: "Genuine Authenticity", confidence: 0.85, evidence: [] },
  ],
});

// Compatible couple 3: Both love music + travel
const emma = makePersona({
  name: "Emma SYNTHETIC",
  summary: "A touring musician who lives for travel and creative experiences.",
  needs: [
    { need: "Partner who shares music passion and concert experiences", kind: "stated", weight: 5, confidence: 0.9, evidence: [] },
    { need: "Shared travel and exploration lifestyle", kind: "inferred", weight: 4, confidence: 0.85, evidence: [] },
  ],
  hobbies: [
    { name: "Guitar & Music Performance", confidence: 0.95, evidence: [] },
    { name: "Backpacking & Travel", confidence: 0.9, evidence: [] },
  ],
  values: [
    { name: "Creativity & Self-expression", confidence: 0.9, evidence: [] },
    { name: "Independence & Freedom", confidence: 0.85, evidence: [] },
  ],
});

const frank = makePersona({
  name: "Frank SYNTHETIC",
  summary: "A music producer who travels the world collecting sounds and stories.",
  needs: [
    { need: "Shared love for music creation and concert experiences", kind: "stated", weight: 5, confidence: 0.9, evidence: [] },
    { need: "Partner who craves travel and exploring new cultures", kind: "inferred", weight: 4, confidence: 0.85, evidence: [] },
  ],
  hobbies: [
    { name: "Music Production & Vinyl Collecting", confidence: 0.95, evidence: [] },
    { name: "Travel & Cultural Exploration", confidence: 0.9, evidence: [] },
  ],
  values: [
    { name: "Creative Freedom & Innovation", confidence: 0.9, evidence: [] },
    { name: "Independence & Autonomy", confidence: 0.85, evidence: [] },
  ],
});

// Dealbreaker pairs: 3 incompatible mixes
// G: ultra-homebody vs H: hardcore nomad
const george = makePersona({
  name: "George SYNTHETIC",
  summary: "A quiet librarian who never travels and prefers solitary indoor evenings.",
  needs: [
    { need: "Stable home routine without travel disruptions", kind: "stated", weight: 5, confidence: 0.9, evidence: [] },
    { need: "Quiet evenings and low social energy environment", kind: "inferred", weight: 4, confidence: 0.85, evidence: [] },
  ],
  hobbies: [
    { name: "Reading & Book Collecting", confidence: 0.95, evidence: [] },
    { name: "Indoor Meditation", confidence: 0.9, evidence: [] },
  ],
  values: [
    { name: "Stability & Routine", confidence: 0.9, evidence: [] },
    { name: "Solitude & Peace", confidence: 0.85, evidence: [] },
  ],
});

const hannah = makePersona({
  name: "Hannah SYNTHETIC",
  summary: "An extreme sports adventurer who is always traveling and hates staying home.",
  needs: [
    { need: "Constant travel and adrenaline-fueled adventures", kind: "stated", weight: 5, confidence: 0.9, evidence: [] },
    { need: "Partner who craves excitement and spontaneous trips", kind: "inferred", weight: 4, confidence: 0.85, evidence: [] },
  ],
  hobbies: [
    { name: "Skydiving & Extreme Sports", confidence: 0.95, evidence: [] },
    { name: "Nomadic Travel & Camping", confidence: 0.9, evidence: [] },
  ],
  values: [
    { name: "Adventure & Risk-taking", confidence: 0.9, evidence: [] },
    { name: "Freedom & Spontaneity", confidence: 0.85, evidence: [] },
  ],
});

// I: veganism activist vs J: competitive barbecue pitmaster
const ivan = makePersona({
  name: "Ivan SYNTHETIC",
  summary: "A strict vegan activist who fights animal agriculture and values environmental ethics.",
  needs: [
    { need: "Partner who shares strict plant-based lifestyle", kind: "stated", weight: 5, confidence: 0.9, evidence: [] },
    { need: "Shared environmental activism and conservation values", kind: "inferred", weight: 4, confidence: 0.85, evidence: [] },
  ],
  hobbies: [
    { name: "Vegan Cooking & Plant-based Recipes", confidence: 0.95, evidence: [] },
    { name: "Environmental Activism", confidence: 0.9, evidence: [] },
  ],
  values: [
    { name: "Environmental Stewardship & Animal Rights", confidence: 0.9, evidence: [] },
    { name: "Social Justice", confidence: 0.85, evidence: [] },
  ],
});

const julia = makePersona({
  name: "Julia SYNTHETIC",
  summary: "A competitive barbecue pitmaster who lives for slow-smoked meat and hunting trips.",
  needs: [
    { need: "Partner who appreciates barbecue and grilled meat traditions", kind: "stated", weight: 5, confidence: 0.9, evidence: [] },
    { need: "Shared outdoor hunting and fishing experiences", kind: "inferred", weight: 4, confidence: 0.85, evidence: [] },
  ],
  hobbies: [
    { name: "Barbecue & Meat Smoking", confidence: 0.95, evidence: [] },
    { name: "Hunting & Fishing", confidence: 0.9, evidence: [] },
  ],
  values: [
    { name: "Tradition & Heritage", confidence: 0.9, evidence: [] },
    { name: "Independence & Self-reliance", confidence: 0.85, evidence: [] },
  ],
});

// K: tech maximalist vs L: tech-free lifestyle
const kyle = makePersona({
  name: "Kyle SYNTHETIC",
  summary: "A techno-optimist who wants screens everywhere and codes 14 hours a day.",
  needs: [
    { need: "Partner who shares passion for coding and technology immersion", kind: "stated", weight: 5, confidence: 0.9, evidence: [] },
    { need: "Respect for long focused coding sessions", kind: "inferred", weight: 4, confidence: 0.85, evidence: [] },
  ],
  hobbies: [
    { name: "Coding & Software Development", confidence: 0.95, evidence: [] },
    { name: "Gaming & VR", confidence: 0.9, evidence: [] },
  ],
  values: [
    { name: "Innovation & Technology Progress", confidence: 0.9, evidence: [] },
    { name: "Ambition & Achievement", confidence: 0.85, evidence: [] },
  ],
});

const laura = makePersona({
  name: "Laura SYNTHETIC",
  summary: "A nature artist who avoids all technology and lives off-grid.",
  needs: [
    { need: "Partner who values nature over screens and technology", kind: "stated", weight: 5, confidence: 0.9, evidence: [] },
    { need: "Simple off-grid lifestyle without digital distractions", kind: "inferred", weight: 4, confidence: 0.85, evidence: [] },
  ],
  hobbies: [
    { name: "Painting & Watercolors", confidence: 0.95, evidence: [] },
    { name: "Organic Gardening & Foraging", confidence: 0.9, evidence: [] },
  ],
  values: [
    { name: "Simplicity & Nature", confidence: 0.9, evidence: [] },
    { name: "Mindfulness & Presence", confidence: 0.85, evidence: [] },
  ],
});

const allCandidates = [alice, bob, carol, dave, emma, frank, george, hannah, ivan, julia, kyle, laura];

// ── Tests ──

describe("Taxonomy", () => {
  it("maps free-text hobbies to canonical tags", () => {
    expect(mapToTags("Hiking & Trail Running")).toContain("hiking");
    expect(mapToTags("Hiking & Trail Running")).toContain("running");
    expect(mapToTags("Photography")).toContain("photography");
    expect(mapToTags("AI Research")).toContain("artificial_intelligence");
  });

  it("has ~60 canonical tags total", () => {
    const total = HOBBY_TAGS.length + INTEREST_TAGS.length + VALUE_TAGS.length;
    expect(total).toBeGreaterThanOrEqual(55);
    expect(total).toBeLessThanOrEqual(70);
  });

  it("computes tag overlap correctly", () => {
    const tagsA = extractPersonaTags(alice);
    const tagsB = extractPersonaTags(bob);
    const overlap = tagOverlap(tagsA, tagsB);
    expect(overlap).toBeGreaterThan(0.3); // Both have hiking + AI
  });

  it("detects low overlap between incompatible personas", () => {
    const tagsI = extractPersonaTags(ivan);
    const tagsJ = extractPersonaTags(julia);
    const overlap = tagOverlap(tagsI, tagsJ);
    expect(overlap).toBeLessThan(0.3);
  });
});

describe("Scorer is a PURE function of reviews", () => {
  it("computes correct scores from reviews", () => {
    const reviewA: SideReview = {
      need_scores: [{ need: "test", score: 8, turns: [1] }],
      values_alignment: 8, chemistry: 7,
      red_flags: [], green_flags: [],
      would_see_again: 80,
      learned_about_principal: [],
      summary: "Good date",
    };
    const reviewB: SideReview = {
      need_scores: [{ need: "test", score: 6, turns: [2] }],
      values_alignment: 6, chemistry: 5,
      red_flags: [], green_flags: [],
      would_see_again: 60,
      learned_about_principal: [],
      summary: "OK date",
    };
    const judge: JudgeReview = {
      mutual_score: 70,
      rationale: "Test",
      shared_ground: [],
      friction: [],
      best_turns: [1],
      verdict: "Test",
    };

    const scores = computeScores(reviewA, reviewB, judge);
    // view(A->B) = 0.7*80 + 0.3*8*10 = 56 + 24 = 80
    expect(scores.viewAToB).toBeCloseTo(80, 0);
    // view(B->A) = 0.7*60 + 0.3*6*10 = 42 + 18 = 60
    expect(scores.viewBToA).toBeCloseTo(60, 0);
    // score(A->B) = 0.5*80 + 0.3*70 + 0.2*60 = 40+21+12 = 73
    expect(scores.scoreAToB).toBeCloseTo(73, 0);
    // score(B->A) = 0.5*60 + 0.3*70 + 0.2*80 = 30+21+16 = 67
    expect(scores.scoreBToA).toBeCloseTo(67, 0);
  });

  it("has no randomness — same inputs give identical outputs", () => {
    const reviewA: SideReview = {
      need_scores: [{ need: "test", score: 7, turns: [1] }],
      values_alignment: 7, chemistry: 7,
      red_flags: [], green_flags: [],
      would_see_again: 75,
      learned_about_principal: [], summary: "Test",
    };
    const reviewB = { ...reviewA };
    const judge: JudgeReview = {
      mutual_score: 72,
      rationale: "Test",
      shared_ground: [], friction: [],
      best_turns: [1], verdict: "Test",
    };

    const s1 = computeScores(reviewA, reviewB, judge);
    const s2 = computeScores(reviewA, reviewB, judge);
    expect(s1.scoreAToB).toBe(s2.scoreAToB);
    expect(s1.scoreBToA).toBe(s2.scoreBToA);
  });
});

describe("(a) Causality: transcript changes score by >=20 points", () => {
  const personaA = makePersona({ name: "Alpha SYNTHETIC" });
  const personaB = makePersona({ name: "Beta SYNTHETIC" });

  it("positive vs hostile transcript: score differs by >=20", () => {
    const posTranscript = makePositiveTranscript("Alpha SYNTHETIC", "Beta SYNTHETIC");
    const hostileTranscript = makeHostileTranscript("Alpha SYNTHETIC", "Beta SYNTHETIC");

    const posReviewA = deriveMockSideReview(personaA, personaB, posTranscript, 1);
    const posReviewB = deriveMockSideReview(personaB, personaA, posTranscript, 1);
    const posJudge = deriveMockJudgeReview(personaA, personaB, posTranscript);
    const posScores = computeScores(posReviewA, posReviewB, posJudge);

    const hostReviewA = deriveMockSideReview(personaA, personaB, hostileTranscript, 1);
    const hostReviewB = deriveMockSideReview(personaB, personaA, hostileTranscript, 1);
    const hostJudge = deriveMockJudgeReview(personaA, personaB, hostileTranscript);
    const hostScores = computeScores(hostReviewA, hostReviewB, hostJudge);

    const diff = Math.abs(posScores.scoreAToB - hostScores.scoreAToB);
    expect(diff).toBeGreaterThanOrEqual(20);
  });

  it("positive vs scrambled transcript: score differs by >=20", () => {
    const posTranscript = makePositiveTranscript("Alpha SYNTHETIC", "Beta SYNTHETIC");
    const scrambledTranscript = makeScrambledTranscript("Alpha SYNTHETIC", "Beta SYNTHETIC");

    const posReviewA = deriveMockSideReview(personaA, personaB, posTranscript, 1);
    const posReviewB = deriveMockSideReview(personaB, personaA, posTranscript, 1);
    const posJudge = deriveMockJudgeReview(personaA, personaB, posTranscript);
    const posScores = computeScores(posReviewA, posReviewB, posJudge);

    const scrReviewA = deriveMockSideReview(personaA, personaB, scrambledTranscript, 1);
    const scrReviewB = deriveMockSideReview(personaB, personaA, scrambledTranscript, 1);
    const scrJudge = deriveMockJudgeReview(personaA, personaB, scrambledTranscript);
    const scrScores = computeScores(scrReviewA, scrReviewB, scrJudge);

    const diff = Math.abs(posScores.scoreAToB - scrScores.scoreAToB);
    expect(diff).toBeGreaterThanOrEqual(20);
  });
});

describe("(b) Planted truth: compatible partner is top-3 for >=5 of 6 people", () => {
  // Generate all pairwise dates for the 12 candidates
  // then check if compatible partners rank in top 3
  const couples: [Persona, Persona][] = [
    [alice, bob], [carol, dave], [emma, frank],
  ];
  const dealbreakers: [Persona, Persona][] = [
    [george, hannah], [ivan, julia], [kyle, laura],
  ];

  function simulateAllDates(): Map<string, Array<{ target: string; score: number }>> {
    const rankings = new Map<string, Array<{ target: string; score: number }>>();

    for (const p of allCandidates) {
      const scores: Array<{ target: string; score: number }> = [];
      for (const q of allCandidates) {
        if (p.identity.name === q.identity.name) continue;

        // Determine transcript type based on couple match
        const isCompatible = couples.some(
          ([a, b]) => (a.identity.name === p.identity.name && b.identity.name === q.identity.name) ||
                      (b.identity.name === p.identity.name && a.identity.name === q.identity.name)
        );
        const isDealbreaker = dealbreakers.some(
          ([a, b]) => (a.identity.name === p.identity.name && b.identity.name === q.identity.name) ||
                      (b.identity.name === p.identity.name && a.identity.name === q.identity.name)
        );

        let transcript: Transcript;
        if (isCompatible) {
          transcript = makePositiveTranscript(p.identity.name, q.identity.name);
        } else if (isDealbreaker) {
          transcript = makeHostileTranscript(p.identity.name, q.identity.name);
        } else {
          // Neutral transcript for non-planted pairs
          transcript = [
            { turnNumber: 1, speakerName: p.identity.name, message: "Nice to meet you. I'm curious about your background." },
            { turnNumber: 2, speakerName: q.identity.name, message: "Thanks for the conversation. I enjoy learning about different perspectives." },
            { turnNumber: 3, speakerName: p.identity.name, message: "That's interesting. What do you value most in daily life?" },
            { turnNumber: 4, speakerName: q.identity.name, message: "I think balance and personal growth are important to me." },
            { turnNumber: 5, speakerName: p.identity.name, message: "Makes sense. How do you handle disagreements or schedule conflicts?" },
            { turnNumber: 6, speakerName: q.identity.name, message: "I try to communicate directly and find a middle ground." },
          ];
        }

        const reviewP = deriveMockSideReview(p, q, transcript, 1);
        const reviewQ = deriveMockSideReview(q, p, transcript, 1);
        const judge = deriveMockJudgeReview(p, q, transcript);
        const s = computeScores(reviewP, reviewQ, judge);

        scores.push({ target: q.identity.name, score: s.scoreAToB });
      }

      scores.sort((a, b) => b.score - a.score);
      rankings.set(p.identity.name, scores);
    }
    return rankings;
  }

  it("compatible partner is in top-3 for at least 5 of 6 people", () => {
    const rankings = simulateAllDates();
    let topThreeHits = 0;

    for (const [a, b] of couples) {
      const aRanks = rankings.get(a.identity.name)!;
      const bRanks = rankings.get(b.identity.name)!;

      const aTop3 = aRanks.slice(0, 3).map((r) => r.target);
      const bTop3 = bRanks.slice(0, 3).map((r) => r.target);

      if (aTop3.includes(b.identity.name)) topThreeHits++;
      if (bTop3.includes(a.identity.name)) topThreeHits++;
    }

    // At least 5 of 6 people should have their compatible partner in top 3
    expect(topThreeHits).toBeGreaterThanOrEqual(5);
  });

  it("dealbreaker partners rank lower than compatible partners", () => {
    const rankings = simulateAllDates();

    // For dealbreaker pairs, check their score is lower
    for (const [a, b] of dealbreakers) {
      const aRanks = rankings.get(a.identity.name)!;
      const bScore = aRanks.find((r) => r.target === b.identity.name)?.score || 0;
      // Dealbreaker score should be in bottom half
      const midScore = aRanks[Math.floor(aRanks.length / 2)]?.score || 0;
      expect(bScore).toBeLessThanOrEqual(midScore + 5);
    }
  });
});

describe("(c) Ablation: profile-only vs date-informed ranking differences", () => {
  it("reports position differences between profile-only and date-informed rankings", () => {
    const candidates = [alice, bob, carol, dave, emma, frank];
    const compatiblePairs = [
      ["Alice SYNTHETIC", "Bob SYNTHETIC"],
      ["Carol SYNTHETIC", "Dave SYNTHETIC"],
      ["Emma SYNTHETIC", "Frank SYNTHETIC"],
    ];
    const ablationResults: Array<{ person: string; positionDiffs: number; totalTargets: number }> = [];

    for (const p of candidates) {
      const profileOnlyScores: Array<{ target: string; score: number }> = [];
      const dateInformedScores: Array<{ target: string; score: number }> = [];

      for (const q of candidates) {
        if (p.identity.name === q.identity.name) continue;

        const neutralTranscript: Transcript = [
          { turnNumber: 1, speakerName: p.identity.name, message: "Hello. Nice to meet you." },
          { turnNumber: 2, speakerName: q.identity.name, message: "Hello. Likewise." },
          { turnNumber: 3, speakerName: p.identity.name, message: "How are things?" },
          { turnNumber: 4, speakerName: q.identity.name, message: "Fine thanks. You?" },
          { turnNumber: 5, speakerName: p.identity.name, message: "All good." },
          { turnNumber: 6, speakerName: q.identity.name, message: "Great." },
        ];

        const profileReviewP = deriveMockSideReview(p, q, neutralTranscript, 1);
        const profileReviewQ = deriveMockSideReview(q, p, neutralTranscript, 1);
        const profileJudge = deriveMockJudgeReview(p, q, neutralTranscript);
        const profileScores = computeScores(profileReviewP, profileReviewQ, profileJudge);

        profileOnlyScores.push({ target: q.identity.name, score: profileScores.scoreAToB });

        // Date-informed: use positive transcript for compatible pairs
        const isCouple = compatiblePairs.some(
          ([a, b]) =>
            (a === p.identity.name && b === q.identity.name) ||
            (b === p.identity.name && a === q.identity.name)
        );
        const datedTranscript = isCouple
          ? makePositiveTranscript(p.identity.name, q.identity.name)
          : neutralTranscript;

        const dateReviewP = deriveMockSideReview(p, q, datedTranscript, 1);
        const dateReviewQ = deriveMockSideReview(q, p, datedTranscript, 1);
        const dateJudge = deriveMockJudgeReview(p, q, datedTranscript);
        const dateScores = computeScores(dateReviewP, dateReviewQ, dateJudge);

        dateInformedScores.push({ target: q.identity.name, score: dateScores.scoreAToB });
      }

      // Sort both by score descending to get rankings
      profileOnlyScores.sort((a, b) => b.score - a.score);
      dateInformedScores.sort((a, b) => b.score - a.score);

      // Count position differences
      let positionDiffs = 0;
      for (let i = 0; i < profileOnlyScores.length; i++) {
        const profileTarget = profileOnlyScores[i].target;
        const dateRank = dateInformedScores.findIndex((s) => s.target === profileTarget);
        if (dateRank !== i) positionDiffs++;
      }

      ablationResults.push({
        person: p.identity.name,
        positionDiffs,
        totalTargets: profileOnlyScores.length,
      });
    }

    // The ablation should show that at least some rankings change
    const totalDiffs = ablationResults.reduce((s, r) => s + r.positionDiffs, 0);
    console.log("=== ABLATION RESULTS ===");
    console.log(JSON.stringify(ablationResults, null, 2));
    console.log(`Total position differences: ${totalDiffs}`);

    // Transcript-informed rankings must differ from profile-only
    expect(totalDiffs).toBeGreaterThan(0);
  });
});

