import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import popcornImage from '../assets/popcorn-cinema.jpg';

const Home = () => {
  return (
    <div className="home-container">
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
