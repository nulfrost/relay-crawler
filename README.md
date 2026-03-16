# Relay Crawler (meant for github actions)

basically what this does is:
- re-connects to disconnected PDSes (or tries to) every hour
- queries the upstream relay and compares the hosts it knows about vs the hosts your relay knows about. anything new will be added to your relay

the idea was taken from here: https://sri.leaflet.pub/3mddrqk5ays27/l-quote/12_0-15_105#12_0

## I have a relay and want to run this myself

cool! here's what you'll need to do:

1. click the "use this template" button and create a new repository
2. set up your repository secrets with these environment variables

```bash
# Required, used to get a list of disconnected PDS to try reconnecting to them
RELAY_ADMIN_PASSWORD=

# Your relay URL
RELAY_HOST=

# Upstream relay URL to pull and compare to. Defaults to https://relay1.us-west.bsky.network/
UPSTREAM_RELAY_HOST=

# Optional: if you want to have reports sent to a discord channel after every cron execution
DISCORD_WEBHOOK_TOKEN=
```

that should be it, in the next hour or so is when the first crawl should run. If you've set up a discord webhook you should see a report after the run as well. if there are any issues feel free to open an issue in the original repo: https://github.com/nulfrost/relay-crawler
