Deployment guide
================

Frontend (Netlify)
- Connect this GitHub repo to Netlify.
- In Netlify project settings set the build command to:

  npm ci && npm run build

- Set the publish directory to `frontend/dist`.
- Set environment variable `BACKEND_URL` to your backend public URL (example: https://your-backend.example.com).

Backend (Recommended: Render or Railway)
- This project uses a WebSocket (Socket.IO) server; Vercel serverless functions are not suitable for long-lived WebSocket connections.
- Recommended hosting: Render (Web Service), Railway, Fly.io, or a VPS.
- Render example: create a new Web Service, point to the `backend/` folder, set build and start commands:

  Build Command: npm ci
  Start Command: npm start

- Required environment variables (set in service settings):
  - TELEGRAM_BOT_TOKEN
  - TELEGRAM_ADMIN_CHAT_ID
  - PORT (optional)

If you still want to use Vercel, a `backend/vercel.json` file is included, but note WebSockets may not function reliably on Vercel serverless.

Admin app
- The `admin/` folder contains a standalone admin UI. You can deploy it as a separate Netlify site (same steps as frontend) or host it under Netlify subdomain.

Local testing
- Start backend:

  cd backend
  npm ci
  npm run dev

- Start frontend:

  cd frontend
  npm ci
  npm run dev

- Start admin UI:

  cd admin
  npm ci
  npm run dev
