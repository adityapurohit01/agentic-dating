"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart, Play, CheckCircle2, Clock, ArrowRight, Sparkles } from "lucide-react";

export default function DatesFeedPage() {
  const [dates, setDates] = useState<any[]>([]);
  const [selectedRound, setSelectedRound] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);

  const fetchDates = async () => {
    try {
      let url = "/api/dates";
      if (selectedRound !== "all") url += `?round=${selectedRound}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setDates(data.dates || []);
      }
    } catch {} finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDates();
    const interval = setInterval(fetchDates, 3000);
    return () => clearInterval(interval);
  }, [selectedRound]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white flex items-center gap-2.5">
            <Heart className="w-7 h-7 text-pink-500 fill-pink-500" />
            Agent Dating Feed
          </h1>
          <p className="text-zinc-400 text-sm mt-1">
            Simulated 1-on-1 dates between candidate agents.
          </p>
        </div>

        {/* Round Filter */}
        <div className="flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 p-1 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setSelectedRound("all")}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              selectedRound === "all" ? "bg-rose-600 text-white" : "text-zinc-400 hover:text-white"
            }`}
          >
            All Rounds
          </button>
          <button
            onClick={() => setSelectedRound("1")}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              selectedRound === "1" ? "bg-rose-600 text-white" : "text-zinc-400 hover:text-white"
            }`}
          >
            Round 1 (Speed)
          </button>
          <button
            onClick={() => setSelectedRound("2")}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              selectedRound === "2" ? "bg-rose-600 text-white" : "text-zinc-400 hover:text-white"
            }`}
          >
            Round 2 (Deep)
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-20 text-zinc-500 text-sm">Loading simulated dates...</div>
      ) : dates.length === 0 ? (
        <div className="text-center py-20 bg-zinc-900/30 border border-zinc-800 rounded-2xl space-y-3">
          <p className="text-zinc-400 text-sm">No dates recorded yet.</p>
          <Link href="/" className="inline-block px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold">
            Run Pipeline
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {dates.map((d) => {
            const isDone = d.status === "done";
            const isInProgress = d.status === "in_progress";

            return (
              <Link
                key={d.id}
                href={`/dates/${d.id}`}
                className="bg-zinc-900/40 hover:bg-zinc-900/80 border border-zinc-800/80 hover:border-zinc-700 rounded-2xl p-5 transition-all flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold px-2 py-0.5 rounded text-[10px] uppercase tracking-wider bg-zinc-800 text-zinc-300">
                      Round {d.round} {d.round === 1 ? "(Speed)" : "(Deep)"}
                    </span>

                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 ${
                      isDone
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        : isInProgress
                        ? "bg-rose-500/10 text-rose-400 border border-rose-500/20 animate-pulse"
                        : "bg-zinc-800 text-zinc-500"
                    }`}>
                      {isDone ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                      {d.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm font-bold text-white">
                    <span className="group-hover:text-rose-400 transition-colors">{d.aName}</span>
                    <Heart className="w-4 h-4 text-rose-500 fill-rose-500 shrink-0 mx-2" />
                    <span className="group-hover:text-rose-400 transition-colors">{d.bName}</span>
                  </div>

                  {d.scene && (
                    <p className="text-xs text-zinc-400 line-clamp-1 italic">
                      📍 {d.scene.scene}
                    </p>
                  )}
                </div>

                <div className="pt-2 border-t border-zinc-800/60 flex items-center justify-between text-xs">
                  {isDone && d.mutualScore !== null ? (
                    <div className="flex items-center gap-2">
                      <span className="text-zinc-500">Mutual Score:</span>
                      <strong className="text-rose-400 font-bold">{d.mutualScore}/100</strong>
                    </div>
                  ) : (
                    <span className="text-zinc-500">In Simulation</span>
                  )}

                  <span className="text-rose-400 group-hover:text-rose-300 font-semibold flex items-center gap-1">
                    Watch Date <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
