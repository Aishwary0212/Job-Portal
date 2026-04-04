export const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:5000'

export const API_ENDPOINTS = {
  login: '/api/auth/login',
  register: '/api/auth/register',
  me: '/api/auth/me',
  updateProfile: '/api/auth/profile',
  jobs: '/api/jobs',
  createJob: '/api/jobs',
  jobDetails: (id) => `/api/jobs/${id}`,
  updateJob: (id) => `/api/jobs/${id}`,
  deleteJob: (id) => `/api/jobs/${id}`,
  applications: '/api/applications',
  myApplications: '/api/applications/mine',
  applyToJob: (jobId) => `/api/applications/${jobId}`,
  updateApplicationStatus: (id) => `/api/applications/${id}/status`
}
