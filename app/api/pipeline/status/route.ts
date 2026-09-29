import { NextResponse } from "next/server";
import { getPipelineStatus } from "@/server/jobs/pipeline";

export async function GET() {
  const status = getPipelineStatus();
  return NextResponse.json(status);
}
