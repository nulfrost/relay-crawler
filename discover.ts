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

const currentHosts = new Set(hosts.map((host) => host.Host));

const upstream = await fetch(
  "https://relay1.us-west.bsky.network/xrpc/com.atproto.sync.listHosts?limit=1000",
);

if (!upstream.ok) {
  throw new Error(
    "there was an error fetching data from upstream relay" + upstream.status,
  );
}

const totalUpstreamHosts = [];

const { cursor, hosts: upstreamHosts } = await upstream.json() as {
  cursor: string;
  hosts: {
    accountCount: number;
    hostname: string;
    seq: number;
    status: "active" | "offline";
  }[];
};
totalUpstreamHosts.push(...upstreamHosts);

let curr = cursor;

do {
  const upstream = await fetch(
    `https://relay1.us-west.bsky.network/xrpc/com.atproto.sync.listHosts?limit=1000&cursor=${curr}`,
  );
  const { cursor, hosts } = await upstream.json() as {
    cursor: string;
    hosts: {
      accountCount: number;
      hostname: string;
      seq: number;
      status: "active" | "offline";
    }[];
  };
  totalUpstreamHosts.push(...hosts);
  curr = cursor;
} while (curr);

const upstreamRelayHosts = new Set(
  totalUpstreamHosts.filter((host) => host.status === "active").map((host) =>
    host.hostname
  ),
);

const newHosts = upstreamRelayHosts.difference(currentHosts);

let successfulAdditions = 0;
let unsuccessfulAdditions = 0;

for (const host of Array.from(newHosts)) {
  const response = await fetch(
    `${Deno.env.get("RELAY_HOST")}/admin/pds/requestCrawl`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${
          btoa("admin:" + Deno.env.get("RELAY_ADMIN_PASSWORD"))
        }`,
      },
      body: JSON.stringify({ hostname: host }),
    },
  );

  if (!response.ok) {
    const data = await response.json();
    console.info(
      `[ERROR]: could not add new PDS to relay - ${host} - reason: ${
        (data as Error).message
      }`,
    );
    unsuccessfulAdditions += 1
    continue;
  }

  successfulAdditions +=1
  console.info(`[INFO]: added ${host} to relay`);
}

// summary of this run sent to discord webhook
const DISCORD_WEBHOOK_TOKEN = Deno.env.get("DISCORD_WEBHOOK_TOKEN");
const webhookResponse = await fetch(
  `https://discord.com/api/webhooks/1479298793735196716/${DISCORD_WEBHOOK_TOKEN}`,
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      embeds: [
        {
          "title": "New PDS additions",
          "description": "Summary of discovery github action",
          timestamp: new Date().toISOString(),
          "fields": [
            {
              "name": "added",
              "value": `${successfulAdditions} PDSes successfully added`,
            },
            {
              "name": "failures",
              "value": `${unsuccessfulAdditions} PDSes did not get added`,
            },
          ],
        },
      ],
    }),
  },
);
if (!webhookResponse.ok) {
  const data = await response.json();
  console.log({ data });
  throw new Error(`failed to send message to webhook: ${webhookResponse.status}`);
}
