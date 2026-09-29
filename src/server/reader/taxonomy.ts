/**
 * Canonical Taxonomy (~60 tags)
 *
 * Every hobby, interest, and value from a persona is mapped onto this fixed
 * tag set. Tags serve as a pre-filter / feature for the scoring engine.
 * They are NEVER the final score — the transcript-derived LLM reviews are.
 */

export const HOBBY_TAGS = [
  "running",
  "hiking",
  "cycling",
  "swimming",
  "yoga",
  "climbing",
  "martial_arts",
  "team_sports",
  "cooking",
  "baking",
  "photography",
  "painting",
  "music_performance",
  "music_listening",
  "reading",
  "writing",
  "gaming",
  "gardening",
  "travel",
  "camping",
  "fishing",
  "dancing",
  "crafts_diy",
  "meditation",
  "volunteering",
] as const;

export const INTEREST_TAGS = [
  "artificial_intelligence",
  "software_engineering",
  "data_science",
  "product_management",
  "entrepreneurship",
  "finance_investing",
  "sustainability",
  "architecture_design",
  "fashion",
  "philosophy",
  "psychology",
  "history",
  "politics_policy",
  "science_research",
  "education",
  "healthcare",
  "media_entertainment",
  "food_culture",
  "fitness_wellness",
  "space_exploration",
] as const;

export const VALUE_TAGS = [
  "empathy",
  "integrity",
  "curiosity",
  "creativity",
  "resilience",
  "ambition",
  "humility",
  "authenticity",
  "independence",
  "community",
  "family",
  "spirituality",
  "environmental_stewardship",
  "social_justice",
  "work_life_balance",
] as const;

export type HobbyTag = (typeof HOBBY_TAGS)[number];
export type InterestTag = (typeof INTEREST_TAGS)[number];
export type ValueTag = (typeof VALUE_TAGS)[number];
export type CanonicalTag = HobbyTag | InterestTag | ValueTag;

export const ALL_TAGS: readonly CanonicalTag[] = [
  ...HOBBY_TAGS,
  ...INTEREST_TAGS,
  ...VALUE_TAGS,
];

/**
 * Keyword → canonical tag mapping.
 * Each keyword substring triggers the associated tag.
 */
const KEYWORD_MAP: Record<string, CanonicalTag> = {
  // Hobbies
  run: "running",
  jog: "running",
  marathon: "running",
  sprint: "running",
  trail: "hiking",
  hike: "hiking",
  trek: "hiking",
  backpack: "hiking",
  mountain: "hiking",
  cycle: "cycling",
  bike: "cycling",
  bicycle: "cycling",
  swim: "swimming",
  surf: "swimming",
  yoga: "yoga",
  pilates: "yoga",
  climb: "climbing",
  boulder: "climbing",
  martial: "martial_arts",
  karate: "martial_arts",
  judo: "martial_arts",
  boxing: "martial_arts",
  basketball: "team_sports",
  soccer: "team_sports",
  football: "team_sports",
  cricket: "team_sports",
  baseball: "team_sports",
  tennis: "team_sports",
  volleyball: "team_sports",
  cook: "cooking",
  culinary: "cooking",
  chef: "cooking",
  recipe: "cooking",
  bak: "baking",
  pastry: "baking",
  photo: "photography",
  camera: "photography",
  paint: "painting",
  sketch: "painting",
  draw: "painting",
  art: "painting",
  guitar: "music_performance",
  piano: "music_performance",
  sing: "music_performance",
  instrument: "music_performance",
  band: "music_performance",
  concert: "music_listening",
  vinyl: "music_listening",
  playlist: "music_listening",
  spotify: "music_listening",
  jazz: "music_listening",
  music: "music_listening",
  book: "reading",
  read: "reading",
  novel: "reading",
  literature: "reading",
  poetry: "reading",
  writ: "writing",
  blog: "writing",
  journal: "writing",
  author: "writing",
  game: "gaming",
  esport: "gaming",
  garden: "gardening",
  plant: "gardening",
  botanical: "gardening",
  travel: "travel",
  wander: "travel",
  explore: "travel",
  nomad: "travel",
  camp: "camping",
  outdoor: "camping",
  fish: "fishing",
  angl: "fishing",
  danc: "dancing",
  ballet: "dancing",
  salsa: "dancing",
  craft: "crafts_diy",
  diy: "crafts_diy",
  woodwork: "crafts_diy",
  meditat: "meditation",
  mindful: "meditation",
  zen: "meditation",
  volunteer: "volunteering",
  charity: "volunteering",
  philanthrop: "volunteering",
  nonprofit: "volunteering",

  // Interests
  "artificial intelligence": "artificial_intelligence",
  "machine learning": "artificial_intelligence",
  "deep learning": "artificial_intelligence",
  ai: "artificial_intelligence",
  neural: "artificial_intelligence",
  software: "software_engineering",
  engineer: "software_engineering",
  coding: "software_engineering",
  programm: "software_engineering",
  developer: "software_engineering",
  data: "data_science",
  analytics: "data_science",
  statistic: "data_science",
  product: "product_management",
  startup: "entrepreneurship",
  entrepreneur: "entrepreneurship",
  founder: "entrepreneurship",
  venture: "entrepreneurship",
  business: "entrepreneurship",
  finance: "finance_investing",
  invest: "finance_investing",
  stock: "finance_investing",
  crypto: "finance_investing",
  sustainab: "sustainability",
  green: "sustainability",
  climate: "sustainability",
  renewable: "sustainability",
  architect: "architecture_design",
  design: "architecture_design",
  ux: "architecture_design",
  fashion: "fashion",
  style: "fashion",
  philosoph: "philosophy",
  ethics: "philosophy",
  psycholog: "psychology",
  mental: "psychology",
  therapy: "psychology",
  histor: "history",
  ancient: "history",
  politic: "politics_policy",
  policy: "politics_policy",
  governance: "politics_policy",
  scien: "science_research",
  research: "science_research",
  lab: "science_research",
  educat: "education",
  teach: "education",
  mentor: "education",
  learn: "education",
  health: "healthcare",
  medical: "healthcare",
  wellness: "fitness_wellness",
  fitness: "fitness_wellness",
  workout: "fitness_wellness",
  media: "media_entertainment",
  film: "media_entertainment",
  movie: "media_entertainment",
  podcast: "media_entertainment",
  food: "food_culture",
  wine: "food_culture",
  coffee: "food_culture",
  tea: "food_culture",
  space: "space_exploration",
  astro: "space_exploration",
  rocket: "space_exploration",

  // Values
  empath: "empathy",
  compassion: "empathy",
  caring: "empathy",
  integrit: "integrity",
  honest: "integrity",
  transparen: "integrity",
  trust: "integrity",
  curios: "curiosity",
  wonder: "curiosity",
  inquis: "curiosity",
  creativ: "creativity",
  innovat: "creativity",
  imagin: "creativity",
  resilien: "resilience",
  grit: "resilience",
  persever: "resilience",
  tenac: "resilience",
  ambit: "ambition",
  driven: "ambition",
  goal: "ambition",
  achiev: "ambition",
  humil: "humility",
  modest: "humility",
  authen: "authenticity",
  genuine: "authenticity",
  real: "authenticity",
  independen: "independence",
  autonomy: "independence",
  self_relian: "independence",
  communit: "community",
  social: "community",
  civic: "community",
  famil: "family",
  parent: "family",
  children: "family",
  spirit: "spirituality",
  faith: "spirituality",
  environment: "environmental_stewardship",
  conservation: "environmental_stewardship",
  eco: "environmental_stewardship",
  justice: "social_justice",
  equity: "social_justice",
  divers: "social_justice",
  inclusion: "social_justice",
  balance: "work_life_balance",
  downtime: "work_life_balance",
  boundary: "work_life_balance",
  self_care: "work_life_balance",
};

/**
 * Map a free-text hobby/interest/value name to canonical tags.
 * Returns an array because a single phrase can match multiple tags.
 */
export function mapToTags(text: string): CanonicalTag[] {
  const lower = text.toLowerCase();
  const matched = new Set<CanonicalTag>();

  for (const [keyword, tag] of Object.entries(KEYWORD_MAP)) {
    if (lower.includes(keyword)) {
      matched.add(tag);
    }
  }

  return [...matched];
}

/**
 * Extract all canonical tags from a persona's hobbies, interests, and values.
 */
export function extractPersonaTags(persona: {
  hobbies: Array<{ name: string }>;
  interests: Array<{ name: string }>;
  values: Array<{ name: string }>;
}): Set<CanonicalTag> {
  const tags = new Set<CanonicalTag>();

  for (const h of persona.hobbies) {
    for (const t of mapToTags(h.name)) tags.add(t);
  }
  for (const i of persona.interests) {
    for (const t of mapToTags(i.name)) tags.add(t);
  }
  for (const v of persona.values) {
    for (const t of mapToTags(v.name)) tags.add(t);
  }

  return tags;
}

/**
 * Compute the Jaccard similarity between two tag sets.
 * Returns 0..1; used as a prefilter signal only, never the final score.
 */
export function tagOverlap(a: Set<CanonicalTag>, b: Set<CanonicalTag>): number {
  if (a.size === 0 && b.size === 0) return 0;
  let intersection = 0;
  for (const t of a) {
    if (b.has(t)) intersection++;
  }
  const union = new Set([...a, ...b]).size;
  return intersection / union;
}
