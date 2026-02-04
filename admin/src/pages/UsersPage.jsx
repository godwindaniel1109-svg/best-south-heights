import { useEffect, useState } from 'react'
import axios from 'axios'
import { io } from 'socket.io-client'
import './Admin.css'

export default function UsersPage(){
  const [users, setUsers] = useState([])
  const [activeUsers, setActiveUsers] = useState(0)
  
  useEffect(()=>{
    fetchUsers()
    const socket = io('/', { path: '/socket.io' })
    socket.on('usersUpdate', (u) => {
      setUsers(u || [])
      const active = (u || []).filter(usr => usr.connected).length
      setActiveUsers(active)
    })
    return ()=> socket.disconnect()
  },[])
  
  async function fetchUsers(){
    const res = await axios.get('/api/admin/users')
    const userList = res.data.users || []
    setUsers(userList)
    const active = userList.filter(u => u.connected).length
    setActiveUsers(active)
  }
  
  async function toggleBan(u){
    await axios.patch(`/api/admin/users/${u.id}`, { banned: !u.banned })
    fetchUsers()
  }
  
  async function makeAdmin(u){
    await axios.patch(`/api/admin/users/${u.id}`, { role: u.role==='admin' ? 'user' : 'admin' })
    fetchUsers()
  }

  async function uploadAvatar(e){
    const file = e.target.files[0]
    if(!file) return
    const fd = new FormData()
    fd.append('file', file)
    try {
      const up = await axios.post('/api/upload', fd)
      const url = up.data.url
      await axios.patch(`/api/admin/users/admin-1`, { avatar: url })
      fetchUsers()
    } catch(err){
      console.warn('Failed to upload avatar:', err.message)
    }
  }

  const getInitials = (name) => {
    if (!name) return '?'
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  return (
    <div className="admin-page">
      <h2>👥 User Management</h2>
      
      <div className="active-users-count">
        <span style={{color:'#28a745',fontSize:'1.2rem'}}>🟢</span> <strong>{activeUsers} Active Users</strong> out of {users.length} total
      </div>

      <div className="avatar-upload-section">
        <label htmlFor="admin-avatar">🖼️ Set Admin Profile Picture:</label>
        <input 
          id="admin-avatar"
          type="file" 
          accept="image/*" 
          onChange={uploadAvatar}
          style={{display:'block'}}
        />
      </div>

      <table>
        <thead>
          <tr>
            <th style={{width:'60px'}}>Avatar</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Banned</th>
            <th style={{width:'280px'}}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u=> (
            <tr key={u.id}>
              <td>
                {u.avatar ? (
                  <img src={u.avatar} alt="avatar" />
                ) : (
                  <div className="avatar-placeholder">{getInitials(u.userName)}</div>
                )}
              </td>
              <td>{u.userName || u.fullName || '—'}</td>
              <td>{u.email || '—'}</td>
              <td>
                <span style={{
                  background: u.role === 'admin' ? '#ffeaa7' : '#e8f5e9',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontSize: '0.85rem',
                  fontWeight: '500'
                }}>
                  {u.role === 'admin' ? '⭐ Admin' : '👤 User'}
                </span>
              </td>
              <td>
                <span className={u.connected ? 'status-online' : 'status-offline'}>
                  <span className={`status-dot ${u.connected ? 'online' : 'offline'}`}></span>
                  {u.connected ? 'Online' : 'Offline'}
                </span>
              </td>
              <td>
                <span style={{color: u.banned ? '#dc3545' : '#28a745', fontWeight: '500'}}>
                  {u.banned ? '🚫 Yes' : '✅ No'}
                </span>
              </td>
              <td style={{fontSize:'0.9rem'}}>
                <button onClick={()=>makeAdmin(u)}>
                  {u.role === 'admin' ? '⭐ Remove Admin' : '👤 Make Admin'}
                </button>
                <button onClick={()=>toggleBan(u)} style={{background: u.banned ? '#28a745' : '#dc3545'}}>
                  {u.banned? '✅ Unban' : '🚫 Ban'}
                </button>
                <a href={`/admin/chat?user=${u.id}`}>💬 Message</a>
}
