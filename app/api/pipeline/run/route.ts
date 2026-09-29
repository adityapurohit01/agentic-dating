import { NextResponse } from "next/server";
import { runFullPipeline } from "@/server/jobs/pipeline";

export async function POST(req: Request) {
  try {
    let fromStage = "collect";
    try {
      const body = await req.json();
      if (body.from) fromStage = body.from;
    } catch {}

    // Run asynchronously or start in background
    runFullPipeline(fromStage as any);

    return NextResponse.json({
      success: true,
      message: `Pipeline triggered starting from stage: ${fromStage}`,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
