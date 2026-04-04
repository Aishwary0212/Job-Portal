import React from 'react'
import { Navigate } from 'react-router-dom'
import { getStoredToken, getStoredUser } from '../utils/auth'

const AdminRoute = ({ children }) => {
  const token = getStoredToken()
  const user = getStoredUser()

  if (!token || !user) {
    return <Navigate to="/admin" replace />
  }

  if (user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />
  }

  return children
}

export default AdminRoute
