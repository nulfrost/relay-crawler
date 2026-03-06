interface Host {
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

// const pdsResponse = await fetch(`${Deno.env.get("RELAY_HOST")}/admin/pds/list`, {
//   headers: {
//     "Content-Type": "application/json",
//     Authorization: `Basic ${
//       btoa("admin:" + Deno.env.get("RELAY_ADMIN_PASSWORD"))
//     }`,
//   },
// });

// if (!pdsResponse.ok) {
//   throw new Error(
//     `there was an error fetching the pds list: ${pdsResponse.status}`,
//   );
// }

// const hosts = await pdsResponse.json() as Host[];

// const disconnectedHosts = hosts.filter((host) =>
//   host.HasActiveConnection === false
// );

// let successfulConnections = 0;
// let unsuccessfulConnections = 0;


// for (const host of disconnectedHosts) {
//   const response = await fetch(
//     `${Deno.env.get("RELAY_HOST")}/xrpc/com.atproto.sync.requestCrawl`,
//     {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ hostname: host.Host }),
//     },
//   );

//   if (!response.ok) {
//     const data = await response.json();
//     console.info(
//       `[ERROR] there was an error crawling ${host.Host} - ${
//         (data as Error).message
//       }`,
//     );
//     unsuccessfulConnections += 1;
//     continue;
//   }

//   console.info(`[INFO] crawled ${host.Host} at ${new Date().toISOString()}`);
//   successfulConnections += 1;
// }

// const hosts = await response.json() as Host[];

// const currentHosts = new Set(hosts.map((host) => host.Host));

// const upstream = await fetch(
//   "https://relay1.us-west.bsky.network/xrpc/com.atproto.sync.listHosts?limit=1000",
// );

// if (!upstream.ok) {
//   throw new Error(
//     "there was an error fetching data from upstream relay" + upstream.status,
//   );
// }

// const totalUpstreamHosts = [];

// const { cursor, hosts: upstreamHosts } = await upstream.json() as {
//   cursor: string;
//   hosts: {
//     accountCount: number;
//     hostname: string;
//     seq: number;
//     status: "active" | "offline";
//   }[];
// };
// totalUpstreamHosts.push(...upstreamHosts);

// let curr = cursor;

// do {
//   const upstream = await fetch(
//     `https://relay1.us-west.bsky.network/xrpc/com.atproto.sync.listHosts?limit=1000&cursor=${curr}`,
//   );
//   const { cursor, hosts } = await upstream.json() as {
//     cursor: string;
//     hosts: {
//       accountCount: number;
//       hostname: string;
//       seq: number;
//       status: "active" | "offline";
//     }[];
//   };
//   totalUpstreamHosts.push(...hosts);
//   curr = cursor;
// } while (curr);

// const upstreamRelayHosts = new Set(
//   totalUpstreamHosts.filter((host) => host.status === 'active').map(host => host.hostname),
// );

// const newHosts = upstreamRelayHosts.difference(currentHosts);

// for (const host of Array.from(newHosts)) {
//   const response = await fetch(`${Deno.env.get("RELAY_HOST")}/admin/pds/requestCrawl`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Basic ${
//         btoa("admin:" + Deno.env.get("RELAY_ADMIN_PASSWORD"))
//       }`,
//     },
//     body: JSON.stringify({ hostname: host }),
//   });

//   if (!response.ok) {
//     const data = await response.json();
//     console.info(`[ERROR]: could not add new PDS to relay - ${host} - reason: ${(data as Error).message}`)
//     continue
//   }

//   console.info(`[INFO]: added ${host} to relay`)
// }

const DISCORD_WEBHOOK_TOKEN = Deno.env.get("DISCORD_WEBHOOK_TOKEN");
const response = await fetch(
  `https://discord.com/api/webhooks/1479298793735196716/${DISCORD_WEBHOOK_TOKEN}`,
  {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      embeds: [
        {
          "title": "Relay Re-crawl",
          "description": "Summary of recrawl github action",
          "timestamp": new Date().toISOString(),
          "fields": [
            {
              "name": "added",
              "value": ` PDSes successfully re-crawled`,
            },
            {
              "name": "failures",
              "value": ` PDSes failed to re-crawl`,
            },
          ],
        },
      ],
    }),
  },
);
if (!response.ok) {
  const data = await response.json()
  console.log({data})
  throw new Error(`failed to send message to webhook: ${response.status}`);
}
