import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import './LandingPage.css'

const LandingPage = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const heroImages = [
    '/images/Landing 1.jpg',
    '/images/Landing 2.jpg',
    '/images/Landing 3.jpg',
    '/images/Landing 4.jpg',
    '/images/LandS 1.jpg'
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length)
    }, 4000) // Change image every 4 seconds
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="landing-page">
      <div className="landing-navbar">
        <div className="navbar-logo">
          <img src="/logo.svg" alt="Pennysavia USA Logo" className="logo-icon" />
          <span className="logo-text">Pennysavia USA</span>
        </div>
        <div className="navbar-links">
          <Link to="/login" className="nav-link">Sign In</Link>
          <Link to="/register" className="nav-cta">Join Now</Link>
        </div>
      </div>
      <div className="landing-container">
        <div className="landing-hero">
          <div className="hero-text">
            <h1 className="landing-title">Pennysavia USA</h1>
            <p className="landing-subtitle">Build Your Future. Connect. Earn. Grow.</p>
            <p className="landing-description">
              Join thousands of Pennsylvanians building real connections and discovering incredible opportunities. Start with $10,000 in virtual funds and unlock unlimited potential in your community.
            </p>
            <div className="landing-actions">
              <Link to="/register" className="btn btn-primary">Join Now - Free</Link>
              <Link to="/login" className="btn btn-secondary">Sign In</Link>
            </div>
            <p className="landing-trust">✓ 100% Free • ✓ Community Driven • ✓ Your Future Starts Today</p>
          </div>

          <div className="hero-images">
            {heroImages.map((img, idx) => (
              <img 
                key={idx}
                src={img} 
                alt={`hero${idx + 1}`} 
                className={`hero-image ${idx === currentImageIndex ? 'active' : ''}`}
              />
            ))}
          </div>
        </div>

        <div className="landing-content">
          <div className="features">
            <div className="feature-card">
              <div className="feature-icon">👥</div>
              <h2>Meetups & Networking</h2>
              <p>Connect with passionate professionals and neighbors at exclusive meetups across Pennsylvania. Build lasting relationships that matter.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💼</div>
              <h2>Real Job Opportunities</h2>
              <p>Access hundreds of verified job listings tailored to your skills. From entry-level to executive roles across PA.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💰</div>
              <h2>Virtual Wallet</h2>
              <p>Start with $10,000 in virtual funds. Earn more through engagement and prepare for real-world financial success.</p>
            </div>
          </div>
        </div>

        <div className="cofounder-section">
          <h2>Meet Our Co-Founder</h2>
          <div className="cofounder-card">
            <img src="/images/Elon.jpg" alt="Elon - Co-Founder" className="cofounder-image" />
            <div className="cofounder-info">
              <h3>Elon</h3>
              <p className="cofounder-title">Co-Founder & Vision Lead</p>
              <p className="cofounder-bio">
                Elon is the visionary behind Pennysavia USA, dedicated to empowering communities across Pennsylvania. With a passion for connecting people and creating opportunities, Elon founded Pennysavia to bridge the gap between talent, jobs, and community engagement. His mission: to make every Pennsylvanian feel seen, supported, and equipped for success.
              </p>
              <p className="cofounder-quote">"Community is everything. Together, we rise."</p>
            </div>
          </div>
        </div>

        <div className="landing-stats">
          <div className="stat">
            <span className="stat-number">1000+</span>
            <span className="stat-label">Active Members</span>
          </div>
          <div className="stat">
            <span className="stat-number">500+</span>
            <span className="stat-label">Job Listings</span>
          </div>
          <div className="stat">
            <span className="stat-number">50+</span>
            <span className="stat-label">Community Events</span>
          </div>
        </div>

        <footer className="landing-footer">
          <p>&copy; 2026 Pennysavia USA. Building Pennsylvania's Future Together.</p>
        </footer>
      </div>
    </div>
  )
}

export default LandingPage
