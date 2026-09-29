import { EventEmitter } from "events";
import { getSqlite } from "./db";

// Global event bus for real-time SSE delivery across server components
declare global {
  var _eventEmitter: EventEmitter | undefined;
}

if (!global._eventEmitter) {
  global._eventEmitter = new EventEmitter();
  global._eventEmitter.setMaxListeners(200);
}

export const eventBus = global._eventEmitter;

export interface AppEvent {
  id: number;
  type: string;
  payload: any;
  createdAt: number;
}

export function emitEvent(type: string, payload: any): AppEvent {
  const sqlite = getSqlite();
  const now = Date.now();
  const payloadJson = JSON.stringify(payload);

  const stmt = sqlite.prepare(`
    INSERT INTO events (type, payload_json, created_at)
    VALUES (?, ?, ?)
  `);
  const info = stmt.run(type, payloadJson, now);
  const eventId = Number(info.lastInsertRowid);

  const event: AppEvent = {
    id: eventId,
    type,
    payload,
    createdAt: now,
  };

  eventBus.emit("app_event", event);
  if (type.startsWith("date:")) {
    eventBus.emit(type, event);
  }

  return event;
}

export function getEventsSince(lastEventId: number, limit = 100): AppEvent[] {
  const sqlite = getSqlite();
  const stmt = sqlite.prepare(`
    SELECT id, type, payload_json, created_at
    FROM events
    WHERE id > ?
    ORDER BY id ASC
    LIMIT ?
  `);
  const rows = stmt.all(lastEventId, limit) as {
    id: number;
    type: string;
    payload_json: string;
    created_at: number;
  }[];

  return rows.map((r) => ({
    id: r.id,
    type: r.type,
    payload: JSON.parse(r.payload_json),
    createdAt: r.created_at,
  }));
}
