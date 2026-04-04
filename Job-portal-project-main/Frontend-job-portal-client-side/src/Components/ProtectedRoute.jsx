import React from 'react'
import { Navigate } from 'react-router-dom'
import { getStoredToken, getStoredUser } from '../utils/auth'

const ProtectedRoute = ({ children }) => {
  const token = getStoredToken()
  const user = getStoredUser()

  if (!token || !user) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default ProtectedRoute
