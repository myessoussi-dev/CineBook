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
        if (!res.ok) throw new Error('Erreur réseau')
        return res.json()
      })
      .then(data => {
        setMovies(data)
        setLoading(false)
      })
      .catch(err => {
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
