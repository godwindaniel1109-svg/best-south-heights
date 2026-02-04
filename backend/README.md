Pennysavia backend

This minimal Express server receives JSON with base64-encoded images and a 15-digit `code`, and forwards them to your Telegram bot (server-side) to keep the bot token private.

Setup

1. Copy `.env.example` to `.env` and set `BOT_TOKEN` and `CHAT_ID`.
2. Install dependencies:

```bash
cd backend
npm install
```

3. Run server:

```bash
# development
npm run dev

# production
npm start
```

API

POST /api/send-telegram
Content-Type: application/json
Body: { images: ["data:image/jpeg;base64,...", ...], code: "123456789012345" }

The server will send a message containing the code, then forward each image to the configured chat id.
