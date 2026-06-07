# Setup Instructions

## Table of Contents
1. [Initial Setup](#1-initial-setup)
2. [Connecting FiveM Server API](#2-connecting-fivem-server-api)
3. [Setting Up Discord Webhook](#3-setting-up-discord-webhook)
4. [Adding Gallery Images](#4-adding-gallery-images)
5. [Customizing Staff Accounts](#5-customizing-staff-accounts)
6. [Discord Bot Setup](#6-discord-bot-setup)
7. [Customizing Config](#7-customizing-config)
8. [Deployment](#8-deployment)

---

## 1. Initial Setup

### View the site locally
Just open the file in your browser:

```bash
# Windows
start main-website/index.html

# Or just double-click the file in File Explorer
```

The page will load with the Windows 97 desktop. The Server Info page opens automatically. Click desktop icons or Start Menu to navigate.

**Default staff accounts:**
| Username | Password | Role |
|----------|----------|------|
| admin    | admin123 | Administrator |
| staff    | staff123 | Moderator |
| owner    | owner123 | Owner |

> ⚠️ **Change these passwords before going live!**

---

## 2. Connecting FiveM Server API

The site can show live player counts and server status from your FiveM server.

### Option A: Via CFX Server ID (Recommended)

1. Find your server's join code (the part after `cfx.re/join/` - e.g., `abcd1234`)
2. Open `js/script.js`
3. Find the `CONFIG` object at the top (around line 30)
4. Set `fivemServerId` to your server ID:

```javascript
var CONFIG = {
    fivemServerId: 'your-server-id-here',   // e.g. 'abcd1234'
    // ...
};
```

### Option B: Via Server IP (Direct Connection)

If your server has port 30120 exposed:

```javascript
var CONFIG = {
    fivemServerIp: 'your.server.ip:30120',  // e.g. '198.51.100.42:30120'
    // ...
};
```

### Option C: No Server (Fallback)

If neither is set, the site will display simulated stats (random player count, auto-calculated restarts).

### Testing

1. Open the site in your browser
2. Check the stats section on the Home page
3. If connected, you'll see live player count like `32/128`
4. The taskbar will show a green ● Online indicator

### Restart Times

Default restart schedule is **4:00 AM** and **4:00 PM** (CST). To change this, edit the `restartTimes` in `config.json`:

```json
{
    "restartTimes": [4, 16]
}
```

Format: 24-hour hour values (e.g., `[6, 18]` for 6 AM and 6 PM).

---

## 3. Setting Up Discord Webhook

Get notified on Discord when someone submits an application.

### Get a Webhook URL

1. Open your Discord server settings
2. Go to **Integrations** → **Webhooks**
3. Click **Create Webhook**
4. Name it (e.g., "Applications")
5. Select the channel for notifications
6. Click **Copy Webhook URL**

### Add to the site

Open `js/script.js` and find the `CONFIG` object:

```javascript
var CONFIG = {
    // ...
    discordWebhookUrl: 'https://discord.com/api/webhooks/your-webhook-url-here',
    // ...
};
```

Paste your webhook URL between the quotes.

### What gets posted

- **New application** → Embed with Discord ID, in-game name, age, faction
- (The webhook system is ready for approve/deny notifications too - see the Discord Bot for full DM functionality)

---

## 4. Adding Gallery Images

### Step 1: Prepare your screenshots
Take some in-game screenshots (1920x1080 or similar). Compress them with TinyPNG for faster loading.

### Step 2: Add files to gallery folder
Save your images to `main-website/assets/gallery/` with sequential names:

```
assets/gallery/
├── gallery-1.jpg    # City skyline
├── gallery-2.jpg    # Police action
├── gallery-3.jpg    # Car meet
└── ...
```

Supported formats: `.jpg`, `.png`, `.gif`, `.webp`

### Step 3: Update the config

Open `js/script.js` and edit the `galleryImages` array:

```javascript
galleryImages: [
    { file: 'assets/gallery/gallery-1.jpg', caption: 'Chicago Skyline' },
    { file: 'assets/gallery/gallery-2.jpg', caption: 'Police Operations' },
    { file: 'assets/gallery/gallery-3.jpg', caption: 'Car Meets' },
    { file: 'assets/gallery/gallery-4.jpg', caption: 'Community Events' },
    { file: 'assets/gallery/gallery-5.jpg', caption: 'Air Operations' },
    { file: 'assets/gallery/gallery-6.jpg', caption: 'City Life' }
]
```

### Step 4: Refresh the page
Open the Gallery page - your images will appear. Click any image to open the lightbox viewer.

---

## 5. Customizing Staff Accounts

Staff accounts are stored in localStorage. The defaults are set in `js/script.js` in the `initStaff()` function:

```javascript
localStorage.setItem(STAFF_KEY, JSON.stringify({
    'admin': { password: 'admin123', name: 'Admin', role: 'Administrator' },
    'staff': { password: 'staff123', name: 'Staff', role: 'Moderator' },
    'owner': { password: 'owner123', name: 'Owner', role: 'Owner' }
}));
```

### To change passwords/accounts:

1. Edit the values in `initStaff()` function in `js/script.js`
2. Save and refresh
3. The new accounts will apply on first login after clearing localStorage
4. To reset: clear your browser's localStorage for this site

### Dashboard features:
- **Overview** - Stats on pending/approved/denied applications
- **Pending** - Review and approve/deny applications
- **Approved** - View approved applications
- **Denied** - View denied applications with reasons

---

## 6. Discord Bot Setup

The Discord bot (`discord-bot/`) handles DM notifications, whitelist role assignment, and member verification.

### Requirements
- Node.js 16.9.0 or higher
- A Discord Application with Bot token

### Step 1: Create a Discord Bot

1. Go to https://discord.com/developers/applications
2. Click **New Application** → name it "Oakridge RP Bot"
3. Go to **Bot** tab → **Add Bot**
4. Under **Privileged Gateway Intents**, enable:
   - ✅ Server Members Intent
   - ✅ Message Content Intent
5. Copy the **Token**

### Step 2: Invite the Bot to Your Server

1. Go to **OAuth2** → **URL Generator**
2. Check `bot` and `applications.commands`
3. Bot permissions:
   - Send Messages
   - Read Message History
   - Direct Messages
   - Manage Roles (for whitelist role assignment)
4. Use the generated URL to invite the bot

### Step 3: Configure the Bot

Open `discord-bot/bot.js` and edit the CONFIG section:

```javascript
const CONFIG = {
    token: 'YOUR_BOT_TOKEN_HERE',
    guildId: 'YOUR_DISCORD_SERVER_ID',
    whitelistRoleId: '',           // Role ID to assign on approval (optional)
    logChannelId: '',              // Channel ID for staff logs (optional)
    websiteUrl: 'https://your-site.com',
    checkInterval: 60              // DM check interval (seconds)
};
```

### Step 4: Run the Bot

```bash
cd discord-bot
npm install
npm start
```

### Bot Commands

| Command | Permission | Description |
|---------|-----------|-------------|
| `!ping` | Anyone | Check bot is alive |
| `!check <discordId>` | Anyone | Check if a user is in the Discord server |
| `!lookup <discordId>` | Anyone | Get full user info (join date, roles, etc.) |
| `!whitelist <id> approve [by]` | Admin | Approve user, assign role, send DM |
| `!whitelist <id> deny <reason>` | Admin | Deny user, send DM with reason |

### Bot Features
- Sends embed DMs on approval/denial
- Auto-assigns whitelist role on approval
- Logs actions to staff channel
- Periodic checker for pending notifications

---

## 7. Customizing Config

The `config.json` file at `main-website/config.json` contains all server settings. This file is for reference - the actual runtime config is read from `js/script.js`.

Key settings you can customize:

```json
{
    "serverName": "Oakridge Chicago RP",
    "serverLinks": {
        "connect": "https://cfx.re/join/your-server-id",
        "discord": "https://discord.gg/your-invite"
    },
    "fivem": {
        "serverId": "",
        "serverIp": "localhost:30120"
    },
    "discord": {
        "webhookUrl": "",
        "guildId": ""
    },
    "restartTimes": [4, 16]
}
```

---

## 8. Deployment

### Option A: Static Hosting (GitHub Pages, Netlify, Vercel)

1. Push the `main-website/` folder to a Git repository
2. Connect to your hosting provider
3. Set the publish directory to `main-website/`

**Note:** The application database uses localStorage, which is per-browser. Staff will only see applications submitted from their own browser. For shared staff access, see the Discord Bot for notification workflow.

### Option B: Traditional Web Hosting

Upload the `main-website/` folder contents to your web server's public HTML directory via FTP.

### Option C: Custom Domain

1. Point your domain to your hosting provider
2. Update the `websiteUrl` in any config files
3. Update server links in `config.json`

---

## Troubleshooting

**Page shows blank white screen?**
- Check browser console (F12) for JavaScript errors
- Make sure file paths are correct (assets/, css/, js/)
- Try opening `index.html` directly from File Explorer

**API stats show "Offline"?**
- Your FiveM server may need port 30120 open
- Some hosting blocks the CFX API - try the direct IP method
- The fallback will automatically show simulated stats

**Staff login not working?**
- Clear browser localStorage and try again
- Default accounts: admin/admin123

**Gallery images not showing?**
- Check file paths in `galleryImages` array
- Verify images exist in `assets/gallery/`
- Check file names match exactly

**Discord bot won't connect?**
- Verify your bot token is correct
- Ensure bot has been invited to your server
- Check that all required intents are enabled
