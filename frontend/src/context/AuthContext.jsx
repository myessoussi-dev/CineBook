import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('cinebook_token'))
  const [user, setUser] = useState(() => {
    const u = localStorage.getItem('cinebook_user')
    return u ? JSON.parse(u) : null
  })

  function login(token, userResponse) {
    setToken(token)
    setUser(userResponse)
    localStorage.setItem('cinebook_token', token)
    localStorage.setItem('cinebook_user', JSON.stringify(userResponse))
  }

  function logout() {
    setToken(null)
    setUser(null)
    localStorage.clear()
  }

  return (
    <AuthContext.Provider value={{ token, user, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
