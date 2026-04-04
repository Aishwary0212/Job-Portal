import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authApi } from '../utils/api'
import { setAuthData } from '../utils/auth'

const Login = () => {
  const navigate = useNavigate()

  const [email, setEmail]     = useState('')
  const [password, setPass]   = useState('')
  const [error, setError]     = useState('')
  const [success, setSuccess] = useState('')

  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!email.trim() || !password.trim()) {
      setError('Please fill in all fields.')
      return
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address.')
      return
    }

    try {
      setLoading(true)

      const data = await authApi.login({ email, password })

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

      setSuccess('Login successful! Redirecting...')
      setTimeout(() => navigate('/Jobs'), 1200)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <img src="/logo.png" alt="Job Portal" className="auth-logo" />
        <h2 className="auth-title">Login</h2>

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          {error   && <div className="alert-error">{error}</div>}
          {success && <div className="alert-success">{success}</div>}

          <div className="form-field">
            <label>Email</label>
            <input
              type="email"
              placeholder="Email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-field">
            <label>Password</label>
            <input
              type="password"
              placeholder="Type Here"
              value={password}
              onChange={(e) => setPass(e.target.value)}
            />
          </div>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="auth-footer">
          Don't have an account. <Link to="/register">Create Account</Link>
        </p>
      </div>
    </div>
  )
}

export default Login
