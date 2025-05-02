import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './MovieDetails.css';

const MovieDetails = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [showTrailer, setShowTrailer] = useState(false);
  const [selectedDay, setSelectedDay] = useState('today');
  const [projections, setProjections] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:8089/api/movies/${id}`)
      .then(res => res.json())
      .then(data => setMovie(data));
  }, [id]);

  const getDateForDay = (day) => {
    const today = new Date();
    const newDate = new Date(today);
    if (day === 'tomorrow') newDate.setDate(today.getDate() + 1);
    if (day === 'after') newDate.setDate(today.getDate() + 2);
    return newDate;
  };

  useEffect(() => {
    if (!movie || !movie.currentlyShowing) return;
    const date = getDateForDay(selectedDay).toISOString().split('T')[0];
    fetch(`http://localhost:8089/api/projections?movieId=${movie.id}&date=${date}`)
      .then(res => res.json())
      .then(data => setProjections(data));
  }, [selectedDay, movie]);

  const formatType = (type) => {
    if (type === 'TWO_D') return '2D';
    if (type === 'THREE_D') return '3D';
    if (type === 'FOUR_DX') return '4DX';
    return type;
  };

  if (!movie) return <p>Loading...</p>;

  return (
    <div className="movie-detail-page">
      <div className="movie-detail-container">
        <img
          src={movie.imageUrl || '/assets/posters/fallback.jpg'}
          alt={movie.title}
          className="movie-detail-img"
        />
        <div className="movie-detail-info">
          <h1>{movie.title}</h1>
          <div className="movie-meta">
            <span>{movie.genre}</span>
            <span>{movie.durationInMinutes} min</span>
            <span>{movie.releaseYear}</span>
          </div>

          <p className="movie-section-title">Synopsis</p>
          <p>{movie.description}</p>

          <p className="movie-section-title">Director</p>
          <p>{movie.director}</p>

          <p className="movie-section-title">Cast</p>
          <p>{movie.cast}</p>

          {/* Prikaži screenings samo ako je currentlyShowing */}
          {movie.currentlyShowing ? (
            <>
              <p className="movie-section-title">Screenings</p>
              <div className="screening-buttons">
                <button
                  className={selectedDay === 'today' ? 'active' : ''}
                  onClick={() => setSelectedDay('today')}
                >
                  Today
                </button>
                <button
                  className={selectedDay === 'tomorrow' ? 'active' : ''}
                  onClick={() => setSelectedDay('tomorrow')}
                >
                  Tomorrow
                </button>
                <button
                  className={selectedDay === 'after' ? 'active' : ''}
                  onClick={() => setSelectedDay('after')}
                >
                  Day After
                </button>
              </div>

              <div className="time-buttons">
                {projections.length > 0 ? (
                  projections.map((p) => (
                    <button key={p.id}>
                      {new Date(p.startTime).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })} ({formatType(p.projectionType)})
                    </button>
                  ))
                ) : (
                  <p style={{ color: '#aaa' }}>No screenings available for selected day.</p>
                )}
              </div>
            </>
          ) : (
            <p style={{ marginTop: '20px', fontStyle: 'italic', color: '#ccc' }}>
              🎬 Coming Soon – This movie is not yet in theaters.
            </p>
          )}

          <div className="action-buttons">
            <button onClick={() => setShowTrailer(!showTrailer)}>
              🎬 {showTrailer ? 'Hide Trailer' : 'Watch Trailer'}
            </button>
            {/* Book Tickets samo ako prikazujemo */}
            {movie.currentlyShowing && (
              <button>🎟️ Book Tickets</button>
            )}
          </div>

          {showTrailer && movie.trailerUrl && (
            <div style={{ marginTop: '30px' }}>
              <iframe
                width="100%"
                height="450"
                src={movie.trailerUrl}
                title="Movie Trailer"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{ borderRadius: '12px' }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;
