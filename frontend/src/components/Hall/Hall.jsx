import React, { useEffect, useState } from 'react';
import './Hall.css';
import { Link } from 'react-router-dom';

import D3Image from '../../assets/3D.jpg';
import D4Image from '../../assets/4D.jpg';
import ProslavaImage from '../../assets/Proslava.jpg';
import DefaultImage from '../../assets/popcorn-cinema.jpg';

const Hall = () => {
  const [halls, setHalls] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8089/api/halls')
      .then(res => res.json())
      .then(data => setHalls(data))
      .catch(err => console.error("Error fetching halls:", err));
  }, []);

  const translateHallName = (name) => {
    switch (name.trim()) {
      case '3D Sala': return '3D Hall';
      case '4D Sala': return '4D Hall';
      case 'Rođendaonica': return 'Birthday party venue';
      default: return name;
    }
  };

  const getImageForHall = (translatedName) => {
    switch (translatedName) {
      case '3D Hall': return D3Image;
      case '4D Hall': return D4Image;
      case 'Birthday party venue': return ProslavaImage;
      default: return DefaultImage;
    }
  };

  return (
    <div className="halls-wrapper">
      <h2 className="hall-title">Cinema Halls</h2>
      <div className="halls-grid">
        {halls.map(hall => {
          const translatedName = translateHallName(hall.name);
          const image = getImageForHall(translatedName);

          return (
            <div key={hall.id} className="hall-card">
              <img
                src={image}
                alt={translatedName}
                className="hall-image"
                onError={(e) => { e.target.onerror = null; e.target.src = DefaultImage; }}
              />
              <h3>{translatedName}</h3>
              <p>Total seats: {hall.totalSeats}</p>
              <p>Available seats: {hall.availableSeats}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Hall;