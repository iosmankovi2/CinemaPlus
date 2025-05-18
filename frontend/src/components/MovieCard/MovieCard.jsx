import React from 'react';
import './MovieCard.css';
import { Link } from 'react-router-dom';
const isLoggedIn = !!localStorage.getItem('token');

const MovieCard = ({ id, title, genre, duration, imageUrl, moviecast }) => {
  return (
    <Link to={`/movies/${id}`} className="movie-card">
      <img
        src={imageUrl || '/assets/posters/fallback.jpg'}
        alt={title}
        className="movie-poster"
      />
      <h3>{title}</h3>
      <p>{genre} • {duration} min</p>
      {isLoggedIn ? (
      <button className="book-btn">Book Tickets</button>
        ) : null}
    </Link>
  );
};

export default MovieCard;
