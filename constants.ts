export const RELAY_HOST = Deno.env.get("RELAY_HOST")
export const UPSTREAM_RELAY_HOST = Deno.env.get("UPSTREAM_RELAY_HOST") ?? 'https://relay1.us-west.bsky.network'
export const RELAY_ADMIN_PASSWORD = Deno.env.get("RELAY_ADMIN_PASSWORD");
export const DISCORD_WEBHOOK_TOKEN = Deno.env.get("DISCORD_WEBHOOK_TOKEN");
