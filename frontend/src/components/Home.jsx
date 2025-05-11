import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import popcornImage from '../assets/popcorn-cinema.jpg';

const Home = () => {

  const [activeTab, setActiveTab] = useState('top');
   
    const renderMovies = () => {
      const movies = {
        top: [
          { title: 'Film A', image: 'https://via.placeholder.com/200x300?text=Film+A' },
          { title: 'Film B', image: 'https://via.placeholder.com/200x300?text=Film+B' },
          { title: 'Film C', image: 'https://via.placeholder.com/200x300?text=Film+C' },
        ],
        today: [
          { title: 'Film D', image: 'https://via.placeholder.com/200x300?text=Film+D' },
          { title: 'Film E', image: 'https://via.placeholder.com/200x300?text=Film+E' },
        ],
        soon: [
          { title: 'Film F', image: 'https://via.placeholder.com/200x300?text=Film+F' },
          { title: 'Film G', image: 'https://via.placeholder.com/200x300?text=Film+G' },
        ]
      };
    
      return (
        <div className="movie-grid-container">
          <div className="movie-grid">
            {movies[activeTab].map((movie, index) => (
              <div className="movie-card" key={index}>
                <img src={movie.image} alt={movie.title} className="movie-poster" />
                <h3 className="movie-title">{movie.title}</h3>
                <button className="details-button">Detalji</button>
              </div>
            ))}
          </div>
        </div>
      );
    };
    
  return (
    <div className="home-container" style={{ backgroundImage: `url(${popcornImage})` }}>
    {/* Navigacija */}
    <header className="navbar">
      <Link to="/" className="logo">
        🎞️ <span><span className="cinema-red">Cinema</span><span className="plus-white">Plus</span></span>
      </Link>
      <nav className="nav-links">
        <Link to="/sale" className="nav-link">Sale</Link>
        <Link to="/movies" className="nav-link">Movies</Link>
        <Link to="/login" className="nav-link">Login</Link>
        <Link to="/register" className="nav-link">Register</Link>
      </nav>
    </header>
  
    {/* Overlay sadržaj preko slike */}
    <div className="overlay">
      <div className="tab-menu">
        <button onClick={() => setActiveTab('top')} className={activeTab === 'top' ? 'active' : ''}>TOP FILMOVI</button>
        <button onClick={() => setActiveTab('today')} className={activeTab === 'today' ? 'active' : ''}>DANAS U KINU</button>
        <button onClick={() => setActiveTab('soon')} className={activeTab === 'soon' ? 'active' : ''}>USKORO U KINU</button>
      </div>
  
      <div className="movie-section">
        {renderMovies()}
      </div>
    </div>
  
    {/* Footer */}
    <footer className="footer">
      <p>© CinemaPlus BH d.o.o.</p>
      <div className="footer-links">
        <Link to="/terms">Uslovi poslovanja</Link>
        <Link to="/contact">Kontaktirajte nas</Link>
        <Link to="/advertising">Oglašavanje</Link>
      </div>
    </footer>
  </div>
  
  

  );
};

export default Home;
