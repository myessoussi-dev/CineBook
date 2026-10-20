import { useState, useMemo } from 'react'
import { useParams, useRoutes } from 'react-router-dom'
import { useMovies, useMovieById } from '../hooks/useMovies'
import HeroSection from '../components/HeroSection'
import MovieCard from '../components/MovieCard'
import MovieDetail from '../components/MovieDetail'
import Footer from '../components/Footer'
import Icon from '../components/Icon'
import './Home.css'

// ──────────────────────────────────────────────
// Movie List View
// ──────────────────────────────────────────────
function MovieListView({ movies, loading, error }) {
  const [activeGenre, setActiveGenre] = useState('Tous')
  const [sortBy, setSortBy] = useState('popularity')
  const [searchQuery, setSearchQuery] = useState('')

  // Collect all unique genres
  const genres = useMemo(() => {
    const all = ['Tous']
    movies.forEach(m => m.categories?.forEach(c => {
      if (!all.includes(c.name)) all.push(c.name)
    }))
    return all
  }, [movies])

  const filtered = useMemo(() => {
    let list = [...movies]
    if (searchQuery) {
      list = list.filter(m => m.title.toLowerCase().includes(searchQuery.toLowerCase()))
    }
    if (activeGenre !== 'Tous') {
      list = list.filter(m => m.categories?.some(c => c.name === activeGenre))
    }
    if (sortBy === 'popularity') list.sort((a, b) => b.popularity - a.popularity)
    else if (sortBy === 'rating') list.sort((a, b) => b.voteAverage - a.voteAverage)
    else if (sortBy === 'date') list.sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate))
    return list
  }, [movies, activeGenre, sortBy, searchQuery])

  function resetFilters() {
    setSearchQuery('')
    setActiveGenre('Tous')
  }

  if (error) return (
    <div className="state state-full">
      <div className="state-icon"><Icon name="wifi-off" size={26} /></div>
      <h2>Impossible de charger les films</h2>
      <p>Le serveur ne répond pas. Vérifiez votre connexion puis rechargez la page.</p>
      <button type="button" className="btn btn-primary" onClick={() => window.location.reload()}>Recharger la page</button>
      <p className="dim" style={{ fontSize: 'var(--fs-xs)' }}>{error}</p>
    </div>
  )

  return (
    <>
      {loading ? (
        <div className="hero-skeleton">
          <div className="container hero-skeleton-inner">
            <div className="skeleton" style={{ width: 160, height: 16 }} />
            <div className="skeleton" style={{ width: 'min(560px, 90%)', height: 72 }} />
            <div className="skeleton" style={{ width: 'min(420px, 70%)', height: 16 }} />
            <div className="skeleton" style={{ width: 220, height: 52, borderRadius: 'var(--r-md)' }} />
          </div>
        </div>
      ) : (
        <HeroSection movies={movies} />
      )}

      <section className="catalog container" aria-labelledby="catalog-title">
        <div className="catalog-head">
          <div>
            <h2 id="catalog-title" className="catalog-title display">À l'affiche</h2>
            {!loading && (
              <p className="catalog-count">
                {filtered.length} film{filtered.length !== 1 ? 's' : ''}
                {activeGenre !== 'Tous' && ` en ${activeGenre.toLowerCase()}`}
              </p>
            )}
          </div>

          <div className="catalog-tools">
            <label className="search">
              <Icon name="search" size={17} />
              <span className="visually-hidden">Rechercher un film</span>
              <input
                type="search"
                placeholder="Rechercher un film"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </label>

            <label className="sort">
              <span className="visually-hidden">Trier par</span>
              <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
                <option value="popularity">Les plus populaires</option>
                <option value="rating">Les mieux notés</option>
                <option value="date">Les plus récents</option>
              </select>
              <Icon name="chevron-down" size={16} />
            </label>
          </div>
        </div>

        <div className="genre-bar scroll-x" role="group" aria-label="Filtrer par genre">
          {genres.map(g => (
            <button key={g} type="button" className="chip" aria-pressed={activeGenre === g} onClick={() => setActiveGenre(g)}>
              {g}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="movie-grid">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i}>
                <div className="skeleton" style={{ aspectRatio: '2/3', borderRadius: 'var(--r-md)' }} />
                <div className="skeleton" style={{ height: 14, width: '80%', marginTop: 12 }} />
                <div className="skeleton" style={{ height: 12, width: '50%', marginTop: 8 }} />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="state">
            <div className="state-icon"><Icon name="search" size={24} /></div>
            <h2>Aucun film ne correspond</h2>
            <p>Essayez un autre titre ou retirez le filtre de genre.</p>
            <button type="button" className="btn btn-ghost" onClick={resetFilters}>Effacer les filtres</button>
          </div>
        ) : (
          <div className="movie-grid">
            {filtered.map(movie => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        )}
      </section>

      <Footer />
    </>
  )
}

// ──────────────────────────────────────────────
// Movie Detail Wrapper (fetches by id from URL)
// ──────────────────────────────────────────────
function MovieDetailView() {
  const { id } = useParams()
  const { movie, loading, error } = useMovieById(id)
  return (
    <>
      <MovieDetail movie={movie} loading={loading} error={error} />
      {!loading && movie && <Footer />}
    </>
  )
}

// ──────────────────────────────────────────────
// Home — routes on a single page
// ──────────────────────────────────────────────
export default function Home() {
  const { movies, loading, error } = useMovies()

  const element = useRoutes([
    {
      path: '/',
      element: <MovieListView movies={movies} loading={loading} error={error} />,
    },
    {
      path: '/movies/:id',
      element: <MovieDetailView />,
    },
  ])

  return element
}
