import { eventBus } from "@/server/events";
import { getSqlite } from "@/server/db";

export const dynamic = "force-dynamic";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      // 1. Send existing turns first
      const sqlite = getSqlite();
      const existingTurns = sqlite.prepare(`
        SELECT t.turn_number, t.speaker_id, t.message, p.name as speaker_name
        FROM date_turns t
        JOIN people p ON p.id = t.speaker_id
        WHERE t.date_id = ?
        ORDER BY t.turn_number ASC
      `).all(id) as any[];

      for (const t of existingTurns) {
        controller.enqueue(
          encoder.encode(`event: turn\ndata: ${JSON.stringify(t)}\n\n`)
        );
      }

      // 2. Listen for new turn events
      const onTurn = (evt: any) => {
        if (evt.payload?.dateId === id) {
          controller.enqueue(
            encoder.encode(`event: turn\ndata: ${JSON.stringify(evt.payload)}\n\n`)
          );
        }
      };

      const onCompleted = (evt: any) => {
        if (evt.payload?.dateId === id) {
          controller.enqueue(
            encoder.encode(`event: completed\ndata: ${JSON.stringify(evt.payload)}\n\n`)
          );
        }
      };

      eventBus.on("date:turn", onTurn);
      eventBus.on("date:completed", onCompleted);

      req.signal.addEventListener("abort", () => {
        eventBus.off("date:turn", onTurn);
        eventBus.off("date:completed", onCompleted);
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
