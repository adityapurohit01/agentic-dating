"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { Trophy, ArrowUpRight, ArrowDownRight, Minus, ArrowLeft, Play, AlertCircle, Heart } from "lucide-react";

export default function PersonRankingsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRankings = async () => {
      try {
        const res = await fetch(`/api/people/${id}/rankings`);
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch {} finally {
        setIsLoading(false);
      }
    };
    fetchRankings();
  }, [id]);

  if (isLoading) {
    return <div className="max-w-5xl mx-auto px-4 py-20 text-center text-zinc-500">Loading rankings...</div>;
  }

  if (!data || !data.rankings || data.rankings.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <Trophy className="w-12 h-12 text-zinc-600 mx-auto" />
        <h2 className="text-xl font-bold text-white">No Compatibility Rankings Yet</h2>
        <p className="text-sm text-zinc-400">
          Rankings are calculated after running Round 1 speed dates and Round 2 deep dates.
        </p>
        <Link href="/" className="inline-block px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold">
          Go to Pipeline
        </Link>
      </div>
    );
  }

  const { person, rankings } = data;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Link href={`/people/${id}`} className="text-xs text-zinc-400 hover:text-white flex items-center gap-1 mb-2">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Profile
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2">
            <Trophy className="w-7 h-7 text-amber-400" />
            Compatibility Rankings for {person.name}
          </h1>
          <p className="text-xs text-zinc-400">
            Ordered list of candidates evaluated by private agent reviews and neutral judge scoring.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {rankings.map((r: any) => {
          const isTopTier = r.r2Rank !== null;
          const mover = r.mover || 0;

          return (
            <div
              key={r.targetId}
              className={`p-5 rounded-2xl border transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
                r.rank === 1
                  ? "bg-amber-950/20 border-amber-500/40 shadow-lg shadow-amber-950/20"
                  : isTopTier
                  ? "bg-zinc-900/60 border-zinc-700/80"
                  : "bg-zinc-900/30 border-zinc-800/80"
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-extrabold text-base ${
                  r.rank === 1
                    ? "bg-amber-500 text-black shadow-md shadow-amber-500/30"
                    : r.rank <= 3
                    ? "bg-zinc-800 text-white"
                    : "bg-zinc-900 text-zinc-500 border border-zinc-800"
                }`}>
                  #{r.rank}
                </div>

                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <Link
                      href={`/people/${r.targetId}`}
                      className="font-bold text-base text-white hover:text-rose-400 transition-colors"
                    >
                      {r.targetName}
                    </Link>

                    {isTopTier && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                        Round 2 Finalist
                      </span>
                    )}

                    {/* Mover Badge */}
                    {mover > 0 && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-0.5">
                        <ArrowUpRight className="w-3 h-3" /> +{mover} after R2
                      </span>
                    )}
                    {mover < 0 && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500/10 text-red-400 border border-red-500/20 flex items-center gap-0.5">
                        <ArrowDownRight className="w-3 h-3" /> {mover} after R2
                      </span>
                    )}
                    {mover === 0 && r.r1Rank && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-zinc-800 text-zinc-400 flex items-center gap-0.5">
                        <Minus className="w-3 h-3" /> Steady
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-zinc-400 line-clamp-1">{r.targetHeadline}</p>

                  <div className="pt-1 space-y-1 text-xs text-zinc-300">
                    <p><strong className="text-emerald-400">Why fit:</strong> {r.rationale?.why_fit}</p>
                    <p><strong className="text-amber-400">Friction:</strong> {r.rationale?.friction}</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-zinc-800">
                <div className="text-right">
                  <div className="text-2xl font-black text-rose-400">{r.score}</div>
                  <div className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">Match Score</div>
                </div>

                {r.dateId && (
                  <Link
                    href={`/dates/${r.dateId}`}
                    className="px-3.5 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors border border-zinc-700"
                  >
                    <Play className="w-3 h-3 fill-white" /> Watch Date
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
