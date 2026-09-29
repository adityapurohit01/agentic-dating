import { z } from "zod";
import { llm } from "../llm";
import { Persona } from "../reader/schemas";

export const SceneSchema = z.object({
  scene: z.string(),
  opening_topic: z.string(),
  friction_topic: z.string(),
  why: z.string(),
});
export type Scene = z.infer<typeof SceneSchema>;

const SCENE_OPTIONS = [
  {
    scene: "A sunlit cafe corner near a botanical conservatory, surrounded by rare ferns and fresh espresso aromas.",
    opening_topic: "Morning creative rituals and what keeps personal curiosity alive.",
    friction_topic: "Finding space for spontaneous weekend getaways amidst heavy weekly commitments.",
  },
  {
    scene: "An intimate rooftop terrace overlooking the illuminated bay skyline as dusk settles over the water.",
    opening_topic: "The boldest ideas or projects that shaped each other's perspectives.",
    friction_topic: "Balancing high-intensity ambition with being emotionally present in a relationship.",
  },
  {
    scene: "A quiet corner of an independent design bookstore and gallery with courtyard seating and pour-over tea.",
    opening_topic: "Favorite books, visual aesthetics, and the craftsmanship of great tools.",
    friction_topic: "Differing paces of decision making: deliberate patience versus rapid execution.",
  },
  {
    scene: "A rustic coastal lookout cafe along the cliffs, listening to waves crashing against the rocky shore.",
    opening_topic: "Outdoor adventures, mountain trails, and places that bring true calm.",
    friction_topic: "Rooted geographical stability versus the desire for nomadic travel and relocation.",
  },
  {
    scene: "A warm farm-to-table tasting room with vinyl jazz records spinning softly in the background.",
    opening_topic: "Culinary traditions, family memories, and the joy of shared feasts.",
    friction_topic: "Navigating differences in social energy: lively dinner parties versus quiet solo evenings.",
  },
  {
    scene: "A serene Japanese tea house tucked beside a peaceful stone garden and bamboo grove.",
    opening_topic: "Philosophy of mind, long-term human progress, and what gives life meaning.",
    friction_topic: "Handling public visibility, professional pressures, and personal boundary protection.",
  },
];

export async function moderateDateScene(
  dateId: string,
  personA: Persona,
  personB: Persona
): Promise<Scene> {
  const prompt = `Two AI agents representing real candidates are going on a date.

Candidate A:
- Name: ${personA.identity.name}
- Summary: ${personA.summary}
- Top Needs: ${personA.needs.slice(0, 3).map((n) => n.need).join(", ")}
- Friction Points: ${personA.friction_points.map((f) => f.point).join(", ")}

Candidate B:
- Name: ${personB.identity.name}
- Summary: ${personB.summary}
- Top Needs: ${personB.needs.slice(0, 3).map((n) => n.need).join(", ")}
- Friction Points: ${personB.friction_points.map((f) => f.point).join(", ")}

Design an immersive scene for this date (e.g. coffee roastery, bookstore cafe, trailhead, ramen shop), an engaging opening topic that bridges their common interests, and a friction topic most likely to test genuine compatibility (e.g. career vs relocation, spontaneity vs planning, work hours, ambition vs downtime). Return JSON matching SceneSchema.`;

  try {
    return await llm.object({
      schema: SceneSchema,
      prompt,
      purpose: "moderate_scene",
      dateId,
      temperature: 0.6,
    });
  } catch {
    // Deterministic selection based on candidate names to ensure variety
    let charSum = 0;
    const combined = personA.identity.name + personB.identity.name + dateId;
    for (let i = 0; i < combined.length; i++) {
      charSum += combined.charCodeAt(i);
    }
    const template = SCENE_OPTIONS[charSum % SCENE_OPTIONS.length];

    // Tailor topics using actual hobbies/friction points if present
    const hobbyA = personA.hobbies[0]?.name;
    const hobbyB = personB.hobbies[0]?.name;
    const opening = hobbyA && hobbyB
      ? `Bridging ${personA.identity.name}'s passion for ${hobbyA} and ${personB.identity.name}'s love for ${hobbyB}.`
      : template.opening_topic;

    const frictionA = personA.friction_points[0]?.point;
    const friction = frictionA || template.friction_topic;

    return {
      scene: template.scene,
      opening_topic: opening,
      friction_topic: friction,
      why: `Designed specifically to reflect ${personA.identity.name} and ${personB.identity.name}'s complementary passions while testing alignment on daily life rhythms.`,
    };
  }
}
