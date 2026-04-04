import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const AdminLogin = () => {
  const navigate = useNavigate()
  const [email, setEmail]     = useState('')
  const [password, setPass]   = useState('')
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!email.trim() || !password.trim()) {
      setError('Please fill in all fields.')
      return
    }
    setLoading(true)
    try {
      if (email === 'admin@gmail.com' && password === 'admin123') {
        localStorage.setItem('admin', JSON.stringify({ email, role: 'admin' }))
        navigate('/admin/dashboard')
      } else {
        setError('Invalid credentials. Use admin@gmail.com / admin123')
      }
    } catch (err) {
      setError(err.message || 'Login failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <img src="/logo.png" alt="Job Portal" className="auth-logo" />
        <h2 className="auth-title" style={{ color: '#dc2626' }}>Admin Login</h2>
        <p style={{ fontSize: 12, color: '#6b7280', marginBottom: 20, textAlign: 'center' }}>
        </p>
        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          {error && <div className="alert-error">{error}</div>}
          <div className="form-field">
            <label>Email</label>
            <input
              type="email"
              placeholder="admin@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-field">
            <label>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPass(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="auth-btn"
            style={{ background: '#dc2626' }}
            disabled={loading}
          >
            {loading ? 'Please wait...' : 'Admin Login'}
          </button>
        </form>
        <p className="auth-footer" style={{ marginTop: 16 }}>
          <span
            style={{ color: '#2563eb', cursor: 'pointer', fontWeight: 600 }}
            onClick={() => navigate('/login')}
          >
          Back to User Login
          </span>
        </p>
      </div>
    </div>
  )
}

export default AdminLogin;