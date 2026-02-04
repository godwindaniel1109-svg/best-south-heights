import { useEffect, useState } from 'react'
import axios from 'axios'
import './Admin.css'

export default function UsersPage(){
  const [users, setUsers] = useState([])
  useEffect(()=>{fetchUsers()},[])
  async function fetchUsers(){
    const res = await axios.get('/api/admin/users')
    setUsers(res.data.users || [])
  }
  async function toggleBan(u){
    const res = await axios.patch(`/api/admin/users/${u.id}`, { banned: !u.banned })
    fetchUsers()
  }
  async function makeAdmin(u){
    const res = await axios.patch(`/api/admin/users/${u.id}`, { role: u.role==='admin' ? 'user' : 'admin' })
    fetchUsers()
  }
  return (
    <div className="admin-page">
      <h2>Users</h2>
      <table>
        <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Banned</th><th>Actions</th></tr></thead>
        <tbody>
          {users.map(u=> (
            <tr key={u.id}>
              <td>{u.userName || u.fullName || '—'}</td>
              <td>{u.email}</td>
              <td>{u.role || 'user'}</td>
              <td>{u.banned ? 'Yes' : 'No'}</td>
              <td>
                <button onClick={()=>makeAdmin(u)}>Toggle Admin</button>
                <button onClick={()=>toggleBan(u)}>{u.banned? 'Unban' : 'Ban'}</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
