import { NextResponse } from "next/server";
import { seedFixtures } from "@/../scripts/seed-fixtures";

export async function POST() {
  try {
    const seeded = await seedFixtures(true);
    return NextResponse.json({
      success: true,
      count: seeded.length,
      message: `Loaded ${seeded.length} synthetic candidates into demo set`,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
