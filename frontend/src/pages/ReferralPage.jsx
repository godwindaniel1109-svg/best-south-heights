import { useAuth } from '../context/AuthContext'
import './PageContent.css'

const ReferralPage = () => {
  const { user } = useAuth()
  const referralCode = user?.referralCode || 'N/A'
  const referralLink = `${window.location.origin}/register?ref=${referralCode}`

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink)
    alert('Referral link copied to clipboard!')
  }

  return (
    <div className="page-content">
      <div className="page-header">
        <h2>🎁 Referral Program</h2>
        <p>Share your referral link and earn rewards</p>
      </div>

      <div className="referral-content">
        <div className="referral-card">
          <h3>Your Referral Code</h3>
          <div className="referral-code-display">
            <span className="code-text">{referralCode}</span>
          </div>
        </div>

        <div className="referral-card">
          <h3>Your Referral Link</h3>
          <div className="referral-link-container">
            <input
              type="text"
              value={referralLink}
              readOnly
              className="referral-link-input"
            />
            <button onClick={copyToClipboard} className="btn-copy">
              Copy Link
            </button>
          </div>
        </div>

        <div className="referral-info">
          <h3>How It Works</h3>
          <ul>
            <li>📧 Share your referral link with friends and family</li>
            <li>✅ They sign up using your link</li>
            <li>🎉 You both earn rewards when they join</li>
            <li>💰 Track your referrals and earnings</li>
          </ul>
        </div>

        <div className="referral-stats">
          <div className="stat-card">
            <span className="stat-label">Total Referrals</span>
            <span className="stat-value">0</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Active Referrals</span>
            <span className="stat-value">0</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReferralPage
