import { ApifyClient } from "apify-client";
import { Connector, RawSourceItem } from "./types";
import { extractInstagramHandle } from "./normalize";
import fs from "fs";
import path from "path";

export class ApifyConnector implements Connector {
  private client: ApifyClient | null = null;
  private linkedinActor: string;
  private instagramActor: string;

  constructor() {
    const token = process.env.APIFY_TOKEN;
    this.client = token ? new ApifyClient({ token }) : null;
    this.linkedinActor = process.env.APIFY_LINKEDIN_ACTOR || "myagizm/linkedin-profile-scraper";
    this.instagramActor = process.env.APIFY_INSTAGRAM_ACTOR || "apify/instagram-profile-scraper";
  }

  async fetchLinkedIn(urls: string[]): Promise<RawSourceItem[]> {
    if (!this.client || urls.length === 0) {
      return this.fallbackFixtures(urls, "linkedin");
    }

    try {
      // Build input based on optional override or standard format
      const override = process.env.APIFY_LINKEDIN_INPUT_JSON;
      const input = override
        ? { ...JSON.parse(override), urls }
        : { profileUrls: urls, urls };

      const run = await this.client.actor(this.linkedinActor).call(input, { waitSecs: 180 });
      const { items } = await this.client.dataset(run.defaultDatasetId).listItems();

      return urls.map((url, idx) => {
        const item = items[idx] || items.find((i: any) => (i.url || i.profileUrl || "").includes(url)) || items[0];
        return {
          url,
          source: "linkedin",
          data: item || { error: "No profile returned by actor" },
        };
      });
    } catch (err: any) {
      return this.fallbackFixtures(urls, "linkedin", err.message);
    }
  }

  async fetchInstagram(handles: string[]): Promise<RawSourceItem[]> {
    if (!this.client || handles.length === 0) {
      return this.fallbackFixtures(handles, "instagram");
    }

    try {
      const cleanHandles = handles.map(extractInstagramHandle);
      const override = process.env.APIFY_INSTAGRAM_INPUT_JSON;
      const input = override
        ? { ...JSON.parse(override), usernames: cleanHandles }
        : { usernames: cleanHandles };

      const run = await this.client.actor(this.instagramActor).call(input, { waitSecs: 180 });
      const { items } = await this.client.dataset(run.defaultDatasetId).listItems();

      return handles.map((h, idx) => {
        const cleanH = cleanHandles[idx];
        const item = items.find((i: any) => (i.username || "").toLowerCase() === cleanH) || items[idx];
        return {
          url: h,
          source: "instagram",
          data: item || { error: "Profile private or not found" },
        };
      });
    } catch (err: any) {
      return this.fallbackFixtures(handles, "instagram", err.message);
    }
  }

  private fallbackFixtures(keys: string[], source: "linkedin" | "instagram", errMsg?: string): RawSourceItem[] {
    const fixtureDir = path.resolve(process.env.DATA_DIR || "./data", "fixtures");
    return keys.map((key, i) => {
      const fixtureNum = String((i % 25) + 1).padStart(2, "0");
      const fixtureFile = path.join(fixtureDir, `synthetic_${fixtureNum}_${source}.json`);

      let data: any = null;
      if (fs.existsSync(fixtureFile)) {
        try {
          data = JSON.parse(fs.readFileSync(fixtureFile, "utf-8"));
        } catch {
          data = null;
        }
      }

      if (!data) {
        data = source === "linkedin"
          ? {
              name: `Synthetic ${fixtureNum}`,
              headline: "Software Architect & Marathoner",
              about: "Passionate about building resilient distributed systems and training for trail ultras.",
              experience: [{ title: "Lead Architect", company: "NextGen Systems", duration: "2021 - Present" }],
              education: [{ school: "MIT", degree: "B.S. in Computer Science" }],
            }
          : {
              username: `synthetic_${fixtureNum}`,
              biography: "Coffee enthusiast. Trail runner. Coding the future. linktr.ee/synthetic",
              posts: [
                { id: `post_${fixtureNum}_1`, caption: "Sunrise 20-miler in the hills. Clear mind, fresh air." },
                { id: `post_${fixtureNum}_2`, caption: "Pour-over setup dialed in for the weekend." },
              ],
            };
      }

      return {
        url: key,
        source,
        data,
        error: errMsg,
      };
    });
  }
}

export async function downloadMediaImages(personId: string, posts: Array<{ id: string; displayUrl?: string; caption?: string }>) {
  const dataDir = process.env.DATA_DIR || "./data";
  const mediaDir = path.resolve(dataDir, "media", personId);
  if (!fs.existsSync(mediaDir)) {
    fs.mkdirSync(mediaDir, { recursive: true });
  }

  const downloaded: Array<{ localPath: string; originalUrl: string; caption: string }> = [];
  const topPosts = (posts || []).slice(0, 12);

  for (const post of topPosts) {
    if (!post.displayUrl) continue;
    try {
      const ext = ".jpg";
      const filename = `${post.id}${ext}`;
      const filePath = path.join(mediaDir, filename);

      if (!fs.existsSync(filePath)) {
        // Fetch image with timeout
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 6000);
        const res = await fetch(post.displayUrl, { signal: controller.signal });
        clearTimeout(timeout);

        if (res.ok) {
          const buffer = Buffer.from(await res.arrayBuffer());
          fs.writeFileSync(filePath, buffer);
          downloaded.push({
            localPath: filePath,
            originalUrl: post.displayUrl,
            caption: post.caption || "",
          });
        }
      } else {
        downloaded.push({
          localPath: filePath,
          originalUrl: post.displayUrl,
          caption: post.caption || "",
        });
      }
    } catch {
      // Quietly skip image download failures as specified
    }
  }

  return downloaded;
}
