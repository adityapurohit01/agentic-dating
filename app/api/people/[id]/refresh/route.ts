import { NextResponse } from "next/server";
import { handleCollect, handleRead } from "@/server/jobs/handlers";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    await handleCollect(id);
    await handleRead(id);
    return NextResponse.json({ success: true, message: `Refreshed candidate ${id}` });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
