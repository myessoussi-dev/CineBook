import { useState, useMemo, useEffect, useRef } from 'react'
import { useParams, useRoutes, useLocation, useSearchParams } from 'react-router-dom'
import { useMovies, useMovieById } from '../hooks/useMovies'
import HeroSection from '../components/HeroSection'
import Reveal, { useInView } from '../components/Reveal'
import MovieCard from '../components/MovieCard'
import MovieDetail from '../components/MovieDetail'
import Footer from '../components/Footer'
import Icon from '../components/Icon'
import './Home.css'

function useUpcoming(enabled) {
  const [upcoming, setUpcoming] = useState([])
  const [loading, setLoading] = useState(true)
  const started = useRef(false)
  useEffect(() => {
    if (!enabled || started.current) return
    started.current = true
    fetch(`/api/movies/upcoming`)
      .then(res => (res.ok ? res.json() : []))
      .then(data => setUpcoming(Array.isArray(data) ? data : []))
      .catch(() => setUpcoming([]))
      .finally(() => setLoading(false))
  }, [enabled])
  return { upcoming, loading }
}

/** Grid whose cards rise in one after another when it scrolls into view */
function MovieGrid({ children }) {
  const [ref, inView] = useInView()
  return <div ref={ref} className={`movie-grid ${inView ? 'is-in' : ''}`}>{children}</div>
}

// ──────────────────────────────────────────────
// Movie list
// ──────────────────────────────────────────────
function MovieListView({ movies, loading, error }) {
  const [searchParams, setSearchParams] = useSearchParams()
  const tab = searchParams.get('tab') === 'coming-soon' ? 'coming-soon' : 'now-showing'
  const [activeGenre, setActiveGenre] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  // Secondary request: wait for the main list so it does not compete with it
  const { upcoming, loading: upcomingLoading } = useUpcoming(!loading || tab === 'coming-soon')
  const searchRef = useRef(null)
  const location = useLocation()

  const source = tab === 'coming-soon' ? upcoming : movies
  const listLoading = tab === 'coming-soon' ? upcomingLoading : loading

  // Navbar links: /#movies scrolls to the list, /#search also focuses the search field
  useEffect(() => {
    if ((location.hash === '#movies' || location.hash === '#search') && !loading) {
      document.getElementById('movies')?.scrollIntoView({ behavior: 'smooth' })
      if (location.hash === '#search') setTimeout(() => searchRef.current?.focus({ preventScroll: true }), 400)
    }
  }, [location.hash, location.key, loading])

  // "Coming soon" from the navbar: bring the list into view
  useEffect(() => {
    if (tab === 'coming-soon' && !location.hash) {
      document.getElementById('movies')?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [tab, location.key])

  // Reset filters when switching tab
  useEffect(() => { setActiveGenre('All') }, [tab])

  const genres = useMemo(() => {
    const all = ['All']
    source.forEach(m => m.categories?.forEach(c => {
      if (!all.includes(c.name)) all.push(c.name)
    }))
    return all
  }, [source])

  const filtered = useMemo(() => {
    let list = [...source]
    if (searchQuery) {
      list = list.filter(m => m.title.toLowerCase().includes(searchQuery.toLowerCase()))
    }
    if (activeGenre !== 'All') {
      list = list.filter(m => m.categories?.some(c => c.name === activeGenre))
    }
    if (tab === 'coming-soon') list.sort((a, b) => new Date(a.releaseDate) - new Date(b.releaseDate))
    else list.sort((a, b) => b.popularity - a.popularity)
    return list
  }, [source, activeGenre, searchQuery, tab])

  function setTab(next) {
    const params = new URLSearchParams(searchParams)
    if (next === 'coming-soon') params.set('tab', 'coming-soon')
    else params.delete('tab')
    setSearchParams(params, { replace: true, preventScrollReset: true })
  }

  function resetFilters() {
    setSearchQuery('')
    setActiveGenre('All')
  }

  if (error) return (
    <div className="state state-full">
      <div className="state-icon"><Icon name="wifi-off" size={26} /></div>
      <h2>Movies could not be loaded</h2>
      <p>The server is not responding. Check your connection and reload the page.</p>
      <button type="button" className="btn btn-primary" onClick={() => window.location.reload()}>Reload</button>
      <p className="dim" style={{ fontSize: 'var(--fs-xs)' }}>{error}</p>
    </div>
  )

  const count = tab === 'coming-soon' ? upcoming.length : movies.length

  return (
    <div className="page-anim">
      {loading
        ? <div className="hero hero-skeleton skeleton" />
        : <HeroSection movies={movies} />}

      <section className="catalog container" id="movies" aria-labelledby="catalog-title">
        <Reveal className="catalog-head">
          <div>
            <h2 id="catalog-title" className="section-title">
              {tab === 'coming-soon' ? 'Coming soon' : 'Now showing'}
            </h2>
            <p className="section-sub">
              {listLoading ? 'Loading the programme…'
                : tab === 'coming-soon'
                  ? `${count} upcoming release${count === 1 ? '' : 's'}. Save the date.`
                  : `${count} movie${count === 1 ? '' : 's'} on screen this week.`}
            </p>
          </div>

          <div className="catalog-tools">
            <div className="segmented" role="tablist" aria-label="Movie list">
              <span className="segmented-thumb" style={{ width: 'calc(50% - 4px)', transform: tab === 'coming-soon' ? 'translateX(100%)' : 'none' }} />
              <button type="button" role="tab" aria-selected={tab === 'now-showing'} onClick={() => setTab('now-showing')}>
                Now showing
              </button>
              <button type="button" role="tab" aria-selected={tab === 'coming-soon'} onClick={() => setTab('coming-soon')}>
                Coming soon
              </button>
            </div>

            <label className="search">
              <Icon name="search" size={17} />
              <span className="visually-hidden">Search movies</span>
              <input
                ref={searchRef}
                type="search"
                placeholder="Search"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </label>
          </div>
        </Reveal>

        {genres.length > 2 && (
          <Reveal delay={80} className="genre-bar scroll-x" role="group" aria-label="Filter by genre">
            {genres.map(g => (
              <button key={g} type="button" className="chip" aria-pressed={activeGenre === g} onClick={() => setActiveGenre(g)}>
                {g}
              </button>
            ))}
          </Reveal>
        )}

        {listLoading ? (
          <div className="movie-grid is-in">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i}>
                <div className="skeleton" style={{ aspectRatio: '2/3', borderRadius: 'var(--r-lg)' }} />
                <div className="skeleton" style={{ height: 14, width: '75%', marginTop: 14 }} />
                <div className="skeleton" style={{ height: 12, width: '45%', marginTop: 8 }} />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="state">
            <div className="state-icon"><Icon name={source.length === 0 ? 'calendar' : 'search'} size={24} /></div>
            {source.length === 0 ? (
              <>
                <h2>{tab === 'coming-soon' ? 'No upcoming releases yet' : 'No movies showing right now'}</h2>
                <p>Check back soon, the programme is updated every morning.</p>
              </>
            ) : (
              <>
                <h2>No movies match your search</h2>
                <p>Try another title or clear the genre filter.</p>
                <button type="button" className="btn btn-ghost" onClick={resetFilters}>Clear filters</button>
              </>
            )}
          </div>
        ) : (
          <MovieGrid key={tab + activeGenre}>
            {filtered.map((movie, i) => (
              <MovieCard key={movie.id} movie={movie} upcoming={tab === 'coming-soon'} index={i} />
            ))}
          </MovieGrid>
        )}
      </section>

      <Footer />
    </div>
  )
}

// ──────────────────────────────────────────────
// Movie detail wrapper (fetches by id from URL)
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
