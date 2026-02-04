import { useEffect, useRef, useState } from 'react'
import { io } from 'socket.io-client'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'
import './PageContent.css'

const socket = io('/', { path: '/socket.io' })

export default function Chat(){
  const { user } = useAuth()
  const [room, setRoom] = useState('global')
  const [messages, setMessages] = useState([])
  const [text, setText] = useState('')

  useEffect(()=>{
    if (!user) return
    const userRoom = `user:${user.id}`
    const r = 'global'
    setRoom(userRoom)

    axios.get('/api/messages').then(r=> setMessages(r.data.messages || []))

    socket.on('chatMessage', msg => {
      // if message is for this user or for global room
      if (msg.room === userRoom || msg.room === 'global' || msg.room?.startsWith('user:')) setMessages(prev=>[...prev, msg])
    })

    socket.emit('joinRoom', { room: 'global', user })
    socket.emit('joinRoom', { room: userRoom, user })

    return ()=>{
      socket.emit('leaveRoom', { room: 'global', user })
      socket.emit('leaveRoom', { room: userRoom, user })
      socket.off('chatMessage')
    }
  }, [user])

  function sendText(){
    if(!text) return
    const payload = { room, user, text }
    socket.emit('chatMessage', payload)
    setText('')
  }

  async function sendFile(e){
    const file = e.target.files[0]
    if(!file) return
    const fd = new FormData()
    fd.append('file', file)
    const res = await axios.post('/api/upload', fd)
    const url = res.data.url
    socket.emit('chatMedia', { room, user, url, mediaType: file.type.startsWith('audio') ? 'audio' : 'image' })
  }

  return (
    <div className="page-content">
      <div className="page-header">
        <h2>💬 Community Chat</h2>
        <p>Chat with the community and support</p>
      </div>

      <div className="chat-window">
        {messages.map(m => (
          <div key={m.id} className={`chat-msg ${m.type}`}>
            <div className="meta">{m.user?.userName || 'System'} • {new Date(m.timestamp).toLocaleTimeString()}</div>
            {m.type === 'text' && <div className="text">{m.text}</div>}
            {m.type === 'audio' && <audio controls src={m.url}></audio>}
            {m.type === 'image' && <img src={m.url} alt="upload" />}
            {m.type === 'system' && <div className="system">{m.text}</div>}
          </div>
        ))}
      </div>

      <div className="chat-inputs">
        <input value={text} onChange={e=>setText(e.target.value)} placeholder="Type a message" />
        <button onClick={sendText}>Send</button>
        <input type="file" onChange={sendFile} accept="image/*,audio/*" />
      </div>
    </div>
  )
}
