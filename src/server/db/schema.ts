import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

export const people = sqliteTable("people", {
  id: text("id").primaryKey(),
  linkedinUrl: text("linkedin_url").notNull(),
  instagramUrl: text("instagram_url").notNull(),
  name: text("name"),
  headline: text("headline"),
  consentStatus: text("consent_status").default("opted_in").notNull(),
  adultConfirmed: integer("adult_confirmed").default(1).notNull(),
  publicConfirmed: integer("public_confirmed").default(1).notNull(),
  status: text("status").default("pending").notNull(),
  identityMatch: real("identity_match"),
  identityNotes: text("identity_notes"),
  createdAt: integer("created_at").notNull(),
  updatedAt: integer("updated_at").notNull(),
});

export const rawSources = sqliteTable("raw_sources", {
  id: text("id").primaryKey(),
  personId: text("person_id").notNull().references(() => people.id, { onDelete: "cascade" }),
  source: text("source").notNull(), // 'linkedin' | 'instagram'
  rawJson: text("raw_json").notNull(),
  fetchedAt: integer("fetched_at").notNull(),
});

export const media = sqliteTable("media", {
  id: text("id").primaryKey(),
  personId: text("person_id").notNull().references(() => people.id, { onDelete: "cascade" }),
  originalUrl: text("original_url").notNull(),
  localPath: text("local_path").notNull(),
  caption: text("caption"),
  visionJson: text("vision_json"),
  createdAt: integer("created_at").notNull(),
});

export const personas = sqliteTable("personas", {
  id: text("id").primaryKey(),
  personId: text("person_id").notNull().references(() => people.id, { onDelete: "cascade" }),
  version: integer("version").default(1).notNull(),
  model: text("model").notNull(),
  personaJson: text("persona_json").notNull(),
  factsJson: text("facts_json").notNull(),
  createdAt: integer("created_at").notNull(),
});

export const voice = sqliteTable("voice", {
  id: text("id").primaryKey(),
  personId: text("person_id").notNull().references(() => people.id, { onDelete: "cascade" }),
  metricsJson: text("metrics_json").notNull(),
  styleNotes: text("style_notes"),
  exemplarsJson: text("exemplars_json").notNull(),
  fidelityScore: real("fidelity_score"),
  createdAt: integer("created_at").notNull(),
});

export const memoryItems = sqliteTable("memory_items", {
  id: text("id").primaryKey(),
  personId: text("person_id").notNull().references(() => people.id, { onDelete: "cascade" }),
  kind: text("kind").notNull(), // 'semantic' | 'episodic' | 'lesson'
  content: text("content").notNull(),
  sourceRef: text("source_ref"),
  dateId: text("date_id"),
  createdAt: integer("created_at").notNull(),
});

export const dates = sqliteTable("dates", {
  id: text("id").primaryKey(),
  aId: text("a_id").notNull().references(() => people.id, { onDelete: "cascade" }),
  bId: text("b_id").notNull().references(() => people.id, { onDelete: "cascade" }),
  round: integer("round").notNull(), // 1 | 2
  status: text("status").default("pending").notNull(), // 'pending' | 'in_progress' | 'done' | 'error'
  sceneJson: text("scene_json"),
  startedAt: integer("started_at"),
  completedAt: integer("completed_at"),
});

export const dateTurns = sqliteTable("date_turns", {
  id: text("id").primaryKey(),
  dateId: text("date_id").notNull().references(() => dates.id, { onDelete: "cascade" }),
  turnNumber: integer("turn_number").notNull(),
  speakerId: text("speaker_id").notNull().references(() => people.id, { onDelete: "cascade" }),
  role: text("role").notNull(), // 'user' | 'assistant'
  message: text("message").notNull(),
  createdAt: integer("created_at").notNull(),
});

export const dateReviews = sqliteTable("date_reviews", {
  id: text("id").primaryKey(),
  dateId: text("date_id").notNull().references(() => dates.id, { onDelete: "cascade" }),
  reviewerId: text("reviewer_id").notNull(),
  reviewType: text("review_type").notNull(), // 'side' | 'judge'
  reviewJson: text("review_json").notNull(),
  createdAt: integer("created_at").notNull(),
});

export const scores = sqliteTable("scores", {
  id: text("id").primaryKey(),
  dateId: text("date_id").notNull().references(() => dates.id, { onDelete: "cascade" }),
  aToB: real("a_to_b").notNull(),
  bToA: real("b_to_a").notNull(),
  mutual: real("mutual").notNull(),
  createdAt: integer("created_at").notNull(),
});

export const rankings = sqliteTable("rankings", {
  id: text("id").primaryKey(),
  personId: text("person_id").notNull().references(() => people.id, { onDelete: "cascade" }),
  targetId: text("target_id").notNull().references(() => people.id, { onDelete: "cascade" }),
  rank: integer("rank").notNull(),
  score: real("score").notNull(),
  r1Rank: integer("r1_rank"),
  r2Rank: integer("r2_rank"),
  rationaleJson: text("rationale_json").notNull(),
  createdAt: integer("created_at").notNull(),
});

export const jobs = sqliteTable("jobs", {
  id: text("id").primaryKey(),
  type: text("type").notNull(),
  payloadJson: text("payload_json").notNull(),
  status: text("status").default("pending").notNull(),
  attempts: integer("attempts").default(0).notNull(),
  maxAttempts: integer("max_attempts").default(3).notNull(),
  runAfter: integer("run_after").default(0).notNull(),
  error: text("error"),
  createdAt: integer("created_at").notNull(),
  updatedAt: integer("updated_at").notNull(),
});

export const events = sqliteTable("events", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  type: text("type").notNull(),
  payloadJson: text("payload_json").notNull(),
  createdAt: integer("created_at").notNull(),
});

export const llmCalls = sqliteTable("llm_calls", {
  id: text("id").primaryKey(),
  purpose: text("purpose").notNull(),
  model: text("model").notNull(),
  tokensIn: integer("tokens_in").notNull(),
  tokensOut: integer("tokens_out").notNull(),
  costUsd: real("cost_usd").notNull(),
  estimated: integer("estimated").default(0).notNull(),
  durationMs: integer("duration_ms").notNull(),
  personId: text("person_id"),
  dateId: text("date_id"),
  createdAt: integer("created_at").notNull(),
});
