# 🤖 Telegram Bot Setup Guide

## Overview

The Pennysavia platform includes an interactive Telegram bot that allows admins to:
- ✅ Approve/Reject submissions directly from Telegram
- 📊 View statistics on pending, approved, and rejected submissions
- 🎯 Manage both gift card submissions and DWT purchases
- 💬 Receive real-time notifications for new submissions

## Prerequisites

1. **Telegram Account**: Create one at https://telegram.org
2. **BotFather**: The official bot for creating Telegram bots
3. **Backend Running**: The backend must be accessible via HTTPS (required for webhooks)

## Step 1: Create a Telegram Bot

1. Open Telegram and search for **@BotFather**
2. Send `/start` to begin
3. Send `/newbot` to create a new bot
4. Follow the prompts:
   - Enter bot name: `Pennysavia Admin Bot`
   - Enter bot username: `pennysavia_admin_bot` (must end with `_bot`)
5. **Save the token** provided by BotFather (format: `XXXXXXXXX:XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX`)

## Step 2: Get Your Chat ID

1. Search for **@userinfobot** on Telegram
2. Send `/start` to get your user ID (Chat ID)
3. **Save this ID** for later

## Step 3: Configure Environment Variables

Create or update `.env` in the `backend/` folder:

```env
TELEGRAM_BOT_TOKEN=YOUR_BOT_TOKEN_HERE
TELEGRAM_ADMIN_CHAT_ID=YOUR_CHAT_ID_HERE
TELEGRAM_WEBHOOK_SECRET=tg-sec-YOUR_CHAT_ID-20260106
PORT=4000
```

**Example:**
```env
TELEGRAM_BOT_TOKEN=8403984953:AAEH68RfaaH--DaloJ7nmdMI2p2Av1678B8
TELEGRAM_ADMIN_CHAT_ID=7099353645
TELEGRAM_WEBHOOK_SECRET=tg-sec-7099353645-20260106
PORT=4000
```

## Step 4: Set Up Webhook (Production Only)

For production deployment (Netlify/Render), set the Telegram webhook:

```bash
# Replace with your actual backend URL
curl https://api.telegram.org/bot YOUR_TOKEN/setWebhook \
  -F url="https://your-backend-url.com/api/telegram/webhook"
```

**Example:**
```bash
curl https://api.telegram.org/bot8403984953:AAEH68RfaaH--DaloJ7nmdMI2p2Av1678B8/setWebhook \
  -F url="https://pennysavia-backend.onrender.com/api/telegram/webhook"
```

To remove webhook:
```bash
curl https://api.telegram.org/bot YOUR_TOKEN/deleteWebhook
```

## Step 5: Test the Bot

1. Start the backend:
   ```bash
   cd backend
   npm install
   npm start
   ```

2. Send `/start` to your bot on Telegram
   - You should receive: "👋 Welcome to Pennysavia Admin Bot!"

3. Use available commands:
   - `/start` - Show welcome message
   - `/pending` - List all pending submissions
   - `/approved` - List all approved submissions
   - `/stats` - Show submission statistics

## Bot Features

### 🔔 Automatic Notifications

When a user submits a DWT purchase or gift card:

1. **Notification Message** with details:
   - Submitter name, email, phone
   - Amount (price for DWT, USD for gift cards)
   - Timestamp

2. **Interactive Buttons**:
   - ✅ **Approve** - Instantly approve the submission
   - ❌ **Reject** - Instantly reject the submission

3. **Proof Images** (separate messages):
   - Payment proof for DWT purchases
   - Gift card images for gift card submissions

### 💬 Admin Commands

| Command | Description | Admin Only |
|---------|-------------|-----------|
| `/start` | Show welcome & commands | No |
| `/pending` | List pending submissions | Yes |
| `/approved` | List approved submissions | Yes |
| `/rejected` | List rejected submissions | Yes |
| `/stats` | Show statistics | Yes |

### ✅ Approval Workflow

1. **User submits** → DWT purchase or gift card
2. **Bot sends notification** with approval/reject buttons
3. **Admin clicks button** in Telegram
4. **Submission updated** automatically
5. **Confirmation sent** to admin chat
6. **Dashboard synced** in real-time

## Local Development (Polling Mode)

For local development, the bot uses **polling** instead of webhooks (webhooks require HTTPS):

- Simply start the backend locally
- The bot will check for messages every few seconds
- Commands work normally: `/start`, `/pending`, etc.

## Production Deployment

### Render (Recommended for Backend)

1. Deploy backend to Render
2. Get your backend URL: `https://your-app.onrender.com`
3. Set webhook via curl (see Step 4)
4. Update `TELEGRAM_BOT_TOKEN` and `TELEGRAM_ADMIN_CHAT_ID` in Render environment variables

### Netlify (Frontend)

1. Frontend deployment handles all UI
2. Backend webhook URL points to Render
3. Admin can manage submissions both in dashboard and Telegram

## Telegram Bot Limitations

- **Webhook updates only**: Production requires HTTPS
- **Polling for local dev**: Works fine but less efficient
- **Chat ID required**: Bot only responds in configured admin chat
- **In-memory storage**: Restarting backend resets submissions (use database for production)

## Troubleshooting

### Bot doesn't respond to commands

1. Check that backend is running
2. Verify `TELEGRAM_BOT_TOKEN` is correct
3. Verify you're messaging the correct bot username

### Webhook not working

1. Ensure backend URL is HTTPS (production only)
2. Verify webhook URL is set: `curl https://api.telegram.org/bot{TOKEN}/getWebhookInfo`
3. Check backend logs for webhook errors

### Commands show "Admin only"

1. Verify `TELEGRAM_ADMIN_CHAT_ID` in `.env` matches your chat ID
2. Get your chat ID from @userinfobot

### Buttons don't work

1. Check that backend is running
2. Verify submission ID is still in memory (not restarted)
3. Check browser console for errors

## Next Steps

1. ✅ Add database persistence (replace in-memory storage)
2. ✅ Add user notifications via Telegram (notify users of approval status)
3. ✅ Add batch approval feature
4. ✅ Add appeal process for rejected submissions
5. ✅ Add admin authorization via Telegram

## Support

For issues with Telegram Bot API, see: https://core.telegram.org/bots/api
