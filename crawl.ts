import type { Host } from "./types.ts";

const pdsListResponse = await fetch(
  `${Deno.env.get("RELAY_HOST")}/admin/pds/list`,
  {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${
        btoa("admin:" + Deno.env.get("RELAY_ADMIN_PASSWORD"))
      }`,
    },
  },
);

if (!pdsListResponse.ok) {
  throw new Error(
    `there was an error fetching the pds list: ${pdsListResponse.status}`,
  );
}

const hosts = await pdsListResponse.json() as Host[];

const disconnectedHosts = hosts.filter((host) =>
  host.HasActiveConnection === false
);

let successfulConnections = 0;
let unsuccessfulConnections = 0;

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
    unsuccessfulConnections += 1;
    continue;
  }

  console.info(`[INFO] crawled ${host.Host} at ${new Date().toISOString()}`);
  successfulConnections += 1;
}

// summary of this run sent to discord webhook

const nextScheduledRun = Temporal.PlainDateTime.from(
  Temporal.Now.plainDateTimeISO("America/New_York"),
)
  .add({ hours: 1 }).toLocaleString();
const DISCORD_WEBHOOK_TOKEN = Deno.env.get("DISCORD_WEBHOOK_TOKEN");
const response = await fetch(
  `https://discord.com/api/webhooks/1479298793735196716/${DISCORD_WEBHOOK_TOKEN}`,
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      embeds: [
        {
          "title": "Relay Re-crawl",
          "description": "Summary of recrawl github action",
          timestamp: new Date().toISOString(),
          "fields": [
            {
              "name": "added",
              "value": `${successfulConnections} PDSes successfully re-crawled`,
            },
            {
              "name": "failures",
              "value": `${unsuccessfulConnections} PDSes failed to re-crawl`,
            },
            {
              "name": "Next scheduled run",
              "value": nextScheduledRun,
            },
          ],
        },
      ],
    }),
  },
);
if (!response.ok) {
  const data = await response.json();
  console.log({ data });
  throw new Error(`failed to send message to webhook: ${response.status}`);
}
