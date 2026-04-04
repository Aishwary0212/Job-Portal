import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { applicationsApi, jobsApi } from '../utils/api'
import { getStoredUser } from '../utils/auth'
import AppNavbar from '../components/AppNavbar'

const JobDetails = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [user] = useState(() => getStoredUser())
  const [applied, setApplied] = useState(false)

  useEffect(() => {
    const loadJob = async () => {
      try {
        setLoading(true)
        const data = await jobsApi.getJobById(id)
        setJob(data)
        setApplied(Boolean(data.hasApplied))
      } catch (loadError) {
        setError(loadError.message)
        toast.error(loadError.message || 'Failed to load job details.')
      } finally {
        setLoading(false)
      }
    }

    loadJob()
  }, [id, user?._id])

  const handleApply = async () => {
    setError('')
    setSuccess('')

    if (!user) {
      navigate('/login')
      return
    }

    if (user.role !== 'candidate') {
      const message = 'Only candidates can apply to jobs.'
      setError(message)
      toast.error(message)
      return
    }

    try {
      await applicationsApi.applyToJob(job._id)
      setApplied(true)
      setSuccess('Application submitted successfully.')
      toast.success('Application submitted successfully!')
      setJob((currentJob) => ({
        ...currentJob,
        applicationsCount: (currentJob?.applicationsCount || 0) + 1,
        hasApplied: true
      }))
    } catch (applyError) {
      setError(applyError.message)
      toast.error(applyError.message || 'Failed to apply.')
    }
  }

  const canEdit =
    user?.role === 'admin' ||
    (user?.role === 'recruiter' &&
      job?.createdBy?._id &&
      user?._id === job.createdBy._id)

  return (
    <>
      <AppNavbar />
      <div className="auth-page">
        <div className="auth-card">
        <h2 className="auth-title">Job Details</h2>
        {loading && <div className="alert-success">Loading job...</div>}
        {!loading && error && <div className="alert-error">{error}</div>}
        {!loading && job && (
          <>
            {success && <div className="alert-success">{success}</div>}
            {!success && error && <div className="alert-error">{error}</div>}

            <div className="form-field">
              <label>Title</label>
              <input value={job.title} readOnly />
            </div>
            <div className="form-field">
              <label>Company</label>
              <input value={job.company} readOnly />
            </div>
            <div className="form-field">
              <label>Location</label>
              <input value={job.location} readOnly />
            </div>
            <div className="form-field">
              <label>Type</label>
              <input value={job.type || 'Full-Time'} readOnly />
            </div>
            <div className="form-field">
              <label>Status</label>
              <input value={job.status || 'Open'} readOnly />
            </div>
            <div className="form-field">
              <label>Description</label>
              <textarea value={job.description || 'No description provided'} readOnly rows="5" />
            </div>
            <div className="form-field">
              <label>Posted By</label>
              <input value={job.createdBy?.name || 'Unknown'} readOnly />
            </div>
            <div className="form-field">
              <label>Total Applications</label>
              <input value={job.applicationsCount || 0} readOnly />
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
              <button className="auth-btn" type="button" onClick={() => navigate('/jobs')}>
                Back to Jobs
              </button>
              {canEdit ? (
                <button className="auth-btn" type="button" onClick={() => navigate(`/jobs/${job._id}/edit`)}>
                  Edit Job
                </button>
              ) : (
                <button className="auth-btn" type="button" onClick={handleApply} disabled={applied}>
                  {applied ? 'Applied' : 'Apply'}
                </button>
              )}
            </div>
          </>
        )}
        </div>
      </div>
    </>
  )
}

export default JobDetails
