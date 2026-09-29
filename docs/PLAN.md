# Implementation Plan & Task List

## Milestones & Checklist

- [ ] **Milestone 1: Scaffold**
  - [x] AGENTS.md, docs/DECISIONS.md, docs/BLOCKERS.md, .env.example, .gitignore
  - [x] package.json, tsconfig.json, next.config.ts, tailwind.config.ts
  - [ ] Drizzle schema & migrations with WAL mode + FTS5
  - [ ] LLM provider interface (Mock, Gemini, Anthropic) with pricing and spend tracking
  - [ ] Event bus (SSE events table + in-memory emitter)
  - [ ] In-process job queue and worker (instrumentation.ts)
  - [ ] Tests for mock LLM and job queue

- [ ] **Milestone 2: Collect**
  - [ ] Apify connector with actor schema adaptation and input json overrides
  - [ ] Raw source storage & fixture loading
  - [ ] Field normalizers for LinkedIn and Instagram
  - [ ] Identity check between LinkedIn and Instagram profiles
  - [ ] Add people form (single & CSV import)
  - [ ] 25 synthetic fixtures (diverse careers, hobbies, writing styles)

- [ ] **Milestone 3: Reader**
  - [ ] Fact extractor with source references (`li:...`, `ig:...`)
  - [ ] Vision analysis for downloaded post images
  - [ ] Persona generation with Zod validation & one repair attempt
  - [ ] Safety filter (strip protected traits: orientation, religion, health, ethnicity, politics)
  - [ ] Voice metrics calculation, style notes, exemplars, and fidelity Turing test
  - [ ] Profile page with interactive evidence drawer and voice card

- [ ] **Milestone 4: Dating Engine**
  - [ ] Scene moderator (scene, opening topic, friction topic)
  - [ ] Persona agent with distinct system prompt & rules
  - [ ] Round 1 speed dating (6 turns per pair, 300 total for 25 people)
  - [ ] Turn-by-turn persistence & SSE event streaming
  - [ ] Post-date side reviews & neutral judge scoring
  - [ ] Fact-checker for unsupported claims (grounding rate)
  - [ ] Live dates page & date detail transcript view with replay

- [ ] **Milestone 5: Memory & Round 2**
  - [ ] Memory store (semantic, episodic, lessons) with FTS5 search
  - [ ] Round 1 reflection (need weight changes, new must-haves, dealbreakers)
  - [ ] Round 2 deep dates (top-K picks, 14 turns, memory recall enabled)
  - [ ] Tool registry (get_profile, recall_memory, write_memory, list_rankings, etc.)
  - [ ] Model Context Protocol (MCP) server stdio bridge

- [ ] **Milestone 6: Ranking & Visuals**
  - [ ] Blended scoring formula (0.5*view_A + 0.3*judge + 0.2*view_B)
  - [ ] Two-tier ranking (Round 2 top-tier + Round 1 baseline) with tie-break
  - [ ] Rankings page with rationale, friction points, cited turns, and mover badges
  - [ ] N x N Compatibility Matrix / Heatmap
  - [ ] Agent voice chat demo page
  - [ ] Cost & token tracking page

- [ ] **Milestone 7: Hardening**
  - [ ] Job retries with exponential backoff & resume after restart
  - [ ] MAX_USD_PER_RUN spend cap enforcement
  - [ ] Delete person complete purge (DB, media, memory)
  - [ ] Optional basic auth password gate
  - [ ] Mobile responsive styling and fallback error badges ("MOCK MODE")

- [ ] **Milestone 8: Verification & Documentation**
  - [ ] Seed 25 synthetic candidates and execute full pipeline
  - [ ] Unit & integration tests pass with Vitest
  - [ ] Browser verification across all pages with screenshots in `docs/screens/`
  - [ ] Dockerfile & docker-compose.yml verification
  - [ ] Complete README.md and docs/WALKTHROUGH.md
