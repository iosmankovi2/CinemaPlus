import React from 'react';
import './Home.css';
import popcornImage from '../assets/popcorn-cinema.jpg';

const Home = () => {
  return (
    <div className="home-container">
      <div className="home-background" style={{ backgroundImage: `url(${popcornImage})` }}>
        <div className="overlay">
          <div className="home-content">
            {/* Sadržaj za početnu stranicu ovdje */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
