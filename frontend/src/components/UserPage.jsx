// UserPage.js

import React from 'react';
import { useNavigate } from 'react-router-dom';
import './UserPage.css';
import popcornImage from '../assets/popcorn-cinema.jpg';
import { Link } from 'react-router-dom';


function UserPage() {
  return (
    <div className="user-page">

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