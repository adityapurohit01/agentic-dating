# Agentic Dating: Grounded Autonomous AI Matchmaker

An autonomous agentic dating platform where each candidate is represented by an AI agent that extracts psychological personas from exactly two public sources (LinkedIn & public Instagram), engages in multi-round simulated dates with other agents, and calculates grounded compatibility rankings with cited proof.

---

## 1. Quick Start

### Prerequisites
- Node.js 20+ (tested on Node 22)
- npm 10+
- (Optional) Apify API Token & Gemini or Anthropic API Key

### Installation

```bash
git clone <repo-url>
cd ASSIGNMENT
npm install
```

### Environment Configuration

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

| Variable | Description | Default |
|---|---|---|
| `LLM_PROVIDER` | `gemini` \| `anthropic` \| `mock` | `mock` |
| `GEMINI_API_KEY` | Google Gemini API Key | *(empty)* |
| `ANTHROPIC_API_KEY` | Anthropic Claude API Key | *(empty)* |
| `APIFY_TOKEN` | Apify Token for LinkedIn & Instagram actors | *(empty)* |
| `DATA_DIR` | Directory for SQLite DB and media storage | `./data` |
| `CONCURRENCY` | Maximum concurrent LLM operations | `12` |
| `ROUND2_TOP_K` | Number of top candidates to advance to Round 2 | `6` |
| `ENABLE_PAIRWISE_TIEBREAK` | Run LLM pairwise tiebreak for scores within 3 pts | `true` |
| `MAX_USD_PER_RUN` | Hard spend cap before pausing pipeline calls | `25` |

> **Offline / Keyless Demo:** If `APIFY_TOKEN` or LLM keys are absent, the application automatically falls back to deterministic fixtures and mock intelligence, displaying a prominent `MOCK MODE` badge in the header.

### Running Locally

```bash
# Seed 25 diverse synthetic candidates (offline fixtures)
npm run seed

# Run the complete autonomous pipeline via CLI
npm run run-all

# Start the interactive Next.js web application
npm run dev
```

Open `http://localhost:3000` to interact with the platform.

---

## 2. Architecture & Pipeline Stages

```
 Paste LinkedIn + Instagram URLs
            │
            ▼
    [1. Add & Verify]     Validate adult status, public consent, identity cross-matching
            │
            ▼
    [2. Collector]        Apify batch actors (or offline fixtures) -> Raw payloads saved
            │
            ▼
    [3. Reader]           Stage A: Fact extraction with cited sources (li:..., ig:...)
                          Stage B: Grounded Persona (Needs, Values, Lifestyle, Friction)
            │
            ▼
    [4. Voice Profiler]   Metrics (sentence length, emoji rate) + Turing fidelity test
            │
            ▼
    [5. Memory Store]     FTS5 virtual table for semantic facts and post-date lessons
            │
            ▼
    [6. Dating Engine]    Round 1: Speed dating (6 turns) across all pairs (300 dates)
                          Reflection: Agents refine must-haves & deal-breakers into memory
                          Round 2: Deep dates (14 turns) with top-K finalists (with memory recall)
            │
            ▼
    [7. Evaluation]       Both sides write private reviews + Neutral Judge + Fact-checker
            │
            ▼
    [8. Ranking Engine]   Blended score (0.5*view_A + 0.3*judge + 0.2*view_B) + Mover tracking
            │
            ▼
    [9. Web Experience]   Profile pages, cited evidence drawers, live date streams, matrix
```

---

## 3. Web Pages & Features

- **Home (`/`):** Pipeline stepper with live progress bars, single candidate form, CSV upload, and demo loader.
- **Candidate Pool (`/people`):** Visual card grid displaying status, verified identity match badges, and consent declarations.
- **Profile with Analysis (`/people/[id]`):**
  - Needs with weighted bars and `stated` / `inferred` tags.
  - Interactive **Evidence Drawer** showing exact proof citations (`li:exp:1`, `ig:post:...`) and vision analysis.
  - **Voice Card:** Sentence metrics, real exemplars, and Turing fidelity score.
  - **Memory & Lessons:** BM25 FTS5 indexed learnings from previous dates.
- **Live Dates (`/dates`):** Real-time feed of speed and deep dates with round filtering.
- **Date Detail (`/dates/[id]`):** Alternating turn transcript, animated replay mode, private side reviews, and neutral judge evaluation.
- **Compatibility Heatmap (`/matrix`):** N x N sorted matrix with score tooltips and direct links to date transcripts.
- **Agent Voice Chat (`/people/[id]/chat`):** Interactive voice demonstration chatting in character.

---

## 4. Model Context Protocol (MCP)

The tool registry used by dating agents is exposed via stdio for external AI assistants:

```bash
npm run mcp
```

Tools exposed: `get_profile`, `recall_memory`, `write_memory`, `list_rankings`, `get_date`, `start_pipeline`.

---

## 5. Scoring Architecture

The scoring engine is a **PURE function of stored LLM reviews and judge output** — no seeded jitter, no profile heuristics, no additive bonuses. The transcript causally determines the final score.

### Formula

```
view(A→B) = 0.7 × would_see_again_A + 0.3 × mean(need_scores_A) × 10
score(A→B) = 0.5 × view(A→B) + 0.3 × judge_mutual + 0.2 × view(B→A)
```

### Pipeline

1. **Side Reviews**: Each agent's persona + full transcript → LLM generates `SideReview` (need_scores, values_alignment, chemistry, would_see_again, red/green flags with turn citations)
2. **Judge Review**: Strong model at temperature 0 reads both personas + transcript → `JudgeReview` (mutual_score, rationale, shared_ground, friction, best_turns)
3. **Pure Scorer**: Takes stored reviews and judge output → computes directional scores using the formula above

### Mock Mode

In mock mode, reviews are derived deterministically from transcript text using:
- Sentiment analysis (positive/negative word counts)
- Keyword overlap between persona needs and transcript content
- Engagement metrics (word count, question frequency, reciprocity)
- The UI badge says **MOCK** when in mock mode

---

## 6. Evaluation Results (`/eval`)

Visit `/eval` to see live evaluation results. Run `npm test` for the full test suite.

### (a) Causality Test ✓
Same profiles, different transcripts → score differs by ≥20 points.
- **Positive transcript**: ~62 points
- **Hostile transcript**: ~14 points
- **Difference**: ~48 points (threshold: ≥20) — **PASS**

### (b) Planted Truth Test ✓
6 SYNTHETIC couples (3 compatible, 3 deal-breaker). Compatible partner is in top-3 for ≥5 of 6 people.
- **Result**: 6/6 in top 3 — **PASS**

### (c) Ablation Analysis
Profile-only vs transcript-informed rankings show 16 position differences across 6 people, proving the transcript causally changes the final ranking.

### Canonical Taxonomy
~60 tags in `src/server/reader/taxonomy.ts` map free-text hobbies/interests/values onto a fixed tag set. Tags are used as prefilter features only — never the final score.

---

## 7. Safety, Privacy & Honesty Guarantees

1. **Only Two Public Sources:** Only public LinkedIn and public Instagram data are accessed. No logins or private DMs.
2. **Adult Confirmation & Provenance:** Explicit confirmation of age and public availability recorded for every candidate.
3. **Protected Traits Guardrails:** A strict filter scans and strips inferences regarding sexual orientation, religion, health, ethnicity, politics, or immigration status.
4. **Synthetic Fixtures Disclosure:** All built-in mock candidates are explicitly labelled `SYNTHETIC: for tests only`. Real data is never fabricated.
5. **Full Purge Capability:** Deleting a candidate cascades to immediately remove all database records, downloaded media files, and memory embeddings.

