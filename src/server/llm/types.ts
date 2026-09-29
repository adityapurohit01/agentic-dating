import { z } from "zod";

export interface LLMMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface LLMTextOptions {
  system?: string;
  messages: LLMMessage[];
  model?: string;
  maxTokens?: number;
  temperature?: number;
  purpose: string;
  personId?: string;
  dateId?: string;
}

export interface LLMObjectOptions<T extends z.ZodTypeAny> {
  schema: T;
  system?: string;
  prompt: string;
  model?: string;
  maxTokens?: number;
  temperature?: number;
  purpose: string;
  personId?: string;
  dateId?: string;
}

export interface LLMVisionOptions<T extends z.ZodTypeAny> {
  schema: T;
  images: Array<{ path?: string; base64?: string; mimeType?: string; url?: string }>;
  prompt: string;
  model?: string;
  purpose: string;
  personId?: string;
}

export interface LLMInterface {
  text(options: LLMTextOptions): Promise<string>;
  object<T extends z.ZodTypeAny>(options: LLMObjectOptions<T>): Promise<z.infer<T>>;
  vision<T extends z.ZodTypeAny>(options: LLMVisionOptions<T>): Promise<z.infer<T>>;
}
