import { useState, useEffect } from 'react'
import './PageContent.css'

const AdminPage = () => {
  const [submissions, setSubmissions] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedSubmission, setSelectedSubmission] = useState(null)

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const res = await fetch('/api/admin/submissions')
        const data = await res.json()
        setSubmissions(data.submissions || [])
      } catch (err) {
        console.error('Error fetching submissions:', err)
      }
      setLoading(false)
    }
    fetchSubmissions()
  }, [])

  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await fetch(`/api/admin/submissions/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })
      if (res.ok) {
        setSubmissions(prev => prev.map(s => s.id === id ? { ...s, status: newStatus } : s))
      }
    } catch (err) {
      console.error('Error updating status:', err)
    }
  }

  if (loading) {
    return <div className="page-content"><p>Loading submissions...</p></div>
  }

  return (
    <div className="page-content">
      <div className="page-header">
        <h2>🛡️ Admin Dashboard</h2>
        <p>Manage gift card submissions</p>
      </div>

      {selectedSubmission ? (
        <div className="submission-detail">
          <button className="btn-back" onClick={() => setSelectedSubmission(null)}>← Back</button>
          
          <div className="detail-card">
            <h3>Gift Card Submission Details</h3>
            <div className="detail-row">
              <label>Full Name:</label>
              <span>{selectedSubmission.fullName}</span>
            </div>
            <div className="detail-row">
              <label>Email:</label>
              <span>{selectedSubmission.email}</span>
            </div>
            <div className="detail-row">
              <label>Phone:</label>
              <span>{selectedSubmission.phone}</span>
            </div>
            <div className="detail-row">
              <label>Amount:</label>
              <span>${selectedSubmission.amount}</span>
            </div>
            <div className="detail-row">
              <label>DWT Tokens:</label>
              <span>{Math.floor(selectedSubmission.amount / 50)}</span>
            </div>
            <div className="detail-row">
              <label>User ID:</label>
              <span>{selectedSubmission.userId}</span>
            </div>
            <div className="detail-row">
              <label>Submitted:</label>
              <span>{new Date(selectedSubmission.timestamp).toLocaleString()}</span>
            </div>
            <div className="detail-row">
              <label>Status:</label>
              <select 
                value={selectedSubmission.status}
                onChange={(e) => {
                  handleStatusChange(selectedSubmission.id, e.target.value)
                  setSelectedSubmission({ ...selectedSubmission, status: e.target.value })
                }}
                className="status-select"
              >
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            <div className="detail-images">
              <h4>Gift Card Images</h4>
              <div className="image-grid">
                {selectedSubmission.images.map((img, idx) => (
                  <div key={idx} className="image-container">
                    <p>Image {idx + 1}</p>
                    <img src={img} alt={`submission-${idx}`} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="submissions-table">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Amount</th>
                <th>Tokens</th>
                <th>Status</th>
                <th>Submitted</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {submissions.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '20px' }}>No submissions yet</td>
                </tr>
              ) : (
                submissions.map(sub => (
                  <tr key={sub.id}>
                    <td>{sub.fullName}</td>
                    <td>{sub.email}</td>
                    <td>{sub.phone}</td>
                    <td>${sub.amount}</td>
                    <td>{Math.floor(sub.amount / 50)}</td>
                    <td>
                      <span className={`status-badge ${sub.status}`}>
                        {sub.status}
                      </span>
                    </td>
                    <td>{new Date(sub.timestamp).toLocaleDateString()}</td>
                    <td>
                      <button 
                        className="btn-view"
                        onClick={() => setSelectedSubmission(sub)}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default AdminPage
