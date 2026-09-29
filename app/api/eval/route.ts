import { NextResponse } from "next/server";
import { deriveMockSideReview, SideReview } from "@/server/dating/review";
import { deriveMockJudgeReview, JudgeReview } from "@/server/dating/judge";
import { computeScores } from "@/server/dating/scorer";
import { Persona } from "@/server/reader/schemas";

// ── Synthetic test data (labelled SYNTHETIC) ──

function makePersona(name: string, overrides: Partial<Persona>): Persona {
  return {
    identity: { name, headline: "", location: "", current_role: "", company: "", education: [] },
    summary: overrides.summary || `${name} is a SYNTHETIC persona for evaluation.`,
    needs: overrides.needs || [
      { need: "Mutual respect", kind: "inferred" as const, weight: 5, confidence: 0.9, evidence: [] },
    ],
    hobbies: overrides.hobbies || [],
    interests: overrides.interests || [],
    values: overrides.values || [],
    lifestyle: overrides.lifestyle || { rhythm: "", social_energy: "", travel: "", fitness: "", food: "", other: "" },
    ambition: overrides.ambition || { level: "Medium", direction: "", evidence: [] },
    humor: overrides.humor || { style: "Warm", evidence: [] },
    communication_style: overrides.communication_style || { summary: "Direct", evidence: [] },
    relationship_signals: [],
    friction_points: [],
    green_flags: [],
    unknowns: [],
    ...overrides,
  } as Persona;
}

type Transcript = Array<{ turnNumber: number; speakerName: string; message: string }>;

function positiveTranscript(a: string, b: string): Transcript {
  return [
    { turnNumber: 1, speakerName: a, message: "Hey! This is wonderful — I love meeting someone with genuine curiosity and passion for life." },
    { turnNumber: 2, speakerName: b, message: "I feel the same! Your approach to creative problem-solving is inspiring and brilliant." },
    { turnNumber: 3, speakerName: a, message: "I deeply appreciate that. I agree — having aligned values like empathy and authenticity matters." },
    { turnNumber: 4, speakerName: b, message: "Beautiful perspective. I admire your thoughtful energy and the way you connect ideas together." },
    { turnNumber: 5, speakerName: a, message: "This resonates perfectly. I feel genuine warmth and excitement about our shared interests." },
    { turnNumber: 6, speakerName: b, message: "Absolutely amazing conversation. I'd love to explore these ideas and experiences more together." },
  ];
}

function hostileTranscript(a: string, b: string): Transcript {
  return [
    { turnNumber: 1, speakerName: a, message: "This is uncomfortable. I struggle with these forced conversations and dislike the awkward setup." },
    { turnNumber: 2, speakerName: b, message: "Unfortunately I find this terrible. Your rigid approach is frustrating and exhausting." },
    { turnNumber: 3, speakerName: a, message: "I disagree with everything. The tension is stressful and your stubbornness is draining." },
    { turnNumber: 4, speakerName: b, message: "Awful. This hostile exchange is toxic and boring. I hate superficial interactions." },
    { turnNumber: 5, speakerName: a, message: "Disappointed. Difficult, shallow, uncomfortable conversation. I worry about compatibility." },
    { turnNumber: 6, speakerName: b, message: "Terrible date. Cold, dismissive, stressful. This was an awful waste of time." },
  ];
}

function neutralTranscript(a: string, b: string): Transcript {
  return [
    { turnNumber: 1, speakerName: a, message: "Hello. Nice to meet you." },
    { turnNumber: 2, speakerName: b, message: "Hello. Likewise." },
    { turnNumber: 3, speakerName: a, message: "How are things?" },
    { turnNumber: 4, speakerName: b, message: "Fine thanks. And you?" },
    { turnNumber: 5, speakerName: a, message: "All good. Take care." },
    { turnNumber: 6, speakerName: b, message: "Thanks. Goodbye." },
  ];
}

// Compatible couples
const couples: Array<{ a: Persona; b: Persona; reason: string }> = [
  {
    a: makePersona("Alice SYNTHETIC", {
      summary: "SYNTHETIC: AI researcher who loves hiking.",
      needs: [{ need: "Shared hiking and outdoor adventures", kind: "stated", weight: 5, confidence: 0.9, evidence: [] }],
      hobbies: [{ name: "Hiking", confidence: 0.9, evidence: [] }],
    }),
    b: makePersona("Bob SYNTHETIC", {
      summary: "SYNTHETIC: Software engineer who hikes mountains.",
      needs: [{ need: "Partner who shares hiking passion", kind: "stated", weight: 5, confidence: 0.9, evidence: [] }],
      hobbies: [{ name: "Trail Running & Hiking", confidence: 0.9, evidence: [] }],
    }),
    reason: "Both love hiking and technology",
  },
  {
    a: makePersona("Carol SYNTHETIC", {
      summary: "SYNTHETIC: Passionate chef and family person.",
      needs: [{ need: "Shared cooking and food exploration", kind: "stated", weight: 5, confidence: 0.9, evidence: [] }],
      hobbies: [{ name: "Cooking & Culinary Arts", confidence: 0.9, evidence: [] }],
    }),
    b: makePersona("Dave SYNTHETIC", {
      summary: "SYNTHETIC: Culinary enthusiast and community volunteer.",
      needs: [{ need: "Partner who loves cooking", kind: "stated", weight: 5, confidence: 0.9, evidence: [] }],
      hobbies: [{ name: "Cooking & Recipe Development", confidence: 0.9, evidence: [] }],
    }),
    reason: "Both love cooking and family values",
  },
  {
    a: makePersona("Emma SYNTHETIC", {
      summary: "SYNTHETIC: Touring musician who lives for travel.",
      needs: [{ need: "Partner who shares music passion", kind: "stated", weight: 5, confidence: 0.9, evidence: [] }],
      hobbies: [{ name: "Guitar & Music Performance", confidence: 0.9, evidence: [] }],
    }),
    b: makePersona("Frank SYNTHETIC", {
      summary: "SYNTHETIC: Music producer who travels the world.",
      needs: [{ need: "Shared love for music creation", kind: "stated", weight: 5, confidence: 0.9, evidence: [] }],
      hobbies: [{ name: "Music Production", confidence: 0.9, evidence: [] }],
    }),
    reason: "Both love music and travel",
  },
];

// Dealbreaker pairs
const dealbreakers: Array<{ a: Persona; b: Persona; reason: string }> = [
  {
    a: makePersona("George SYNTHETIC", {
      summary: "SYNTHETIC: Quiet librarian who never travels.",
      needs: [{ need: "Stable home routine without travel", kind: "stated", weight: 5, confidence: 0.9, evidence: [] }],
    }),
    b: makePersona("Hannah SYNTHETIC", {
      summary: "SYNTHETIC: Extreme sports adventurer always traveling.",
      needs: [{ need: "Constant travel and adrenaline", kind: "stated", weight: 5, confidence: 0.9, evidence: [] }],
    }),
    reason: "Homebody vs nomad",
  },
  {
    a: makePersona("Ivan SYNTHETIC", {
      summary: "SYNTHETIC: Strict vegan activist.",
      needs: [{ need: "Partner shares plant-based lifestyle", kind: "stated", weight: 5, confidence: 0.9, evidence: [] }],
    }),
    b: makePersona("Julia SYNTHETIC", {
      summary: "SYNTHETIC: Competitive barbecue pitmaster.",
      needs: [{ need: "Partner appreciates barbecue traditions", kind: "stated", weight: 5, confidence: 0.9, evidence: [] }],
    }),
    reason: "Vegan activist vs meat enthusiast",
  },
  {
    a: makePersona("Kyle SYNTHETIC", {
      summary: "SYNTHETIC: Techno-optimist, codes 14 hours a day.",
      needs: [{ need: "Passion for coding and technology", kind: "stated", weight: 5, confidence: 0.9, evidence: [] }],
    }),
    b: makePersona("Laura SYNTHETIC", {
      summary: "SYNTHETIC: Nature artist, avoids all technology.",
      needs: [{ need: "Partner values nature over screens", kind: "stated", weight: 5, confidence: 0.9, evidence: [] }],
    }),
    reason: "Tech maximalist vs off-grid",
  },
];

function computeDateScore(a: Persona, b: Persona, transcript: Transcript) {
  const reviewA = deriveMockSideReview(a, b, transcript, 1);
  const reviewB = deriveMockSideReview(b, a, transcript, 1);
  const judge = deriveMockJudgeReview(a, b, transcript);
  return { ...computeScores(reviewA, reviewB, judge), reviewA, reviewB, judge };
}

export async function GET() {
  const allCandidates = [
    ...couples.flatMap((c) => [c.a, c.b]),
    ...dealbreakers.flatMap((d) => [d.a, d.b]),
  ];

  // ── Causality Test ──
  const causalityA = allCandidates[0];
  const causalityB = allCandidates[1];
  const posScores = computeDateScore(causalityA, causalityB, positiveTranscript(causalityA.identity.name, causalityB.identity.name));
  const hostScores = computeDateScore(causalityA, causalityB, hostileTranscript(causalityA.identity.name, causalityB.identity.name));
  const causalityDiff = Math.abs(posScores.scoreAToB - hostScores.scoreAToB);

  // ── Planted Truth Test ──
  const plantedResults: Array<{
    person: string;
    compatiblePartner: string;
    partnerRank: number;
    topThree: string[];
    reason: string;
  }> = [];

  for (const couple of couples) {
    for (const [self, partner] of [[couple.a, couple.b], [couple.b, couple.a]] as [Persona, Persona][]) {
      const scores: Array<{ target: string; score: number }> = [];
      for (const q of allCandidates) {
        if (q.identity.name === self.identity.name) continue;
        const isMatch = q.identity.name === partner.identity.name;
        const isDealbreaker = dealbreakers.some(
          (d) =>
            (d.a.identity.name === self.identity.name && d.b.identity.name === q.identity.name) ||
            (d.b.identity.name === self.identity.name && d.a.identity.name === q.identity.name)
        );
        const transcript = isMatch
          ? positiveTranscript(self.identity.name, q.identity.name)
          : isDealbreaker
            ? hostileTranscript(self.identity.name, q.identity.name)
            : neutralTranscript(self.identity.name, q.identity.name);

        const s = computeDateScore(self, q, transcript);
        scores.push({ target: q.identity.name, score: s.scoreAToB });
      }
      scores.sort((a, b) => b.score - a.score);
      const partnerRank = scores.findIndex((s) => s.target === partner.identity.name) + 1;
      plantedResults.push({
        person: self.identity.name,
        compatiblePartner: partner.identity.name,
        partnerRank,
        topThree: scores.slice(0, 3).map((s) => `${s.target} (${s.score.toFixed(1)})`),
        reason: couple.reason,
      });
    }
  }
  const plantedTopThreeHits = plantedResults.filter((r) => r.partnerRank <= 3).length;

  // ── Ablation Test ──
  const ablationResults: Array<{
    person: string;
    profileOnlyRanking: string[];
    dateInformedRanking: string[];
    positionDiffs: number;
  }> = [];

  for (const p of allCandidates.slice(0, 6)) {
    const profileOnly: Array<{ target: string; score: number }> = [];
    const dateInformed: Array<{ target: string; score: number }> = [];

    for (const q of allCandidates.slice(0, 6)) {
      if (p.identity.name === q.identity.name) continue;

      const neutral = neutralTranscript(p.identity.name, q.identity.name);
      const pOnly = computeDateScore(p, q, neutral);
      profileOnly.push({ target: q.identity.name, score: pOnly.scoreAToB });

      const isCouple = couples.some(
        (c) =>
          (c.a.identity.name === p.identity.name && c.b.identity.name === q.identity.name) ||
          (c.b.identity.name === p.identity.name && c.a.identity.name === q.identity.name)
      );
      const dated = isCouple
        ? positiveTranscript(p.identity.name, q.identity.name)
        : neutral;
      const dInf = computeDateScore(p, q, dated);
      dateInformed.push({ target: q.identity.name, score: dInf.scoreAToB });
    }

    profileOnly.sort((a, b) => b.score - a.score);
    dateInformed.sort((a, b) => b.score - a.score);

    let diffs = 0;
    for (let i = 0; i < profileOnly.length; i++) {
      const t = profileOnly[i].target;
      const j = dateInformed.findIndex((s) => s.target === t);
      if (j !== i) diffs++;
    }

    ablationResults.push({
      person: p.identity.name,
      profileOnlyRanking: profileOnly.map((s) => `${s.target} (${s.score.toFixed(1)})`),
      dateInformedRanking: dateInformed.map((s) => `${s.target} (${s.score.toFixed(1)})`),
      positionDiffs: diffs,
    });
  }
  const totalAblationDiffs = ablationResults.reduce((s, r) => s + r.positionDiffs, 0);

  return NextResponse.json({
    causality: {
      positiveScore: posScores.scoreAToB,
      hostileScore: hostScores.scoreAToB,
      diff: causalityDiff,
      passes: causalityDiff >= 20,
    },
    plantedTruth: {
      results: plantedResults,
      topThreeHits: plantedTopThreeHits,
      total: plantedResults.length,
      passes: plantedTopThreeHits >= 5,
    },
    ablation: {
      results: ablationResults,
      totalPositionDiffs: totalAblationDiffs,
    },
  });
}
