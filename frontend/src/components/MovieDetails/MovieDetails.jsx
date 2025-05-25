import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './MovieDetails.css';

const MovieDetails = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [showTrailer, setShowTrailer] = useState(false);
  const [selectedDay, setSelectedDay] = useState('today');
  const [projections, setProjections] = useState([]);
  const [selectedProjection, setSelectedProjection] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ comment: '', rating: 5 });
  const isLoggedIn = !!localStorage.getItem('token');

  useEffect(() => {
    fetch(`/api/movies/${id}`)
      .then(res => res.json())
      .then(data => setMovie(data));
  }, [id]);

  useEffect(() => {
    fetch(`/api/reviews/movie/${id}`)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error ${res.status}`);
        return res.json();
      })
      .then(data => setReviews(data))
      .catch(err => console.error('Failed to fetch reviews', err));
  }, [id]);

  useEffect(() => {
    if (!movie || !movie.currentlyShowing) return;
    const date = getDateForDay(selectedDay).toISOString().split('T')[0];
    fetch(`/api/projections/by-date?movieId=${id}&date=${date}`)
      .then(res => res.json())
      .then(data => {
        console.log("Fetched projections:", data);
        setProjections(data);
      });
  }, [selectedDay, movie]);

  const getDateForDay = (day) => {
    const today = new Date();
    const newDate = new Date(today);
    if (day === 'tomorrow') newDate.setDate(today.getDate() + 1);
    if (day === 'after') newDate.setDate(today.getDate() + 2);
    return newDate;
  };

  const handleReviewSubmit = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('You must be logged in to leave a review.');
      return;
    }

    try {
      const response = await fetch('http://localhost:8089/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          comment: newReview.comment,
          rating: newReview.rating,
          movie: { id: parseInt(id) }
        })
      });

      if (!response.ok) {
        const text = await response.text();
        alert('Failed to add review: ' + text);
        return;
      }

      const added = await response.json();
      setReviews(prev => [...prev, added]);
      setNewReview({ comment: '', rating: 5 });
    } catch (err) {
      console.error(err);
      alert('Something went wrong.');
    }
  };

  const formatType = (type) => {
    if (type === 'TWO_D') return '2D';
    if (type === 'THREE_D') return '3D';
    if (type === 'FOUR_DX') return '4DX';
    return type;
  };

  const handleBookTickets = () => {
    if (!selectedProjection) {
      alert("Please select a screening time first.");
      return;
    }
    if (!selectedProjection.hallId) {
      alert("Hall ID is missing for this projection.");
      return;
    }
    window.location.href = `/sale/${selectedProjection.hallId}?projectionId=${selectedProjection.id}`;
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
          <p>{movie.movieCast}</p>

          {movie.currentlyShowing ? (
            <>
              <p className="movie-section-title">Screenings</p>
              <div className="screening-buttons">
                {['today', 'tomorrow', 'after'].map((day) => (
                  <button
                    key={day}
                    className={selectedDay === day ? 'active' : ''}
                    onClick={() => setSelectedDay(day)}
                  >
                    {day.charAt(0).toUpperCase() + day.slice(1)}
                  </button>
                ))}
              </div>

              <div className="time-buttons">
                {projections.length > 0 ? (
                  projections.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => {
                        setSelectedProjection(p);
                        localStorage.setItem("selectedProjection", JSON.stringify(p));
                      }}
                      className={selectedProjection?.id === p.id ? 'active' : ''}
                    >
                      {new Date(p.startTime).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
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
            {movie.currentlyShowing && isLoggedIn && (
              <button onClick={handleBookTickets}>🎟️ Book Tickets</button>
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

        {movie.currentlyShowing && (
          <div className="review-section">
            <h2>📝 Reviews</h2>

            {reviews.length === 0 ? (
              <p>No reviews yet. Be the first to write one!</p>
            ) : (
              <ul className="review-list">
                {reviews.map((r) => (
                  <li key={r.id} className="review-item">
                    <p><strong>{r.userName}</strong> rated it {r.rating} ⭐</p>
                    <p>{r.comment}</p>
                    <p className="review-date">{new Date(r.createdAt).toLocaleDateString()}</p>
                  </li>
                ))}
              </ul>
            )}

            <div className="add-review-form">
              <h3>Add Your Review</h3>
              {isLoggedIn ? (
                <>
                  <textarea
                    value={newReview.comment}
                    onChange={(e) =>
                      setNewReview({ ...newReview, comment: e.target.value })
                    }
                    placeholder="Write your comment here..."
                    rows={4}
                    className="review-textarea"
                  />
                  <div className="rating-dropdown">
                    <label htmlFor="rating">Rating:</label>
                    <select
                      id="rating"
                      value={newReview.rating}
                      onChange={(e) =>
                        setNewReview({ ...newReview, rating: parseInt(e.target.value) })
                      }
                    >
                      <option disabled value="">Choose rating</option>
                      {[1, 2, 3, 4, 5].map((val) => (
                        <option key={val} value={val}>{val} ⭐</option>
                      ))}
                    </select>
                  </div>
                  <button
                    onClick={handleReviewSubmit}
                    className="submit-btn"
                    style={{ marginTop: '12px' }}
                  >
                    Submit Review
                  </button>
                </>
              ) : (
                <p style={{ fontStyle: 'italic', color: '#888' }}>
                  You must be logged in to write a review.
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieDetails;