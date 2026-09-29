"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface CausalityResult {
  positiveScore: number;
  hostileScore: number;
  diff: number;
  passes: boolean;
}

interface PlantedResult {
  person: string;
  compatiblePartner: string;
  partnerRank: number;
  topThree: string[];
  reason: string;
}

interface AblationResult {
  person: string;
  profileOnlyRanking: string[];
  dateInformedRanking: string[];
  positionDiffs: number;
}

interface EvalData {
  causality: CausalityResult;
  plantedTruth: {
    results: PlantedResult[];
    topThreeHits: number;
    total: number;
    passes: boolean;
  };
  ablation: {
    results: AblationResult[];
    totalPositionDiffs: number;
  };
}

export default function EvalPage() {
  const [data, setData] = useState<EvalData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/eval")
      .then((r) => r.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch((e) => {
        setError(e.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-400 mx-auto mb-4" />
          <p className="text-violet-300 text-lg">Running evaluation tests...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 flex items-center justify-center">
        <div className="text-red-400 text-lg">Error: {error || "No data"}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <Link href="/" className="text-violet-400 hover:text-violet-300 text-sm mb-2 block">
              ← Back to Dashboard
            </Link>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-300 to-pink-300 bg-clip-text text-transparent">
              Scoring Evaluation
            </h1>
            <p className="text-slate-400 mt-2">
              Transcript causality &bull; Planted truth &bull; Ablation analysis
            </p>
          </div>
          <div className="px-3 py-1 rounded-full text-xs font-mono bg-amber-500/20 text-amber-300 border border-amber-500/30">
            MOCK MODE
          </div>
        </div>

        {/* Causality Test */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-3 h-3 rounded-full ${data.causality.passes ? "bg-emerald-400" : "bg-red-400"}`} />
            <h2 className="text-2xl font-semibold">
              (a) Causality Test
            </h2>
            <span className={`px-2 py-0.5 rounded text-xs font-bold ${data.causality.passes ? "bg-emerald-500/20 text-emerald-300" : "bg-red-500/20 text-red-300"}`}>
              {data.causality.passes ? "PASS" : "FAIL"}
            </span>
          </div>
          <p className="text-slate-400 text-sm mb-4">
            Same profiles, different transcripts. Score must differ by ≥20 points.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-5">
              <div className="text-sm text-emerald-400 font-medium mb-1">Positive Transcript</div>
              <div className="text-3xl font-bold text-emerald-300">{data.causality.positiveScore.toFixed(1)}</div>
              <div className="text-xs text-slate-500 mt-1">Score A→B</div>
            </div>
            <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-5">
              <div className="text-sm text-red-400 font-medium mb-1">Hostile Transcript</div>
              <div className="text-3xl font-bold text-red-300">{data.causality.hostileScore.toFixed(1)}</div>
              <div className="text-xs text-slate-500 mt-1">Score A→B</div>
            </div>
            <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-5">
              <div className="text-sm text-violet-400 font-medium mb-1">Score Difference</div>
              <div className="text-3xl font-bold text-violet-300">{data.causality.diff.toFixed(1)}</div>
              <div className="text-xs text-slate-500 mt-1">Threshold: ≥20</div>
            </div>
          </div>
        </section>

        {/* Planted Truth Test */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-3 h-3 rounded-full ${data.plantedTruth.passes ? "bg-emerald-400" : "bg-red-400"}`} />
            <h2 className="text-2xl font-semibold">
              (b) Planted Truth
            </h2>
            <span className={`px-2 py-0.5 rounded text-xs font-bold ${data.plantedTruth.passes ? "bg-emerald-500/20 text-emerald-300" : "bg-red-500/20 text-red-300"}`}>
              {data.plantedTruth.passes ? "PASS" : "FAIL"} — {data.plantedTruth.topThreeHits}/{data.plantedTruth.total} in top 3
            </span>
          </div>
          <p className="text-slate-400 text-sm mb-4">
            6 SYNTHETIC couples (3 compatible, 3 deal-breaker). Compatible partner must be top-3 for ≥5 of 6 people.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700/50">
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">Person</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">Compatible Partner</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">Reason</th>
                  <th className="text-center py-3 px-4 text-slate-400 font-medium">Partner Rank</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">Top 3</th>
                </tr>
              </thead>
              <tbody>
                {data.plantedTruth.results.map((r, i) => (
                  <tr key={i} className="border-b border-slate-800/50 hover:bg-slate-800/30">
                    <td className="py-3 px-4 font-medium text-white">{r.person}</td>
                    <td className="py-3 px-4 text-violet-300">{r.compatiblePartner}</td>
                    <td className="py-3 px-4 text-slate-400">{r.reason}</td>
                    <td className="py-3 px-4 text-center">
                      <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold ${
                        r.partnerRank <= 3
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                          : "bg-red-500/20 text-red-300 border border-red-500/40"
                      }`}>
                        {r.partnerRank}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-xs text-slate-300 font-mono">{r.topThree.join(", ")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Ablation Test */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-3 h-3 rounded-full bg-blue-400" />
            <h2 className="text-2xl font-semibold">
              (c) Ablation Analysis
            </h2>
            <span className="px-2 py-0.5 rounded text-xs font-bold bg-blue-500/20 text-blue-300">
              {data.ablation.totalPositionDiffs} ranking positions changed
            </span>
          </div>
          <p className="text-slate-400 text-sm mb-4">
            Profile-only ranking vs transcript-informed ranking. Shows how many positions shifted.
          </p>
          <div className="space-y-4">
            {data.ablation.results.map((r, i) => (
              <div key={i} className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-semibold text-white">{r.person}</span>
                  <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                    r.positionDiffs > 0
                      ? "bg-amber-500/20 text-amber-300"
                      : "bg-slate-600/50 text-slate-400"
                  }`}>
                    {r.positionDiffs} position{r.positionDiffs !== 1 ? "s" : ""} changed
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-slate-500 mb-1 uppercase tracking-wider">Profile-Only</div>
                    <ol className="text-sm space-y-1">
                      {r.profileOnlyRanking.map((name, j) => (
                        <li key={j} className="text-slate-300 font-mono text-xs">
                          <span className="text-slate-500 mr-2">#{j + 1}</span>{name}
                        </li>
                      ))}
                    </ol>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 mb-1 uppercase tracking-wider">Date-Informed</div>
                    <ol className="text-sm space-y-1">
                      {r.dateInformedRanking.map((name, j) => (
                        <li key={j} className="text-violet-300 font-mono text-xs">
                          <span className="text-slate-500 mr-2">#{j + 1}</span>{name}
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Summary */}
        <section className="bg-gradient-to-r from-violet-900/40 to-pink-900/40 border border-violet-500/30 rounded-xl p-6">
          <h3 className="text-xl font-semibold mb-3">Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-slate-400">Causality:</span>{" "}
              <span className={data.causality.passes ? "text-emerald-300" : "text-red-300"}>
                {data.causality.passes ? "✓ PASS" : "✗ FAIL"} (Δ{data.causality.diff.toFixed(1)} ≥ 20)
              </span>
            </div>
            <div>
              <span className="text-slate-400">Planted Truth:</span>{" "}
              <span className={data.plantedTruth.passes ? "text-emerald-300" : "text-red-300"}>
                {data.plantedTruth.passes ? "✓ PASS" : "✗ FAIL"} ({data.plantedTruth.topThreeHits}/{data.plantedTruth.total} ≥ 5)
              </span>
            </div>
            <div>
              <span className="text-slate-400">Ablation:</span>{" "}
              <span className="text-blue-300">
                {data.ablation.totalPositionDiffs} positions shifted
              </span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
