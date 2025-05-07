// Hall.jsx
import React, { useEffect, useState } from 'react';
import './Hall.css';
import { useNavigate, Link } from 'react-router-dom';
import D3Image from '../../assets/3D.jpg';
import D4Image from '../../assets/4D.jpg';
import ProslavaImage from '../../assets/Proslava.jpg';
import DefaultImage from '../../assets/popcorn-cinema.jpg';

const Hall = () => {
  const [halls, setHalls] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:8089/api/halls`)
      .then(res => res.json())
      .then(data => setHalls(data));
  }, []);

  const getImageForHall = (name) => {
    switch (name) {
      case '3D Sala': return D3Image;
      case '4D Sala': return D4Image;
      case 'Rođendaonica': return ProslavaImage;
      default: return DefaultImage;
    }
  };

  return (
  
    <div className="halls-wrapper">
      <h2 className="hall-title">Sale u Kinu</h2>
      <div className="halls-grid">
        {halls.map(hall => (
          <div key={hall.id} className="hall-card">
            <img src={getImageForHall(hall.name)} alt={hall.name} className="hall-image" />
            <h3>{hall.name}</h3>
            <p>Ukupno sjedišta: {hall.totalSeats}</p>
            <p>Slobodna sjedišta: {hall.availableSeats}</p>
            <Link to={`/sale/${hall.id}`} state={{ hallName: hall.name }}>
              <button>Prikaži sjedišta</button>
            </Link>
          </div>
        ))}
      </div>
    </div>
    
  );
};

export default Hall;