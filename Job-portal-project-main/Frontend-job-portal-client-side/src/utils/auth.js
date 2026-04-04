export const getStoredToken = () => localStorage.getItem('token') || ''

export const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem('user') || 'null')
  } catch {
    return null
  }
}

export const setAuthData = ({ token, user }) => {
  if (token) {
    localStorage.setItem('token', token)
  }

  if (user) {
    localStorage.setItem('user', JSON.stringify(user))
  }
}

export const clearAuthData = () => {
  localStorage.removeItem('user')
  localStorage.removeItem('token')
}
