import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import AuthPage from './pages/AuthPage'
import SeatSelection from './pages/SeatSelection'
import SeancesPage from './pages/SeancesPage'
import CheckoutPage from './pages/CheckoutPage'
import BookingConfirmationPage from './pages/BookingConfirmationPage'

export default function App() {
  const location = useLocation()
  const hideNav = ['/login', '/register'].includes(location.pathname)
    || location.pathname.includes('/seats')

  return (
    <>
      {!hideNav && <Navbar />}
      <Routes>
        <Route path="/login" element={<AuthPage />} />
        <Route path="/register" element={<AuthPage />} />
        <Route path="/seances" element={<SeancesPage />} />
        <Route path="/movies/:id/sessions/:sessionId/seats" element={<SeatSelection />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/booking-confirmation" element={<BookingConfirmationPage />} />
        <Route path="/*" element={<Home />} />
      </Routes>
    </>
  )
}
