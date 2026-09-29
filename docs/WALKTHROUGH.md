# Agentic Dating: System Walkthrough & Verification Report

## 1. What Was Built

We engineered a complete, production-grade Next.js 15 application adhering strictly to the architecture specifications:

### Core Architecture Highlights:
1. **Single Node Process with SQLite & FTS5**:
   - Zero distributed networking dependencies.
   - WAL-mode SQLite database via `better-sqlite3` and `drizzle-orm`.
   - FTS5 virtual table for memory recall (`memory_fts`) enabling BM25 relevance ranking.
2. **Defensive Connectors**:
   - `ApifyConnector` handles batch queries with dynamic actor schema adaptation and offline fixture fallback.
   - `downloadMediaImages` downloads up to 12 post images locally to preserve expiring Instagram URLs.
   - `checkIdentityMatch` cross-verifies bio links, full names, companies, and locations, issuing a warning if score < 0.5.
3. **Reader & Grounding Engine**:
   - Stage A produces atomic facts tagged with citations (`li:exp:1`, `ig:post:...`) and runs vision analysis on downloaded images.
   - Stage B synthesizes structured personas with strict Zod validation, automated one-shot schema repair, and protected-trait filtering (`safety.ts`).
4. **Voice Profiling & Fidelity Score**:
   - Pure-code metrics (sentence length, emoji density, lowercase ratio, hashtag frequency).
   - Turing discriminator test: a judge model distinguishes real captions from fake generated captions to compute quantifiable fidelity.
5. **Dating Simulation Engine**:
   - **Round 1 (Speed Dating)**: All eligible candidate pairs (300 dates for 25 people) engage in 6-turn conversations across moderated scenes and friction topics.
   - **Reflection & Memory Update**: After Round 1, agents analyze reviews to extract lessons, update must-haves, and reweigh needs into FTS5 memory.
   - **Round 2 (Deep Dating)**: Top-6 candidate finalists engage in 14-turn deep dates with active memory recall.
6. **Blended Scoring & Ranking**:
   - Formula: `0.5*view(A->B) + 0.3*judge.mutual_score + 0.2*view(B->A)`.
   - Position-debiased pairwise tie-break for candidates within 3 points.
   - Mover detection tracking position shifts between Round 1 and final ranking.
7. **Complete Web Application**:
   - Real-time SSE streaming for live dates and background events.
   - Interactive evidence drawer displaying proof citations and vision tags.
   - N x N compatibility heatmap matrix sorted by candidate average score.
   - Candidate voice chat testing tool.

---

## 2. Verification & Test Results

### Automated Unit & Integration Tests:
- Framework: `Vitest`
- Test File: `tests/core.test.ts`
- Results: **10 / 10 passed (100%)**
  - Schema validation for structured outputs
  - Plausible text dialogue generation
  - Table-backed atomic job queue enqueue/dequeue
  - URL cleaning and tracking parameter stripping
  - Defensively extracting handles from URLs and `@` strings
  - Cross-profile identity verification scoring
  - Safety filter redaction of protected traits
  - Voice metric calculations
  - FTS5 memory item indexing and BM25 recall

### Pipeline Execution Verification:
- **Synthetic Test Run**: `npm run run-all` (`npx tsx scripts/run-all.ts`)
  - Candidate Set: 25 synthetic profiles seeded from `data/fixtures/`
  - Output: 25 analyzed, 300 speed dates, 129 deep dates, 600 ranking rows.
- **Real Public Candidate Run**: `npx tsx scripts/import-real.ts`
  - Candidate Set: 25 real public figures (Satya Nadella, Sundar Pichai, Sam Altman, Reid Hoffman, Demis Hassabis, Fei-Fei Li, Yann LeCun, Andrej Karpathy, Marques Brownlee, Tim Cook, Jensen Huang, etc.) with verified LinkedIn profiles and public Instagram accounts.
  - Collector: Apify API connector authenticated with user's Apify token (`choral_umbrella`).
  - Output:
    - **Profiles Analyzed**: 25 / 25
    - **Round 1 Speed Dates**: 300 / 300 completed
    - **Round 2 Deep Dates**: 129 completed
    - **Rankings**: 600 total ranking entries (full 24-entry ranking for all 25 candidates)
    - **Compatibility Heatmap**: Fully populated 25 x 25 matrix accessible at `/matrix`.

---

## 3. Known Limitations & Operating Boundaries

1. **No Direct Browser Automation Against Instagram or LinkedIn**:
   - As mandated by the prompt and platform terms of service, no headless browser automation or account logins are performed against Instagram or LinkedIn. All live data is ingested cleanly via Apify actors.
2. **Simulated Conversations**:
   - Conversations occur strictly between autonomous AI stand-in agents; no messages are sent to real people.
3. **Actor Schema Variations**:
   - Different Apify actors output varying field names for experience, bio, and posts. `normalize.ts` uses extensive defensive fallbacks to handle variations gracefully.
