import { getSqlite } from "../db";
import crypto from "crypto";

export interface JobRow {
  id: string;
  type: string;
  payload_json: string;
  status: "pending" | "running" | "completed" | "failed";
  attempts: number;
  max_attempts: number;
  run_after: number;
  error: string | null;
  created_at: number;
  updated_at: number;
}

export function enqueueJob(
  type: string,
  payload: any,
  options?: { runAfter?: number; maxAttempts?: number }
): string {
  const sqlite = getSqlite();
  const id = crypto.randomUUID();
  const now = Date.now();
  const runAfter = options?.runAfter || now;
  const maxAttempts = options?.maxAttempts || 3;

  sqlite.prepare(`
    INSERT INTO jobs (id, type, payload_json, status, attempts, max_attempts, run_after, created_at, updated_at)
    VALUES (?, ?, ?, 'pending', 0, ?, ?, ?, ?)
  `).run(
    id,
    type,
    JSON.stringify(payload),
    maxAttempts,
    runAfter,
    now,
    now
  );

  return id;
}

export function dequeueNextJob(): { id: string; type: string; payload: any } | null {
  const sqlite = getSqlite();
  const now = Date.now();

  // Atomically select and mark running inside a transaction
  const selectStmt = sqlite.prepare(`
    SELECT * FROM jobs
    WHERE status = 'pending' AND run_after <= ?
    ORDER BY created_at ASC
    LIMIT 1
  `);

  const updateStmt = sqlite.prepare(`
    UPDATE jobs
    SET status = 'running', updated_at = ?
    WHERE id = ? AND status = 'pending'
  `);

  const tx = sqlite.transaction(() => {
    const job = selectStmt.get(now) as JobRow | undefined;
    if (!job) return null;

    const res = updateStmt.run(now, job.id);
    if (res.changes === 0) return null;

    return {
      id: job.id,
      type: job.type,
      payload: JSON.parse(job.payload_json),
    };
  });

  return tx();
}

export function completeJob(id: string) {
  const sqlite = getSqlite();
  const now = Date.now();
  sqlite.prepare(`
    UPDATE jobs
    SET status = 'completed', updated_at = ?
    WHERE id = ?
  `).run(now, id);
}

export function failJob(id: string, error: string) {
  const sqlite = getSqlite();
  const now = Date.now();
  const job = sqlite.prepare("SELECT attempts, max_attempts FROM jobs WHERE id = ?").get(id) as {
    attempts: number;
    max_attempts: number;
  } | undefined;

  const attempts = (job?.attempts || 0) + 1;
  const maxAttempts = job?.max_attempts || 3;
  const isFailedPermanently = attempts >= maxAttempts;

  // Exponential backoff if retryable
  const retryDelayMs = Math.min(60_000, Math.pow(2, attempts) * 1000);
  const nextRun = now + retryDelayMs;

  sqlite.prepare(`
    UPDATE jobs
    SET status = ?, attempts = ?, run_after = ?, error = ?, updated_at = ?
    WHERE id = ?
  `).run(
    isFailedPermanently ? "failed" : "pending",
    attempts,
    nextRun,
    error,
    now,
    id
  );
}

export function resetStalledJobs() {
  const sqlite = getSqlite();
  const now = Date.now();
  // If server restarted, reset 'running' jobs back to 'pending'
  sqlite.prepare(`
    UPDATE jobs
    SET status = 'pending', updated_at = ?
    WHERE status = 'running'
  `).run(now);
}
