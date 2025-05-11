import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import popcornImage from '../assets/popcorn-cinema.jpg';

const Home = () => {
  return (
    <div className="home-container">
      {/* Navigacija */}
      <header className="navbar">
        <Link to="/" className="logo">
          🎞️ <span><span className="cinema-red">Cinema</span><span className="plus-white">Plus</span></span>
        </Link>
        <nav className="nav-links">
          <Link to="/sale" className="nav-link">Halls</Link>
          <Link to="/movies" className="nav-link">Movies</Link>
          <Link to="/login" className="nav-link">Login</Link>
          <Link to="/register" className="nav-link">Register</Link>
        </nav>
      </header>

      {/* Pozadinska slika sa overlay-em */}
      <div className="home-background" style={{ backgroundImage: `url(${popcornImage})` }}>
        <div className="overlay">
          <div className="home-content">

          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
