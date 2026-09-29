import { NextResponse } from "next/server";
import { z } from "zod";
import { getSqlite } from "@/server/db";
import { cleanUrl } from "@/server/connectors/normalize";
import crypto from "crypto";

const AddPersonSchema = z.object({
  linkedin_url: z.string().url(),
  instagram_url: z.string(),
  consent_status: z.enum(["public_figure", "opted_in", "unknown"]).default("opted_in"),
  adult_confirmed: z.boolean(),
  public_confirmed: z.boolean(),
});

export async function GET() {
  const sqlite = getSqlite();
  const people = sqlite.prepare(`
    SELECT id, name, headline, linkedin_url, instagram_url, consent_status,
           adult_confirmed, public_confirmed, status, identity_match, identity_notes, created_at
    FROM people
    ORDER BY created_at DESC
  `).all();
  return NextResponse.json({ people });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = AddPersonSchema.parse(body);

    if (!data.adult_confirmed || !data.public_confirmed) {
      return NextResponse.json(
        { error: "Must confirm candidate is an adult and profiles are public" },
        { status: 400 }
      );
    }

    const cleanLi = cleanUrl(data.linkedin_url);
    const cleanIg = cleanUrl(data.instagram_url);
    const sqlite = getSqlite();

    // Check duplicate
    const existing = sqlite.prepare(`
      SELECT id FROM people WHERE linkedin_url = ? OR instagram_url = ?
    `).get(cleanLi, cleanIg) as any;

    if (existing) {
      return NextResponse.json({ error: "Candidate already exists", id: existing.id }, { status: 409 });
    }

    const id = crypto.randomUUID();
    const now = Date.now();

    sqlite.prepare(`
      INSERT INTO people (
        id, linkedin_url, instagram_url, consent_status,
        adult_confirmed, public_confirmed, status, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, 'pending', ?, ?)
    `).run(
      id,
      cleanLi,
      cleanIg,
      data.consent_status,
      data.adult_confirmed ? 1 : 0,
      data.public_confirmed ? 1 : 0,
      now,
      now
    );

    return NextResponse.json({ id, status: "pending" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
