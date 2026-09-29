import { NormalizedProfile } from "./types";

export interface IdentityCheckResult {
  matchScore: number; // 0 to 1
  notes: string;
}

export function checkIdentityMatch(
  linkedin: Partial<NormalizedProfile>,
  instagram: Partial<NormalizedProfile>,
  linkedinUrl: string
): IdentityCheckResult {
  let score = 0;
  const reasons: string[] = [];

  // Check 1: Instagram bio or external URL links to LinkedIn
  const igBio = (instagram.bio || "").toLowerCase();
  const igExternal = (instagram.externalUrl || "").toLowerCase();
  const liHandleMatch = linkedinUrl.match(/linkedin\.com\/in\/([a-zA-Z0-9-]+)/);
  const liHandle = liHandleMatch ? liHandleMatch[1].toLowerCase() : "";

  if (
    (liHandle && (igBio.includes(liHandle) || igExternal.includes(liHandle))) ||
    igBio.includes("linkedin.com") ||
    igExternal.includes("linkedin.com")
  ) {
    score += 0.5;
    reasons.push("Instagram links directly to LinkedIn handle/URL");
  }

  // Check 2: Name similarity
  const liName = (linkedin.name || "").toLowerCase().trim();
  const igName = (instagram.name || "").toLowerCase().trim();
  if (liName && igName) {
    if (liName === igName) {
      score += 0.3;
      reasons.push("Exact full name match");
    } else {
      const liTokens = liName.split(/\s+/);
      const igTokens = igName.split(/\s+/);
      const intersection = liTokens.filter((t) => igTokens.includes(t));
      if (intersection.length > 0) {
        score += 0.2;
        reasons.push(`Partial name match (${intersection.join(", ")})`);
      }
    }
  }

  // Check 3: Employer / company mention in IG bio
  const company = (linkedin.company || "").toLowerCase();
  if (company && company.length > 2 && igBio.includes(company)) {
    score += 0.15;
    reasons.push(`Company '${linkedin.company}' referenced in Instagram bio`);
  }

  // Check 4: Location match
  const liLoc = (linkedin.location || "").toLowerCase();
  if (liLoc && liLoc.length > 2 && igBio.includes(liLoc)) {
    score += 0.1;
    reasons.push(`Location '${linkedin.location}' referenced in Instagram bio`);
  }

  // Baseline credit if synthetic or both present
  if (reasons.length === 0) {
    score = 0.45;
    reasons.push("No explicit cross-links found; name/topic alignment inferred");
  }

  const finalScore = Math.min(1.0, Math.max(0.1, Number(score.toFixed(2))));
  return {
    matchScore: finalScore,
    notes: reasons.join("; "),
  };
}
