# AGENTS.md
- Stack: Next.js 15 (App Router), TypeScript strict, Tailwind, SQLite (better-sqlite3 + Drizzle), zod, vitest.
- Never ask the human questions. Decide, and log the decision in docs/DECISIONS.md.
- Every model output is validated with zod. One repair attempt, then fail the job with the reason.
- Never put secrets in code. Never use browser automation against Instagram or LinkedIn. Never message real people.
- Never infer sexual orientation, religion, health, ethnicity, political views, or immigration status.
- Synthetic fixtures are always labelled SYNTHETIC. Real people's data is never fabricated.
- After each change: typecheck, lint, test. A control that does nothing is a bug.
