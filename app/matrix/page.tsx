"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Grid, Sparkles, Trophy } from "lucide-react";

export default function MatrixPage() {
  const [data, setData] = useState<{ candidates: any[]; matrix: any }>({ candidates: [], matrix: {} });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/matrix")
      .then((res) => res.json())
      .then((json) => {
        setData(json);
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  const getScoreColor = (score: number) => {
    if (score >= 85) return "bg-rose-500 text-white font-bold";
    if (score >= 75) return "bg-pink-600/80 text-white";
    if (score >= 65) return "bg-purple-600/60 text-zinc-100";
    if (score >= 50) return "bg-zinc-800 text-zinc-300";
    return "bg-zinc-900 text-zinc-500";
  };

  const { candidates, matrix } = data;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-white flex items-center gap-2.5">
          <Grid className="w-7 h-7 text-purple-400" />
          Compatibility Heatmap
        </h1>
        <p className="text-zinc-400 text-sm mt-1">
          N x N pairwise compatibility matrix. Rows sorted by average score. Click any cell to open the date transcript.
        </p>
      </div>

      {isLoading ? (
        <div className="text-center py-20 text-zinc-500 text-sm">Loading compatibility matrix...</div>
      ) : candidates.length === 0 ? (
        <div className="text-center py-20 bg-zinc-900/30 border border-zinc-800 rounded-2xl space-y-3">
          <p className="text-zinc-400 text-sm">No dates completed yet to generate matrix.</p>
          <Link href="/" className="inline-block px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold">
            Run Pipeline
          </Link>
        </div>
      ) : (
        <div className="bg-zinc-900/40 border border-zinc-800 rounded-3xl p-6 overflow-x-auto custom-scrollbar">
          <table className="border-collapse text-xs">
            <thead>
              <tr>
                <th className="p-2 text-left text-zinc-500 font-semibold sticky left-0 bg-zinc-950/90 z-10 min-w-[140px]">
                  Candidate
                </th>
                <th className="p-2 text-center text-zinc-400 font-semibold min-w-[50px]">
                  Avg
                </th>
                {candidates.map((c) => (
                  <th key={c.id} className="p-2 text-center text-zinc-400 font-normal min-w-[42px] max-w-[50px] truncate" title={c.name}>
                    {c.name.replace("Synthetic ", "S").replace(" (SYNTHETIC)", "")}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {candidates.map((row) => (
                <tr key={row.id} className="border-t border-zinc-800/40">
                  <td className="p-2 font-bold text-zinc-200 sticky left-0 bg-zinc-950/90 z-10 truncate max-w-[160px]">
                    <Link href={`/people/${row.id}`} className="hover:text-rose-400 transition-colors">
                      {row.name.replace(" (SYNTHETIC)", "")}
                    </Link>
                  </td>
                  <td className="p-2 text-center font-bold text-rose-400 font-mono">
                    {row.avgScore}
                  </td>
                  {candidates.map((col) => {
                    if (row.id === col.id) {
                      return <td key={col.id} className="p-1 text-center bg-zinc-950 text-zinc-700 font-mono">•</td>;
                    }

                    const cell = matrix[row.id]?.[col.id];
                    if (!cell) {
                      return <td key={col.id} className="p-1 text-center text-zinc-700 font-mono">-</td>;
                    }

                    return (
                      <td key={col.id} className="p-1 text-center">
                        <Link
                          href={`/dates/${cell.dateId}`}
                          className={`block py-1.5 rounded text-[11px] font-mono transition-transform hover:scale-110 shadow-sm ${getScoreColor(
                            cell.score
                          )}`}
                          title={`${row.name} & ${col.name}: Match ${cell.score}/100 (Round ${cell.round})`}
                        >
                          {Math.round(cell.score)}
                        </Link>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
