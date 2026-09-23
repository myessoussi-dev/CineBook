import { useState, useMemo } from 'react'
import { useParams, useRoutes, useNavigate } from 'react-router-dom'
import { useMovies, useMovieById } from '../hooks/useMovies'
import HeroSection from '../components/HeroSection'
import MovieCard from '../components/MovieCard'
import MovieDetail from '../components/MovieDetail'

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

  if (error) return (
    <div style={{ textAlign: 'center', padding: '120px 40px' }}>
      <span style={{ fontSize: '48px' }}>📡</span>
      <p style={{ marginTop: '16px', color: 'var(--text-muted)' }}>
        Impossible de charger les films.<br />
        <span style={{ fontSize: '13px', color: 'var(--text-dim)' }}>{error}</span>
      </p>
    </div>
  )

  return (
    <>
      {/* Hero */}
      {loading ? (
        <div style={{ height: '100vh', background: 'linear-gradient(to bottom, #0d1117, var(--bg-primary))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: 52, height: 52, borderRadius: '50%',
              border: '3px solid rgba(255,255,255,0.08)',
              borderTopColor: 'var(--accent)',
              animation: 'spin 0.8s linear infinite',
              margin: '0 auto 16px',
            }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
            <p style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '13px' }}>
              Chargement des films...
            </p>
          </div>
        </div>
      ) : (
        <HeroSection movies={movies} />
      )}

      {/* Catalog section */}
      <section style={{ padding: '60px 40px 80px', maxWidth: '1400px', margin: '0 auto' }}>
        {/* Section header */}
        <div style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          marginBottom: '32px',
          gap: '20px',
          flexWrap: 'wrap',
        }}>
          <div>
            <p style={{ fontSize: '11px', color: 'var(--accent)', fontFamily: 'var(--font-mono)', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '6px' }}>
              Catalogue
            </p>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '40px', letterSpacing: '3px', color: 'var(--text-primary)' }}>
              TOUS LES FILMS
            </h2>
          </div>

          {/* Search + sort */}
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <div style={{ position: 'relative' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-dim)" strokeWidth="2"
                style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input
                type="text"
                placeholder="Rechercher un film..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  padding: '9px 14px 9px 36px',
                  color: 'var(--text-primary)',
                  fontSize: '13px',
                  outline: 'none',
                  width: '220px',
                  fontFamily: 'var(--font-body)',
                  transition: 'border-color 0.2s',
                }}
                onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
              />
            </div>

            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                padding: '9px 14px',
                color: 'var(--text-muted)',
                fontSize: '13px',
                outline: 'none',
                cursor: 'pointer',
                fontFamily: 'var(--font-body)',
              }}
            >
              <option value="popularity">Popularité</option>
              <option value="rating">Note</option>
              <option value="date">Date de sortie</option>
            </select>
          </div>
        </div>

        {/* Genre pills */}
        <div style={{
          display: 'flex',
          gap: '8px',
          flexWrap: 'wrap',
          marginBottom: '36px',
          paddingBottom: '20px',
          borderBottom: '1px solid var(--border)',
        }}>
          {genres.map(g => (
            <button
              key={g}
              onClick={() => setActiveGenre(g)}
              style={{
                padding: '7px 18px',
                borderRadius: '20px',
                border: `1px solid ${activeGenre === g ? 'var(--accent)' : 'var(--border)'}`,
                background: activeGenre === g ? 'rgba(232,160,32,0.12)' : 'transparent',
                color: activeGenre === g ? 'var(--accent)' : 'var(--text-muted)',
                fontSize: '13px',
                fontWeight: activeGenre === g ? 600 : 400,
                cursor: 'pointer',
                transition: 'all 0.2s',
                letterSpacing: '0.3px',
              }}
              onMouseEnter={e => { if (activeGenre !== g) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)' }}
              onMouseLeave={e => { if (activeGenre !== g) e.currentTarget.style.borderColor = 'var(--border)' }}
            >
              {g}
            </button>
          ))}
        </div>

        {/* Results count */}
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-dim)', marginBottom: '24px', letterSpacing: '0.5px' }}>
          {filtered.length} film{filtered.length !== 1 ? 's' : ''} trouvé{filtered.length !== 1 ? 's' : ''}
        </p>

        {/* Movie grid */}
        {loading ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '20px',
          }}>
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="skeleton" style={{ aspectRatio: '2/3', borderRadius: 'var(--radius-lg)' }} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <p style={{ fontSize: '48px', marginBottom: '16px' }}>🎭</p>
            <p style={{ color: 'var(--text-muted)' }}>Aucun film trouvé pour cette recherche.</p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '20px',
          }}>
            {filtered.map((movie, i) => (
              <MovieCard key={movie.id} movie={movie} index={i} />
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid var(--border)',
        padding: '32px 40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        color: 'var(--text-dim)',
        fontSize: '12px',
        fontFamily: 'var(--font-mono)',
      }}>
        <span style={{ color: 'var(--accent)', fontFamily: 'var(--font-display)', fontSize: '18px', letterSpacing: '2px' }}>
          CINÉBOOK
        </span>
        <span>© {new Date().getFullYear()} — Tous droits réservés</span>
        <span>Powered by TMDB</span>
      </footer>
    </>
  )
}

// ──────────────────────────────────────────────
// Movie Detail Wrapper (fetches by id from URL)
// ──────────────────────────────────────────────
function MovieDetailView() {
  const { id } = useParams()
  const { movie, loading, error } = useMovieById(id)
  return <MovieDetail movie={movie} loading={loading} error={error} />
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
