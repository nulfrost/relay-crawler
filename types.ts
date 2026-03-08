export interface Host {
  ID: number;
  CreatedAt: string;
  Host: string;
  SSL: boolean;
  Cursor: number;
  Registered: boolean;
  Blocked: boolean;
  CrawlRateLimit: number;
  RepoCount: number;
  RepoLimit: number;
  HasActiveConnection: boolean;
  EventsSeenSinceStartup: number;
  PerSecondEventRate: { Max: number; Window: number };
  PerHourEventRate: { Max: number; Window: number };
  PerDayEventRate: { Max: number; Window: number };
  UserCount: number;
}

export interface ListHostsResponse {
  cursor?: string;
  hosts: {
    accountCount: number;
    hostname: string;
    seq: number;
    status: "active" | "offline";
  }[];
}

export interface DiscordWebhookMessage {
  embeds: DiscordWebhookEmbeds[]
}

interface DiscordWebhookEmbeds {
  title: string;
  description?: string;
  timestamp?: string;
  fields: DiscordWebhookEmbedFields[];
}

interface DiscordWebhookEmbedFields {
  name: string;
  value?: string;
}
