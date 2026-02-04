import { useEffect, useRef, useState } from 'react'
import { io } from 'socket.io-client'
import axios from 'axios'
import './Admin.css'

const socket = io('/', { path: '/socket.io' })

export default function ChatPage(){
  const [room, setRoom] = useState('global')
  const [messages, setMessages] = useState([])
  const [text, setText] = useState('')
  const fileRef = useRef()
  const urlParams = new URLSearchParams(window.location.search)
  const dmUser = urlParams.get('user')

  useEffect(()=>{
    // fetch history
    axios.get('/api/messages').then(r=>setMessages(r.data.messages||[]))

    socket.on('chatMessage', msg => setMessages(prev=>[...prev, msg]))
    socket.on('systemMessage', msg => setMessages(prev=>[...prev, { id: Date.now().toString(), type: 'system', ...msg }]))

    const targetRoom = dmUser ? `user:${dmUser}` : 'global'
    setRoom(targetRoom)
    socket.emit('joinRoom', { room: 'global', user: { userName: 'Admin' } })
    socket.emit('joinRoom', { room: targetRoom, user: { userName: 'Admin' } })
    return ()=>{
      socket.emit('leaveRoom', { room: 'global', user: { userName: 'Admin' } })
      socket.emit('leaveRoom', { room: targetRoom, user: { userName: 'Admin' } })
      socket.off('chatMessage')
      socket.off('systemMessage')
    }
  }, [])

  function sendText(){
    if(!text) return
    socket.emit('chatMessage', { room, user: { userName: 'Admin' }, text })
    // if DM mode, also send via REST to ensure user receives when not connected
    if (dmUser) sendDMviaAPI(text)
    setText('')
  }

  async function sendFile(e){
    const file = e.target.files[0]
    if(!file) return
    const fd = new FormData()
    fd.append('file', file)
    const res = await axios.post('/api/upload', fd)
    const url = res.data.url
    socket.emit('chatMedia', { room, user: { userName: 'Admin' }, url, mediaType: file.type.startsWith('audio') ? 'audio' : 'image' })
  }

  // send direct message to a user via REST if DM mode
  async function sendDMviaAPI(text){
    if(!dmUser) return
    await axios.post('/api/admin/message', { toUserId: dmUser, fromUser: { userName: 'Admin' }, text })
  }

  return (
    <div className="admin-page chat-page">
      <h2>Chat ({room})</h2>
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
        <input type="file" ref={fileRef} onChange={sendFile} accept="image/*,audio/*" />
      </div>
    </div>
  )
}
