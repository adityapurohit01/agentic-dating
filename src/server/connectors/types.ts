export interface RawSourceItem {
  url: string;
  source: "linkedin" | "instagram";
  data: any;
  error?: string;
}

export interface NormalizedProfile {
  name: string;
  headline?: string;
  location?: string;
  currentRole?: string;
  company?: string;
  summary?: string;
  experience?: Array<{ title: string; company: string; duration?: string; description?: string }>;
  education?: Array<{ school: string; degree?: string }>;
  skills?: string[];
  bio?: string;
  externalUrl?: string;
  followersCount?: number;
  posts?: Array<{
    id: string;
    caption: string;
    displayUrl?: string;
    timestamp?: string;
  }>;
}

export interface Connector {
  fetchLinkedIn(urls: string[]): Promise<RawSourceItem[]>;
  fetchInstagram(handles: string[]): Promise<RawSourceItem[]>;
}
