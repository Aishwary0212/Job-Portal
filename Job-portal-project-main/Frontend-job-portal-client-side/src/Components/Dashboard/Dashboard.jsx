import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './Dashboard.css'
import { authApi, jobsApi } from '../../utils/api'
import { clearAuthData, getStoredUser, setAuthData } from '../../utils/auth'
import { getApplicationsForRecruiter, getApplicationsForUser } from '../../utils/applications'
import AppNavbar from '../../components/AppNavbar'

const Dashboard = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('profile')
  const [sidebarOpen] = useState(true)
  const [user, setUser] = useState(() => getStoredUser() || {})
  const [postedJobs, setPostedJobs] = useState([])

  useEffect(() => {
    const syncProfile = async () => {
      try {
        const data = await authApi.getMe()
        setAuthData({
          user: {
            _id: data._id,
            username: data.username || data.name,
            name: data.name,
            email: data.email,
            role: data.role,
            location: data.location,
            resumeLink: data.resumeLink,
            gender: data.gender,
            createdAt: data.createdAt
          }
        })
        setUser({
          _id: data._id,
          username: data.username || data.name,
          name: data.name,
          email: data.email,
          role: data.role,
          location: data.location,
          resumeLink: data.resumeLink,
          gender: data.gender,
          createdAt: data.createdAt
        })
      } catch {
        clearAuthData()
        navigate('/login')
      }
    }

    syncProfile()
  }, [navigate])

  useEffect(() => {
    const loadRecruiterJobs = async () => {
      if (user.role !== 'recruiter' || !user._id) {
        setPostedJobs([])
        return
      }

      try {
        const jobs = await jobsApi.getJobs()
        setPostedJobs(jobs.filter((job) => job.createdBy?._id === user._id))
      } catch {
        setPostedJobs([])
      }
    }

    loadRecruiterJobs()
  }, [user._id, user.role])

  return (
    <div className="dash-wrapper">
      <AppNavbar />

      <div className="dash-body">

        {sidebarOpen && (
          <aside className="sidebar">
            <div className="sidebar-user">
              <img src="/logo4.png" alt="avatar"
                style={{ width: '60px', height: '60px', borderRadius: '50%' }} />
              <div className="sidebar-username">{user.username || 'User'}</div>
              <div className="sidebar-role">{user.role || 'candidate'}</div>
            </div>
            <div className="sidebar-menu">
              <div
                className={`sidebar-item ${activeTab === 'profile' ? 'active' : ''}`}
                onClick={() => setActiveTab('profile')}
              >
               - <span className="sidebar-icon">👤</span> Profile
              </div>
              <div
                className={`sidebar-item ${activeTab === 'applications' ? 'active' : ''}`}
                onClick={() => setActiveTab('applications')}
              >
                <span className="sidebar-icon">💼</span> Applications
              </div>
              <div
                className="sidebar-item"
                onClick={() => navigate('/jobs')}
              >
                <span className="sidebar-icon">📄</span> Jobs
              </div>
              {user.role === 'recruiter' && (
                <div
                  className="sidebar-item"
                  onClick={() => navigate('/jobs/create')}
                >
                  <span className="sidebar-icon">➕</span> Create Job
                </div>
              )}
            </div>
          </aside>
        )}

        <main className="dash-main">

          {activeTab === 'profile' && (
            <div className="profile-card">
              <h2 className="profile-title">Informations</h2>
              <div className="profile-content">

                <div className="profile-avatar-section">
                  <div className="profile-avatar-box">
                    <img src="/logo4.png" alt="avatar"
                      style={{ width: '120px', height: '120px', borderRadius: '8px' }} />
                  </div>
                  <button className="edit-btn" onClick={() => navigate('/edit-profile')}>
                     Edit
                  </button>
                </div>

                <div className="profile-info">
                  <div className="info-row">
                    <span className="info-label">Username :</span>
                    <span className="info-value">{user.username || 'N/A'}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Role :</span>
                    <span className="info-value">{user.role || 'candidate'}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Email :</span>
                    <span className="info-value">{user.email || 'N/A'}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Join :</span>
                    <span className="info-value">
                      {user.createdAt
                        ? new Date(user.createdAt).toLocaleDateString('en-IN', {
                            month: 'short', day: 'numeric', year: 'numeric'
                          })
                        : 'N/A'}
                    </span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Location :</span>
                    <span className="info-value">{user.location || 'Not Available'}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Gender :</span>
                    <span className="info-value">{user.gender || 'Not Available'}</span>
                  </div>
                </div>

              </div>
            </div>
          )}
          {activeTab === 'applications' && (
            <div className="profile-card">
              <h2 className="profile-title">
                {user.role === 'recruiter' ? 'Job Applicants' : 'My Applications'}
              </h2>
              {(() => {
                if (user.role === 'recruiter') {
                  const jobApplications = getApplicationsForRecruiter(user._id, postedJobs)
                    .map((application) => ({
                      ...application,
                      postedJobTitle:
                        postedJobs.find((job) => String(job._id) === String(application.jobId))?.title ||
                        application.jobTitle
                    }))

                  if (jobApplications.length === 0) {
                    return (
                      <div className="empty-state">
                        <div className="empty-icon">📋</div>
                        <p>No one has applied to your jobs yet.</p>
                      </div>
                    )
                  }

                  return (
                    <div className="profile-info">
                      {jobApplications.map((application) => (
                        <div key={application.id} className="info-row">
                          <span className="info-label">{application.userName} :</span>
                          <span className="info-value">
                            {application.postedJobTitle} ({application.status})
                          </span>
                        </div>
                      ))}
                    </div>
                  )
                }

                const applications = getApplicationsForUser(user._id)

                if (applications.length === 0) {
                  return (
                    <div className="empty-state">
                      <div className="empty-icon">📋</div>
                      <p>No applications yet.</p>
                    </div>
                  )
                }

                return (
                  <div className="profile-info">
                    {applications.map((application) => (
                      <div key={application.id} className="info-row">
                        <span className="info-label">{application.jobTitle} :</span>
                        <span className="info-value">{application.status}</span>
                      </div>
                    ))}
                  </div>
                )
              })()}
            </div>
          )}

        </main>
      </div>
    </div>
  )
}
export default Dashboard
