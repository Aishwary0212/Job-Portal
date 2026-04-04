import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Home from './Components/Homepage/Home'
import Dashboard from './Components/Dashboard/Dashboard'
import AdminDashboard from './Components/Admin/AdminDashboard'
import AdminRoute from './Components/AdminRoute'
import Login from './pages/Login'
import Register from './pages/Register'
import EditProfile from './pages/EditProfile'
import AdminLogin from './pages/AdminLogin'
import Jobs from './pages/Jobs'
import ProtectedRoute from './components/ProtectedRoute'
import RecruiterRoute from './components/RecruiterRoute'
import CreateJob from './pages/CreateJob'
import JobDetails from './pages/JobDetails'
import EditJob from './pages/EditJob'

import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/edit-profile" element={
          <ProtectedRoute>
            <EditProfile />
          </ProtectedRoute>
        } />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/jobs/:id" element={<JobDetails />} />
        <Route path="/jobs/create" element={
          <RecruiterRoute>
            <CreateJob />
          </RecruiterRoute>
        } />
        <Route path="/jobs/:id/edit" element={
          <RecruiterRoute>
            <EditJob />
          </RecruiterRoute>
        } />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        } />

      </Routes>
    </BrowserRouter>
  )
}

export default App
