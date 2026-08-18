# 🚀 Deployment Guide — Nagpur Traffic AI

This guide details how to deploy **Nagpur Traffic AI — Risk Heatmap & Police Deployment Command Center** across popular hosting platforms, edge networks, and container environments.

---

## ⚡ Option 1: Vercel (Recommended)

### Automatic Deployment via Vercel CLI / Dashboard
1. Push your repository to GitHub / GitLab / Bitbucket.
2. Go to [Vercel Dashboard](https://vercel.com/new) and select **Import Project**.
3. Vercel automatically detects Vite:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Click **Deploy**.

*Note: Routing rules for Single Page Applications (SPA) are already pre-configured in `vercel.json`.*

---

## 🌐 Option 2: Netlify

### Deployment via Netlify Dashboard
1. Connect your GitHub repository on [Netlify](https://app.netlify.com/).
2. Set Build Settings:
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`
3. Click **Deploy Site**.

*Note: SPA redirects are pre-configured via `netlify.toml` and `public/_redirects`.*

---

## ☁️ Option 3: Cloudflare Pages

1. Log into [Cloudflare Dashboard](https://dash.cloudflare.com/) -> **Workers & Pages**.
2. Click **Create Application** -> **Pages** -> **Connect to Git**.
3. Select the repository and set:
   - **Framework preset**: Vite
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
4. Click **Save and Deploy**.

---

## 🚢 Option 4: Render / Railway / Fly.io

### Render Static Site:
1. Create a **New Static Site** on Render.
2. Build Command: `npm run build`
3. Publish Directory: `dist`
4. Add Rewrite Rule: `/* -> /index.html` (200).

---

## 🐳 Option 5: Docker Containerization

To run locally or deploy on AWS ECS, GCP Cloud Run, or DigitalOcean App Platform using Docker:

### 1. Build Docker Image
```bash
docker build -t nagpur-traffic-ai .
```

### 2. Run Container
```bash
docker run -d -p 8080:80 nagpur-traffic-ai
```

Access app at `http://localhost:8080`.

---

## 📦 Option 6: GitHub Pages

1. In `package.json`, install `gh-pages`:
   ```bash
   npm install --save-dev gh-pages
   ```
2. Add deploy scripts to `package.json`:
   ```json
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d dist"
   }
   ```
3. Run `npm run deploy`.

---

## 🔍 Pre-Flight Verification Checklist

- [x] **Build Script**: Verified standard `vite build`.
- [x] **Git Hygiene**: `.gitignore` configured to ignore `node_modules`, `dist`, `.env*`.
- [x] **SPA Rewrites**: Pre-configured for Vercel (`vercel.json`), Netlify (`netlify.toml`, `public/_redirects`), and Nginx (`nginx.conf`).
- [x] **Zero Build Warnings**: Clean compilation with optimized chunk sizes.
- [x] **SEO & Social Previews**: OpenGraph, Twitter Card, and Meta tags configured in `index.html`.
