import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import './AdminDashboard.css'
import { applicationsApi, authApi, jobsApi } from '../../utils/api'
import { clearAuthData, getStoredUser } from '../../utils/auth'

const initialJobForm = {
  title: '',
  company: '',
  location: '',
  description: '',
  type: 'Full-Time',
  status: 'Open'
}

const getStatusLabel = (status) => {
  if (status === 'Approved') return 'Accepted'
  if (status === 'Rejected') return 'Rejected'
  return 'Pending'
}

const AdminDashboard = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('stats')
  const [jobs, setJobs] = useState([])
  const [applications, setApplications] = useState([])
  const [users, setUsers] = useState([])
  const [newJob, setNewJob] = useState(initialJobForm)
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [formError, setFormError] = useState('')
  const [saving, setSaving] = useState(false)
  const [updatingId, setUpdatingId] = useState('')
  const [userActionId, setUserActionId] = useState('')
  const currentUser = getStoredUser()

  const loadAdminData = async () => {
    try {
      setLoading(true)
      setError('')
      setSuccess('')
      const [jobsData, applicationsData, usersData] = await Promise.all([
        jobsApi.getJobs(),
        applicationsApi.getAll(),
        authApi.getUsers()
      ])
      setJobs(jobsData)
      setApplications(applicationsData)
      setUsers(usersData)
    } catch (loadError) {
      setError(loadError.message)
      toast.error(loadError.message || 'Failed to load admin data.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAdminData()
  }, [])

  const logout = () => {
    clearAuthData()
    navigate('/admin')
  }

  const addJob = async () => {
    if (!newJob.title.trim() || !newJob.company.trim() || !newJob.location.trim()) {
      const message = 'Title, company, and location are required.'
      setFormError(message)
      toast.error(message)
      return
    }

    try {
      setSaving(true)
      setFormError('')
      await jobsApi.createJob(newJob)
      setNewJob(initialJobForm)
      setShowForm(false)
      toast.success('Job added successfully!')
      await loadAdminData()
    } catch (saveError) {
      setFormError(saveError.message)
      toast.error(saveError.message || 'Failed to add job.')
    } finally {
      setSaving(false)
    }
  }

  const deleteJob = async (id) => {
    try {
      setError('')
      setSuccess('')
      await jobsApi.deleteJob(id)
      setJobs((currentJobs) => currentJobs.filter((job) => job._id !== id))
      setApplications((currentApplications) =>
        currentApplications.filter((application) => application.job?._id !== id)
      )
      setSuccess('Job deleted successfully.')
      toast.success('Job deleted successfully!')
    } catch (deleteError) {
      setError(deleteError.message)
      toast.error(deleteError.message || 'Failed to delete job.')
    }
  }

  const updateStatus = async (id, status) => {
    try {
      setError('')
      setSuccess('')
      setUpdatingId(id)

      setApplications((currentApplications) =>
        currentApplications.map((application) =>
          application._id === id ? { ...application, status } : application
        )
      )

      await applicationsApi.updateStatus(id, status)

      setSuccess(`Application ${status.toLowerCase()} successfully.`)
      toast.success(`Application ${status.toLowerCase()} successfully.`)
      await loadAdminData()
    } catch (updateError) {
      await loadAdminData()
      setError(updateError.message)
      toast.error(updateError.message || 'Failed to update application.')
    } finally {
      setUpdatingId('')
    }
  }

  const approvedCount = applications.filter((application) => application.status === 'Approved').length
  const pendingCount = applications.filter((application) => application.status === 'Pending').length

  const updateUserRole = async (id, role) => {
    try {
      setUserActionId(id)
      setError('')
      setSuccess('')
      const updatedUser = await authApi.updateUserRole(id, role)
      setUsers((currentUsers) =>
        currentUsers.map((user) => (user._id === id ? updatedUser : user))
      )
      setSuccess('User role updated successfully.')
      toast.success('User role updated successfully!')
    } catch (updateError) {
      setError(updateError.message)
      toast.error(updateError.message || 'Failed to update user role.')
    } finally {
      setUserActionId('')
    }
  }

  const deleteUser = async (id) => {
    try {
      setUserActionId(id)
      setError('')
      setSuccess('')
      await authApi.deleteUser(id)
      setUsers((currentUsers) => currentUsers.filter((user) => user._id !== id))
      setSuccess('User deleted successfully.')
      toast.success('User deleted successfully!')
    } catch (deleteError) {
      setError(deleteError.message)
      toast.error(deleteError.message || 'Failed to delete user.')
    } finally {
      setUserActionId('')
    }
  }

  return (
    <div className="admin-wrapper">
      <nav className="admin-nav">
        <h2>Admin Panel</h2>
        <button onClick={logout}>Logout</button>
      </nav>

      <div className="admin-body">
        <aside className="admin-sidebar">
          <div onClick={() => setActiveTab('stats')}>Dashboard</div>
          <div onClick={() => setActiveTab('users')}>Users</div>
          <div onClick={() => setActiveTab('jobs')}>Jobs</div>
          <div onClick={() => setActiveTab('apps')}>Applications</div>
        </aside>

        <main className="admin-main">
          {loading && <p>Loading admin data...</p>}
          {!loading && error && <p>{error}</p>}
          {!loading && !error && success && <p>{success}</p>}

          {!loading && !error && activeTab === 'stats' && (
            <div>
              <h2>Dashboard</h2>

              <div className="cards">
                <div className="card blue">
                  <h3>{jobs.length}</h3>
                  <p>Total Jobs</p>
                </div>

                <div className="card green">
                  <h3>{applications.length}</h3>
                  <p>Total Applications</p>
                </div>

                <div className="card orange">
                  <h3>{pendingCount}</h3>
                  <p>Pending Reviews</p>
                </div>

                <div className="card blue">
                  <h3>{approvedCount}</h3>
                  <p>Approved Candidates</p>
                </div>

                <div className="card green">
                  <h3>{users.length}</h3>
                  <p>Total Users</p>
                </div>
              </div>
            </div>
          )}

          {!loading && !error && activeTab === 'users' && (
            <div>
              <h2>Manage Users</h2>

              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Joined</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id}>
                      <td>{user.name || user.username || 'User'}</td>
                      <td>{user.email}</td>
                      <td>
                        <select
                          className="admin-select"
                          value={user.role}
                          disabled={userActionId === user._id}
                          onChange={(event) => updateUserRole(user._id, event.target.value)}
                        >
                          <option value="candidate">candidate</option>
                          <option value="recruiter">recruiter</option>
                          <option value="admin">admin</option>
                        </select>
                      </td>
                      <td>
                        {user.createdAt
                          ? new Date(user.createdAt).toLocaleDateString('en-IN', {
                              month: 'short', day: 'numeric', year: 'numeric'
                            })
                          : 'N/A'}
                      </td>
                      <td>
                        <button
                          className="button-delete"
                          disabled={userActionId === user._id || currentUser?._id === user._id}
                          onClick={() => deleteUser(user._id)}
                        >
                          {currentUser?._id === user._id
                            ? 'Current Admin'
                            : userActionId === user._id
                              ? 'Working...'
                              : 'Delete'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {!loading && !error && activeTab === 'jobs' && (
            <div>
              <h2>Jobs</h2>

              <button
                className="button-add"
                onClick={() => setShowForm(!showForm)}
              >
                {showForm ? 'Cancel' : 'Add Job'}
              </button>

              {showForm && (
                <div>
                  {formError && <p>{formError}</p>}
                  <input
                    placeholder="Title"
                    value={newJob.title}
                    onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                  />
                  <input
                    placeholder="Company"
                    value={newJob.company}
                    onChange={(e) => setNewJob({ ...newJob, company: e.target.value })}
                  />
                  <input
                    placeholder="Location"
                    value={newJob.location}
                    onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
                  />
                  <textarea
                    placeholder="Description"
                    value={newJob.description}
                    onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
                  />
                  <select
                    value={newJob.type}
                    onChange={(e) => setNewJob({ ...newJob, type: e.target.value })}
                  >
                    <option value="Full-Time">Full-Time</option>
                    <option value="Part-Time">Part-Time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                  </select>
                  <select
                    value={newJob.status}
                    onChange={(e) => setNewJob({ ...newJob, status: e.target.value })}
                  >
                    <option value="Open">Open</option>
                    <option value="Pending">Pending</option>
                    <option value="Closed">Closed</option>
                  </select>
                  <button
                    className="button-save"
                    onClick={addJob}
                    disabled={saving}
                  >
                    {saving ? 'Saving...' : 'Save'}
                  </button>
                </div>
              )}

              <table>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Company</th>
                    <th>Status</th>
                    <th>Applied</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.map((job) => (
                    <tr key={job._id}>
                      <td>{job.title}</td>
                      <td>{job.company}</td>
                      <td>{job.status}</td>
                      <td>{job.applicationsCount || 0}</td>
                      <td>
                        <button
                          className="button-delete"
                          onClick={() => deleteJob(job._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {!loading && !error && activeTab === 'apps' && (
            <div>
              <h2>Applications</h2>

              <table>
                <thead>
                  <tr>
                    <th>Candidate</th>
                    <th>Email</th>
                    <th>Job</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((application) => (
                    <tr key={application._id}>
                      <td>{application.candidate?.name || 'Candidate'}</td>
                      <td>{application.candidate?.email || 'N/A'}</td>
                      <td>{application.job?.title || 'Job'}</td>
                      <td>{getStatusLabel(application.status)}</td>
                      <td>
                        <button
                          className="button-approve"
                          onClick={() => updateStatus(application._id, 'Approved')}
                          disabled={updatingId === application._id || application.status === 'Approved'}
                        >
                          {updatingId === application._id
                            ? 'Updating...'
                            : application.status === 'Approved'
                              ? 'Accepted'
                              : 'Accept'}
                        </button>
                        <button
                          className="button-reject"
                          onClick={() => updateStatus(application._id, 'Rejected')}
                          disabled={updatingId === application._id || application.status === 'Rejected'}
                        >
                          {updatingId === application._id
                            ? 'Updating...'
                            : application.status === 'Rejected'
                              ? 'Rejected'
                              : 'Reject'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default AdminDashboard
