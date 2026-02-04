import { useAuth } from '../context/AuthContext'
import './Wallet.css'

const Wallet = () => {
  const { user } = useAuth()

  return (
    <div className="wallet-card">
      <div className="wallet-header">
        <h3>💰 Wallet</h3>
      </div>
      <div className="wallet-content">
        <div className="wallet-balance">
          <span className="balance-label">Balance</span>
          <span className="balance-amount">
            ${user?.walletBalance?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
          </span>
        </div>
        <div className="wallet-dwt">
          <span className="dwt-label">DWT Tokens</span>
          <span className="dwt-amount">
            {user?.dwtTokens || 0}
          </span>
        </div>
        {user?.dwtPurchases && user.dwtPurchases.filter(p => p.status === 'pending').length > 0 && (
          <div className="wallet-pending">
            <span className="pending-label">Pending DWT</span>
            <span className="pending-amount">
              {user.dwtPurchases.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0)}
            </span>
          </div>
        )}
        <div className="wallet-info">
          <p className="info-text">
            You need DWT tokens to view jobs and withdraw funds
          </p>
        </div>
      </div>
    </div>
  )
}

export default Wallet
