# Pennysavia USA — Deployment Guide

## Status
✅ **All 3 servers verified running locally:**
- Backend: http://localhost:4000
- Frontend: http://localhost:3002
- Admin: http://localhost:5173

---

## Step 1: Deploy Frontend (User App) to Netlify

### 1a. Connect GitHub to Netlify
1. Go to **https://netlify.com** → Sign in or create account
2. Click **"New site from Git"** → Select **GitHub** → Authorize Netlify → Choose repo `best-south-heights`
3. Click **"Connect site"**

### 1b. Configure Build Settings
- **Base directory**: (leave blank, it's the repo root)
- **Build command**: `npm ci && npm run build`
- **Publish directory**: `frontend/dist`
- **Environment variables**: Click **"Add environment variables"** and set:
  - `BACKEND_URL` = (you'll set this after deploying backend, e.g., `https://your-backend.onrender.com`)

### 1c. Deploy
- Click **"Deploy site"**
- Wait ~2-3 minutes for build to complete
- Your **Frontend URL** = `https://[site-name].netlify.app` (shown in Netlify dashboard)

---

## Step 2: Deploy Backend (Socket.IO Server) to Render

### 2a. Create a New Web Service on Render
1. Go to **https://render.com** → Sign in or create account
2. Click **"New +"** → Select **"Web Service"**
3. Connect GitHub (authorize if needed) → Select repo `best-south-heights`

### 2b. Configure the Web Service
**Settings to fill:**

| Field | Value |
|-------|-------|
| **Name** | `pennysavia-backend` |
| **Environment** | `Node` |
| **Build Command** | `cd backend && npm ci` |
| **Start Command** | `cd backend && npm start` |
| **Plan** | Free (or Starter for production) |

### 2c. Add Environment Variables
Click **"Environment"** and add:

```
TELEGRAM_BOT_TOKEN=8403984953:AAEH68RfaaH--DaloJ7nmdMI2p2Av1678B8
TELEGRAM_ADMIN_CHAT_ID=7099353645
TELEGRAM_WEBHOOK_SECRET=tg-sec-7099353645-20260106
PORT=4000
```

### 2d. Deploy
- Click **"Create Web Service"**
- Wait for the build to complete (~3-5 minutes)
- Your **Backend URL** = `https://pennysavia-backend.onrender.com` (shown in Render dashboard)

### 2e. Update Frontend Environment Variable
1. Go back to **Netlify** → Your site settings
2. Find **Environment** → Edit the `BACKEND_URL` value
3. Set it to: `https://pennysavia-backend.onrender.com` (your actual Render URL)
4. Redeploy frontend: In Netlify, click **"Deploys"** → **"Trigger deploy"** → **"Deploy site"**

---

## Step 3: Deploy Admin Dashboard to Netlify (Optional)

### 3a. Create a New Site
1. In **Netlify**, click **"Add new site"** → **"Import an existing project"**
2. Select repo → Click **"Connect"**

### 3b. Configure
- **Base directory**: (leave blank)
- **Build command**: `npm ci && npm run build`
- **Publish directory**: `admin/dist`
- **Environment variables**: Set `BACKEND_URL` to your Render backend URL

### 3c. Deploy
- Click **"Deploy site"**
- Your **Admin URL** = `https://[admin-site-name].netlify.app`

---

## Step 4: Verify Everything Works

### Test User App
1. Open **Frontend URL** (e.g., `https://example.netlify.app`)
2. Register a test account
3. Go to **Chat** page → Try sending a message
4. Check if Telegram notification arrives

### Test Admin Dashboard
1. Open **Admin URL** (e.g., `https://admin-example.netlify.app`)
2. Navigate to **Users** → See registered users
3. Navigate to **Chat** → Send a message to test
4. Navigate to **Submissions** → Review gift card submissions

---

## Final URLs to Share

| App | URL |
|-----|-----|
| **User App** | `https://[your-netlify-frontend].netlify.app` |
| **Admin Dashboard** | `https://[your-netlify-admin].netlify.app` |
| **Backend API** | `https://pennysavia-backend.onrender.com` |

---

## Troubleshooting

### Backend not connecting
- Check that `BACKEND_URL` is set in Netlify frontend environment
- Verify Render service is running (check Render dashboard)
- Test API manually: `curl https://pennysavia-backend.onrender.com/`

### Chat not working
- Backend must be deployed first (Socket.IO requires a running server)
- Check browser console for WebSocket connection errors
- Ensure CORS is enabled (it is in our backend config)

### Telegram not receiving messages
- Verify `TELEGRAM_BOT_TOKEN` and `TELEGRAM_ADMIN_CHAT_ID` are correct
- Test bot manually in Telegram: send a message to the bot
- Check backend logs in Render dashboard for errors

---

## Production Recommendations

1. **Use PostgreSQL** instead of in-memory storage for messages and users
   - Add a `.db` layer using `pg` or `prisma`

2. **Add JWT Authentication** for admin routes
   - Protect `/api/admin/*` endpoints with token verification

3. **Enable HTTPS** (both Netlify and Render provide automatic HTTPS)

4. **Use separate Telegram webhook** for production
   - Render will provide a public URL for webhook callbacks

5. **Monitor and logs**
   - Enable logs in Render dashboard
   - Set up error notifications

6. **Rate limiting** on `/api/upload` and chat endpoints
   - Prevent abuse and large uploads

---

## Local Development Commands

```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
cd frontend
npm run dev

# Terminal 3: Admin
cd admin
npm run dev
```

All servers will start on different ports automatically.

---

## Repository
**https://github.com/godwindaniel1109-svg/best-south-heights.git**

Happy deploying! 🚀
