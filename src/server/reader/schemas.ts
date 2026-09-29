import { z } from "zod";

export const FactSchema = z.object({
  id: z.string(),
  text: z.string(),
  source_ref: z.string(), // li:about, li:exp:1, ig:bio, ig:post:1
  kind: z.string(),
});
export type Fact = z.infer<typeof FactSchema>;

export const VisionAnalysisSchema = z.object({
  activities: z.array(z.string()),
  setting: z.string(),
  people_count: z.number(),
  mood: z.string(),
  objects: z.array(z.string()),
  notable: z.string(),
});
export type VisionAnalysis = z.infer<typeof VisionAnalysisSchema>;

export const PersonaSchema = z.object({
  identity: z.object({
    name: z.string(),
    headline: z.string().optional().default(""),
    location: z.string().optional().default(""),
    current_role: z.string().optional().default(""),
    company: z.string().optional().default(""),
    education: z.array(z.string()).default([]),
  }),
  summary: z.string(),
  needs: z.array(
    z.object({
      need: z.string(),
      kind: z.enum(["stated", "inferred"]),
      weight: z.number().min(1).max(5),
      confidence: z.number().min(0).max(1),
      evidence: z.array(z.string()),
    })
  ),
  hobbies: z.array(
    z.object({
      name: z.string(),
      confidence: z.number().min(0).max(1),
      evidence: z.array(z.string()),
    })
  ),
  interests: z.array(
    z.object({
      name: z.string(),
      confidence: z.number().min(0).max(1),
      evidence: z.array(z.string()),
    })
  ),
  values: z.array(
    z.object({
      name: z.string(),
      confidence: z.number().min(0).max(1),
      evidence: z.array(z.string()),
    })
  ),
  lifestyle: z.object({
    rhythm: z.string(),
    social_energy: z.string(),
    travel: z.string(),
    fitness: z.string(),
    food: z.string(),
    other: z.string(),
  }),
  ambition: z.object({
    level: z.string(),
    direction: z.string(),
    evidence: z.array(z.string()),
  }),
  humor: z.object({
    style: z.string(),
    evidence: z.array(z.string()),
  }),
  communication_style: z.object({
    summary: z.string(),
    evidence: z.array(z.string()),
  }),
  relationship_signals: z.array(
    z.object({
      signal: z.string(),
      confidence: z.number().min(0).max(1),
      evidence: z.array(z.string()),
    })
  ),
  friction_points: z.array(
    z.object({
      point: z.string(),
      why: z.string(),
      evidence: z.array(z.string()),
    })
  ),
  green_flags: z.array(
    z.object({
      flag: z.string(),
      evidence: z.array(z.string()),
    })
  ),
  unknowns: z.array(z.string()),
});
export type Persona = z.infer<typeof PersonaSchema>;
