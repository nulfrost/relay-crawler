import {
  DISCORD_WEBHOOK_TOKEN,
  RELAY_ADMIN_PASSWORD,
  RELAY_HOST,
} from "./constants.ts";
import type { DiscordWebhookMessage } from "./types.ts";

export async function getPdsList() {
  try {
    const response = await fetch(
      `${RELAY_HOST}/admin/pds/list`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${btoa("admin:" + RELAY_ADMIN_PASSWORD)}`,
        },
      },
    );

    return response;
  } catch (error) {
    throw error;
  }
}

export async function requestCrawl(host: string) {
  try {
    const response = await fetch(
      `${RELAY_HOST}/xrpc/com.atproto.sync.requestCrawl`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ hostname: host }),
      },
    );
    return response;
  } catch (error) {
    throw error;
  }
}

export async function sendWebhookMessage(message: DiscordWebhookMessage) {
  try {
    const response = await fetch(
      `https://discord.com/api/webhooks/1479298793735196716/${DISCORD_WEBHOOK_TOKEN}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          embeds: message.embeds,
        }),
      },
    );
    return response;
  } catch (error) {
    throw error;
  }
}
