import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import './BuyDWTPage.css'

const BuyDWTPage = () => {
  const { user, submitDWTPurchase } = useAuth()
  const [amount, setAmount] = useState(1)
  const [image, setImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [submitted, setSubmitted] = useState(false)
  const DWT_PRICE = 50 // $50 USD per DWT

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!image) {
      alert('Please upload an image')
      return
    }

    // Convert image to base64 for storage (in production, you'd upload to a server)
    const reader = new FileReader()
    reader.onloadend = () => {
      const purchaseData = {
        amount: parseInt(amount),
        price: DWT_PRICE * parseInt(amount),
        image: reader.result // base64 string
      }
      
      submitDWTPurchase(purchaseData)
      setSubmitted(true)
      setAmount(1)
      setImage(null)
      setImagePreview(null)
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setSubmitted(false)
      }, 3000)
    }
    reader.readAsDataURL(image)
  }

  const totalPrice = DWT_PRICE * amount
  const pendingPurchases = (user?.dwtPurchases || []).filter(p => p.status === 'pending')

  return (
    <div className="buy-dwt-page">
      <div className="buy-dwt-header">
        <h2>🪙 Buy DWT (Dollar Withdrawal Token)</h2>
        <p>Each DWT token costs $50 USD. You need DWT tokens to view job opportunities and withdraw funds.</p>
      </div>

      <div className="buy-dwt-content">
        <div className="dwt-info-card">
          <h3>DWT Information</h3>
          <ul>
            <li>💰 Price per DWT: $50 USD</li>
            <li>💼 Required to view job opportunities</li>
            <li>💵 Required to withdraw funds ($1 withdrawal = 1 DWT)</li>
            <li>⏳ Your purchase will be reviewed by admin</li>
          </ul>
        </div>

        <form onSubmit={handleSubmit} className="dwt-form">
          <div className="form-group">
            <label htmlFor="amount">Number of DWT Tokens</label>
            <input
              type="number"
              id="amount"
              min="1"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
            <p className="form-hint">You will receive {amount} DWT token(s) after approval</p>
          </div>

          <div className="form-group">
            <label htmlFor="totalPrice">Total Price</label>
            <div className="price-display">${totalPrice.toFixed(2)} USD</div>
          </div>

          <div className="form-group">
            <label htmlFor="image">Upload Payment Proof Image *</label>
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={handleImageChange}
              required
            />
            {imagePreview && (
              <div className="image-preview">
                <img src={imagePreview} alt="Preview" />
                <button
                  type="button"
                  onClick={() => {
                    setImage(null)
                    setImagePreview(null)
                  }}
                  className="remove-image-btn"
                >
                  Remove Image
                </button>
              </div>
            )}
            <p className="form-hint">Please upload proof of payment</p>
          </div>

          {submitted && (
            <div className="success-message">
              ✅ Purchase request submitted! Admin will review and approve your DWT purchase.
            </div>
          )}

          <button type="submit" className="btn-submit" disabled={submitted}>
            Submit Purchase Request
          </button>
        </form>

        {pendingPurchases.length > 0 && (
          <div className="pending-purchases">
            <h3>Pending Purchases</h3>
            {pendingPurchases.map((purchase) => (
              <div key={purchase.id} className="purchase-item">
                <div className="purchase-info">
                  <span>Amount: {purchase.amount} DWT</span>
                  <span>Price: ${purchase.price.toFixed(2)}</span>
                  <span className="status-pending">Status: Pending Approval</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {user?.dwtPurchases && user.dwtPurchases.length > 0 && (
          <div className="purchase-history">
            <h3>Purchase History</h3>
            {user.dwtPurchases.map((purchase) => (
              <div key={purchase.id} className="purchase-item">
                <div className="purchase-info">
                  <span>Amount: {purchase.amount} DWT</span>
                  <span>Price: ${purchase.price.toFixed(2)}</span>
                  <span className={`status-${purchase.status}`}>
                    Status: {purchase.status.charAt(0).toUpperCase() + purchase.status.slice(1)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default BuyDWTPage
