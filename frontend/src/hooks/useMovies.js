import { useState, useEffect } from 'react'
 
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'
 
export function useMovies() {
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
 
  useEffect(() => {
    setLoading(true)
    fetch(`${BASE_URL}/api/movies`)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then(data => {
        console.log('✅ Films reçus:', data)
        // Si le backend renvoie { content: [...] } (pagination Spring)
        const list = Array.isArray(data) ? data : data.content ?? data.data ?? []
        setMovies(list)
        setLoading(false)
      })
      .catch(err => {
        console.error('❌ Erreur fetch films:', err)
        setError(err.message)
        setLoading(false)
      })
  }, [])
 
  return { movies, loading, error }
}
 
export function useMovieById(id) {
  const [movie, setMovie] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
 
  useEffect(() => {
    if (!id) return
    setLoading(true)
    setMovie(null)
    fetch(`${BASE_URL}/api/movies/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Film non trouvé')
        return res.json()
      })
      .then(data => {
        setMovie(data)
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [id])
 
  return { movie, loading, error }
}
 
export function useMovieSessions(movieId) {
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
 
  useEffect(() => {
    if (!movieId) return
    setLoading(true)
    fetch(`${BASE_URL}/api/movies/${movieId}/sessions`)
      .then(res => {
        if (!res.ok) throw new Error('Sessions introuvables')
        return res.json()
      })
      .then(data => {
        setSessions(Array.isArray(data) ? data : data.content ?? [])
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [movieId])
 
  return { sessions, loading, error }
}
 
export function useSessionDetails(sessionId) {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
 
  useEffect(() => {
    if (!sessionId) return
    setLoading(true)
    fetch(`${BASE_URL}/api/sessions/${sessionId}`)
      .then(res => { if (!res.ok) throw new Error('Session introuvable'); return res.json() })
      .then(data => { setSession(data); setLoading(false) })
      .catch(err => { setError(err.message); setLoading(false) })
  }, [sessionId])
 
  return { session, loading, error }
}
 
export function useSessionSeats(sessionId) {
  const [seats, setSeats] = useState([])
  const [reservedIds, setReservedIds] = useState([])
  const [loading, setLoading] = useState(true)
 
  useEffect(() => {
    if (!sessionId) return
    setLoading(true)
    Promise.all([
      fetch(`${BASE_URL}/api/sessions/${sessionId}/seats`).then(r => r.json()),
      fetch(`${BASE_URL}/api/sessions/${sessionId}/reserved-seats`).then(r => r.json()),
    ])
      .then(([allSeats, reserved]) => {
        setSeats(Array.isArray(allSeats) ? allSeats : [])
        const ids = Array.isArray(reserved)
          ? reserved.map(s => (typeof s === 'object' ? s.id : s))
          : []
        setReservedIds(ids)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [sessionId])
 
  return { seats, reservedIds, loading }
}