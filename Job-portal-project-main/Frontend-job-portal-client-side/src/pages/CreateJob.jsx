import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { jobsApi } from '../utils/api'
import AppNavbar from '../components/AppNavbar'

const CreateJob = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    title: '',
    company: '',
    location: '',
    description: '',
    type: 'Full-Time',
    status: 'Open'
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setSuccess('')

    if (!form.title.trim() || !form.company.trim() || !form.location.trim()) {
      setError('Please fill in title, company, and location.')
      return
    }

    try {
      setLoading(true)
      await jobsApi.createJob(form)
      setSuccess('Job created successfully! Redirecting...')
      setTimeout(() => navigate('/jobs'), 1000)
    } catch (submitError) {
      setError(submitError.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <AppNavbar />
      <div className="auth-page">
        <div className="auth-card">
        <img src="/logo.png" alt="Job Portal" className="auth-logo" />
        <h2 className="auth-title">Create Job</h2>

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          {error && <div className="alert-error">{error}</div>}
          {success && <div className="alert-success">{success}</div>}

          <div className="form-field">
            <label>Job Title</label>
            <input
              type="text"
              name="title"
              placeholder="React Developer"
              value={form.title}
              onChange={handleChange}
            />
          </div>

          <div className="form-field">
            <label>Company</label>
            <input
              type="text"
              name="company"
              placeholder="Company Name"
              value={form.company}
              onChange={handleChange}
            />
          </div>

          <div className="form-field">
            <label>Location</label>
            <input
              type="text"
              name="location"
              placeholder="Location"
              value={form.location}
              onChange={handleChange}
            />
          </div>

          <div className="form-field">
            <label>Description</label>
            <textarea
              name="description"
              placeholder="Describe the job"
              value={form.description}
              onChange={handleChange}
              rows="4"
            />
          </div>

          <div className="form-field">
            <label>Type</label>
            <select name="type" value={form.type} onChange={handleChange}>
              <option value="Full-Time">Full-Time</option>
              <option value="Part-Time">Part-Time</option>
              <option value="Contract">Contract</option>
              <option value="Internship">Internship</option>
            </select>
          </div>

          <div className="form-field">
            <label>Status</label>
            <select name="status" value={form.status} onChange={handleChange}>
              <option value="Open">Open</option>
              <option value="Pending">Pending</option>
              <option value="Closed">Closed</option>
            </select>
          </div>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Creating...' : 'Create Job'}
          </button>
        </form>

        <p className="auth-footer">
          <span
            style={{ color: '#2563eb', cursor: 'pointer', fontWeight: 600 }}
            onClick={() => navigate('/jobs')}
          >
            Back to Jobs
          </span>
        </p>
        </div>
      </div>
    </>
  )
}

export default CreateJob
