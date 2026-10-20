import { useState } from 'react'
import { Link } from 'react-router-dom'
import Icon from './Icon'
import { POSTER_SMALL, POSTER_BASE, formatRuntime, getYear } from '../utils/format'
import './MovieCard.css'

export default function MovieCard({ movie }) {
  const [imgError, setImgError] = useState(false)

  const year = getYear(movie.releaseDate)
  const runtime = formatRuntime(movie.runtime)
  const genre = movie.categories?.[0]?.name

  return (
    <Link to={`/movies/${movie.id}`} className="mcard">
      <div className="mcard-poster">
        {movie.posterPath && !imgError ? (
          <img
            src={`${POSTER_SMALL}${movie.posterPath}`}
            srcSet={`${POSTER_SMALL}${movie.posterPath} 342w, ${POSTER_BASE}${movie.posterPath} 500w`}
            sizes="(max-width: 640px) 50vw, (max-width: 1100px) 25vw, 220px"
            alt=""
            loading="lazy"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="mcard-fallback">
            <Icon name="film" size={32} strokeWidth={1.4} />
          </div>
        )}

        {movie.voteAverage > 0 && (
          <span className="mcard-rating rating">
            <Icon name="star" size={12} />
            {movie.voteAverage.toFixed(1)}
          </span>
        )}
      </div>

      <div className="mcard-body">
        <h3 className="mcard-title">{movie.title}</h3>
        <p className="mcard-meta">
          {[year, runtime, genre].filter(Boolean).map((item, i) => (
            <span key={i}>{item}</span>
          ))}
        </p>
      </div>
    </Link>
  )
}
