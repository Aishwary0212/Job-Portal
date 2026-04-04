import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { jobsApi } from '../utils/api'
import AppNavbar from '../components/AppNavbar'

const EditJob = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [form, setForm] = useState({
    title: '',
    company: '',
    location: '',
    description: '',
    type: 'Full-Time',
    status: 'Open'
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    const loadJob = async () => {
      try {
        const job = await jobsApi.getJobById(id)
        setForm({
          title: job.title || '',
          company: job.company || '',
          location: job.location || '',
          description: job.description || '',
          type: job.type || 'Full-Time',
          status: job.status || 'Open'
        })
      } catch (loadError) {
        setError(loadError.message)
        toast.error(loadError.message || 'Failed to load job.')
      } finally {
        setLoading(false)
      }
    }

    loadJob()
  }, [id])

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setSuccess('')

    if (!form.title.trim() || !form.company.trim() || !form.location.trim()) {
      const message = 'Please fill in title, company, and location.'
      setError(message)
      toast.error(message)
      return
    }

    try {
      setSaving(true)
      await jobsApi.updateJob(id, form)
      setSuccess('Job updated successfully! Redirecting...')
      toast.success('Job updated successfully!')
      setTimeout(() => navigate(`/jobs/${id}`), 1000)
    } catch (submitError) {
      setError(submitError.message)
      toast.error(submitError.message || 'Failed to update job.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <AppNavbar />
      <div className="auth-page">
        <div className="auth-card">
        <h2 className="auth-title">Edit Job</h2>
        {loading && <div className="alert-success">Loading job...</div>}
        {!loading && (
          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            {error && <div className="alert-error">{error}</div>}
            {success && <div className="alert-success">{success}</div>}

            <div className="form-field">
              <label>Job Title</label>
              <input type="text" name="title" value={form.title} onChange={handleChange} />
            </div>
            <div className="form-field">
              <label>Company</label>
              <input type="text" name="company" value={form.company} onChange={handleChange} />
            </div>
            <div className="form-field">
              <label>Location</label>
              <input type="text" name="location" value={form.location} onChange={handleChange} />
            </div>
            <div className="form-field">
              <label>Description</label>
              <textarea name="description" value={form.description} onChange={handleChange} rows="4" />
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

            <button type="submit" className="auth-btn" disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        )}
        </div>
      </div>
    </>
  )
}

export default EditJob
