import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import AuthPage from './pages/AuthPage'

export default function App() {
  const location = useLocation()
  const isAuth = location.pathname === '/login' || location.pathname === '/register'

  return (
    <>
      {!isAuth && <Navbar />}
      <Routes>
        <Route path="/login" element={<AuthPage />} />
        <Route path="/register" element={<AuthPage />} />
        <Route path="/*" element={<Home />} />
      </Routes>
    </>
  )
}
