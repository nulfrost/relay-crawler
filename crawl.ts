import type { Host } from "./types.ts";

const response = await fetch(`${Deno.env.get("RELAY_HOST")}/admin/pds/list`, {
  headers: {
    "Content-Type": "application/json",
    Authorization: `Basic ${
      btoa("admin:" + Deno.env.get("RELAY_ADMIN_PASSWORD"))
    }`,
  },
});

if (!response.ok) {
  throw new Error(
    `there was an error fetching the pds list: ${response.status}`,
  );
}

const hosts = await response.json() as Host[];

const disconnectedHosts = hosts.filter((host) =>
  host.HasActiveConnection === false
);

for (const host of disconnectedHosts) {
  const response = await fetch(
    `${Deno.env.get("RELAY_HOST")}/xrpc/com.atproto.sync.requestCrawl`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ hostname: host.Host }),
    },
  );

  if (!response.ok) {
    const data = await response.json();
    console.info(
      `[ERROR] there was an error crawling ${host.Host} - ${
        (data as Error).message
      }`,
    );
    continue;
  }

  console.info(`[INFO] crawled ${host.Host} at ${new Date().toISOString()}`);
}
