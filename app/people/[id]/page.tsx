"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import {
  Heart, Sparkles, MessageSquare, Trophy, RefreshCw, X,
  ShieldCheck, AlertTriangle, ExternalLink, Image as ImageIcon,
  CheckCircle2, Brain, FileText, Activity
} from "lucide-react";

export default function PersonProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [data, setData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"persona" | "voice" | "memory" | "raw">("persona");
  const [selectedEvidence, setSelectedEvidence] = useState<{ label: string; refs: string[] } | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadData = async () => {
    try {
      const res = await fetch(`/api/people/${id}`);
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch {}
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await fetch(`/api/people/${id}/refresh`, { method: "POST" });
      await loadData();
    } catch {} finally {
      setIsRefreshing(false);
    }
  };

  if (!data) {
    return <div className="max-w-5xl mx-auto px-4 py-20 text-center text-zinc-500">Loading candidate profile...</div>;
  }

  const { person, persona, facts, voice, media, memory, rawSources } = data;

  const findFact = (ref: string) => {
    return facts?.find((f: any) => f.source_ref === ref);
  };

  const findMedia = (ref: string) => {
    return media?.find((m: any) => m.localPath?.includes(ref.replace("ig:media:", "")));
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-8">
      {/* Header Profile Card */}
      <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                {person.name || "Candidate"}
              </h1>
              {person.name?.includes("SYNTHETIC") && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  SYNTHETIC
                </span>
              )}
            </div>
            <p className="text-sm text-zinc-400 font-medium">
              {persona?.identity?.headline || person.headline || "Analyzed Candidate"}
            </p>
            <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-500 pt-1">
              <span>{persona?.identity?.location || "Location not stated"}</span>
              <span>•</span>
              <span>{persona?.identity?.company || "Company not stated"}</span>
              <span>•</span>
              <a href={person.linkedin_url} target="_blank" className="text-blue-400 hover:underline flex items-center gap-1">
                LinkedIn <ExternalLink className="w-3 h-3" />
              </a>
              <span>•</span>
              <a href={person.instagram_url} target="_blank" className="text-pink-400 hover:underline flex items-center gap-1">
                Instagram <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="p-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors border border-zinc-700"
              title="Re-analyze Profile"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
            </button>
            <Link
              href={`/people/${id}/chat`}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
              Chat Voice Demo
            </Link>
            <Link
              href={`/people/${id}/rankings`}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <Trophy className="w-4 h-4" />
              Rankings
            </Link>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-zinc-800 text-xs font-semibold gap-6">
          <button
            onClick={() => setActiveTab("persona")}
            className={`pb-3 flex items-center gap-1.5 transition-colors ${
              activeTab === "persona" ? "text-rose-400 border-b-2 border-rose-500" : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <Brain className="w-4 h-4" /> Persona & Needs
          </button>
          <button
            onClick={() => setActiveTab("voice")}
            className={`pb-3 flex items-center gap-1.5 transition-colors ${
              activeTab === "voice" ? "text-rose-400 border-b-2 border-rose-500" : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <Activity className="w-4 h-4" /> Voice Card
          </button>
          <button
            onClick={() => setActiveTab("memory")}
            className={`pb-3 flex items-center gap-1.5 transition-colors ${
              activeTab === "memory" ? "text-rose-400 border-b-2 border-rose-500" : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <Sparkles className="w-4 h-4" /> Memory & Lessons
          </button>
          <button
            onClick={() => setActiveTab("raw")}
            className={`pb-3 flex items-center gap-1.5 transition-colors ${
              activeTab === "raw" ? "text-rose-400 border-b-2 border-rose-500" : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <FileText className="w-4 h-4" /> Raw Sources
          </button>
        </div>
      </div>

      {/* Main Tab Content */}
      {activeTab === "persona" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column: Summary, Needs, Values */}
          <div className="md:col-span-2 space-y-6">
            {/* Summary */}
            <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6 space-y-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-400">Psychological Profile Summary</h3>
              <p className="text-sm text-zinc-200 leading-relaxed">
                {persona?.summary || "Profile analysis pending."}
              </p>
            </div>

            {/* Core Needs with Weight Bars */}
            <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-400">Core Relational Needs</h3>
                <span className="text-xs text-zinc-500">Click any need to view cited evidence</span>
              </div>

              <div className="space-y-3">
                {persona?.needs?.map((n: any, idx: number) => (
                  <div
                    key={idx}
                    onClick={() => setSelectedEvidence({ label: n.need, refs: n.evidence || [] })}
                    className="p-3.5 rounded-xl bg-zinc-950/60 hover:bg-zinc-950 border border-zinc-800 hover:border-zinc-700 cursor-pointer transition-all space-y-2 group"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <div className="font-semibold text-zinc-200 group-hover:text-rose-400 transition-colors flex items-center gap-2">
                        <span>{n.need}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          n.kind === "stated" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                        }`}>
                          {n.kind}
                        </span>
                      </div>
                      <span className="text-zinc-500 font-mono text-[11px]">Weight {n.weight}/5</span>
                    </div>

                    <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-rose-500 to-pink-500 h-full rounded-full transition-all"
                        style={{ width: `${(n.weight / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hobbies & Interests */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-5 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Hobbies & Activities</h4>
                <div className="flex flex-wrap gap-2">
                  {persona?.hobbies?.map((h: any, i: number) => (
                    <button
                      key={i}
                      onClick={() => setSelectedEvidence({ label: h.name, refs: h.evidence || [] })}
                      className="px-3 py-1.5 rounded-xl bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 text-xs text-zinc-300 transition-colors"
                    >
                      {h.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-5 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Intellectual Interests</h4>
                <div className="flex flex-wrap gap-2">
                  {persona?.interests?.map((item: any, i: number) => (
                    <button
                      key={i}
                      onClick={() => setSelectedEvidence({ label: item.name, refs: item.evidence || [] })}
                      className="px-3 py-1.5 rounded-xl bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 text-xs text-zinc-300 transition-colors"
                    >
                      {item.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Green Flags, Friction Points, Unknowns */}
          <div className="space-y-6">
            {/* Green Flags */}
            <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-5 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Green Flags
              </h4>
              <div className="space-y-2 text-xs">
                {persona?.green_flags?.map((g: any, i: number) => (
                  <div
                    key={i}
                    onClick={() => setSelectedEvidence({ label: g.flag, refs: g.evidence || [] })}
                    className="p-2.5 rounded-xl bg-emerald-950/20 border border-emerald-900/30 text-emerald-200 cursor-pointer hover:bg-emerald-950/40 transition-colors"
                  >
                    {g.flag}
                  </div>
                ))}
              </div>
            </div>

            {/* Friction Points */}
            <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-5 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" /> Potential Friction Points
              </h4>
              <div className="space-y-2 text-xs">
                {persona?.friction_points?.map((f: any, i: number) => (
                  <div
                    key={i}
                    onClick={() => setSelectedEvidence({ label: f.point, refs: f.evidence || [] })}
                    className="p-2.5 rounded-xl bg-amber-950/20 border border-amber-900/30 text-amber-200 cursor-pointer hover:bg-amber-950/40 transition-colors"
                  >
                    <div className="font-semibold">{f.point}</div>
                    <div className="text-[11px] text-amber-300/80 mt-0.5">{f.why}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Unknowns Section (Honesty disclosure) */}
            <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-5 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                Honest Unknowns
              </h4>
              <p className="text-[11px] text-zinc-500">
                Traits the two public profiles could not reliably establish:
              </p>
              <ul className="list-disc list-inside space-y-1 text-xs text-zinc-400">
                {persona?.unknowns?.map((u: string, i: number) => (
                  <li key={i}>{u}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Voice Card Tab */}
      {activeTab === "voice" && (
        <div className="space-y-6">
          <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-white">Voice Fingerprint & Fidelity</h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Style metrics and discriminator Turing test score.
                </p>
              </div>

              {voice?.fidelityScore !== null && voice?.fidelityScore !== undefined ? (
                <div className="bg-zinc-950 border border-zinc-800 px-4 py-2 rounded-xl text-center">
                  <div className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold">Fidelity Turing Score</div>
                  <div className="text-xl font-extrabold text-rose-400">
                    {Math.round(voice.fidelityScore * 100)}%
                  </div>
                  <div className="text-[9px] text-zinc-500">(Rough discriminator check)</div>
                </div>
              ) : (
                <div className="text-xs text-zinc-500 italic">Not enough caption data for fidelity test</div>
              )}
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 text-center">
                <div className="text-[10px] font-bold text-zinc-500 uppercase">Avg Sentence Words</div>
                <div className="text-lg font-bold text-white mt-1">{voice?.metrics?.avgSentenceLength || 0}</div>
              </div>
              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 text-center">
                <div className="text-[10px] font-bold text-zinc-500 uppercase">Emoji / 100 Chars</div>
                <div className="text-lg font-bold text-white mt-1">{voice?.metrics?.emojiPer100Chars || 0}</div>
              </div>
              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 text-center">
                <div className="text-[10px] font-bold text-zinc-500 uppercase">Hashtag Rate</div>
                <div className="text-lg font-bold text-white mt-1">{voice?.metrics?.hashtagRate || 0}</div>
              </div>
              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 text-center">
                <div className="text-[10px] font-bold text-zinc-500 uppercase">Language Mix</div>
                <div className="text-xs font-semibold text-white mt-2 truncate">{voice?.metrics?.languageScriptMix || "Latin"}</div>
              </div>
            </div>

            {/* Style Notes */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Voice Style Guidelines</h4>
              <p className="text-sm text-zinc-200 bg-zinc-950/60 p-4 rounded-xl border border-zinc-800/80 leading-relaxed">
                {voice?.styleNotes || "Conversational, direct, authentic pacing."}
              </p>
            </div>

            {/* Exemplars */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Verbatim Real Exemplars</h4>
              <div className="space-y-2">
                {voice?.exemplars?.map((ex: string, i: number) => (
                  <div key={i} className="p-3 rounded-xl bg-zinc-950 border border-zinc-800/60 text-xs text-zinc-300 italic">
                    &ldquo;{ex}&rdquo;
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Memory Tab */}
      {activeTab === "memory" && (
        <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6 space-y-6">
          <div>
            <h3 className="text-lg font-bold text-white">Memory & Episodic Lessons</h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Reflective lessons stored in FTS5 table and recalled during Round 2 dates.
            </p>
          </div>

          <div className="space-y-3">
            {memory?.length === 0 ? (
              <p className="text-xs text-zinc-500 italic">No memories or reflection lessons logged yet.</p>
            ) : (
              memory.map((m: any, i: number) => (
                <div key={i} className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs space-y-1">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="font-bold uppercase tracking-wider text-rose-400">{m.kind}</span>
                    <span className="text-zinc-600">{new Date(m.created_at).toLocaleTimeString()}</span>
                  </div>
                  <div className="text-zinc-200">{m.content}</div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Raw Sources Tab */}
      {activeTab === "raw" && (
        <div className="space-y-6">
          {rawSources?.map((rs: any, i: number) => (
            <div key={i} className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold uppercase tracking-wider text-zinc-300">
                  {rs.source} Raw Data
                </h4>
                <span className="text-xs text-zinc-500">Fetched: {new Date(rs.fetchedAt).toLocaleString()}</span>
              </div>
              <pre className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 text-[11px] text-zinc-400 overflow-x-auto max-h-96">
                {JSON.stringify(rs.data, null, 2)}
              </pre>
            </div>
          ))}
        </div>
      )}

      {/* Evidence Drawer Modal */}
      {selectedEvidence && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-700 rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-2xl animate-fadeIn">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="font-bold text-sm text-white">
                Proof & Provenance: <span className="text-rose-400">{selectedEvidence.label}</span>
              </div>
              <button
                onClick={() => setSelectedEvidence(null)}
                className="text-zinc-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
              {selectedEvidence.refs.length === 0 ? (
                <p className="text-xs text-zinc-400 italic">No direct reference links provided for this claim.</p>
              ) : (
                selectedEvidence.refs.map((ref, idx) => {
                  const fact = findFact(ref);
                  const med = findMedia(ref);

                  return (
                    <div key={idx} className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2">
                      <div className="text-[10px] font-mono text-rose-400 font-bold">[{ref}]</div>
                      {fact && <p className="text-xs text-zinc-200">{fact.text}</p>}
                      {med && (
                        <div className="space-y-2 pt-1">
                          {med.originalUrl && (
                            <img
                              src={med.originalUrl}
                              alt="Verified source"
                              className="rounded-lg max-h-48 object-cover border border-zinc-800"
                            />
                          )}
                          {med.vision && (
                            <p className="text-[11px] text-zinc-400 italic">
                              Vision AI detected: {med.vision.activities?.join(", ")} in {med.vision.setting}.
                            </p>
                          )}
                        </div>
                      )}
                      {!fact && !med && (
                        <p className="text-xs text-zinc-400 italic">Extracted from public profile activity at source ref: {ref}</p>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            <button
              onClick={() => setSelectedEvidence(null)}
              className="w-full py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-bold text-zinc-200"
            >
              Close Proof Drawer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
