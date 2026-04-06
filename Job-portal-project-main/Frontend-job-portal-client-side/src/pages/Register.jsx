import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { authApi } from '../utils/api'
import { setAuthData } from '../utils/auth'

const Register = () => {
  const navigate = useNavigate()

  const [form, setForm]       = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'candidate'
  })
  const [error, setError]     = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const validate = () => {
    if (!form.username || !form.email || !form.password || !form.confirmPassword)
      return 'Please fill in all fields.'
    if (!/\S+@\S+\.\S+/.test(form.email))
      return 'Please enter a valid email address.'
    if (form.password.length < 6)
      return 'Password must be at least 6 characters.'
    if (form.password !== form.confirmPassword)
      return 'Passwords do not match.'
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    const err = validate()
    if (err) {
      setError(err)
      toast.error(err)
      return
    }

    try {
      setLoading(true)

      const data = await authApi.register({
        username: form.username,
        email: form.email,
        password: form.password,
        role: form.role
      })

      setAuthData({
        token: data.token,
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

      setSuccess('Account created! Redirecting...')
      toast.success('Account created successfully!')
      setTimeout(() => navigate('/dashboard'), 1200)
    } catch (submitError) {
      setError(submitError.message)
      toast.error(submitError.message || 'Registration failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <img src="/logo.png" alt="Job Portal" className="auth-logo" />
        <h2 className="auth-title">Create Account</h2>

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          {error   && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <div className="form-field">
            <label>Username</label>
            <input type="text" name="username" placeholder="Type Here"
              value={form.username} onChange={handleChange} />
          </div>

          <div className="form-field">
            <label>Email</label>
            <input type="email" name="email" placeholder="Email@example.com"
              value={form.email} onChange={handleChange} />
          </div>

          <div className="form-field">
            <label>Role</label>
            <select name="role" value={form.role} onChange={handleChange}>
              <option value="candidate">Candidate</option>
              <option value="recruiter">Recruiter</option>
            </select>
          </div>

          <div className="form-field">
            <label>Password</label>
            <input type="password" name="password" placeholder="Type Here"
              value={form.password} onChange={handleChange} />
          </div>

          <div className="form-field">
            <label>Confirm Password</label>
            <input type="password" name="confirmPassword" placeholder="Type Here"
              value={form.confirmPassword} onChange={handleChange} />
          </div>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account. <Link to="/login">Login Now</Link>
        </p>
      </div>
    </div>
  )
}

export default Register
