import { NextResponse } from "next/server";
import { getSqlite } from "@/server/db";
import fs from "fs";
import path from "path";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const sqlite = getSqlite();

  const person = sqlite.prepare("SELECT * FROM people WHERE id = ?").get(id) as any;
  if (!person) {
    return NextResponse.json({ error: "Person not found" }, { status: 404 });
  }

  const personaRow = sqlite.prepare("SELECT * FROM personas WHERE person_id = ?").get(id) as any;
  const voiceRow = sqlite.prepare("SELECT * FROM voice WHERE person_id = ?").get(id) as any;
  const rawSources = sqlite.prepare("SELECT source, raw_json, fetched_at FROM raw_sources WHERE person_id = ?").all(id) as any[];
  const mediaRows = sqlite.prepare("SELECT original_url, local_path, caption, vision_json FROM media WHERE person_id = ?").all(id) as any[];
  const memoryRows = sqlite.prepare("SELECT kind, content, source_ref, created_at FROM memory_items WHERE person_id = ? ORDER BY created_at DESC").all(id) as any[];

  return NextResponse.json({
    person,
    persona: personaRow ? JSON.parse(personaRow.persona_json) : null,
    facts: personaRow ? JSON.parse(personaRow.facts_json) : [],
    voice: voiceRow ? {
      metrics: JSON.parse(voiceRow.metrics_json),
      styleNotes: voiceRow.style_notes,
      exemplars: JSON.parse(voiceRow.exemplars_json),
      fidelityScore: voiceRow.fidelity_score,
    } : null,
    rawSources: rawSources.map((r) => ({ source: r.source, data: JSON.parse(r.raw_json), fetchedAt: r.fetched_at })),
    media: mediaRows.map((m) => ({
      originalUrl: m.original_url,
      localPath: m.local_path,
      caption: m.caption,
      vision: m.vision_json ? JSON.parse(m.vision_json) : null,
    })),
    memory: memoryRows,
  });
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const sqlite = getSqlite();

  // Purge from DB with cascade
  sqlite.prepare("DELETE FROM people WHERE id = ?").run(id);

  // Purge from FTS virtual table
  try {
    sqlite.prepare("DELETE FROM memory_fts WHERE person_id = ?").run(id);
  } catch {}

  // Purge media files from disk
  const mediaDir = path.resolve(process.env.DATA_DIR || "./data", "media", id);
  if (fs.existsSync(mediaDir)) {
    try {
      fs.rmSync(mediaDir, { recursive: true, force: true });
    } catch {}
  }

  return NextResponse.json({ success: true, message: `Purged candidate ${id}` });
}
