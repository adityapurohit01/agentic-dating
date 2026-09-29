import { eventBus, getEventsSince, AppEvent } from "@/server/events";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const encoder = new TextEncoder();
  const lastEventIdHeader = req.headers.get("last-event-id");
  const lastEventId = lastEventIdHeader ? parseInt(lastEventIdHeader, 10) : 0;

  const stream = new ReadableStream({
    start(controller) {
      // 1. Replay historical events since Last-Event-ID
      if (!isNaN(lastEventId) && lastEventId > 0) {
        const backlog = getEventsSince(lastEventId, 50);
        for (const evt of backlog) {
          controller.enqueue(
            encoder.encode(`id: ${evt.id}\nevent: ${evt.type}\ndata: ${JSON.stringify(evt.payload)}\n\n`)
          );
        }
      }

      // 2. Stream live events
      const onAppEvent = (evt: AppEvent) => {
        try {
          controller.enqueue(
            encoder.encode(`id: ${evt.id}\nevent: ${evt.type}\ndata: ${JSON.stringify(evt.payload)}\n\n`)
          );
        } catch {}
      };

      eventBus.on("app_event", onAppEvent);

      req.signal.addEventListener("abort", () => {
        eventBus.off("app_event", onAppEvent);
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
