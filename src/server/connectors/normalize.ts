import { NormalizedProfile } from "./types";

export function cleanUrl(rawUrl: string): string {
  try {
    const parsed = new URL(rawUrl.trim());
    // Strip tracking parameters
    ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "igshid", "si"].forEach(
      (param) => parsed.searchParams.delete(param)
    );
    // Lowercase path
    parsed.pathname = parsed.pathname.toLowerCase().replace(/\/+$/, "");
    return parsed.toString();
  } catch {
    return rawUrl.trim().toLowerCase();
  }
}

export function extractInstagramHandle(urlOrHandle: string): string {
  const trimmed = urlOrHandle.trim().replace(/^@/, "");
  try {
    const parsed = new URL(trimmed.startsWith("http") ? trimmed : `https://${trimmed}`);
    const parts = parsed.pathname.split("/").filter(Boolean);
    return (parts[0] || trimmed).toLowerCase();
  } catch {
    return trimmed.toLowerCase();
  }
}

export function normalizeLinkedIn(raw: any): Partial<NormalizedProfile> {
  if (!raw || typeof raw !== "object") return {};

  const name = raw.fullName || raw.name || raw.formattedName || `${raw.firstName || ""} ${raw.lastName || ""}`.trim() || "LinkedIn User";
  const headline = raw.headline || raw.title || raw.subTitle || "";
  const location = raw.location || raw.locationName || raw.geoCountryName || "";
  const summary = raw.about || raw.summary || raw.bio || raw.description || "";

  const expRaw = raw.experience || raw.positions || raw.workExperience || [];
  const experience = Array.isArray(expRaw)
    ? expRaw.map((e: any) => ({
        title: e.title || e.role || e.designation || "Role",
        company: e.company || e.companyName || "Company",
        duration: e.duration || e.dateRange || "",
        description: e.description || e.summary || "",
      }))
    : [];

  const eduRaw = raw.education || raw.schools || [];
  const education = Array.isArray(eduRaw)
    ? eduRaw.map((ed: any) => ({
        school: ed.school || ed.schoolName || ed.college || "University",
        degree: ed.degree || ed.degreeName || ed.fieldOfStudy || "",
      }))
    : [];

  const skillsRaw = raw.skills || raw.endorsements || [];
  const skills = Array.isArray(skillsRaw)
    ? skillsRaw.map((s: any) => (typeof s === "string" ? s : s.name || s.title)).filter(Boolean)
    : [];

  return {
    name,
    headline,
    location,
    currentRole: experience[0]?.title || headline,
    company: experience[0]?.company || "",
    summary,
    experience,
    education,
    skills,
  };
}

export function normalizeInstagram(raw: any): Partial<NormalizedProfile> {
  if (!raw || typeof raw !== "object") return {};

  const name = raw.fullName || raw.name || raw.username || "Instagram User";
  const bio = raw.biography || raw.bio || raw.description || "";
  const externalUrl = raw.externalUrl || raw.externalUrls?.[0] || raw.external_url || raw.website || "";
  const followersCount = raw.followersCount || raw.followerCount || raw.edge_followed_by?.count || 0;

  const postsRaw = raw.latestPosts || raw.posts || raw.media || raw.edge_owner_to_timeline_media?.edges || [];
  const posts = Array.isArray(postsRaw)
    ? postsRaw.map((p: any, idx: number) => {
        const node = p.node || p;
        return {
          id: String(node.id || node.shortCode || node.code || `post_${idx}`),
          caption: node.caption || node.text || node.edge_media_to_caption?.edges?.[0]?.node?.text || "",
          displayUrl: node.displayUrl || node.imageUrl || node.url || node.display_url || "",
          timestamp: node.timestamp || node.taken_at_timestamp || "",
        };
      })
    : [];

  return {
    name,
    bio,
    externalUrl,
    followersCount,
    posts,
  };
}
