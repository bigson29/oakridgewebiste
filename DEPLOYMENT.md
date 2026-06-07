# 🚀 Deployment Guide

Choose your hosting provider and follow the steps below.

## Option 1: GitHub Pages (Recommended for Beginners)

**Pros:** Free, easy, automatic updates
**Cons:** Limited customization

### Step 1: Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `oakridge-website` (or your server name)
3. Add description: "Oakridge Chicago RP Server Website"
4. Choose "Public"
5. Click "Create repository"

### Step 2: Push Code to GitHub

On your computer, open terminal/PowerShell in your website folder:

```bash
# Initialize git
git init

# Add all files
git add .

# Initial commit
git commit -m "Initial website commit"

# Add remote repository
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/oakridge-website.git

# Push to GitHub
git push -u origin main
```

### Step 3: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click "Settings" tab
3. Scroll to "Pages" section
4. Under "Source", select "main" branch
5. Click "Save"
6. Wait 1-2 minutes for build to complete
7. Your site is live at: `https://YOUR_USERNAME.github.io/oakridge-website/`

### Custom Domain (Optional)

1. Buy domain from GoDaddy, Namecheap, etc.
2. GitHub Settings → Pages
3. Enter domain under "Custom domain"
4. Add DNS records to your domain provider:
   ```
   CNAME: www.yourserver.com → YOUR_USERNAME.github.io
   A: 185.199.108.153
   A: 185.199.109.153
   A: 185.199.110.153
   A: 185.199.111.153
   ```
5. Wait for DNS to propagate (up to 48 hours)

---

## Option 2: Netlify (Recommended for Features)

**Pros:** Free tier with features, easy deployments, custom domains
**Cons:** Limited bandwidth on free tier

### Step 1: Sign Up

1. Go to https://netlify.com
2. Click "Sign up"
3. Choose "GitHub" to connect your account
4. Authorize Netlify to access your GitHub

### Step 2: Create New Site

1. Click "New site from Git"
2. Select GitHub
3. Search and select your repository
4. Configure build settings:
   - Build command: (leave empty)
   - Publish directory: `/` (root)
5. Click "Deploy site"

### Step 3: Configure Domain

1. Go to Site settings
2. Click "Domain management"
3. Click "Add custom domain"
4. Enter your domain
5. Follow DNS setup instructions
6. Netlify generates SSL automatically

---

## Option 3: Traditional Web Hosting

**Pros:** Full control, better for production
**Cons:** Requires FTP/SSH access, small cost

### Step 1: Choose Hosting

Popular options:
- **Bluehost:** https://bluehost.com (~$3/month)
- **SiteGround:** https://siteground.com (~$3/month)
- **GoDaddy:** https://godaddy.com (~$5/month)
- **HostGator:** https://hostgator.com (~$3/month)

### Step 2: Upload Files via FTP

1. Get FTP credentials from hosting control panel
2. Download FTP client:
   - **FileZilla:** https://filezilla-project.org (Free)
   - **WinSCP:** https://winscp.net (Free)
   - **Cyberduck:** https://cyberduck.io (Free)

3. Connect to FTP:
   - Host: ftp.yourserver.com
   - Username: your-ftp-username
   - Password: your-ftp-password
   - Port: 21

4. Upload to `public_html/` folder

### Step 3: Setup Domain

1. In hosting control panel, point domain to your hosting
2. Add DNS records:
   ```
   A Record: @ → your-hosting-ip
   A Record: www → your-hosting-ip
   ```
3. Wait for DNS propagation (up to 24 hours)

---

## Option 4: AWS S3 + CloudFront (Advanced)

**Pros:** Scalable, CDN included
**Cons:** Requires AWS account, can be complex

### Step 1: Create S3 Bucket

```bash
# Using AWS CLI
aws s3 mb s3://your-domain.com

# Enable static website hosting
aws s3 website s3://your-domain.com \
  --index-document index.html \
  --error-document index.html
```

### Step 2: Upload Files

```bash
# Sync website files
aws s3 sync ./main-website s3://your-domain.com --delete
```

### Step 3: Setup CloudFront

1. Create CloudFront distribution
2. Set origin to S3 bucket
3. Disable caching for HTML
4. Create SSL certificate in ACM
5. Point domain CNAME to CloudFront URL

---

## Post-Deployment Checklist

- [ ] Website loads in browser
- [ ] All images display correctly
- [ ] All links work
- [ ] Mobile responsive (test on phone)
- [ ] Forms functional (if any)
- [ ] Fast loading (test with https://gtmetrix.com)
- [ ] HTTPS working (green lock in browser)
- [ ] SEO setup (meta tags, sitemap)
- [ ] Analytics configured (Google Analytics, etc.)
- [ ] Shared with community

---

## Performance Optimization

### Image Optimization
```bash
# Using TinyPNG CLI
npm install -g tinypng-cli
tinypng assets/logo.png
tinypng assets/banner.png
```

### Enable Gzip Compression

**Netlify:** Automatic
**GitHub Pages:** Automatic
**Traditional Hosting:** Add to .htaccess:
```apache
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html
  AddOutputFilterByType DEFLATE text/plain
  AddOutputFilterByType DEFLATE text/xml
  AddOutputFilterByType DEFLATE text/css
  AddOutputFilterByType DEFLATE text/javascript
  AddOutputFilterByType DEFLATE application/javascript
</IfModule>
```

### Caching

**Netlify:** Automatic
**GitHub Pages:** Automatic
**Traditional Hosting:** Add to .htaccess:
```apache
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType text/javascript "access plus 1 month"
</IfModule>
```

### Monitor Performance
- **Google PageSpeed:** https://pagespeed.web.dev
- **GTmetrix:** https://gtmetrix.com
- **WebPageTest:** https://webpagetest.org

---

## SSL Certificate (HTTPS)

All recommended hosting providers include FREE SSL:
- ✅ GitHub Pages: Automatic
- ✅ Netlify: Automatic
- ✅ Most web hosts: Automatic (Let's Encrypt)

---

## Updating Your Website

### Via GitHub/Git

```bash
# Make changes locally
# Edit files as needed

# Commit and push
git add .
git commit -m "Update website"
git push origin main

# Netlify/GitHub Pages auto-deploys!
```

### Via FTP

1. Connect to FTP
2. Edit files locally
3. Upload changed files
4. Site updates immediately

---

## Monitoring & Maintenance

### Setup Google Analytics

1. Create account at https://analytics.google.com
2. Get tracking ID
3. Add to your HTML:
```html
<!-- In index.html, before closing </head> -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_ID');
</script>
```

### Backup Strategy

1. Regular local backups
2. GitHub as version control
3. Netlify auto-snapshots (free plan)
4. Automated backup services (if using traditional hosting)

---

## Troubleshooting Deployment

**Q: Website shows 404 error**
- Check files are in correct folder (public_html/ or S3 root)
- Ensure index.html exists
- Check file permissions (644 for files, 755 for folders)

**Q: Images not showing after deployment**
- Verify image paths are correct
- Check assets/ folder was uploaded
- Use relative paths (e.g., `assets/logo.png`)

**Q: Domain not pointing to site**
- Check DNS records are correct
- Wait for DNS propagation (up to 48 hours)
- Flush DNS cache:
  ```
  Windows: ipconfig /flushdns
  Mac: sudo dscacheutil -flushcache
  ```

**Q: Site is slow**
- Compress images with TinyPNG
- Enable caching
- Move to CDN
- Minimize JavaScript/CSS

**Q: SSL certificate error**
- Wait for certificate to generate (up to 24 hours)
- Force HTTPS redirect
- Clear browser cache

---

## Summary

| Provider | Cost | Difficulty | Best For |
|----------|------|-----------|----------|
| GitHub Pages | Free | Easy | Beginners |
| Netlify | Free | Easy | Features |
| Bluehost | $3/mo | Medium | Full control |
| AWS S3 | Variable | Hard | Scale |

**Recommendation:** Start with **GitHub Pages** or **Netlify** if you're new, they're free and easy!

---

**Your website is ready to go live! Choose an option above and deploy! 🚀**
