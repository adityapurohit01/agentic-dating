export interface VoiceMetrics {
  avgSentenceLength: number;
  emojiPer100Chars: number;
  lowercaseRatio: number;
  hashtagRate: number;
  exclamationRate: number;
  languageScriptMix: string;
  avgPostLength: number;
}

export function calculateVoiceMetrics(texts: string[]): VoiceMetrics {
  const combined = texts.join(" ").trim();
  if (!combined) {
    return {
      avgSentenceLength: 0,
      emojiPer100Chars: 0,
      lowercaseRatio: 0,
      hashtagRate: 0,
      exclamationRate: 0,
      languageScriptMix: "English (Latin)",
      avgPostLength: 0,
    };
  }

  // Sentences
  const sentences = combined.split(/[.!?]+/).map((s) => s.trim()).filter((s) => s.length > 0);
  const words = combined.split(/\s+/).filter(Boolean);
  const avgSentenceLength = sentences.length > 0 ? Number((words.length / sentences.length).toFixed(1)) : words.length;

  // Emojis regex
  const emojiRegex = /[\p{Extended_Pictographic}]/gu;
  const emojiCount = (combined.match(emojiRegex) || []).length;
  const emojiPer100Chars = Number(((emojiCount / Math.max(1, combined.length)) * 100).toFixed(2));

  // Lowercase ratio
  const letters = combined.replace(/[^a-zA-Z]/g, "");
  const lowerLetters = combined.replace(/[^a-z]/g, "");
  const lowercaseRatio = letters.length > 0 ? Number((lowerLetters.length / letters.length).toFixed(2)) : 1.0;

  // Hashtags
  const hashtags = (combined.match(/#[a-zA-Z0-9_]+/g) || []).length;
  const hashtagRate = texts.length > 0 ? Number((hashtags / texts.length).toFixed(1)) : 0;

  // Exclamation rate
  const exclamations = (combined.match(/!/g) || []).length;
  const exclamationRate = texts.length > 0 ? Number((exclamations / texts.length).toFixed(2)) : 0;

  // Average post length
  const avgPostLength = texts.length > 0 ? Math.round(combined.length / texts.length) : 0;

  return {
    avgSentenceLength,
    emojiPer100Chars,
    lowercaseRatio,
    hashtagRate,
    exclamationRate,
    languageScriptMix: "English (Latin)",
    avgPostLength,
  };
}
