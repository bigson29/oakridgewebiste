# Oakridge Chicago RP - Website

A Windows 97-themed FiveM server website inspired by ls85rp.com. Features a retro desktop UI with page-switching navigation, live FiveM API integration, whitelist application system, staff dashboard, image gallery, and Discord bot integration.

## Features

🪟 **Windows 97 Desktop Theme**
- Classic teal desktop with desktop icons
- Start Menu with program-style navigation
- Win95-styled windows, buttons, title bars
- Chunky 3D borders (outset/inset styling)
- MS Sans Serif system font

📊 **Live FiveM API Integration**
- Real-time player count (via CFX API or direct server)
- Restart timer (auto-calculated)
- Server uptime tracking
- Online/Offline status indicator in taskbar

📋 **Whitelist Application System**
- Full application form with validation
- Discord ID-based status checking
- LocalStorage database (no backend required)
- Discord webhook notifications on new apps

🔒 **Staff Dashboard**
- Multi-account login system
- Overview stats (pending/approved/denied)
- Approve/deny applications with reason
- View full application details

🖼️ **Image Gallery**
- Grid layout with placeholder slots
- Click-to-open lightbox viewer
- Easy to add your own screenshots

🤖 **Discord Bot** (`discord-bot/`)
- DM users on approval/denial
- Whitelist role assignment
- Discord member lookup commands

## Project Structure

```
main-website/
├── index.html              # Main HTML (all pages)
├── css/
│   └── style.css           # Windows 97 stylesheet
├── js/
│   └── script.js           # All JavaScript functionality
├── assets/
│   ├── hero-bg.png         # Hero background image
│   └── gallery/            # Add your screenshots here
├── config.json             # Server configuration
├── API_INTEGRATION.md      # API setup guide
├── ASSETS.md               # Asset guide
├── DEPLOYMENT.md           # Deployment guide
├── QUICKSTART.md           # Quick start guide
├── README.md               # This file
├── SETUP.md                # Full setup guide
└── .gitignore

discord-bot/
├── bot.js                  # Discord bot (Node.js)
└── package.json            # Bot dependencies
```

## Quick Start

1. Open `main-website/index.html` in any browser
2. Click desktop icons or Start Menu to navigate pages
3. Staff login: `admin` / `admin123`

## Next Steps

See `SETUP.md` for full customization guide including:
- Adding your FiveM server for live stats
- Setting up the Discord webhook
- Adding gallery images
- Configuring staff accounts
- Deploying the Discord bot

---

*Not affiliated with Rockstar Games or FiveM.*
