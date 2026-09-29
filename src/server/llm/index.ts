import { LLMInterface } from "./types";
import { MockLLM } from "./mock";
import { GeminiLLM } from "./gemini";
import { AnthropicLLM } from "./anthropic";

export * from "./types";
export * from "./pricing";

declare global {
  var _llmInstance: LLMInterface | undefined;
}

export function getLLM(): LLMInterface {
  if (!global._llmInstance) {
    const provider = (process.env.LLM_PROVIDER || "mock").toLowerCase();
    if (provider === "gemini") {
      global._llmInstance = new GeminiLLM();
    } else if (provider === "anthropic") {
      global._llmInstance = new AnthropicLLM();
    } else {
      global._llmInstance = new MockLLM();
    }
  }
  return global._llmInstance;
}

export function isMockMode(): boolean {
  const provider = (process.env.LLM_PROVIDER || "mock").toLowerCase();
  if (provider === "mock") return true;
  if (provider === "gemini" && !process.env.GEMINI_API_KEY) return true;
  if (provider === "anthropic" && !process.env.ANTHROPIC_API_KEY) return true;
  return false;
}

export const llm = getLLM();
