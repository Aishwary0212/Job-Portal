import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Jobs.css'
import { jobsApi } from '../utils/api'
import { getStoredUser } from '../utils/auth'
import { hasAppliedToJob } from '../utils/applications'
import AppNavbar from '../components/AppNavbar'

const Jobs = () => {
  const navigate = useNavigate()
  const [search,       setSearch]       = useState('')
  const [typeFilter,   setTypeFilter]   = useState('Default')
  const [statusFilter, setStatusFilter] = useState('Default')
  const [sortBy,       setSortBy]       = useState('Default')
  const [jobs,         setJobs]         = useState([])
  const [loading,      setLoading]      = useState(true)
  const [error,        setError]        = useState('')
  const [user] = useState(() => getStoredUser())

  useEffect(() => {
    const loadJobs = async () => {
      try {
        setLoading(true)
        const data = await jobsApi.getJobs()
        setJobs(data)
      } catch (loadError) {
        setError(loadError.message)
      } finally {
        setLoading(false)
      }
    }

    loadJobs()
  }, [])

  const filtered = jobs.filter(j =>
    j.title.toLowerCase().includes(search.toLowerCase()) &&
    (typeFilter   === 'Default' || (j.type || 'Full-Time') === typeFilter) &&
    (statusFilter === 'Default' || (j.status || 'Open') === statusFilter)
  ).sort((a, b) => {
    if (sortBy === 'A-Z') return a.title.localeCompare(b.title)
    if (sortBy === 'Z-A') return b.title.localeCompare(a.title)
    return new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
  })

  const canEditJob = (job) =>
    user?.role === 'recruiter' &&
    job?.createdBy?._id &&
    user?._id === job.createdBy._id

  const isAppliedJob = (job) =>
    user?.role !== 'recruiter' &&
    user?._id &&
    hasAppliedToJob(user._id, job._id)

  return (
    <div className="jobs-page">
      <AppNavbar />

      
      <div className="filter-bar">
        <span></span>

        <div className="filter-group">
          <label>Types</label>
          <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
            <option>Default</option>
            <option>Full-Time</option>
            <option>Part-Time</option>
            <option>Contract</option>
            <option>Internship</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Status</label>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option>Default</option>
            <option>Open</option>
            <option>Pending</option>
            <option>Closed</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Sort By</label>
          <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
            <option>Default</option>
            <option>A-Z</option>
            <option>Z-A</option>
          </select>
        </div>

        <div className="search-wrap">
          <input
            type="text"
            placeholder="Type Job Title"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <button>🔍</button>
        </div>
      </div>

      <div className="jobs-grid">
        {loading && <p className="jobs-empty">Loading jobs...</p>}
        {!loading && error && <p className="jobs-empty">{error}</p>}
        {!loading && !error && filtered.length === 0 ? (
          <p className="jobs-empty">No jobs found.</p>
        ) : (
          filtered.map(job => (
            <div key={job._id} className="job-card">

              <div className="card-header">
                <div className="card-icon">{job.title[0].toUpperCase()}</div>
                <div>
                  <p className="card-title">{job.title}</p>
                  <p className="card-company">- {job.company}</p>
                </div>
              </div>

              <div className="card-details">
                <p>📅 {new Date(job.createdAt).toLocaleDateString('en-IN', {
                  month: 'short', day: 'numeric', year: 'numeric'
                })}</p>
                <p>📍 {job.location}</p>
                <p>💼 {job.type || 'Full-Time'}</p>
                <p><span className="card-status">{(job.status || 'Open').toUpperCase()}</span></p>
              </div>

              <div className="card-btns">
                <button className="btn-details" onClick={() => navigate(`/jobs/${job._id}`)}>Details</button>
                {canEditJob(job) ? (
                  <button className="btn-apply" onClick={() => navigate(`/jobs/${job._id}/edit`)}>
                    Edit
                  </button>
                ) : isAppliedJob(job) ? (
                  <button className="btn-apply" disabled>
                    Applied
                  </button>
                ) : (
                  <button className="btn-apply" onClick={() => navigate(`/jobs/${job._id}`)}>
                    Apply
                  </button>
                )}
              </div>

            </div>
          ))
        )}
      </div>

    </div>
  )
}

export default Jobs
