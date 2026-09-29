import { Persona } from "./schemas";

const PROTECTED_TERMS = [
  // Sexual orientation
  "heterosexual", "homosexual", "straight", "gay", "lesbian", "bisexual", "queer", "asexual",
  // Religion
  "christian", "jewish", "muslim", "hindu", "buddhist", "atheist", "agnostic", "catholic", "protestant", "mormon",
  // Health & Disability
  "chronic illness", "disabled", "autistic", "bipolar", "depression", "adhd", "cancer", "hiv",
  // Ethnicity & Race
  "caucasian", "white", "black", "african american", "asian", "hispanic", "latino", "indigenous",
  // Politics
  "democrat", "republican", "conservative", "liberal", "socialist", "libertarian", "trump", "biden",
  // Immigration status
  "undocumented", "immigrant", "visa holder", "green card", "refugee",
];

export function sanitizeText(text: string, path = ""): string {
  let cleaned = text;
  for (const term of PROTECTED_TERMS) {
    const regex = new RegExp(`\\b${term}\\b`, "gi");
    if (regex.test(cleaned)) {
      cleaned = cleaned.replace(regex, "[redacted]");
    }
  }
  return cleaned;
}

export function sanitizeObject<T>(obj: T): T {
  if (typeof obj === "string") {
    return sanitizeText(obj) as any;
  }
  if (Array.isArray(obj)) {
    return obj.map((item) => sanitizeObject(item)) as any;
  }
  if (obj !== null && typeof obj === "object") {
    const res: any = {};
    for (const [key, value] of Object.entries(obj)) {
      res[key] = sanitizeObject(value);
    }
    return res;
  }
  return obj;
}

export function sanitizePersona(persona: Persona): Persona {
  return sanitizeObject(persona);
}
