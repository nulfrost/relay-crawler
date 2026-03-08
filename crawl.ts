import { getPdsList, requestCrawl, sendWebhookMessage } from "./helpers.ts";
import type { Host } from "./types.ts";
import { getDateTimeInFutureHours } from "./future.ts";

const pdsListResponse = await getPdsList();

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
  const response = await requestCrawl(host.Host);

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

const nextScheduledRun = getDateTimeInFutureHours(1);
const response = await sendWebhookMessage({
  embeds: {
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
});

if (!response.ok) {
  const data = await response.json();
  console.log({ data });
  throw new Error(`failed to send message to webhook: ${response.status}`);
}
