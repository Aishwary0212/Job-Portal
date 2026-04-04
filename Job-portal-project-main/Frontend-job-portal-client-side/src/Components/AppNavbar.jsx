import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { clearAuthData, getStoredUser } from '../utils/auth'
import './AppNavbar.css'

const AppNavbar = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const user = getStoredUser()

  const isActive = (path) => {
    if (path === '/dashboard' && location.pathname.startsWith('/admin/dashboard')) {
      return user?.role === 'admin'
    }

    if (path === '/') {
      return location.pathname === '/'
    }

    return location.pathname === path || location.pathname.startsWith(`${path}/`)
  }

  const handleLogout = () => {
    clearAuthData()
    navigate('/')
  }

  return (
    <nav className="app-nav">
      <Link to="/" className="app-nav-brand">
        <img src="/logo.png" alt="Job Portal" className="app-nav-logo" />
      </Link>

      <div className="app-nav-links">
        <Link to="/" className={isActive('/') ? 'app-nav-link active' : 'app-nav-link'}>
          Home
        </Link>
        <Link to="/jobs" className={isActive('/jobs') ? 'app-nav-link active' : 'app-nav-link'}>
          Jobs
        </Link>

        {user ? (
          <>
            <Link
              to={user.role === 'admin' ? '/admin/dashboard' : '/dashboard'}
              className={isActive('/dashboard') ? 'app-nav-link active' : 'app-nav-link'}
            >
              {user.role === 'admin' ? 'Admin Panel' : 'Dashboard'}
            </Link>
            {['recruiter', 'admin'].includes(user.role) && (
              <Link
                to="/jobs/create"
                className={isActive('/jobs/create') ? 'app-nav-link active' : 'app-nav-link'}
              >
                Create Job
              </Link>
            )}
            <button type="button" className="app-nav-button" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <div className="app-nav-auth">
            <Link to="/login" className={isActive('/login') ? 'app-nav-link active' : 'app-nav-link'}>
              Login
            </Link>
            <Link
              to="/register"
              className={isActive('/register') ? 'app-nav-link active' : 'app-nav-link'}
            >
              Signup
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}

export default AppNavbar
