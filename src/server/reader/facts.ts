import { NormalizedProfile } from "../connectors/types";
import { Fact, VisionAnalysisSchema, VisionAnalysis } from "./schemas";
import { llm } from "../llm";

export async function extractFacts(
  personId: string,
  linkedin: Partial<NormalizedProfile>,
  instagram: Partial<NormalizedProfile>,
  mediaList: Array<{ localPath: string; originalUrl: string; caption?: string }>
): Promise<{ facts: Fact[]; mediaVision: Array<{ localPath: string; vision: VisionAnalysis }> }> {
  const facts: Fact[] = [];
  let factId = 1;

  // 1. LinkedIn about/summary
  if (linkedin.summary && linkedin.summary.trim().length > 0) {
    facts.push({
      id: `fact_${factId++}`,
      text: linkedin.summary.trim(),
      source_ref: "li:about",
      kind: "summary",
    });
  }

  // 2. LinkedIn experience
  if (linkedin.experience && linkedin.experience.length > 0) {
    linkedin.experience.forEach((exp, idx) => {
      const desc = exp.description ? `: ${exp.description}` : "";
      facts.push({
        id: `fact_${factId++}`,
        text: `${exp.title} at ${exp.company} (${exp.duration || "current"})${desc}`,
        source_ref: `li:exp:${idx + 1}`,
        kind: "experience",
      });
    });
  }

  // 3. LinkedIn education
  if (linkedin.education && linkedin.education.length > 0) {
    linkedin.education.forEach((edu, idx) => {
      facts.push({
        id: `fact_${factId++}`,
        text: `${edu.degree ? edu.degree + " at " : ""}${edu.school}`,
        source_ref: `li:edu:${idx + 1}`,
        kind: "education",
      });
    });
  }

  // 4. LinkedIn skills
  if (linkedin.skills && linkedin.skills.length > 0) {
    facts.push({
      id: `fact_${factId++}`,
      text: `Key skills: ${linkedin.skills.join(", ")}`,
      source_ref: "li:skills",
      kind: "skills",
    });
  }

  // 5. Instagram bio & external url
  if (instagram.bio && instagram.bio.trim().length > 0) {
    facts.push({
      id: `fact_${factId++}`,
      text: instagram.bio.trim(),
      source_ref: "ig:bio",
      kind: "bio",
    });
  }
  if (instagram.externalUrl && instagram.externalUrl.trim().length > 0) {
    facts.push({
      id: `fact_${factId++}`,
      text: `External link: ${instagram.externalUrl.trim()}`,
      source_ref: "ig:link",
      kind: "link",
    });
  }

  // 6. Instagram posts
  if (instagram.posts && instagram.posts.length > 0) {
    instagram.posts.forEach((post, idx) => {
      if (post.caption && post.caption.trim().length > 0) {
        facts.push({
          id: `fact_${factId++}`,
          text: post.caption.trim(),
          source_ref: `ig:post:${post.id || idx + 1}`,
          kind: "post_caption",
        });
      }
    });
  }

  // 7. Media vision analysis for downloaded images
  const mediaVision: Array<{ localPath: string; vision: VisionAnalysis }> = [];
  for (const item of mediaList.slice(0, 4)) {
    try {
      const visionRes = await llm.vision({
        schema: VisionAnalysisSchema,
        images: [{ path: item.localPath }],
        prompt: `Analyze this image from a public Instagram profile. Caption: "${item.caption || ""}". Identify setting, activities, mood, and objects.`,
        purpose: "media_vision",
        personId,
      });

      mediaVision.push({
        localPath: item.localPath,
        vision: visionRes,
      });

      facts.push({
        id: `fact_${factId++}`,
        text: `Image showing ${visionRes.activities.join(", ")} at ${visionRes.setting}. Mood: ${visionRes.mood}. ${visionRes.notable}`,
        source_ref: `ig:media:${item.localPath.split(/[\\/]/).pop()?.replace(/\.[^.]+$/, "") || "img"}`,
        kind: "image_vision",
      });
    } catch {
      // Vision optional failure handled gracefully
    }
  }

  return { facts, mediaVision };
}
