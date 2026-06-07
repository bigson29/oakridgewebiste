# API Integration Guide

This guide shows how to connect the website to your FiveM server and Discord for live data feeds.

---

## FiveM Server API

The website can fetch live server stats (player count, uptime, status) directly from your FiveM server. This works through the browser, so your server needs to be accessible.

### Option 1: CFX Server ID (Recommended)

Every FiveM server hosted through cfx.re has a server ID. It's the part after `cfx.re/join/` in your server's join link.

**Where to find it:**
1. Go to https://servers.fivem.net/
2. Search for your server
3. Copy the ID from the URL (e.g., `https://servers.fivem.net/servers/detail/abcd1234` → ID is `abcd1234`)

**Configure in `js/script.js`:**

```javascript
var CONFIG = {
    fivemServerId: 'abcd1234',   // ← Your server ID here
    // ...
};
```

The site will call `https://servers-frontend.fivem.net/api/servers/single/abcd1234` to get live data.

### Option 2: Direct Server IP

If your server is self-hosted or has port 30120 publicly accessible:

```javascript
var CONFIG = {
    fivemServerIp: '123.456.78.90:30120',   // ← Your server IP:port
    // ...
};
```

The site will call `http://your-ip:30120/info.json` directly.

### Option 3: Fallback (No API)

If neither option is configured, the website will display simulated stats:
- Random player count (between 15 and 95)
- Auto-calculated restart timer based on schedule
- Server status shown as "Online"

### API Data Displayed

| Stat | Source | Display |
|------|--------|---------|
| Players Online | `Data.clients` / `Data.svMaxclients` | `32/128` |
| Next Restart | Calculated from config times | `6h 30m` |
| Uptime | `Data.uptime` | `12h` or `2d 5h` |
| Server Status | Server reachability | `Online` / `Offline` |
| Tray Indicator | Server reachability | ● Green / ● Red |

### Restart Schedule

The restart timer calculates time until the next scheduled restart:

```json
// config.json
{
    "restartTimes": [4, 16]   // 4:00 AM and 4:00 PM CST
}
```

The timer updates every 60 seconds automatically.

---

## Discord Webhook

A webhook posts new applications to a Discord channel for staff visibility.

### Setup

1. **Create a Webhook** in your Discord server:
   - Server Settings → Integrations → Webhooks
   - Name it (e.g., "Oakridge Applications")
   - Choose the channel for alerts
   - Copy the Webhook URL

2. **Add to `js/script.js`**:

```javascript
var CONFIG = {
    // ...
    discordWebhookUrl: 'https://discord.com/api/webhooks/123456789/abc-def-ghi',
    // ...
};
```

### What the webhook sends

**New Application** — posted when a player submits the form:
```json
{
    "title": "New Application",
    "color": 0x000080,
    "fields": [
        { "name": "Discord ID", "value": "123456789012345678" },
        { "name": "Name", "value": "John_Doe" },
        { "name": "Age", "value": "22" },
        { "name": "Faction", "value": "Law Enforcement" }
    ]
}
```

### Webhook Limitations

The webhook only sends one-way notifications (website → Discord). For two-way communication (approve/deny from Discord), use the **Discord Bot** instead (see `discord-bot/README.md` or `SETUP.md`).

---

## Discord Bot API

The Discord bot (`discord-bot/bot.js`) uses the Discord.js library to provide:

- **DM Notifications** — sends embed DMs to applicants on approval/denial
- **Role Assignment** — automatically assigns whitelist role on approval
- **Member Lookup** — check if applicants are in your Discord server
- **Staff Commands** — `!whitelist approve`, `!whitelist deny`, `!check`, `!lookup`

### Bot Configuration

```javascript
const CONFIG = {
    token: 'YOUR_BOT_TOKEN',         // From Discord Developer Portal
    guildId: 'YOUR_GUILD_ID',        // Right-click server → Copy ID
    whitelistRoleId: '',             // Role to assign (optional)
    logChannelId: '',                // Channel for staff logs (optional)
    websiteUrl: 'https://yoursite.com'
};
```

### API Flow

```
User submits application → Webhook posts to #applications channel
                                ↓
Staff reviews in Dashboard      ↓
  or approves via !whitelist    ↓
                                ↓
Bot DMs user with approval/denial message
Bot assigns whitelist role (if configured)
Bot logs action to staff channel (if configured)
```

---

## No Backend Required

The entire website runs client-side. The "database" is browser localStorage. This means:

**Pros:**
- No server setup needed
- Free to host on GitHub Pages / Netlify
- Fast page loads

**Cons:**
- Applications are stored per-browser (staff can only see apps submitted from their own browser)
- Data is lost if browser localStorage is cleared
- No permanent backup

**For production**, consider adding a simple backend (Firebase, Supabase, or a custom API) to store applications in a shared database. See `DEPLOYMENT.md` for more on this.
