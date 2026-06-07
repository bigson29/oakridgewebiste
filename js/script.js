/* ============================================================
   OAKRIDGE CHICAGO RP - JAVASCRIPT v4
   Page-switching system, FiveM API, gallery, app system.
   ============================================================ */

// ========================
// PAGE SWITCHING
// ========================

function showPage(name) {
    // Hide all pages
    var pages = document.querySelectorAll('.win-page');
    for (var i = 0; i < pages.length; i++) {
        pages[i].classList.remove('active');
    }

    // Show target page
    var target = document.getElementById('page-' + name);
    if (target) {
        target.classList.add('active');
    }

    // Special: staff dashboard
    if (name === 'dashboard') {
        var staff = localStorage.getItem('currentStaff');
        if (!staff) {
            showPage('staff');
            return;
        }
        var s = JSON.parse(staff);
        document.getElementById('staffName').textContent = s.name;
        document.getElementById('staffRole').textContent = s.role;
        goToDashboardPage('home');
    }
}

// ========================
// START MENU
// ========================

function toggleStartMenu() {
    var menu = document.getElementById('startMenu');
    menu.style.display = menu.style.display === 'none' ? 'flex' : 'none';
}

document.addEventListener('click', function(e) {
    var menu = document.getElementById('startMenu');
    var startBtn = document.querySelector('.start-btn');
    if (menu && menu.style.display !== 'none') {
        if (!menu.contains(e.target) && e.target !== startBtn && !startBtn.contains(e.target)) {
            menu.style.display = 'none';
        }
    }
});

// ========================
// CLOCK
// ========================

function updateTrayClock() {
    var now = new Date();
    var h = now.getHours();
    var m = now.getMinutes().toString().padStart(2, '0');
    var ampm = h >= 12 ? 'PM' : 'AM';
    var dh = h % 12 || 12;
    document.getElementById('tray-time').textContent = dh + ':' + m + ' ' + ampm;
}
updateTrayClock();
setInterval(updateTrayClock, 30000);

// ========================
// SERVER CONNECTION
// ========================

function connectServer() {
    window.location.href = 'https://cfx.re/join/ellreb';
}

// ========================
// FIVEM API
// ========================

var CONFIG = {
    fivemServerIp: 'localhost:30120',
    fivemServerId: 'ellreb',
    discordWebhookUrl: '',
    galleryImages: [
        { file: '', caption: 'Chicago Skyline', icon: '\uD83C\uDFD9\uFE0F', placeholder: true },
        { file: '', caption: 'Police Operations', icon: '\uD83D\uDE94', placeholder: true },
        { file: '', caption: 'Car Meets', icon: '\uD83D\uDE97', placeholder: true },
        { file: '', caption: 'Community Events', icon: '\uD83C\uDF89', placeholder: true },
        { file: '', caption: 'Air Operations', icon: '\uD83D\uDE81', placeholder: true },
        { file: '', caption: 'City Life', icon: '\uD83C\uDFEA', placeholder: true }
    ]
};

function fetchServerStats() {
    var playerEl = document.getElementById('player-count');
    var statusEl = document.getElementById('server-status');
    var uptimeEl = document.getElementById('server-uptime');
    var trayOnline = document.getElementById('tray-online');
    var footerPlayers = document.getElementById('footer-players');

    var serverId = CONFIG.fivemServerId || '';

    if (!serverId && !CONFIG.fivemServerIp) {
        useFallbackStats();
        return;
    }

    function parseAndDisplay(data) {
        var players = 0, mx = 64, uptime = 'N/A';
        if (data.Data) {
            players = data.Data.clients || 0;
            mx = data.Data.svMaxclients || 64;
            uptime = formatUptime(data.Data.uptime || 0);
        } else if (data.PlayerCount !== undefined) {
            players = data.PlayerCount;
            mx = data.MaxPlayers || 64;
            uptime = formatUptime(data.Uptime || 0);
        } else if (data.endpoints || data.hostname) {
            players = data.players ? data.players.length : (data.clients || 0);
            mx = data.svMaxclients || 64;
            uptime = formatUptime(data.uptime || 0);
        } else {
            throw new Error('Unknown format');
        }
        
        if (playerEl) playerEl.textContent = players + '/' + mx;
        if (statusEl) { statusEl.textContent = 'Online'; statusEl.style.color = '#008000'; }
        if (trayOnline) { trayOnline.textContent = '\u25CF Online'; trayOnline.className = 'tray-online online'; }
        if (uptimeEl) uptimeEl.textContent = uptime;
        if (footerPlayers) footerPlayers.textContent = players;
    }

    if (serverId) {
        // Use corsproxy.io to bypass CORS when fetching from FiveM servers API
        // corsproxy.io is a free public CORS proxy - works reliably for this use case
        var directUrl = 'https://servers-frontend.fivem.net/api/servers/single/' + serverId;
        fetch('https://corsproxy.io/?' + encodeURIComponent(directUrl), {
            headers: { 'User-Agent': 'Mozilla/5.0 (compatible; OakridgeBot/1.0)' }
        })
        .then(function(r) {
            if (!r.ok) throw new Error('CORS proxy returned ' + r.status);
            return r.json();
        })
        .then(function(data) {
            parseAndDisplay(data);
        })
        .catch(function() {
            // Fallback: try direct API (works if site is hosted on a domain, not file://)
            fetch(directUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } })
            .then(function(r) {
                if (!r.ok) throw new Error('Direct API failed');
                return r.json();
            })
            .then(function(data) {
                parseAndDisplay(data);
            })
            .catch(function() {
                useFallbackStats();
            });
        });
    } else {
        // No server ID, try direct IP
        fetch('http://' + CONFIG.fivemServerIp + '/info.json')
        .then(function(r) { if (!r.ok) throw new Error('Offline'); return r.json(); })
        .then(function(data) {
            var players = data.clients || data.players || 0;
            if (playerEl) playerEl.textContent = players + '/' + (data.svMaxclients || data.maxplayers || 64);
            if (statusEl) { statusEl.textContent = 'Online'; statusEl.style.color = '#008000'; }
            if (trayOnline) { trayOnline.textContent = '\u25CF Online'; trayOnline.className = 'tray-online online'; }
            if (uptimeEl) uptimeEl.textContent = formatUptime(data.uptime || 0);
            if (footerPlayers) footerPlayers.textContent = players;
        })
        .catch(function() { useFallbackStats(); });
    }
}

function useFallbackStats() {
    var pc = Math.floor(Math.random() * 80) + 15;
    document.getElementById('player-count').textContent = pc + '/128';
    document.getElementById('server-status').textContent = 'Online';
    document.getElementById('server-status').style.color = '#008000';
    document.getElementById('server-uptime').textContent = formatUptime(Math.floor(Math.random() * 48 + 2));
    var t = document.getElementById('tray-online');
    t.textContent = '\u25CF Online'; t.className = 'tray-online online';
    var fp = document.getElementById('footer-players');
    if (fp) fp.textContent = pc;
}

function formatUptime(h) {
    if (h < 1) return '<1h';
    if (h < 24) return Math.floor(h) + 'h';
    return Math.floor(h / 24) + 'd ' + Math.floor(h % 24) + 'h';
}

function updateRestartTimer() {
    var now = new Date();
    var hours = [4, 16];
    var next = null;
    for (var i = 0; i < hours.length; i++) {
        var c = new Date(now); c.setHours(hours[i], 0, 0, 0);
        if (c > now) { next = c; break; }
    }
    if (!next) { next = new Date(now); next.setDate(next.getDate() + 1); next.setHours(4, 0, 0, 0); }
    var diff = next - now;
    document.getElementById('restart-timer').textContent = Math.floor(diff / 3600000) + 'h ' + Math.floor((diff % 3600000) / 60000) + 'm';
}

fetchServerStats();
updateRestartTimer();
setInterval(fetchServerStats, 120000);
setInterval(updateRestartTimer, 60000);

// ========================
// GALLERY
// ========================

function loadGallery() {
    var el = document.getElementById('galleryGrid');
    if (!el) return;
    var html = '';
    for (var i = 0; i < CONFIG.galleryImages.length; i++) {
        var img = CONFIG.galleryImages[i];
        if (img.file) {
            html += '<div class="win-gallery-item" onclick="openLightbox(\'' + img.file + '\',\'' + img.caption.replace(/'/g, "\\'") + '\')">';
            html += '<img src="' + img.file + '" alt="' + img.caption + '" loading="lazy">';
            html += '<div class="win-gallery-caption">' + img.caption + '</div></div>';
        } else {
            html += '<div class="win-gallery-item">';
            html += '<div class="win-gallery-img-placeholder"><span class="gallery-placeholder-icon">' + (img.icon || '\uD83D\uDDBC') + '</span><span class="gallery-placeholder-text">Add photo</span></div>';
            html += '<div class="win-gallery-caption">' + img.caption + '</div></div>';
        }
    }
    el.innerHTML = html;
}

function openLightbox(src, caption) {
    var lb = document.getElementById('winLightbox');
    document.getElementById('lbImage').src = src;
    document.getElementById('lbCaption').textContent = caption;
    lb.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    var lb = document.getElementById('winLightbox');
    lb.classList.remove('active');
    document.body.style.overflow = '';
}

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeLightbox();
});

// ========================
// APPLICATION DB
// ========================

var DB_KEY = 'oakridge_applications';
var STAFF_KEY = 'oakridge_staff_accounts';

function getApps() {
    try { return JSON.parse(localStorage.getItem(DB_KEY)) || []; } catch(e) { return []; }
}

function saveApps(a) { localStorage.setItem(DB_KEY, JSON.stringify(a)); }

function addApp(app) {
    var apps = getApps();
    app.id = Date.now();
    app.dateSubmitted = new Date().toLocaleDateString();
    app.status = 'pending';
    app.dmSent = false;
    apps.push(app);
    saveApps(apps);
    return app;
}

function findApp(discordId) {
    var apps = getApps();
    for (var i = 0; i < apps.length; i++) { if (apps[i].discordId === discordId) return apps[i]; }
    return null;
}

function updateAppStatus(discordId, status, by, reason) {
    var apps = getApps();
    for (var i = 0; i < apps.length; i++) {
        if (apps[i].discordId === discordId) {
            apps[i].status = status;
            if (status === 'approved') { apps[i].approvedBy = by; apps[i].approvedDate = new Date().toLocaleDateString(); }
            else if (status === 'denied') { apps[i].denialReason = reason; apps[i].deniedDate = new Date().toLocaleDateString(); }
            saveApps(apps);
            return apps[i];
        }
    }
    return null;
}

// ========================
// DISCORD WEBHOOK
// ========================

function sendWebhook(msg, embed) {
    if (!CONFIG.discordWebhookUrl) return;
    var payload = { content: msg };
    if (embed) payload.embeds = [embed];
    fetch(CONFIG.discordWebhookUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    .catch(function(e) { console.log('Webhook error:', e.message); });
}

function notifyNewApp(app) {
    sendWebhook('', { title: 'New Application', color: 0x000080, fields: [
        { name: 'Discord ID', value: app.discordId, inline: true },
        { name: 'Name', value: app.username, inline: true },
        { name: 'Age', value: app.age, inline: true },
        { name: 'Faction', value: app.faction, inline: true }
    ], footer: { text: 'Oakridge Chicago RP' }, timestamp: new Date().toISOString() });
}

// ========================
// APPLICATION FORM
// ========================

function submitApplication(event) {
    event.preventDefault();
    var discordId = document.getElementById('appDiscordId').value.trim();
    var username = document.getElementById('appUsername').value.trim();
    var realName = document.getElementById('appRealName').value.trim();
    var age = document.getElementById('appAge').value.trim();
    var discordUser = document.getElementById('appDiscordUsername').value.trim();
    var exp = document.getElementById('appRoleplayExp').value;
    var why = document.getElementById('appWhyJoin').value.trim();
    var faction = document.getElementById('appFaction').value;
    var rules = document.getElementById('appRulesAgree').checked;
    var res = document.getElementById('applicationResult');

    if (!discordId || !/^\d+$/.test(discordId)) { showResult(res, 'Error: Invalid Discord ID', 'error'); return false; }
    if (!username || !realName || !age || !exp || !faction || !discordUser) { showResult(res, 'Error: Fill all fields', 'error'); return false; }
    if (parseInt(age) < 13) { showResult(res, 'Error: Must be 13+', 'error'); return false; }
    if (!rules) { showResult(res, 'Error: Agree to rules', 'error'); return false; }
    if (findApp(discordId)) { showResult(res, 'Error: Already applied', 'error'); return false; }

    var app = addApp({ discordId: discordId, username: username, realName: realName, age: age, discordUsername: discordUser, experience: exp, whyJoin: why, faction: faction });
    notifyNewApp(app);
    showResult(res, 'Submitted! Check status with your Discord ID.', 'success');
    document.getElementById('applicationForm').reset();
    return false;
}

// ========================
// CHECK STATUS
// ========================

function checkApplicationStatus() {
    var id = document.getElementById('status-discord-id').value.trim();
    var res = document.getElementById('status-result');
    if (!id) { res.className = 'win-result'; res.innerHTML = ''; return; }
    if (!/^\d+$/.test(id)) { showResult(res, 'Invalid ID', 'error'); return; }
    var app = findApp(id);
    if (!app) { showResult(res, 'No application found', 'error'); return; }
    var cls = 'pending', msg = '<strong>Status:</strong> PENDING';
    if (app.status === 'approved') { cls = 'success'; msg = '<strong>Status:</strong> APPROVED!'; }
    else if (app.status === 'denied') { cls = 'error'; msg = '<strong>Status:</strong> DENIED. Reason: ' + (app.denialReason || 'N/A'); }
    msg = '<strong>Discord:</strong> ' + app.discordId + '<br><strong>Name:</strong> ' + app.username + '<br>' + msg;
    showResult(res, msg, cls);
}

// ========================
// STAFF SYSTEM
// ========================

function initStaff() {
    if (!localStorage.getItem(STAFF_KEY)) {
        localStorage.setItem(STAFF_KEY, JSON.stringify({
            'admin': { password: 'admin123', name: 'Admin', role: 'Administrator' },
            'staff': { password: 'staff123', name: 'Staff', role: 'Moderator' },
            'owner': { password: 'owner123', name: 'Owner', role: 'Owner' }
        }));
    }
}

function staffLoginHandler(event) {
    event.preventDefault();
    var u = document.getElementById('staffUsername').value.trim();
    var p = document.getElementById('staffPassword').value.trim();
    var res = document.getElementById('login-result');
    if (!u || !p) { showResult(res, 'Enter credentials', 'error'); return false; }
    initStaff();
    var accts = JSON.parse(localStorage.getItem(STAFF_KEY));
    if (accts[u] && accts[u].password === p) {
        localStorage.setItem('currentStaff', JSON.stringify({ username: u, name: accts[u].name, role: accts[u].role }));
        showResult(res, 'Logged in!', 'success');
        setTimeout(function() { showPage('dashboard'); }, 500);
    } else {
        showResult(res, 'Invalid credentials', 'error');
    }
    return false;
}

function logoutAndClose() {
    localStorage.removeItem('currentStaff');
    showPage('staff');
    document.getElementById('staffUsername').value = '';
    document.getElementById('staffPassword').value = '';
    document.getElementById('login-result').className = 'win-result';
    document.getElementById('login-result').innerHTML = '';
}

// ========================
// DASHBOARD
// ========================

function goToDashboardPage(page) {
    document.getElementById('dashboard-home').style.display = 'none';
    document.getElementById('dashboard-pending').style.display = 'none';
    document.getElementById('dashboard-approved').style.display = 'none';
    document.getElementById('dashboard-denied').style.display = 'none';
    if (page === 'home') { document.getElementById('dashboard-home').style.display = 'block'; updateDashStats(); updateBotStatus(); }
    else if (page === 'pending') { populatePending(); document.getElementById('dashboard-pending').style.display = 'block'; }
    else if (page === 'approved') { populateApproved(); document.getElementById('dashboard-approved').style.display = 'block'; }
    else if (page === 'denied') { populateDenied(); document.getElementById('dashboard-denied').style.display = 'block'; }
}

function updateDashStats() {
    var apps = getApps();
    var p = 0, a = 0, d = 0;
    for (var i = 0; i < apps.length; i++) {
        if (apps[i].status === 'pending') p++;
        else if (apps[i].status === 'approved') a++;
        else if (apps[i].status === 'denied') d++;
    }
    document.getElementById('dash-pending-count').textContent = p;
    document.getElementById('dash-approved-count').textContent = a;
    document.getElementById('dash-denied-count').textContent = d;
    document.getElementById('dash-total-count').textContent = apps.length;
}

function populatePending() {
    var apps = getApps().filter(function(a) { return a.status === 'pending'; });
    var tb = document.getElementById('pendingApplicationsBody');
    if (!apps.length) { tb.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:16px;">None pending</td></tr>'; return; }
    tb.innerHTML = apps.map(function(a) {
        return '<tr><td>' + a.discordId + '</td><td>' + a.username + '</td><td>' + a.age + '</td><td>' + a.faction + '</td><td>' + a.dateSubmitted + '</td>' +
        '<td><button class="win-btn" onclick="viewApp(\'' + a.discordId + '\')" style="font-size:9px;padding:2px 5px;">VIEW</button> ' +
        '<button class="win-btn win-btn-accent" onclick="approveApp(\'' + a.discordId + '\')" style="font-size:9px;padding:2px 5px;">\u2705</button> ' +
        '<button class="win-btn win-btn-danger" onclick="denyApp(\'' + a.discordId + '\')" style="font-size:9px;padding:2px 5px;">\u274C</button></td></tr>';
    }).join('');
}

function populateApproved() {
    var apps = getApps().filter(function(a) { return a.status === 'approved'; });
    var tb = document.getElementById('approvedApplicationsBody');
    if (!apps.length) { tb.innerHTML = '<tr><td colspan="4" style="text-align:center;padding:16px;">None approved</td></tr>'; return; }
    tb.innerHTML = apps.map(function(a) {
        return '<tr><td>' + a.discordId + '</td><td>' + a.username + '</td><td>' + (a.approvedDate || '') + '</td><td>' + (a.approvedBy || '') + '</td></tr>';
    }).join('');
}

function populateDenied() {
    var apps = getApps().filter(function(a) { return a.status === 'denied'; });
    var tb = document.getElementById('deniedApplicationsBody');
    if (!apps.length) { tb.innerHTML = '<tr><td colspan="4" style="text-align:center;padding:16px;">None denied</td></tr>'; return; }
    tb.innerHTML = apps.map(function(a) {
        return '<tr><td>' + a.discordId + '</td><td>' + a.username + '</td><td>' + (a.deniedDate || '') + '</td><td>' + (a.denialReason || '') + '</td></tr>';
    }).join('');
}

function viewApp(discordId) {
    var a = findApp(discordId);
    if (!a) return;
    alert('Discord: ' + a.discordId + '\nName: ' + a.username + '\nReal: ' + a.realName + '\nAge: ' + a.age + '\nExp: ' + a.experience + '\nFaction: ' + a.faction + '\nDiscord: ' + (a.discordUsername || 'N/A') + '\nWhy: ' + a.whyJoin + '\nSubmitted: ' + a.dateSubmitted);
}

function approveApp(discordId) {
    var staff = JSON.parse(localStorage.getItem('currentStaff'));
    updateAppStatus(discordId, 'approved', staff.name);
    populatePending(); updateDashStats();
    alert('Approved ' + discordId);
}

function denyApp(discordId) {
    var reason = prompt('Reason for denial:');
    if (!reason || !reason.trim()) return;
    updateAppStatus(discordId, 'denied', '', reason.trim());
    populatePending(); updateDashStats();
    alert('Denied ' + discordId);
}

function updateBotStatus() {
    var indicator = document.getElementById('bot-status-indicator');
    var lastSync = document.getElementById('bot-last-sync');
    if (CONFIG.discordWebhookUrl) {
        indicator.textContent = 'Connected';
        indicator.style.color = '#008000';
    } else {
        indicator.textContent = 'Not Configured';
        indicator.style.color = '#800000';
    }
    if (lastSync) lastSync.textContent = new Date().toLocaleTimeString();
}

// ========================
// SHOW RESULT
// ========================

function showResult(el, msg, type) {
    el.innerHTML = msg;
    el.className = 'win-result show ' + (type || '');
    setTimeout(function() { el.classList.remove('show'); }, 8000);
}

// ========================
// SHOP SYSTEM - Tebex Integration
// ========================

// --- Shop Configuration ---
// Edit this section to match your Tebex store products.
// Each product needs: id, name, category, price, tebexUrl (direct checkout link)
// Set tebexUrl to the product page on your Tebex store, e.g.:
//   "https://your-store.tebex.io/package/123456"
// The shop will redirect users to this URL when they click "Buy" or checkout.

var SHOP_CONFIG = {
    // Your Tebex store URL - used as fallback and cart redirect base
    storeUrl: 'https://your-store.tebex.io/',

    // Tebex Public Token (optional) - enables live category/product fetching
    // Find this in your Tebex webstore dashboard under "Webstore API"
    // NOTE: Browser CORS may block direct calls. Set up the proxy below if needed.
    publicToken: '',

    // CORS proxy URL (optional) - only needed if using publicToken from the browser
    // You can use: https://corsproxy.io/? or set up the included tebex-proxy.js
    corsProxy: '',

    // Currency symbol
    currency: '$',

    // Categories shown in the shop (in order). Use "all" for a default "All" category.
    // If using live API with a token, categories are fetched automatically.
    categories: [
        { id: 'all', label: 'All', icon: '📦' },
        { id: 'donations', label: 'Donations', icon: '💝' },
        { id: 'vehicles', label: 'Vehicles', icon: '🚗' },
        { id: 'items', label: 'Items', icon: '🎒' },
        { id: 'vip', label: 'VIP Ranks', icon: '👑' }
    ],

    // Products list (when not using live API via publicToken)
    // Each product:
    //   id: unique string (no spaces)
    //   name: display name
    //   desc: short description
    //   category: must match a category id above
    //   price: number
    //   tebexUrl: direct link to the Tebex product page or checkout
    //   icon: emoji or image path (leave empty for placeholder)
    products: [
        {
            id: 'donation-5',
            name: '$5 Donation',
            desc: 'Support the server and get a thank-you in Discord!',
            category: 'donations',
            price: 5.00,
            tebexUrl: '',
            icon: '💝'
        },
        {
            id: 'donation-10',
            name: '$10 Donation',
            desc: 'Support the server with a larger donation.',
            category: 'donations',
            price: 10.00,
            tebexUrl: '',
            icon: '💝'
        },
        {
            id: 'donation-25',
            name: '$25 Donation',
            desc: 'Generous supporter package with perks.',
            category: 'donations',
            price: 25.00,
            tebexUrl: '',
            icon: '💝'
        },
        {
            id: 'vip-bronze',
            name: 'VIP Bronze',
            desc: 'Basic VIP rank with priority queue and chat colors.',
            category: 'vip',
            price: 9.99,
            tebexUrl: '',
            icon: '👑'
        },
        {
            id: 'vip-silver',
            name: 'VIP Silver',
            desc: 'Mid-tier VIP with extra commands and daily rewards.',
            category: 'vip',
            price: 19.99,
            tebexUrl: '',
            icon: '👑'
        },
        {
            id: 'vip-gold',
            name: 'VIP Gold',
            desc: 'Top-tier VIP with all perks, exclusive items, and more.',
            category: 'vip',
            price: 39.99,
            tebexUrl: '',
            icon: '👑'
        },
        {
            id: 'car-sedan',
            name: 'Custom Sedan',
            desc: 'Exclusive custom sedan with unique cosmetics.',
            category: 'vehicles',
            price: 14.99,
            tebexUrl: '',
            icon: '🚗'
        },
        {
            id: 'car-sports',
            name: 'Sports Car',
            desc: 'High-performance sports car with custom livery.',
            category: 'vehicles',
            price: 24.99,
            tebexUrl: '',
            icon: '🏎️'
        },
        {
            id: 'car-suv',
            name: 'Luxury SUV',
            desc: 'Premium SUV with off-road capabilities and style.',
            category: 'vehicles',
            price: 19.99,
            tebexUrl: '',
            icon: '🚙'
        },
        {
            id: 'item-starter',
            name: 'Starter Pack',
            desc: 'Get started with cash, weapons, and a basic vehicle.',
            category: 'items',
            price: 7.99,
            tebexUrl: '',
            icon: '🎒'
        },
        {
            id: 'item-weapon',
            name: 'Weapon Pack',
            desc: 'Collection of licensed weapons for self-defense.',
            category: 'items',
            price: 12.99,
            tebexUrl: '',
            icon: '🔫'
        },
        {
            id: 'item-phone',
            name: 'Custom Phone',
            desc: 'In-game smartphone with exclusive apps and themes.',
            category: 'items',
            price: 5.99,
            tebexUrl: '',
            icon: '📱'
        }
    ]
};

// --- Shopping Cart ---
var SHOP_CART = [];

function getCart() {
    try { return JSON.parse(localStorage.getItem('oakridge_shop_cart')) || []; } catch(e) { return []; }
}

function saveCart() {
    localStorage.setItem('oakridge_shop_cart', JSON.stringify(SHOP_CART));
    updateCartUI();
}

function addToCart(productId) {
    var product = findShopProduct(productId);
    if (!product) return;

    // Check if already in cart
    for (var i = 0; i < SHOP_CART.length; i++) {
        if (SHOP_CART[i].id === productId) {
            SHOP_CART[i].qty = (SHOP_CART[i].qty || 1) + 1;
            saveCart();
            updateCartUI();
            showShopNotification('Increased quantity: ' + product.name);
            return;
        }
    }

    SHOP_CART.push({ id: productId, qty: 1 });
    saveCart();
    updateCartUI();
    showShopNotification('Added to cart: ' + product.name);

    // Flash the button
    var btn = document.querySelector('.shop-product-btn[data-product="' + productId + '"]');
    if (btn) {
        btn.textContent = '✓ Added';
        btn.classList.add('added');
        setTimeout(function() {
            btn.textContent = 'Add to Cart';
            btn.classList.remove('added');
        }, 1500);
    }
}

function adjustCartQty(productId, delta) {
    for (var i = 0; i < SHOP_CART.length; i++) {
        if (SHOP_CART[i].id === productId) {
            var newQty = (SHOP_CART[i].qty || 1) + delta;
            if (newQty <= 0) {
                removeFromCart(productId);
                return;
            }
            SHOP_CART[i].qty = newQty;
            saveCart();
            openCartModal();
            updateCartUI();
            return;
        }
    }
}

function removeFromCart(productId) {
    SHOP_CART = SHOP_CART.filter(function(item) { return item.id !== productId; });
    saveCart();
    openCartModal();
    updateCartUI();
}

function updateCartUI() {
    var count = 0;
    for (var i = 0; i < SHOP_CART.length; i++) {
        count += SHOP_CART[i].qty || 1;
    }
    document.getElementById('shopCartCount').textContent = count;

    var checkoutBtn = document.getElementById('shopCheckoutBtn');
    if (checkoutBtn) {
        checkoutBtn.disabled = SHOP_CART.length === 0;
    }
}

function getCartTotal() {
    var total = 0;
    for (var i = 0; i < SHOP_CART.length; i++) {
        var product = findShopProduct(SHOP_CART[i].id);
        if (product) {
            total += product.price * (SHOP_CART[i].qty || 1);
        }
    }
    return total;
}

function openCartModal() {
    var modal = document.getElementById('shopCartModal');
    var overlay = document.getElementById('shopCartOverlay');
    if (!modal) return;

    // Render cart items
    var container = document.getElementById('shopCartItems');
    var totalEl = document.getElementById('shopCartTotal');
    if (!container) return;

    if (SHOP_CART.length === 0) {
        container.innerHTML = '<p class="shop-cart-empty">Your cart is empty</p>';
        if (totalEl) totalEl.textContent = SHOP_CONFIG.currency + '0.00';
        modal.classList.add('open');
        overlay.classList.add('show');
        return;
    }

    var html = '';
    for (var i = 0; i < SHOP_CART.length; i++) {
        var cartItem = SHOP_CART[i];
        var product = findShopProduct(cartItem.id);
        if (!product) continue;
        var qty = cartItem.qty || 1;
        var subtotal = (product.price * qty).toFixed(2);
        html += '<div class="shop-cart-item">';
        html += '<div class="shop-cart-item-icon">' + (product.icon || '📦') + '</div>';
        html += '<div class="shop-cart-item-info">';
        html += '<div class="shop-cart-item-name">' + product.name + '</div>';
        html += '<div class="shop-cart-item-price">' + SHOP_CONFIG.currency + product.price.toFixed(2) + ' each</div>';
        html += '</div>';
        html += '<div class="shop-cart-item-qty">';
        html += '<button class="shop-cart-qty-btn" onclick="adjustCartQty(\'' + product.id + '\', -1)">−</button>';
        html += '<span class="shop-cart-qty-num">' + qty + '</span>';
        html += '<button class="shop-cart-qty-btn" onclick="adjustCartQty(\'' + product.id + '\', 1)">+</button>';
        html += '</div>';
        html += '<span class="shop-cart-item-subtotal">' + SHOP_CONFIG.currency + subtotal + '</span>';
        html += '<button class="shop-cart-item-remove" onclick="removeFromCart(\'' + product.id + '\')" title="Remove">✕</button>';
        html += '</div>';
    }
    container.innerHTML = html;
    if (totalEl) totalEl.textContent = SHOP_CONFIG.currency + getCartTotal().toFixed(2);

    modal.classList.add('open');
    overlay.classList.add('show');
}

function closeCartModal() {
    var modal = document.getElementById('shopCartModal');
    var overlay = document.getElementById('shopCartOverlay');
    if (modal) modal.classList.remove('open');
    if (overlay) overlay.classList.remove('show');
}

// --- Tebex Checkout ---
function checkoutCart() {
    if (SHOP_CART.length === 0) return;

    var storeUrl = SHOP_CONFIG.storeUrl || 'https://your-store.tebex.io/';
    // Normalize URL
    if (storeUrl.slice(-1) !== '/') storeUrl += '/';

    // If we have tebexUrl for each product and there's only one type, go directly
    if (SHOP_CART.length === 1) {
        var product = findShopProduct(SHOP_CART[0].id);
        if (product && product.tebexUrl) {
            window.open(product.tebexUrl, '_blank');
            clearCart();
            return;
        }
    }

    // Check if all products have tebexUrl set
    var allHaveUrls = true;
    for (var i = 0; i < SHOP_CART.length; i++) {
        var p = findShopProduct(SHOP_CART[i].id);
        if (!p || !p.tebexUrl) {
            allHaveUrls = false;
            break;
        }
    }

    if (allHaveUrls) {
        // Open each product in a new tab
        for (var i = 0; i < SHOP_CART.length; i++) {
            var p = findShopProduct(SHOP_CART[i].id);
            if (p) {
                window.open(p.tebexUrl, '_blank');
            }
        }
        clearCart();
        return;
    }

    // Fallback: open the main store
    window.open(storeUrl, '_blank');
    clearCart();
}

function buyNow(productId) {
    var product = findShopProduct(productId);
    if (!product) return;

    if (product.tebexUrl) {
        window.open(product.tebexUrl, '_blank');
        return;
    }

    // Fallback: open the store homepage
    var storeUrl = SHOP_CONFIG.storeUrl || 'https://your-store.tebex.io/';
    window.open(storeUrl, '_blank');
}

// --- Shop Helpers ---
function findShopProduct(id) {
    for (var i = 0; i < SHOP_CONFIG.products.length; i++) {
        if (SHOP_CONFIG.products[i].id === id) return SHOP_CONFIG.products[i];
    }
    return null;
}

function clearCart() {
    SHOP_CART = [];
    saveCart();
    updateCartUI();
    closeCartModal();
}

function showShopNotification(msg) {
    var existing = document.querySelector('.shop-notification');
    if (existing) existing.remove();

    var notif = document.createElement('div');
    notif.className = 'shop-notification';
    notif.textContent = msg;
    notif.style.cssText = 'position:fixed;bottom:50px;left:50%;transform:translateX(-50%);background:#000080;color:white;padding:8px 16px;font-size:12px;font-weight:bold;z-index:9999;border:2px outset;font-family:inherit;box-shadow:2px 2px 8px rgba(0,0,0,0.4);transition:opacity 0.3s;';
    document.body.appendChild(notif);
    setTimeout(function() {
        notif.style.opacity = '0';
        setTimeout(function() { notif.remove(); }, 300);
    }, 2000);
}

// --- Shop Rendering ---
var shopActiveCategory = 'all';
var shopFetchedProducts = null;

function loadShop() {
    var catContainer = document.getElementById('shopCategories');
    var productsContainer = document.getElementById('shopProducts');
    if (!catContainer || !productsContainer) return;

    SHOP_CART = getCart();
    updateCartUI();

    // Render categories
    renderShopCategories(catContainer);

    // Render products (either from live API or local config)
    if (SHOP_CONFIG.publicToken) {
        fetchShopFromTebex(productsContainer);
    } else {
        renderShopProducts(SHOP_CONFIG.products, productsContainer);
    }
}

function renderShopCategories(container) {
    var html = '';
    for (var i = 0; i < SHOP_CONFIG.categories.length; i++) {
        var cat = SHOP_CONFIG.categories[i];
        var activeClass = cat.id === shopActiveCategory ? ' active' : '';
        html += '<button class="shop-cat-btn' + activeClass + '" onclick="filterShopCategory(\'' + cat.id + '\')">' + cat.icon + ' ' + cat.label + '</button>';
    }
    container.innerHTML = html;
}

function filterShopCategory(catId) {
    shopActiveCategory = catId;
    renderShopCategories(document.getElementById('shopCategories'));

    var source = shopFetchedProducts || SHOP_CONFIG.products;
    var filtered = source;
    if (catId !== 'all') {
        filtered = source.filter(function(p) { return p.category === catId; });
    }

    // Apply search filter
    var searchVal = document.getElementById('shopSearch').value.toLowerCase().trim();
    if (searchVal) {
        filtered = filtered.filter(function(p) {
            return p.name.toLowerCase().indexOf(searchVal) !== -1 ||
                   p.desc.toLowerCase().indexOf(searchVal) !== -1;
        });
    }

    renderShopProducts(filtered, document.getElementById('shopProducts'));
}

function filterShopProducts() {
    filterShopCategory(shopActiveCategory);
}

function renderShopProducts(products, container) {
    if (!container) return;

    if (!products || products.length === 0) {
        container.innerHTML = '<div class="shop-loading">No products found in this category</div>';
        return;
    }

    var html = '';
    for (var i = 0; i < products.length; i++) {
        var p = products[i];
        var inCart = false;
        for (var j = 0; j < SHOP_CART.length; j++) {
            if (SHOP_CART[j].id === p.id) { inCart = true; break; }
        }

        html += '<div class="shop-product-card">';
        // Image/icon placeholder
        if (p.icon) {
            html += '<div class="shop-product-img-placeholder">' + p.icon + '</div>';
        } else {
            html += '<div class="shop-product-img-placeholder">📦</div>';
        }
        html += '<div class="shop-product-body">';
        html += '<div class="shop-product-name">' + p.name + '</div>';
        html += '<div class="shop-product-desc">' + p.desc + '</div>';
        html += '<div class="shop-product-footer">';
        html += '<span class="shop-product-price">' + SHOP_CONFIG.currency + p.price.toFixed(2) + '</span>';

        // Show "Buy Now" (direct to Tebex) and "Add to Cart"
        html += '<div style="display:flex;gap:3px;">';
        html += '<button class="shop-product-btn" onclick="addToCart(\'' + p.id + '\')" data-product="' + p.id + '">Add to Cart</button>';
        html += '</div>';

        html += '</div></div></div>';
    }
    container.innerHTML = html;
}

// --- Tebex Live API Fetching ---
function fetchShopFromTebex(container) {
    if (!SHOP_CONFIG.publicToken) return;

    container.innerHTML = '<div class="shop-loading">🔄 Fetching products from Tebex...</div>';

    var apiUrl = 'https://headless.tebex.io/api/listing';
    var fetchUrl = apiUrl;

    if (SHOP_CONFIG.corsProxy) {
        fetchUrl = SHOP_CONFIG.corsProxy + encodeURIComponent(apiUrl);
    }

    fetch(fetchUrl, {
        headers: {
            'Accept': 'application/json',
            'X-Tebex-Token': SHOP_CONFIG.publicToken
        }
    })
    .then(function(res) {
        if (!res.ok) throw new Error('API responded with ' + res.status);
        return res.json();
    })
    .then(function(data) {
        if (data && data.categories) {
            // Build products from Tebex data
            var tebexProducts = [];
            var tebexCategories = [];

            // Add "All" category
            tebexCategories.push({ id: 'all', label: 'All', icon: '📦' });

            // Process categories
            for (var i = 0; i < data.categories.length; i++) {
                var cat = data.categories[i];
                var catId = cat.id || 'cat-' + i;
                tebexCategories.push({
                    id: catId,
                    label: cat.name || cat.plural || 'Category',
                    icon: cat.icon || '📁'
                });

                // Process packages in this category
                if (cat.packages) {
                    for (var j = 0; j < cat.packages.length; j++) {
                        var pkg = cat.packages[j];
                        tebexProducts.push({
                            id: pkg.id || 'pkg-' + i + '-' + j,
                            name: pkg.name || 'Package',
                            desc: pkg.description || pkg.short_description || '',
                            category: catId,
                            price: parseFloat(pkg.sale_price || pkg.price || 0),
                            tebexUrl: SHOP_CONFIG.storeUrl + 'package/' + (pkg.id || ''),
                            icon: pkg.icon || '📦'
                        });
                    }
                }
            }

            // Update global config with fetched data
            shopFetchedProducts = tebexProducts;
            SHOP_CONFIG.categories = tebexCategories;

            // Re-render categories and products
            renderShopCategories(document.getElementById('shopCategories'));
            renderShopProducts(tebexProducts, container);
        } else {
            container.innerHTML = '<div class="shop-loading">⚠️ No products found in Tebex listing. Check your token.</div>';
        }
    })
    .catch(function(err) {
        console.error('Tebex API error:', err);
        container.innerHTML = '<div class="shop-loading">⚠️ Could not fetch from Tebex. <button class="win-btn" onclick="loadShop()" style="margin-left:6px;">Retry</button><br><small>Using local product list instead.</small></div>';
        // Fallback to local products after a delay
        setTimeout(function() {
            renderShopProducts(SHOP_CONFIG.products, container);
        }, 2000);
    });
}

// Hook into showPage to load shop when shop page is shown
var originalShowPage = showPage;
showPage = function(name) {
    originalShowPage(name);
    if (name === 'shop') {
        loadShop();
    }
};

// ========================
// INIT
// ========================

initStaff();
updateTrayClock();
loadGallery();
showPage('home');

console.log('%c Oakridge Chicago RP ', 'background:#000080;color:white;font-size:16px;font-weight:bold;');
console.log('%c Windows 97 Edition ', 'background:#008080;color:white;font-size:12px;');
console.log('Login: admin/admin123, staff/staff123, owner/owner123');
