import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { LLMInterface, LLMTextOptions, LLMObjectOptions, LLMVisionOptions } from "./types";
import { calculateCost } from "./pricing";
import { getSqlite } from "../db";
import { MockLLM } from "./mock";
import crypto from "crypto";

export class AnthropicLLM implements LLMInterface {
  private client: Anthropic | null = null;
  private fallback: MockLLM;

  constructor() {
    const key = process.env.ANTHROPIC_API_KEY;
    this.fallback = new MockLLM();
    if (key) {
      try {
        this.client = new Anthropic({ apiKey: key });
      } catch {
        this.client = null;
      }
    }
  }

  private logCall(options: {
    purpose: string;
    model: string;
    tokensIn: number;
    tokensOut: number;
    cachedTokensIn?: number;
    personId?: string;
    dateId?: string;
    durationMs: number;
  }) {
    const sqlite = getSqlite();
    const { costUsd, estimated } = calculateCost(
      options.model,
      options.tokensIn,
      options.tokensOut,
      options.cachedTokensIn || 0
    );
    sqlite.prepare(`
      INSERT INTO llm_calls (id, purpose, model, tokens_in, tokens_out, cost_usd, estimated, duration_ms, person_id, date_id, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      crypto.randomUUID(),
      options.purpose,
      options.model,
      options.tokensIn,
      options.tokensOut,
      costUsd,
      estimated ? 1 : 0,
      options.durationMs,
      options.personId || null,
      options.dateId || null,
      Date.now()
    );
  }

  async text(options: LLMTextOptions): Promise<string> {
    const start = Date.now();
    const model = options.model || process.env.LLM_MODEL_FAST || "claude-haiku-4-5-20251001";

    if (!this.client) {
      return this.fallback.text(options);
    }

    try {
      const messages: Anthropic.MessageParam[] = options.messages.map((m) => ({
        role: m.role === "assistant" ? "assistant" : "user",
        content: m.content,
      }));

      const res = await this.client.messages.create({
        model,
        max_tokens: options.maxTokens || 300,
        temperature: options.temperature ?? 0.7,
        system: options.system
          ? [
              {
                type: "text",
                text: options.system,
                cache_control: { type: "ephemeral" },
              },
            ]
          : undefined,
        messages,
      });

      const reply = res.content[0]?.type === "text" ? res.content[0].text : "";
      this.logCall({
        purpose: options.purpose,
        model,
        tokensIn: res.usage.input_tokens,
        tokensOut: res.usage.output_tokens,
        cachedTokensIn: (res.usage as any).cache_read_input_tokens || 0,
        personId: options.personId,
        dateId: options.dateId,
        durationMs: Date.now() - start,
      });

      return reply;
    } catch {
      return this.fallback.text(options);
    }
  }

  async object<T extends z.ZodTypeAny>(options: LLMObjectOptions<T>): Promise<z.infer<T>> {
    const start = Date.now();
    const model = options.model || process.env.LLM_MODEL_STRONG || "claude-sonnet-5-5";

    if (!this.client) {
      return this.fallback.object(options);
    }

    try {
      const res = await this.client.messages.create({
        model,
        max_tokens: options.maxTokens || 2000,
        temperature: options.temperature ?? 0,
        system: options.system
          ? [
              {
                type: "text",
                text: options.system,
                cache_control: { type: "ephemeral" },
              },
            ]
          : undefined,
        messages: [{ role: "user", content: options.prompt }],
        tools: [
          {
            name: "submit_output",
            description: "Submit the structured JSON result",
            input_schema: {
              type: "object",
              properties: {
                payload: { type: "object", description: "The validated payload" },
              },
              required: ["payload"],
            },
          },
        ],
        tool_choice: { type: "tool", name: "submit_output" },
      });

      const toolUse = res.content.find((c) => c.type === "tool_use") as Anthropic.ToolUseBlock | undefined;
      if (!toolUse) {
        throw new Error("No tool use block received");
      }

      const parsed = options.schema.parse((toolUse.input as any).payload || toolUse.input);
      this.logCall({
        purpose: options.purpose,
        model,
        tokensIn: res.usage.input_tokens,
        tokensOut: res.usage.output_tokens,
        cachedTokensIn: (res.usage as any).cache_read_input_tokens || 0,
        personId: options.personId,
        dateId: options.dateId,
        durationMs: Date.now() - start,
      });

      return parsed;
    } catch {
      return this.fallback.object(options);
    }
  }

  async vision<T extends z.ZodTypeAny>(options: LLMVisionOptions<T>): Promise<z.infer<T>> {
    return this.fallback.vision(options);
  }
}
