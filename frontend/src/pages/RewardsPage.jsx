import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './PageContent.css'

const RewardsPage = () => {
  const { user } = useAuth()
  const dwtTokens = user?.dwtTokens || 0

  const rewards = [
    {
      tokens: 1,
      title: 'Bronze Member',
      icon: '🥉',
      benefits: [
        'Basic platform access',
        'Post on job board',
        'Join meetups',
        'Save $5 on first purchase'
      ],
      color: '#CD7F32'
    },
    {
      tokens: 2,
      title: 'Silver Member',
      icon: '🥈',
      benefits: [
        'All Bronze benefits',
        'Priority job listings',
        'Join 2 meetups/month free',
        'Save $15 on purchases',
        'Access to exclusive deals'
      ],
      color: '#C0C0C0'
    },
    {
      tokens: 3,
      title: 'Gold Member',
      icon: '🏅',
      benefits: [
        'All Silver benefits',
        'Featured job postings',
        'Free meetup attendance (unlimited)',
        'Save $30 on purchases',
        'Priority support',
        'Referral bonus program'
      ],
      color: '#FFD700'
    },
    {
      tokens: 5,
      title: 'Platinum Member',
      icon: '💎',
      benefits: [
        'All Gold benefits',
        'Premium job board placement',
        'Networking events (exclusive)',
        'Save $75 on purchases',
        '24/7 priority support',
        '10% referral bonus',
        'Monthly $25 token credit'
      ],
      color: '#E5E4E2'
    },
    {
      tokens: 10,
      title: 'Diamond VIP',
      icon: '👑',
      benefits: [
        'All Platinum benefits',
        'VIP event access',
        'Business mentorship',
        'Unlimited savings (up to $200)',
        'Dedicated account manager',
        '15% referral bonus',
        'Monthly $50 token credit',
        'Custom business profile'
      ],
      color: '#00D9FF'
    }
  ]

  return (
    <div className="page-content">
      <div className="page-header">
        <h2>🎁 DWT Token Rewards</h2>
        <p>Unlock exclusive benefits with DWT tokens</p>
      </div>

      <div className="rewards-intro">
        <div className="current-tokens">
          <p className="tokens-label">Your DWT Tokens:</p>
          <p className="tokens-amount">{dwtTokens}</p>
          {dwtTokens === 0 && (
            <Link to="/dashboard" className="btn btn-primary">
              Get Started
            </Link>
          )}
        </div>
        <div className="rewards-info">
          <h3>How to Earn DWT Tokens</h3>
          <ul>
            <li>📱 Submit Apple gift cards ($50 = 1 token)</li>
            <li>🔗 Refer friends (earn tokens per successful referral)</li>
            <li>⭐ Complete tasks & challenges</li>
            <li>💬 Engage with community (comments, reviews)</li>
            <li>🏆 Participate in events</li>
          </ul>
        </div>
      </div>

      <div className="rewards-grid">
        {rewards.map((reward, idx) => (
          <div 
            key={idx}
            className={`reward-card ${dwtTokens >= reward.tokens ? 'unlocked' : 'locked'}`}
            style={{ borderTop: `4px solid ${reward.color}` }}
          >
            <div className="reward-header">
              <span className="reward-icon">{reward.icon}</span>
              <h3>{reward.title}</h3>
              <p className="reward-tokens">{reward.tokens} DWT Token{reward.tokens > 1 ? 's' : ''}</p>
            </div>

            <ul className="reward-benefits">
              {reward.benefits.map((benefit, bidx) => (
                <li key={bidx}>
                  <span className="check">✓</span>
                  {benefit}
                </li>
              ))}
            </ul>

            {dwtTokens >= reward.tokens ? (
              <div className="reward-status unlocked-status">
                ✅ Unlocked
              </div>
            ) : (
              <div className="reward-status locked-status">
                🔒 {reward.tokens - dwtTokens} token{reward.tokens - dwtTokens > 1 ? 's' : ''} away
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="rewards-cta">
        <h3>Ready to Unlock Premium Benefits?</h3>
        <p>Submit your Apple gift card to earn DWT tokens and unlock exclusive rewards today!</p>
        <Link to="/dashboard?tab=withdraw" className="btn btn-primary">
          Submit Gift Card Now
        </Link>
      </div>
    </div>
  )
}

export default RewardsPage
