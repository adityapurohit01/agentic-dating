import { NextResponse } from "next/server";
import { getSqlite } from "@/server/db";
import { cleanUrl } from "@/server/connectors/normalize";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const text = await req.text();
    const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
    if (lines.length < 2) {
      return NextResponse.json({ error: "Empty or invalid CSV" }, { status: 400 });
    }

    const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
    const liIdx = headers.indexOf("linkedin_url");
    const igIdx = headers.indexOf("instagram_url");
    const consentIdx = headers.indexOf("consent_status");

    if (liIdx === -1 || igIdx === -1) {
      return NextResponse.json({ error: "CSV must contain linkedin_url and instagram_url headers" }, { status: 400 });
    }

    const sqlite = getSqlite();
    let imported = 0;

    for (let i = 1; i < lines.length; i++) {
      const parts = lines[i].split(",").map((p) => p.trim());
      const rawLi = parts[liIdx];
      const rawIg = parts[igIdx];
      const consent = consentIdx !== -1 && parts[consentIdx] ? parts[consentIdx] : "opted_in";

      if (!rawLi || !rawIg) continue;

      const cleanLi = cleanUrl(rawLi);
      const cleanIg = cleanUrl(rawIg);

      const existing = sqlite.prepare("SELECT id FROM people WHERE linkedin_url = ? OR instagram_url = ?").get(cleanLi, cleanIg);
      if (!existing) {
        sqlite.prepare(`
          INSERT INTO people (
            id, linkedin_url, instagram_url, consent_status,
            adult_confirmed, public_confirmed, status, created_at, updated_at
          ) VALUES (?, ?, ?, ?, 1, 1, 'pending', ?, ?)
        `).run(crypto.randomUUID(), cleanLi, cleanIg, consent, Date.now(), Date.now());
        imported++;
      }
    }

    return NextResponse.json({ imported, message: `Successfully imported ${imported} candidates` });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
