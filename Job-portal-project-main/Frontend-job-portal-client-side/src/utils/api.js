import { clearAuthData, getStoredToken } from './auth'
import { API_BASE_URL, API_ENDPOINTS } from '../config/api'

const buildHeaders = (hasBody = false) => {
  const headers = {}
  const token = getStoredToken()

  if (hasBody) {
    headers['Content-Type'] = 'application/json'
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  return headers
}

export const apiRequest = async (path, options = {}) => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      ...buildHeaders(Boolean(options.body)),
      ...(options.headers || {})
    }
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    if (response.status === 401) {
      clearAuthData()
    }

    throw new Error(data.message || 'Something went wrong')
  }

  return data
}

export const authApi = {
  login: (payload) => apiRequest(API_ENDPOINTS.login, {
    method: 'POST',
    body: JSON.stringify(payload)
  }),
  register: (payload) => apiRequest(API_ENDPOINTS.register, {
    method: 'POST',
    body: JSON.stringify(payload)
  }),
  getMe: () => apiRequest(API_ENDPOINTS.me),
  updateProfile: (payload) => apiRequest(API_ENDPOINTS.updateProfile, {
    method: 'PUT',
    body: JSON.stringify(payload)
  })
}

export const jobsApi = {
  getJobs: () => apiRequest(API_ENDPOINTS.jobs),
  getJobById: (id) => apiRequest(API_ENDPOINTS.jobDetails(id)),
  createJob: (payload) => apiRequest(API_ENDPOINTS.createJob, {
    method: 'POST',
    body: JSON.stringify(payload)
  }),
  updateJob: (id, payload) => apiRequest(API_ENDPOINTS.updateJob(id), {
    method: 'PUT',
    body: JSON.stringify(payload)
  })
}
