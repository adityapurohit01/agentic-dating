import { getSqlite } from "../db";
import { Persona } from "../reader/schemas";
import crypto from "crypto";

export interface MemoryItem {
  id: string;
  personId: string;
  kind: "semantic" | "episodic" | "lesson";
  content: string;
  sourceRef?: string;
  dateId?: string;
  createdAt: number;
}

export function addMemoryItem(item: {
  personId: string;
  kind: "semantic" | "episodic" | "lesson";
  content: string;
  sourceRef?: string;
  dateId?: string;
}): string {
  const sqlite = getSqlite();
  const id = crypto.randomUUID();
  const now = Date.now();

  // 1. Insert into main table
  sqlite.prepare(`
    INSERT INTO memory_items (id, person_id, kind, content, source_ref, date_id, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(
    id,
    item.personId,
    item.kind,
    item.content,
    item.sourceRef || null,
    item.dateId || null,
    now
  );

  // 2. Insert into FTS5 virtual table
  try {
    sqlite.prepare(`
      INSERT INTO memory_fts (id, person_id, kind, content, source_ref)
      VALUES (?, ?, ?, ?, ?)
    `).run(
      id,
      item.personId,
      item.kind,
      item.content,
      item.sourceRef || ""
    );
  } catch {
    // Virtual table fallback
  }

  return id;
}

export function initializeSemanticMemory(personId: string, persona: Persona) {
  // Key facts from persona
  persona.needs.forEach((n) => {
    addMemoryItem({
      personId,
      kind: "semantic",
      content: `Core Need: ${n.need} (weight ${n.weight}/5, ${n.kind})`,
      sourceRef: n.evidence.join(", "),
    });
  });

  persona.values.forEach((v) => {
    addMemoryItem({
      personId,
      kind: "semantic",
      content: `Core Value: ${v.name}`,
      sourceRef: v.evidence.join(", "),
    });
  });

  persona.hobbies.forEach((h) => {
    addMemoryItem({
      personId,
      kind: "semantic",
      content: `Primary Hobby: ${h.name}`,
      sourceRef: h.evidence.join(", "),
    });
  });
}

export function recallMemory(personId: string, query: string, k = 5): MemoryItem[] {
  const sqlite = getSqlite();

  // Clean query for FTS5
  const cleanTokens = query
    .replace(/[^\w\s]/g, " ")
    .trim()
    .split(/\s+/)
    .filter((t) => t.length > 2);

  if (cleanTokens.length === 0) {
    // Fallback: return most recent items
    const rows = sqlite.prepare(`
      SELECT id, person_id, kind, content, source_ref, date_id, created_at
      FROM memory_items
      WHERE person_id = ?
      ORDER BY created_at DESC
      LIMIT ?
    `).all(personId, k) as any[];

    return rows.map((r) => ({
      id: r.id,
      personId: r.person_id,
      kind: r.kind,
      content: r.content,
      sourceRef: r.source_ref,
      dateId: r.date_id,
      createdAt: r.created_at,
    }));
  }

  const ftsQuery = cleanTokens.join(" OR ");

  try {
    const rows = sqlite.prepare(`
      SELECT m.id, m.person_id, m.kind, m.content, m.source_ref, m.date_id, m.created_at
      FROM memory_fts f
      JOIN memory_items m ON f.id = m.id
      WHERE f.person_id = ? AND memory_fts MATCH ?
      ORDER BY bm25(memory_fts) ASC, m.created_at DESC
      LIMIT ?
    `).all(personId, ftsQuery, k) as any[];

    if (rows.length > 0) {
      return rows.map((r) => ({
        id: r.id,
        personId: r.person_id,
        kind: r.kind,
        content: r.content,
        sourceRef: r.source_ref,
        dateId: r.date_id,
        createdAt: r.created_at,
      }));
    }
  } catch {
    // Fallback to simple like search
  }

  const fallbackRows = sqlite.prepare(`
    SELECT id, person_id, kind, content, source_ref, date_id, created_at
    FROM memory_items
    WHERE person_id = ?
    ORDER BY created_at DESC
    LIMIT ?
  `).all(personId, k) as any[];

  return fallbackRows.map((r) => ({
    id: r.id,
    personId: r.person_id,
    kind: r.kind,
    content: r.content,
    sourceRef: r.source_ref,
    dateId: r.date_id,
    createdAt: r.created_at,
  }));
}
