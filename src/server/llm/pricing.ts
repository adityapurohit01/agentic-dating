// Pricing configuration per million tokens with environment overrides
export interface ModelPricing {
  inputPerMillion: number;
  outputPerMillion: number;
  cachedInputPerMillion?: number;
  estimated?: boolean;
}

export const PRICING_CONFIG: Record<string, ModelPricing> = {
  // Anthropic
  "claude-haiku-4-5-20251001": { inputPerMillion: 0.8, outputPerMillion: 4.0, cachedInputPerMillion: 0.08 },
  "claude-3-5-haiku-20241022": { inputPerMillion: 0.8, outputPerMillion: 4.0, cachedInputPerMillion: 0.08 },
  "claude-sonnet-5-5": { inputPerMillion: 3.0, outputPerMillion: 15.0, cachedInputPerMillion: 0.3 },
  "claude-3-5-sonnet-20241022": { inputPerMillion: 3.0, outputPerMillion: 15.0, cachedInputPerMillion: 0.3 },
  
  // Gemini
  "gemini-2.5-flash": { inputPerMillion: 0.075, outputPerMillion: 0.3 },
  "gemini-2.0-flash": { inputPerMillion: 0.075, outputPerMillion: 0.3 },
  "gemini-2.5-pro": { inputPerMillion: 1.25, outputPerMillion: 5.0 },
  "gemini-1.5-pro": { inputPerMillion: 1.25, outputPerMillion: 5.0 },
  "gemini-1.5-flash": { inputPerMillion: 0.075, outputPerMillion: 0.3 },

  // Mock
  "mock": { inputPerMillion: 0.0, outputPerMillion: 0.0 },
};

export function calculateCost(
  model: string,
  tokensIn: number,
  tokensOut: number,
  cachedTokensIn = 0
): { costUsd: number; estimated: boolean } {
  const pricing = PRICING_CONFIG[model] || {
    inputPerMillion: 1.0,
    outputPerMillion: 3.0,
    estimated: true,
  };

  const normalTokens = Math.max(0, tokensIn - cachedTokensIn);
  const normalCost = (normalTokens / 1_000_000) * pricing.inputPerMillion;
  const cachedCost = pricing.cachedInputPerMillion
    ? (cachedTokensIn / 1_000_000) * pricing.cachedInputPerMillion
    : (cachedTokensIn / 1_000_000) * pricing.inputPerMillion;
  const outputCost = (tokensOut / 1_000_000) * pricing.outputPerMillion;

  const totalCost = Number((normalCost + cachedCost + outputCost).toFixed(6));
  return {
    costUsd: totalCost,
    estimated: pricing.estimated ?? false,
  };
}
