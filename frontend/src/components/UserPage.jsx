// UserPage.js

import React from 'react';
import { useNavigate } from 'react-router-dom';
import './UserPage.css';
import popcornImage from '../assets/popcorn-cinema.jpg';

function UserPage() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated"); // Clear authentication state
    navigate('/login');
  };

  return (
    <div className="user-page">
      <header className="navbar">
        <div className="logo">
          🎞️ <span className="cinema-red">Cinema</span><span className="plus-white">Plus</span>
        </div>
        <nav className="nav-links">
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