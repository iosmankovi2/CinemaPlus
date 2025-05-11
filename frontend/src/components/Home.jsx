import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';


const Home = () => {
  const [featuredMovies, setFeaturedMovies] = useState([]);

  useEffect(() => {
    fetch('/api/movies')
      .then((res) => res.json())
      .then((data) => {
        const currentlyShowing = data.filter((movie) => movie.currentlyShowing);
        setFeaturedMovies(currentlyShowing.slice(0, 4));
      })
      .catch((err) => console.error('Error fetching movies:', err));
  }, []);

  return (
    <div className="home-container">
      <div className="hero-section">
        <div className="hero-overlay">
          <div className="home-content">
            <h1 className="welcome-title">Welcome to CinemaPlus!</h1>
            <p className="subtitle">Dive into cinematic adventures — from action-packed blockbusters to heartwarming tales.</p>
            <Link to="/movies" className="cta-button">Browse All Movies</Link>
          </div>
        </div>
      </div>

      <section className="featured-section">
        <h2 className="section-title">Now Showing</h2>
        <div className="featured-movies">
          {featuredMovies.map((movie) => (
            <Link to={`/movies/${movie.id}`} className="featured-card" key={movie.id}>
              <img
                src={movie.imageUrl || '/assets/posters/fallback.jpg'}
                alt={movie.title}
                className="featured-poster"
              />
              <div className="featured-info">
                <h3>{movie.title}</h3>
                <p>{movie.genre} • {movie.durationInMinutes} min</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <footer className="footer">
        <div className="footer-columns">
          <div className="footer-column">
            <h4>About Us</h4>
            <ul>
              <li>Our Story</li>
              <li>Careers</li>
              <li>News</li>
            </ul>
          </div>
          <div className="footer-column">
            <h4>Customer Support</h4>
            <ul>
              <li>Contact Us</li>
              <li>FAQs</li>
              <li>Terms & Conditions</li>
            </ul>
          </div>
          <div className="footer-column">
            <h4>Connect</h4>
            <ul>
              <li>Facebook</li>
              <li>Instagram</li>
              <li>Twitter</li>
              <li>YouTube</li>
            </ul>
          </div>
          <div className="footer-column">
            <h4>Get In Touch</h4>
            <p>Email: support@cinemaplus.ba</p>
            <p>Phone: +387 33 123 456</p>
          </div>
        </div>
        <p className="footer-bottom">&copy; 2025 CinemaPlus — All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
