import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import UsersPage from './pages/UsersPage'
import ChatPage from './pages/Chat'
import AdminPage from './pages/AdminPage'
import { AuthProvider } from './context/AuthContext'

export default function App(){
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/admin/users" replace />} />
          <Route path="/admin/users" element={<UsersPage/>} />
          <Route path="/admin/chat" element={<ChatPage/>} />
          <Route path="/admin/submissions" element={<AdminPage/>} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}
