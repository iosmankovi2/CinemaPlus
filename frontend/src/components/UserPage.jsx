// UserPage.js

import React from 'react';
import { useNavigate } from 'react-router-dom';
import './UserPage.css';
import popcornImage from '../assets/popcorn-cinema.jpg';
import { Link } from 'react-router-dom';


function UserPage() {
  return (
    <div className="user-page">
      <header className="navbar">
           {/* Navigacija */}

        <Link to="/" className="logo">
          🎞️ <span><span className="cinema-red">Cinema</span><span className="plus-white">Plus</span></span>
        </Link>
        <nav className="nav-links">
          <Link to="/sale" className="nav-link">Sale</Link> {/* Dodan link za Sale */}
          <Link to="/movies" className="nav-link">Movies</Link>
          <Link to="/login" className="nav-link">Login</Link>
          <Link to="/register" className="nav-link">Register</Link>
        <div className="logo">

        </div>
          <button onClick={handleLogout} className="nav-link logout-btn">Logout</button>
        </nav>
      </header>

      <div className="home-background" style={{ backgroundImage: `url(${popcornImage})` }}>
        <div className="overlay">
          <div className="home-content">
            <h1 className="welcome-user">Welcome, user!</h1>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserPage;