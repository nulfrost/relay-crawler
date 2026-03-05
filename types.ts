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
