import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

function decodeToken(token) {
  try {
    const payload = token.split('.')[1]
    return JSON.parse(atob(payload))
  } catch {
    return null
  }
}

function isTokenExpired(token) {
  const decoded = decodeToken(token)
  if (!decoded || !decoded.exp) return true
  return decoded.exp * 1000 < Date.now()
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('cinebook_token'))
  const [user, setUser] = useState(() => {
    const u = localStorage.getItem('cinebook_user')
    return u ? JSON.parse(u) : null
  })

  function clearAuth() {
    setToken(null)
    setUser(null)
    localStorage.removeItem('cinebook_token')
    localStorage.removeItem('cinebook_user')
  }

  function login(newToken, userResponse) {
    setToken(newToken)
    setUser(userResponse)
    localStorage.setItem('cinebook_token', newToken)
    localStorage.setItem('cinebook_user', JSON.stringify(userResponse))
  }

  function logout() {
    clearAuth()
  }

  useEffect(() => {
    function checkExpiry() {
      const storedToken = localStorage.getItem('cinebook_token')
      if (storedToken && isTokenExpired(storedToken)) {
        clearAuth()
      }
    }
    checkExpiry()
    const interval = setInterval(checkExpiry, 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <AuthContext.Provider value={{
      token,
      user,
      login,
      logout,
      clearAuth,
      isAuthenticated: !!token && !isTokenExpired(token),
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
