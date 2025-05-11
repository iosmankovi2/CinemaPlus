import React, { useEffect, useState } from 'react';
import MovieCard from '../MovieCard/MovieCard';
import './MovieSection.css';

const MovieSection = () => {
  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetch('/api/movies')
      .then((res) => res.json())
      .then((data) => setMovies(data))
      .catch((err) => console.error("Greška pri dohvatu filmova:", err));
  }, []);

  const filteredMovies = movies.filter((movie) => {
    const term = searchTerm.toLowerCase();
    console.log('CAST:', movie.movieCast); 
  
    return (
      movie.title?.toLowerCase().includes(term) ||
      movie.genre?.toLowerCase().includes(term) ||
      movie.director?.toLowerCase().includes(term) ||
      movie.movieCast?.toLowerCase().includes(term)
    );
  });
  

  const currentlyShowing = filteredMovies.filter((m) => m.currentlyShowing);
  const comingSoon = filteredMovies.filter((m) => !m.currentlyShowing);

  return (
    <>
      <div className="search-bar-container">
        <input
          type="text"
          placeholder="🔍 Search by title, genre, director or cast..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {/* Featured Movies */}
      <section className="movie-section">
        <h2 className="home-title">
          <span className="red-text">Featured</span> <span className="white-text">Movies</span>
        </h2>
        <div className="movie-list">
          {currentlyShowing.length > 0 ? (
            currentlyShowing.map((movie) => (
              <MovieCard
                key={movie.id}
                title={movie.title}
                genre={movie.genre}
                duration={movie.durationInMinutes}
                id={movie.id}
                movieCast={movie.movieCast}
                imageUrl={movie.imageUrl}
              />
            ))
          ) : (
            <p style={{ color: '#ccc', marginTop: '20px' }}>No currently showing movies match your search.</p>
          )}
        </div>
      </section>

      {/* Coming Soon */}
      <section className="movie-section">
        <h2 className="home-title">
          <span className="red-text">Coming</span> <span className="white-text">Soon</span>
        </h2>
        <div className="movie-list">
          {comingSoon.length > 0 ? (
            comingSoon.map((movie) => (
              <MovieCard
                key={movie.id}
                title={movie.title}
                genre={movie.genre}
                duration={movie.durationInMinutes}
                id={movie.id}
                movieCast={movie.movieCast}
                imageUrl={movie.imageUrl}
              />
            ))
          ) : (
            <p style={{ color: '#ccc', marginTop: '20px' }}>No upcoming movies match your search.</p>
          )}
        </div>
      </section>
    </>
  );
};

export default MovieSection;
