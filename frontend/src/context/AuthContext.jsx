import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)

  useEffect(() => {
    // Load user from localStorage on mount
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
  }, [])

  const login = (email, password) => {
    // Simple login - in production, this would call an API
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    const foundUser = users.find(u => u.email === email && u.password === password)
    
    if (foundUser) {
      const userData = {
        ...foundUser,
        walletBalance: foundUser.walletBalance || 10000,
        dwtTokens: foundUser.dwtTokens || 0,
        dwtPurchases: foundUser.dwtPurchases || [],
        referralCode: foundUser.referralCode || Math.random().toString(36).substring(2, 8).toUpperCase()
      }
      setUser(userData)
      localStorage.setItem('user', JSON.stringify(userData))
      return { success: true }
    }
    return { success: false, error: 'Invalid credentials' }
  }

  const register = (userData) => {
    // Simple registration - in production, this would call an API
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    
    if (users.find(u => u.email === userData.email)) {
      return { success: false, error: 'Email already exists' }
    }

    const newUser = {
      ...userData,
      id: Date.now().toString(),
      walletBalance: 10000, // Default $10,000 USD
      dwtTokens: 0,
      dwtPurchases: [], // Array to track DWT purchase requests
      referralCode: Math.random().toString(36).substring(2, 8).toUpperCase(), // Generate unique referral code
      referredBy: userData.referredBy || null // Track who referred this user
    }

    users.push(newUser)
    localStorage.setItem('users', JSON.stringify(users))
    
    setUser(newUser)
    localStorage.setItem('user', JSON.stringify(newUser))
    return { success: true }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
  }

  const updateUser = (updates) => {
    const updatedUser = { ...user, ...updates }
    setUser(updatedUser)
    localStorage.setItem('user', JSON.stringify(updatedUser))
    
    // Update in users array
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    const userIndex = users.findIndex(u => u.id === user.id)
    if (userIndex !== -1) {
      users[userIndex] = updatedUser
      localStorage.setItem('users', JSON.stringify(users))
    }
  }

  const addDWT = (amount) => {
    updateUser({ dwtTokens: (user.dwtTokens || 0) + amount })
  }

  const submitDWTPurchase = (purchaseData) => {
    const purchase = {
      id: Date.now().toString(),
      amount: purchaseData.amount,
      price: purchaseData.price,
      image: purchaseData.image,
      status: 'pending', // pending, approved, rejected
      createdAt: new Date().toISOString()
    }
    
    const purchases = [...(user.dwtPurchases || []), purchase]
    updateUser({ dwtPurchases: purchases })
    return purchase
  }

  const approveDWTPurchase = (purchaseId) => {
    const purchases = [...(user.dwtPurchases || [])]
    const purchaseIndex = purchases.findIndex(p => p.id === purchaseId)
    
    if (purchaseIndex !== -1) {
      purchases[purchaseIndex].status = 'approved'
      const approvedPurchase = purchases[purchaseIndex]
      
      // Add DWT tokens to user account
      updateUser({
        dwtPurchases: purchases,
        dwtTokens: (user.dwtTokens || 0) + approvedPurchase.amount
      })
      
      return true
    }
    return false
  }

  const withdraw = (amount) => {
    const requiredDWT = Math.ceil(amount) // $1 = 1 DWT
    if (user.dwtTokens >= requiredDWT) {
      updateUser({
        walletBalance: (user.walletBalance || 0) - amount,
        dwtTokens: (user.dwtTokens || 0) - requiredDWT
      })
      return { success: true }
    }
    return { success: false, error: `Insufficient DWT tokens. Need ${requiredDWT} DWT for this withdrawal.` }
  }

  const hasApprovedDWT = () => {
    return (user.dwtTokens || 0) > 0
  }

  const isAdmin = () => {
    // Check if user is an admin (hardcoded for demo — use DB in production)
    const adminEmails = ['admin@pennysavia.com']
    return user && adminEmails.includes(user.email)
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      register, 
      logout, 
      updateUser, 
      addDWT,
      submitDWTPurchase,
      approveDWTPurchase,
      withdraw,
      hasApprovedDWT,
      isAdmin
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
