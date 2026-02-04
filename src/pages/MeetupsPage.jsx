import { useState } from 'react'
import './PageContent.css'

const MeetupsPage = () => {
  const [filter, setFilter] = useState('all')
  
  // Pennsylvania meetup locations with multiple cities
  const meetups = [
    { id: 1, title: 'Tech Meetup - Philadelphia', city: 'Philadelphia', date: '2026-02-15', time: '6:00 PM', location: '123 Market St, Philadelphia, PA', attendees: 45, description: 'Weekly tech professionals networking event.' },
    { id: 2, title: 'Entrepreneur Network - Pittsburgh', city: 'Pittsburgh', date: '2026-02-18', time: '7:00 PM', location: 'Tech Hub, Pittsburgh, PA', attendees: 32, description: 'Connect with startup founders and investors.' },
    { id: 3, title: 'Professional Development - Harrisburg', city: 'Harrisburg', date: '2026-02-20', time: '5:30 PM', location: 'Capitol Center, Harrisburg, PA', attendees: 28, description: 'Skill-building workshop for professionals.' },
    { id: 4, title: 'Business Breakfast - Philadelphia', city: 'Philadelphia', date: '2026-02-22', time: '8:00 AM', location: 'Downtown Cafe, Philadelphia, PA', attendees: 35, description: 'Morning networking with local business leaders.' },
    { id: 5, title: 'Community Meetup - Allentown', city: 'Allentown', date: '2026-02-25', time: '6:30 PM', location: 'Community Center, Allentown, PA', attendees: 50, description: 'Social gathering for Allentown residents.' },
    { id: 6, title: 'Students & Young Professionals - Pittsburgh', city: 'Pittsburgh', date: '2026-02-28', time: '5:00 PM', location: 'University Auditorium, Pittsburgh, PA', attendees: 60, description: 'Mentorship and career guidance for new professionals.' },
    { id: 7, title: 'Executive Roundtable - Philadelphia', city: 'Philadelphia', date: '2026-03-01', time: '12:00 PM', location: '500 Walnut St, Philadelphia, PA', attendees: 22, description: 'C-level executive networking lunch.' },
    { id: 8, title: 'Arts & Culture Event - Harrisburg', city: 'Harrisburg', date: '2026-03-05', time: '7:00 PM', location: 'State Museum, Harrisburg, PA', attendees: 55, description: 'Local artists and cultural enthusiasts gathering.' },
    { id: 9, title: 'South Heights Community Gathering', city: 'South Heights', date: '2026-03-08', time: '6:00 PM', location: '456 Heights Ave, South Heights, PA', attendees: 48, description: 'Neighborhood networking and community building event for South Heights residents.' },
    { id: 10, title: 'Magic Motors Automotive Meetup', city: 'Magic Motors', date: '2026-03-12', time: '5:30 PM', location: 'Magic Motors Hub, Magic Motors, PA', attendees: 72, description: 'Car enthusiasts and automotive professionals sharing knowledge and networking.' },
  ]

  const cities = ['all', 'Philadelphia', 'Pittsburgh', 'Harrisburg', 'Allentown', 'South Heights', 'Magic Motors']
  const filtered = filter === 'all' ? meetups : meetups.filter(m => m.city === filter)

  return (
    <div className="page-content">
      <div className="page-header">
        <h2>👥 Meetups in Pennsylvania</h2>
        <p>Connect with people in your area</p>
      </div>

      <div className="filter-bar">
        {cities.map(city => (
          <button
            key={city}
            className={`filter-btn ${filter === city ? 'active' : ''}`}
            onClick={() => setFilter(city)}
          >
            {city === 'all' ? 'All Cities' : city}
          </button>
        ))}
      </div>

      <div className="meetups-list">
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: '#666' }}>
            <p>No meetups found in {filter}. Check back soon!</p>
          </div>
        ) : (
          filtered.map((meetup) => (
            <div key={meetup.id} className="meetup-card">
              <div className="meetup-header">
                <h3>{meetup.title}</h3>
                <span className="meetup-city">{meetup.city}</span>
              </div>
              <div className="meetup-details">
                <span>📅 {meetup.date}</span>
                <span>🕐 {meetup.time}</span>
              </div>
              <span className="meetup-location">📍 {meetup.location}</span>
              <p className="meetup-description">{meetup.description}</p>
              <div className="meetup-footer">
                <span className="attendees">👥 {meetup.attendees} attendees</span>
                <button className="btn-apply">Join Meetup</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default MeetupsPage
