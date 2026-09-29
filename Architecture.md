# Agentic Dating: Architecture (plain words, full detail)

## 1. The idea in one minute

You paste two links for a person: their LinkedIn and their public Instagram. The system reads both and builds a **profile** of that person: what they need, what they like, how they talk. It then creates an **agent** that stands in for them.

Every agent goes on short "dates" with every other agent. After each date, both agents write a private review, and a neutral judge scores the pair. Then the agents learn from their first dates and go on longer second dates with their best prospects. At the end, each person gets a **ranked list** of who fits them best, with reasons that point to lines from the dates.

Everything shows in a website you can click through: add links, see the profile, watch a date live, read the rankings.

## 2. The whole system in one picture

```
 you paste LinkedIn + Instagram links
            |
            v
   [1 Add + Check]  is the Instagram public? does it belong to this person?
            |
            v
   [2 Collector]  Apify pulls both profiles  ->  saved raw (never re-fetched)
            |
            v
   [3 Reader]  facts with proof  ->  Persona (needs, hobbies, interests, values, ...)
            |         \
            |          +--> [4 Voice] how this person writes  ->  Voice card + fidelity score
            v
   [5 Memory]  Persona facts + lessons learned from dates
            |
            v
   [6 Dating engine]
        Round 1: everyone speed-dates everyone (short)
        Reflection: each agent learns what it really wants
        Round 2: long dates with each agent's top picks (uses memory)
            |
            v
   [7 Reviews]  each agent's private review + neutral judge + fact-check
            |
            v
   [8 Ranking]  blend the scores  ->  a ranked list per person + heatmap
            |
            v
   [9 Website]  profile pages, live dates, transcripts, rankings, heatmap
```

A job runner ([10]) drives steps 2 to 8 in the background and saves progress, so a crash or restart picks up where it stopped.

## 3. The parts, one by one

### 3.1 Add + Check

- A form takes a LinkedIn URL and an Instagram URL per person. A CSV import does the same for many people at once.
- The form also asks for two ticks: "this person is an adult" and "these profiles are public". It records how the person came to be here (public figure, opted in, or unknown).
- We normalise the URLs (strip tracking, lower-case handles) and reject duplicates.
- **Identity check:** we compare the two profiles (name, employer, city, links in the bio). A strong sign is an Instagram bio that links to the LinkedIn. The result is a match score from 0 to 1 with notes. Low scores show a warning on the profile.

### 3.2 Collector (Apify)

- We call Apify actors in **batches**: one run for all LinkedIn URLs, one run for all Instagram URLs. This is faster and cheaper than one run per person.
- The actor names live in settings, not in code, so you can swap one that breaks. Every actor sits behind a small `Connector` interface. Today it has one implementation (Apify). Composio or Nango could plug in later.
- We save the **raw answer** exactly as it came back. Nothing is scraped twice.
- We download the Instagram post images to our own storage right away. Instagram image links expire.
- If a profile is private or empty, the person shows a clear error state instead of silently failing.
- Demo safety: a fixture snapshot of real results can be replayed with no network.

### 3.3 Reader (the analysis that gets graded)

The Reader works in two steps, so every claim has proof.

**Step A. Facts with proof.** One pass per source produces small facts. Each fact points to its source: `li:exp:2` (second job), `li:about`, `ig:post:ABC123` (a specific post). For images, a vision model describes the activity, place, and mood in each of the recent posts.

**Step B. Persona.** A stronger model builds the persona from the facts only. It cannot use anything that has no proof. Fields:

- **identity:** name, headline, location, role, company, education
- **needs:** each has a weight (1 to 5), whether it was *stated* or *inferred*, a confidence, and its proof
- **hobbies, interests, values, lifestyle** (rhythm, social energy, travel, fitness, food), **ambition, humor, communication style**
- **relationship signals** (kept low confidence, since two profiles rarely say this)
- **friction points:** things likely to clash with some partners
- **green flags**
- **unknowns:** what the two sources could not tell us (shown honestly on the page)

Hard rules: no guessing of orientation, religion, health, or ethnicity. No gender filtering: we rank on compatibility, because we have no stated preferences to filter by.

### 3.4 Voice

Agents talk in the person's voice, so we measure it.

- **Numbers, computed by code:** average sentence length, emoji rate, capital/lower-case habits, hashtag use, language mix.
- **Style notes** from a model, plus 6 to 10 of the person's real captions or posts kept word-for-word as examples.
- **Fidelity score:** we ask the model to write three fake captions on the same topics as three real ones. A judge model then has to pick the real one in each pair. If the judge can only guess (about 50% right), the voice is convincing, and the score is high. The profile page shows the score with a note that it is a rough check. If the person has too few captions, it shows "not enough data".

### 3.5 Memory

Memory is one table with three kinds of rows, searchable by full-text search:

- **semantic:** the persona facts, with proof
- **episodic:** what an agent learned in each date ("he avoided the money question")
- **lesson:** what the agent concluded after Round 1 ("wants a partner who plans ahead")

Agents call `recall(query)` to fetch a few relevant rows. The persona itself sits in the prompt directly (it is small), and memory is for what was learned along the way. The same tool list is exposed as an **MCP server**, so any MCP client can read profiles, recall memory, or fetch rankings.

### 3.6 Dating engine

**Who dates whom.** With 25 people there are 300 pairs. Each pair has one date in Round 1. Because each date gets reviewed from both sides, everyone still ends up with a full ranking of everyone else.

**Setting up a date.** A cheap "moderator" call reads both personas and picks:
- a **scene** (coffee shop, night market, trailhead) that fits what they share,
- an **opening topic**,
- a **friction topic**: the subject most likely to reveal a real clash (career vs. relocation, spontaneity vs. planning, money, family, work hours, social media, ambition vs. downtime).

**Two separate minds.** Each agent is its own model conversation. It sees its own persona, voice card, rules, and only what the other side has said. This matters: one call writing both sides tends to make every date go well.

**Agent rules (short):**
1. Speak as the person, in first person, in their voice.
2. Use only facts from your notes. If asked about something you do not know, say so naturally ("haven't really thought about that") and move on.
3. Steer toward your own person's real needs.
4. Do not gush. Say plainly what does not fit.
5. Keep messages short (about 60 words in Round 1, 90 in Round 2).

**Round 1, speed date:** 6 messages (3 each): open, one probing question tied to a need, then a mini friction moment.

**Reflection:** after Round 1 each agent reads its reviews and writes lessons: which needs turned out to matter, new must-haves and deal-breakers, and how to reweigh its needs. These go into memory.

**Round 2, deep date:** each person's top 6 (their picks plus the other side's picks, deduplicated). 14 messages in four phases: opening, probing, friction, closing. Agents carry their memory and lessons into it. Stronger model.

### 3.7 Reviews, judge, and fact-check

After every date:
- **Each side writes a private review:** a score from 0 to 10 for each of its own needs (with the turn numbers that prove it), values alignment, chemistry, red flags, green flags, "would see again" (0 to 100), and what it learned about its own person.
- **A neutral judge** (stronger model, temperature 0) sees both personas and the whole date and gives a mutual score with reasons and the best quotes.
- **A cheap fact-check** compares each agent's claims to its persona and lists claims with no support. This is reported as a "grounding rate" (share of claims backed by the persona), not used as a penalty.

### 3.8 Ranking

For a pair (A, B) in a round:

```
score(A -> B) = 0.5 * A's own view of B
              + 0.3 * judge's mutual score
              + 0.2 * B's view of A          (a match needs both sides)
```

For each person:
1. People who had a Round 2 date are ranked above the rest, ordered by `0.35 * Round 1 score + 0.65 * Round 2 score`.
2. Everyone else is ranked by Round 1 score.
3. Optional tie-break: if two scores are within 3 points, ask the agent which date it preferred, in both orders to cancel position bias.

Each ranked row stores a short reason, the friction points, and links to the turns that back them. The site also shows "biggest movers" between Round 1 and Round 2, which is the visible proof that memory changed something.

### 3.9 Website

| Page | What it does |
|---|---|
| Home | Add people (form + CSV + "load the demo set"), pipeline status, big Run button, cost so far |
| People | Grid of everyone with status and identity/consent badges |
| Profile | Summary, needs with weight bars and stated/inferred tags, hobbies, interests, values, lifestyle, voice card and fidelity, friction points, green flags, unknowns. Click any item to see the proof (post text, image, job entry) |
| Live dates | Watch dates as they happen: two chat columns and a live scorecard |
| Date detail | Full transcript, both reviews, the judge, unsupported claims |
| Rankings | One person's ranked list with reasons and links to dates |
| Matrix | Heatmap of everyone against everyone, click a cell to open the date |
| Chat | Talk to one person's agent in their voice (shows the voice off) |

Live updates use Server-Sent Events. Every event is also saved, so a refreshed page can catch up.

A visible banner says: *simulated conversations between AI stand-ins, not the real people.*

### 3.10 Job runner

- Jobs live in a database table (`type`, `payload`, `status`, `attempts`, `run_after`). One worker loop runs inside the server and takes jobs with a concurrency limit (about 12 model calls at once).
- Every step is safe to repeat: dates are unique per pair and round, so a rerun skips finished work.
- Failures retry with growing waits. After the last retry, the job is marked failed with the reason and the rest keep going.
- A spend cap (`MAX_USD_PER_RUN`) stops new model calls when reached.

### 3.11 Safety and privacy

- Only public data, only from the two sources.
- Adult confirmation required. Consent status stored and shown.
- No inference of protected traits. A check strips them from personas if they slip in.
- Optional site password. A "delete this person" button removes everything about them, including images and memory.
- Transcripts are marked as simulated, everywhere they appear.

## 4. Data (tables in plain words)

- `people`: links, name, consent status, adult confirmation, status, identity match
- `raw_sources`: the untouched Apify answers
- `media`: downloaded post images with captions and what the vision model saw
- `personas`: the structured persona and which model wrote it
- `voice`: style numbers, exemplars, fidelity score
- `memory_items`: semantic, episodic, and lesson rows (with a full-text index)
- `dates`: one row per pair per round, with the scene
- `date_turns`: every message, in order
- `date_reviews`: each side's review and the judge's
- `scores`: the numbers behind each ranking
- `rankings`: the final ordered lists with reasons
- `jobs`, `events`, `llm_calls`: the runner, live updates, and the cost log

## 5. Cost and speed

- Apify: cents for 25 people.
- Model calls for 25 people, roughly: reader (a few calls per person, one with images), Round 1 (about 1,800 message calls, 600 reviews, 300 judge calls), Round 2 (about 1,000 to 2,000 calls). The app logs tokens and dollars for every call and shows the total, so the real number comes from the run, not from a guess.
- Cost savers: the persona sits in a cached prompt block, Round 1 uses the cheap model, and only the judge, reader, and Round 2 use the stronger one.
- Time: with 12 calls at once, a full run takes on the order of 10 to 20 minutes. Run it before recording the video.
- Growing later: past a few hundred people, replace "everyone dates everyone" with a shortlist from embedding search (each person meets their nearest 20 to 50), which turns N-squared work into N times k.

## 6. What goes wrong and what we do

| Problem | Response |
|---|---|
| Apify actor fails or changes output | Tolerant field mapping, replaceable actor names, saved fixtures |
| Instagram private or missing | Clear status on the person, excluded from dating with a reason |
| Model returns bad JSON | Validate with a schema, one repair attempt, then retry |
| Agent invents facts | Rules in prompt, fact-check pass, grounding rate shown |
| Scores all look alike (70 to 85) | Blend three sources and rank; optional pairwise tie-break |
| Server restart mid-run | Jobs persist; finished dates are skipped |
| Costs run away | Spend cap and per-call logging |

## 7. How we test

- Unit tests: URL cleaning, Apify field mapping, score blending, ranking, schema checks.
- A **mock model provider** returns deterministic replies so the whole pipeline runs with no keys. The end-to-end test loads synthetic people (clearly labelled as such), runs everything, and asserts that 25 people produce 300 first dates and 24-entry rankings for each person.
- Browser smoke test: open each page, click each control, save screenshots.

## 8. Choices we made, ranked, and why

1. **Plain code with a state machine, not an agent framework.** We need exact control over who sees what in each date.
2. **One Node app with SQLite and an in-process job table.** Zero setup and one deploy. Postgres would be the next step. The database layer is written so the switch is small. We skipped vector search because with 25 people everyone dates everyone.
3. **Round 1 for everyone, Round 2 for the best.** This gives complete rankings and sharper order at the top for a fraction of the cost.
4. **Blended scoring with a neutral judge.** Agents grading their own dates are too generous.
5. **Tool registry shared by agents and an MCP server.** One implementation, two ways to use it.
6. **Voice as a measured feature.** It can be shown and checked instead of just claimed.

## 9. What is deliberately not built

- Logging into Instagram, LinkedIn, Hinge, Tinder, or any DM. Browser automation for those apps breaks their rules and risks bans. An adapter interface is documented so it is clear where it would go.
- Gmail and calendar. The task allows only two sources.
- Real messaging to real people. Conversations stay inside the simulation.

## 10. The three-minute video, second by second

| Time | Show |
|---|---|
| 0:00 to 0:15 | One-sentence pitch and the architecture picture |
| 0:15 to 0:50 | Paste links, watch collection progress, open a profile: needs, hobbies, interests, proof popups, voice score |
| 0:50 to 1:50 | Watch a real date stream (both sides), the friction moment, both reviews and the judge |
| 1:50 to 2:30 | Rankings for one person, the heatmap, "biggest movers" after Round 2, click through to the reason |
| 2:30 to 3:00 | How it stays honest (proof, fact-check, no protected traits), cost per run, and how it scales |