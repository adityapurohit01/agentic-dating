"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { ArrowLeft, Play, RefreshCw, Heart, Sparkles, Scale, AlertTriangle, CheckCircle2, ShieldAlert } from "lucide-react";

export default function DateDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [dateData, setDateData] = useState<any>(null);
  const [turns, setTurns] = useState<any[]>([]);
  const [isReplaying, setIsReplaying] = useState(false);
  const [replayIndex, setReplayIndex] = useState(0);

  const fetchDate = async () => {
    try {
      const res = await fetch(`/api/dates/${id}`);
      if (res.ok) {
        const data = await res.json();
        setDateData(data);
        setTurns(data.turns || []);
      }
    } catch {}
  };

  useEffect(() => {
    fetchDate();

    // Connect to live SSE stream for this date
    const eventSource = new EventSource(`/api/dates/${id}/stream`);

    eventSource.addEventListener("turn", (e) => {
      try {
        const turnData = JSON.parse(e.data);
        setTurns((prev) => {
          if (prev.some((t) => t.turnNumber === turnData.turnNumber)) return prev;
          return [...prev, turnData];
        });
      } catch {}
    });

    eventSource.addEventListener("completed", () => {
      fetchDate();
    });

    return () => {
      eventSource.close();
    };
  }, [id]);

  // Replay animation mode
  useEffect(() => {
    if (!isReplaying) return;
    if (replayIndex >= (dateData?.turns?.length || 0)) {
      setIsReplaying(false);
      return;
    }
    const timer = setTimeout(() => {
      setReplayIndex((prev) => prev + 1);
    }, 1200);
    return () => clearTimeout(timer);
  }, [isReplaying, replayIndex, dateData]);

  const handleStartReplay = () => {
    setReplayIndex(1);
    setIsReplaying(true);
  };

  if (!dateData) {
    return <div className="max-w-5xl mx-auto px-4 py-20 text-center text-zinc-500">Loading date transcript...</div>;
  }

  const { date, reviewA, reviewB, judgeReview, factCheck } = dateData;
  const displayedTurns = isReplaying ? dateData.turns.slice(0, replayIndex) : turns;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-8">
      {/* Header */}
      <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
          <div>
            <Link href="/dates" className="text-xs text-zinc-400 hover:text-white flex items-center gap-1 mb-2">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Dates Feed
            </Link>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-3">
              <span>{date.aName}</span>
              <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
              <span>{date.bName}</span>
            </h1>
            <div className="flex items-center gap-2 mt-2 text-xs">
              <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 font-bold uppercase tracking-wider">
                Round {date.round} {date.round === 1 ? "(Speed Date)" : "(Deep Date)"}
              </span>
              <span className="text-zinc-500">•</span>
              <span className="text-zinc-400">Status: <strong className="text-white capitalize">{date.status}</strong></span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {date.status === "done" && (
              <button
                onClick={handleStartReplay}
                disabled={isReplaying}
                className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors border border-zinc-700"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                {isReplaying ? "Replaying..." : "Replay Date"}
              </button>
            )}
          </div>
        </div>

        {/* Scene & Topics Banner */}
        {date.scene && (
          <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800/80 space-y-2 text-xs">
            <div className="text-zinc-300"><strong className="text-rose-400">Scene:</strong> {date.scene.scene}</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-zinc-400 pt-1">
              <div><strong className="text-blue-400">Opening Topic:</strong> {date.scene.opening_topic}</div>
              <div><strong className="text-amber-400">Friction Topic:</strong> {date.scene.friction_topic}</div>
            </div>
          </div>
        )}
      </div>

      {/* Two-Column Stream / Transcript View */}
      <div className="bg-zinc-900/40 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
          <h2 className="font-bold text-lg text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-rose-500" />
            Live Conversation Transcript
          </h2>
          <span className="text-xs text-zinc-500 font-mono">
            {displayedTurns.length} turns recorded
          </span>
        </div>

        {displayedTurns.length === 0 ? (
          <div className="text-center py-12 text-zinc-500 text-sm">
            Agents are entering the date scene...
          </div>
        ) : (
          <div className="space-y-4 max-h-[550px] overflow-y-auto pr-2 custom-scrollbar">
            {displayedTurns.map((t: any, idx: number) => {
              const isSpeakerA = t.speakerId === date.aId;
              const unsupported = factCheck?.unsupported_claims?.find((u: any) => u.turn === t.turnNumber);
              const turnKey = t.id ? `turn-id-${t.id}` : `turn-${t.turnNumber ?? idx}-${idx}`;

              return (
                <div
                  key={turnKey}
                  className={`flex ${isSpeakerA ? "justify-start" : "justify-end"}`}
                >
                  <div
                    className={`max-w-[82%] rounded-2xl p-4 text-xs leading-relaxed space-y-1.5 ${
                      isSpeakerA
                        ? "bg-zinc-950 border border-zinc-800 text-zinc-200 rounded-bl-none"
                        : "bg-rose-950/40 border border-rose-900/50 text-rose-100 rounded-br-none"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 text-[10px] font-bold pb-1 border-b border-white/5">
                      <span className={isSpeakerA ? "text-blue-400" : "text-pink-400"}>
                        {t.speakerName || (isSpeakerA ? date.aName : date.bName)}
                      </span>
                      <span className="text-zinc-500 font-mono">Turn #{t.turnNumber}</span>
                    </div>

                    <p>{t.message}</p>

                    {unsupported && (
                      <div className="mt-2 p-2 rounded-lg bg-red-950/40 border border-red-900/50 text-[10px] text-red-300 flex items-center gap-1.5">
                        <ShieldAlert className="w-3.5 h-3.5 text-red-400 shrink-0" />
                        <span>Unsupported Claim: {unsupported.claim}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Post-Date Scorecard & Reviews */}
      {judgeReview && (
        <div className="space-y-6">
          {/* Neutral Judge Review */}
          <div className="bg-zinc-900/60 border border-amber-500/30 rounded-3xl p-6 sm:p-8 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Scale className="w-5 h-5 text-amber-400" />
                Neutral Judge Compatibility Assessment
              </h3>
              <div className="text-right">
                <div className="text-2xl font-black text-amber-400">{judgeReview.mutual_score}/100</div>
                <div className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold">Mutual Chemistry</div>
              </div>
            </div>

            <p className="text-xs text-zinc-300 bg-zinc-950/60 p-4 rounded-xl border border-zinc-800 leading-relaxed">
              {judgeReview.rationale}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 space-y-2">
                <h4 className="font-bold text-emerald-400 uppercase text-[10px] tracking-wider">Shared Ground</h4>
                <ul className="list-disc list-inside space-y-1 text-zinc-300">
                  {judgeReview.shared_ground?.map((sg: string, i: number) => (
                    <li key={`sg-${i}-${sg.slice(0, 15)}`}>{sg}</li>
                  ))}
                </ul>
              </div>

              <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 space-y-2">
                <h4 className="font-bold text-amber-400 uppercase text-[10px] tracking-wider">Friction Points</h4>
                <ul className="list-disc list-inside space-y-1 text-zinc-300">
                  {judgeReview.friction?.map((f: string, i: number) => (
                    <li key={`fr-${i}-${f.slice(0, 15)}`}>{f}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Side Reviews Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reviewA && (
              <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-blue-400">
                    {date.aName}&apos;s Private Review
                  </h4>
                  <span className="text-xs font-bold text-white">Would see again: {reviewA.would_see_again}%</span>
                </div>
                <p className="text-xs text-zinc-300 italic">&ldquo;{reviewA.summary}&rdquo;</p>
                <div className="pt-2 text-[11px] text-zinc-400">
                  <strong>Learned:</strong> {reviewA.learned_about_principal?.join("; ") || "None"}
                </div>
              </div>
            )}

            {reviewB && (
              <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-pink-400">
                    {date.bName}&apos;s Private Review
                  </h4>
                  <span className="text-xs font-bold text-white">Would see again: {reviewB.would_see_again}%</span>
                </div>
                <p className="text-xs text-zinc-300 italic">&ldquo;{reviewB.summary}&rdquo;</p>
                <div className="pt-2 text-[11px] text-zinc-400">
                  <strong>Learned:</strong> {reviewB.learned_about_principal?.join("; ") || "None"}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
