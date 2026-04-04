import React from 'react'
import { Navigate } from 'react-router-dom'
import { getStoredToken, getStoredUser } from '../utils/auth'

const RecruiterRoute = ({ children }) => {
  const token = getStoredToken()
  const user = getStoredUser()

  if (!token || !user) {
    return <Navigate to="/login" replace />
  }

  if (user.role !== 'recruiter') {
    return <Navigate to="/dashboard" replace />
  }

  return children
}

export default RecruiterRoute
