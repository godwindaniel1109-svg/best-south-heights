import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import './PageContent.css'

const JobsPage = () => {
  const { user, hasApprovedDWT } = useAuth()
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')

  if (!hasApprovedDWT()) {
    return (
      <div className="page-content">
        <div className="access-denied">
          <h2>🔒 Access Restricted</h2>
          <p>You need to purchase and have approved DWT tokens to view job opportunities.</p>
          <button 
            onClick={() => navigate('/dashboard/buy-dwt')}
            className="btn-primary"
          >
            Buy DWT Now
          </button>
        </div>
      </div>
    )
  }

  // Pennsylvania-based job listings
  const jobs = [
    { id: 1, title: 'Software Developer', company: 'Tech Innovators PA', location: 'Philadelphia, PA', salary: '$85,000 - $125,000', description: 'Build scalable applications in Philadelphia tech hub.' },
    { id: 2, title: 'Registered Nurse', company: 'UPMC Health', location: 'Pittsburgh, PA', salary: '$65,000 - $90,000', description: 'Join our healthcare team in Western PA.' },
    { id: 3, title: 'Manufacturing Engineer', company: 'Precision Manufacturing', location: 'Bethlehem, PA', salary: '$70,000 - $105,000', description: 'Design and optimize manufacturing processes.' },
    { id: 4, title: 'Marketing Manager', company: 'Philly Marketing Group', location: 'Philadelphia, PA', salary: '$75,000 - $110,000', description: 'Lead marketing initiatives for growing startup.' },
    { id: 5, title: 'Construction Supervisor', company: 'PA Construction Co', location: 'Pittsburgh, PA', salary: '$80,000 - $120,000', description: 'Oversee construction projects across PA.' },
    { id: 6, title: 'Data Analyst', company: 'Analytics Hub', location: 'Harrisburg, PA', salary: '$68,000 - $98,000', description: 'Drive insights with data in PA capital.' },
    { id: 7, title: 'Sales Representative', company: 'StateWide Sales', location: 'Philadelphia, PA', salary: '$55,000 - $95,000', description: 'B2B sales role covering PA region.' },
    { id: 8, title: 'Electrician', company: 'PA Electrical Services', location: 'Allentown, PA', salary: '$60,000 - $85,000', description: 'Licensed electrician for commercial projects.' },
    { id: 9, title: 'HR Manager', company: 'Pennsylvania Corp', location: 'Pittsburgh, PA', salary: '$72,000 - $105,000', description: 'HR leadership role for growing company.' },
    { id: 10, title: 'Customer Service Lead', company: 'PA Support Services', location: 'Philadelphia, PA', salary: '$50,000 - $75,000', description: 'Lead customer support team in East PA.' },
  ]

  const filtered = jobs.filter(j => 
    j.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    j.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    j.company.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="page-content">
      <div className="page-header">
        <h2>💼 Job Opportunities in Pennsylvania</h2>
        <p>Discover career opportunities across PA</p>
      </div>

      <div className="search-bar">
        <input 
          type="text"
          placeholder="Search by title, location, or company..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="jobs-list">
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: '#666' }}>
            <p>No jobs match your search. Try different keywords.</p>
          </div>
        ) : (
          filtered.map((job) => (
            <div key={job.id} className="job-card">
              <div className="job-header">
                <h3>{job.title}</h3>
                <span className="job-company">{job.company}</span>
              </div>
              <div className="job-details">
                <span className="job-location">📍 {job.location}</span>
                <span className="job-salary">💰 {job.salary}</span>
              </div>
              <p className="job-description">{job.description}</p>
              <button className="btn-apply">Apply Now</button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default JobsPage
