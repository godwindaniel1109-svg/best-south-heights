import React, { createContext, useContext, useState } from 'react'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({ id: 'admin-1', userName: 'admin', email: 'admin@pennysavia.com', role: 'admin' })

  const isAdmin = () => user?.role === 'admin'
  return (
    <AuthContext.Provider value={{ user, setUser, isAdmin }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
