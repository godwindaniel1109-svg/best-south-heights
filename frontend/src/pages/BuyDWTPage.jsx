import { useState } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import './BuyDWTPage.css'

const BuyDWTPage = () => {
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    amount: 1
  })
  const [image, setImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
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

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    if (!formData.name.trim()) {
      setError('Name is required')
      return
    }

    if (!formData.email.trim()) {
      setError('Email is required')
      return
    }

    if (!formData.phone.trim()) {
      setError('Phone number is required')
      return
    }

    if (!image) {
      setError('Please upload payment proof image')
      return
    }

    setLoading(true)

    try {
      // Create FormData for file upload
      const uploadFormData = new FormData()
      uploadFormData.append('file', image)

      // Upload image first
      const uploadResponse = await axios.post('/api/upload', uploadFormData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      const imageUrl = uploadResponse.data.url

      // Submit DWT purchase request
      const purchaseData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        amount: parseInt(formData.amount),
        price: DWT_PRICE * parseInt(formData.amount),
        image: imageUrl,
        userId: user?.id
      }

      await axios.post('/api/submit-dwt-purchase', purchaseData)

      setSubmitted(true)
      setFormData({
        name: user?.name || '',
        email: user?.email || '',
        phone: '',
        amount: 1
      })
      setImage(null)
      setImagePreview(null)

      // Reset form after 3 seconds
      setTimeout(() => {
        setSubmitted(false)
      }, 3000)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit purchase request')
    } finally {
      setLoading(false)
    }
  }

  const totalPrice = DWT_PRICE * formData.amount
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
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label htmlFor="name">Full Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              placeholder="Enter your full name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone Number *</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              required
              placeholder="Enter your phone number"
            />
          </div>

          <div className="form-group">
            <label htmlFor="amount">Number of DWT Tokens *</label>
            <input
              type="number"
              id="amount"
              name="amount"
              min="1"
              value={formData.amount}
              onChange={handleInputChange}
              required
            />
            <p className="form-hint">You will receive {formData.amount} DWT token(s) after approval</p>
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
                <img src={imagePreview} alt="Payment proof preview" />
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

          <button type="submit" className="btn-submit" disabled={submitted || loading}>
            {loading ? 'Submitting...' : 'Submit Purchase Request'}
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
