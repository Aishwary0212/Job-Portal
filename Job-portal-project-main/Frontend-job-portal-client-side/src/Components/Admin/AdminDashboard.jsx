import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './AdminDashboard.css'

const AdminDashboard = () => {
  const navigate = useNavigate()

  const [activeTab, setActiveTab] = useState('stats')

  const [users, setUsers] = useState([
    { id: 1, name: 'Bhavya', email: 'bhavya@gmail.com', role: 'User' },
    { id: 2, name: 'Rahul', email: 'rahul@gmail.com', role: 'User' },
    { id: 3, name: 'Priya', email: 'priya@gmail.com', role: 'Recruiter' }
  ])

  const [jobs, setJobs] = useState([
    { id: 1, title: 'React Developer', company: 'TechCorp', status: 'Open' },
    { id: 2, title: 'Backend Dev', company: 'CloudBase', status: 'Closed' }
  ])

  const [apps, setApps] = useState([
    { id: 1, user: 'Bhavya', job: 'React Developer', status: 'Pending' }
  ])

  const [newJob, setNewJob] = useState({ title: '', company: '' })
  const [showForm, setShowForm] = useState(false)

  const logout = () => {
    localStorage.removeItem('admin')
    navigate('/admin')
  }

  const addJob = () => {
    if (!newJob.title || !newJob.company) return
    setJobs([...jobs, { ...newJob, id: Date.now(), status: 'Open' }])
    setNewJob({ title: '', company: '' })
    setShowForm(false)
  }

  const deleteUser = (id) => setUsers(users.filter(u => u.id !== id))
  const deleteJob = (id) => setJobs(jobs.filter(j => j.id !== id))

  const updateStatus = (id, status) => {
    setApps(apps.map(a => a.id === id ? { ...a, status } : a))
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

          {activeTab === 'stats' && (
            <div>
              <h2>Dashboard</h2>

              <div className="cards">
                <div className="card blue">
                  <h3>{users.length}</h3>
                  <p>Users</p>
                </div>

                <div className="card green">
                  <h3>{jobs.length}</h3>
                  <p>Jobs</p>
                </div>

                <div className="card orange">
                  <h3>{apps.length}</h3>
                  <p>Applications</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div>
              <h2>Users</h2>
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id}>
                      <td>{u.name}</td>
                      <td>{u.email}</td>
                      <td>{u.role}</td>
                      <td>
                        <button 
                        className='button-delete'
                        onClick={() => deleteUser(u.id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'jobs' && (
            <div>
              <h2>Jobs</h2>

              <button 
              className='button-add'
              onClick={() => setShowForm(!showForm)}>
                Add Job
              </button>

              {showForm && (
                <div>
                  <input
                    placeholder="Title"
                    value={newJob.title}
                    onChange={e => setNewJob({ ...newJob, title: e.target.value })}
                  />
                  <input
                    placeholder="Company"
                    value={newJob.company}
                    onChange={e => setNewJob({ ...newJob, company: e.target.value })}
                  />
                  <button 
                  className='button-save'
                  onClick={addJob}>Save</button>
                </div>
              )}

              <table>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Company</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.map(j => (
                    <tr key={j.id}>
                      <td>{j.title}</td>
                      <td>{j.company}</td>
                      <td>{j.status}</td>
                      <td>
                        <button 
                        className='button-delete'
                        onClick={() => deleteJob(j.id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'apps' && (
            <div>
              <h2>Applications</h2>

              <table>
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Job</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {apps.map(a => (
                    <tr key={a.id}>
                      <td>{a.user}</td>
                      <td>{a.job}</td>
                      <td>{a.status}</td>
                      <td>
                        <button  
                        className='button-approve'
                        onClick={() => updateStatus(a.id, 'Approved')}>
                          Approve
                        </button>
                        <button 
                        className='button-reject'
                        onClick={() => updateStatus(a.id, 'Rejected')}>
                          Reject
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