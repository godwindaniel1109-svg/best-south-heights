import './PageContent.css'

const FreeMoneyPage = () => {
  // Sample free money opportunities - in production, this would come from an API
  const opportunities = [
    {
      id: 1,
      title: 'Government Grant Program',
      amount: '$500 - $2,000',
      deadline: '2024-03-01',
      description: 'Apply for government grants available to eligible residents...',
      category: 'Grant'
    },
    {
      id: 2,
      title: 'Scholarship Opportunity',
      amount: '$1,000 - $5,000',
      deadline: '2024-02-28',
      description: 'Educational scholarship for students pursuing higher education...',
      category: 'Scholarship'
    },
    {
      id: 3,
      title: 'Community Support Fund',
      amount: '$200 - $1,000',
      deadline: '2024-03-15',
      description: 'Community support fund for families in need...',
      category: 'Support Fund'
    }
  ]

  return (
    <div className="page-content">
      <div className="page-header">
        <h2>💰 Free Money Opportunities</h2>
        <p>Discover grants, scholarships, and free money opportunities</p>
      </div>

      <div className="opportunities-list">
        {opportunities.map((opp) => (
          <div key={opp.id} className="opportunity-card">
            <div className="opportunity-header">
              <h3>{opp.title}</h3>
              <span className="opportunity-category">{opp.category}</span>
            </div>
            <div className="opportunity-details">
              <span className="opportunity-amount">💰 {opp.amount}</span>
              <span className="opportunity-deadline">📅 Deadline: {opp.deadline}</span>
            </div>
            <p className="opportunity-description">{opp.description}</p>
            <button className="btn-apply">Apply Now</button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default FreeMoneyPage
