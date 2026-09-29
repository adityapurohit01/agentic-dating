import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
import { Heart, Users, Sparkles, Grid, BarChart3, DollarSign } from "lucide-react";

export const metadata: Metadata = {
  title: "Agentic Dating - Autonomous AI Matchmaker",
  description: "AI agents represent real people, date each other, and compute grounded compatibility rankings.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isMock = (process.env.LLM_PROVIDER || "mock").toLowerCase() === "mock" || !process.env.GEMINI_API_KEY;

  return (
    <html lang="en" className="dark">
      <body className="bg-zinc-950 text-zinc-100 min-h-screen flex flex-col font-sans antialiased selection:bg-rose-500/30">
        {/* Persistent Notice Banner */}
        <div className="bg-gradient-to-r from-rose-950/80 via-zinc-900 to-rose-950/80 border-b border-rose-900/30 px-4 py-2 text-center text-xs font-medium text-rose-300 flex items-center justify-center gap-2">
          <span>⚠️ Simulated conversations between AI stand-ins, not the real people.</span>
          {isMock && (
            <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded text-[10px] font-bold tracking-wider">
              MOCK MODE
            </span>
          )}
        </div>

        {/* Global Navigation */}
        <header className="border-b border-zinc-800/80 bg-zinc-900/50 backdrop-blur-md sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-600 to-pink-500 flex items-center justify-center shadow-lg shadow-rose-500/20 group-hover:scale-105 transition-transform">
                <Heart className="w-5 h-5 text-white fill-white" />
              </div>
              <span className="font-bold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-zinc-200 to-zinc-400">
                Agentic Dating
              </span>
            </Link>

            <nav className="flex items-center gap-1 sm:gap-2">
              <Link href="/" className="px-3 py-1.5 rounded-lg text-sm text-zinc-300 hover:text-white hover:bg-zinc-800/70 transition-colors flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-rose-400" />
                <span className="hidden sm:inline">Pipeline</span>
              </Link>
              <Link href="/people" className="px-3 py-1.5 rounded-lg text-sm text-zinc-300 hover:text-white hover:bg-zinc-800/70 transition-colors flex items-center gap-1.5">
                <Users className="w-4 h-4 text-blue-400" />
                <span>People</span>
              </Link>
              <Link href="/dates" className="px-3 py-1.5 rounded-lg text-sm text-zinc-300 hover:text-white hover:bg-zinc-800/70 transition-colors flex items-center gap-1.5">
                <Heart className="w-4 h-4 text-pink-400" />
                <span>Dates</span>
              </Link>
              <Link href="/matrix" className="px-3 py-1.5 rounded-lg text-sm text-zinc-300 hover:text-white hover:bg-zinc-800/70 transition-colors flex items-center gap-1.5">
                <Grid className="w-4 h-4 text-purple-400" />
                <span>Matrix</span>
              </Link>
              <Link href="/eval" className="px-3 py-1.5 rounded-lg text-sm text-zinc-300 hover:text-white hover:bg-zinc-800/70 transition-colors flex items-center gap-1.5">
                <BarChart3 className="w-4 h-4 text-emerald-400" />
                <span>Eval</span>
              </Link>
            </nav>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1">{children}</main>

        {/* Global Footer */}
        <footer className="border-t border-zinc-800/80 bg-zinc-950 py-6 text-center text-xs text-zinc-500">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>Agentic Dating · Grounded Multi-Agent Compatibility Simulation</div>
            <div className="flex gap-4">
              <Link href="/api/export" target="_blank" className="hover:text-zinc-300 underline">Export JSON</Link>
              <Link href="/api/cost" target="_blank" className="hover:text-zinc-300 underline">Cost Ledger</Link>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
