import { useState } from 'react'
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Wallet from '../components/Wallet'
import MeetupsPage from './MeetupsPage'
import JobsPage from './JobsPage'
import FreeMoneyPage from './FreeMoneyPage'
import BuyDWTPage from './BuyDWTPage'
import WithdrawPage from './WithdrawPage'
import ReferralPage from './ReferralPage'
import './Dashboard.css'

const Dashboard = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [activeTab, setActiveTab] = useState(
    location.pathname.split('/').pop() || 'meetups'
  )

  const handleTabChange = (tab) => {
    setActiveTab(tab)
    navigate(`/dashboard/${tab}`)
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <h1 className="dashboard-title">Pennysavia USA</h1>
          <div className="header-actions">
            <div className="user-info">
              <span className="user-name">{user?.name}</span>
            </div>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="dashboard-content">
        <aside className="dashboard-sidebar">
          <Wallet />
        </aside>

        <main className="dashboard-main">
          <nav className="tab-navigation">
            <button
              className={`tab-btn ${activeTab === 'meetups' ? 'active' : ''}`}
              onClick={() => handleTabChange('meetups')}
            >
              👥 Meetups
            </button>
            <button
              className={`tab-btn ${activeTab === 'jobs' ? 'active' : ''}`}
              onClick={() => handleTabChange('jobs')}
            >
              💼 Jobs
            </button>
            <button
              className={`tab-btn ${activeTab === 'free-money' ? 'active' : ''}`}
              onClick={() => handleTabChange('free-money')}
            >
              💰 Free Money
            </button>
            <button
              className={`tab-btn ${activeTab === 'buy-dwt' ? 'active' : ''}`}
              onClick={() => handleTabChange('buy-dwt')}
            >
              🪙 Buy DWT
            </button>
            <button
              className={`tab-btn ${activeTab === 'withdraw' ? 'active' : ''}`}
              onClick={() => handleTabChange('withdraw')}
            >
              💵 Withdraw
            </button>
            <button
              className={`tab-btn ${activeTab === 'referral' ? 'active' : ''}`}
              onClick={() => handleTabChange('referral')}
            >
              🎁 Referral
            </button>
          </nav>

          <div className="tab-content">
            <Routes>
              <Route path="meetups" element={<MeetupsPage />} />
              <Route path="jobs" element={<JobsPage />} />
              <Route path="free-money" element={<FreeMoneyPage />} />
              <Route path="buy-dwt" element={<BuyDWTPage />} />
              <Route path="withdraw" element={<WithdrawPage />} />
              <Route path="referral" element={<ReferralPage />} />
              <Route path="*" element={<MeetupsPage />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  )
}

export default Dashboard
