import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import './Dashboard.css'
import { applicationsApi, authApi } from '../../utils/api'
import { clearAuthData, getStoredUser, setAuthData } from '../../utils/auth'
import AppNavbar from '../../components/AppNavbar'

const Dashboard = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('profile')
  const [sidebarOpen] = useState(true)
  const [user, setUser] = useState(() => getStoredUser() || {})
  const [applications, setApplications] = useState([])
  const [applicationError, setApplicationError] = useState('')
  const [updatingId, setUpdatingId] = useState('')

  useEffect(() => {
    const syncProfile = async () => {
      try {
        const data = await authApi.getMe()
        setAuthData({
          token: localStorage.getItem('token') || undefined,
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
    const loadApplications = async () => {
      if (!user._id || user.role === 'admin') {
        setApplications([])
        setApplicationError('')
        return
      }

      try {
        setApplicationError('')

        if (user.role === 'recruiter') {
          const recruiterApplications = await applicationsApi.getMine()
          setApplications(recruiterApplications)
          return
        }

        const data = await applicationsApi.getMine()
        setApplications(data)
      } catch {
        setApplications([])
        setApplicationError(
          user.role === 'recruiter'
            ? 'Unable to load applicants right now.'
            : 'Unable to load applications right now.'
        )
      }
    }

    loadApplications()
  }, [user._id, user.role])

  const updateApplicationStatus = async (applicationId, status) => {
    try {
      setUpdatingId(applicationId)
      setApplicationError('')
      await applicationsApi.updateStatus(applicationId, status)
      setApplications((currentApplications) =>
        currentApplications.map((application) =>
          application._id === applicationId ? { ...application, status } : application
        )
      )
      toast.success(`Candidate ${status === 'Approved' ? 'accepted' : 'rejected'} successfully.`)
    } catch (error) {
      const message = error.message || 'Failed to update candidate status.'
      setApplicationError(message)
      toast.error(message)
    } finally {
      setUpdatingId('')
    }
  }

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
                <span className="sidebar-icon">💼</span> {user.role === 'recruiter' ? 'Applicants' : 'Applications'}
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
              {applicationError && <p className="dashboard-message error">{applicationError}</p>}
              {(() => {
                if (user.role === 'recruiter') {
                  if (applications.length === 0) {
                    return (
                      <div className="empty-state">
                        <div className="empty-icon">📋</div>
                        <p>No one has applied to your jobs yet.</p>
                      </div>
                    )
                  }

                  return (
                    <div className="applications-list">
                      {applications.map((application) => (
                        <div key={application._id} className="application-card">
                          <div className="application-copy">
                            <p className="application-title">{application.candidate?.name || 'Candidate'}</p>
                            <p className="application-meta">{application.candidate?.email || 'No email available'}</p>
                            <p className="application-meta">Applied for: {application.job?.title || 'Job'}</p>
                            <p className="application-status">Status: {application.status || 'Pending'}</p>
                          </div>
                          <div className="application-actions">
                            <button
                              className="status-btn approve"
                              type="button"
                              disabled={updatingId === application._id || application.status === 'Approved'}
                              onClick={() => updateApplicationStatus(application._id, 'Approved')}
                            >
                              {updatingId === application._id && application.status !== 'Approved' ? 'Updating...' : 'Accept'}
                            </button>
                            <button
                              className="status-btn reject"
                              type="button"
                              disabled={updatingId === application._id || application.status === 'Rejected'}
                              onClick={() => updateApplicationStatus(application._id, 'Rejected')}
                            >
                              {updatingId === application._id && application.status !== 'Rejected' ? 'Updating...' : 'Reject'}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )
                }

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
                      <div key={application._id} className="info-row">
                        <span className="info-label">{application.job?.title || 'Job'} :</span>
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
