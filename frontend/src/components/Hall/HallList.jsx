import React, { useState, useEffect } from 'react';
import HallCard from './HallCard';
import './HallList.css';

import D4Image from '../../assets/4D.jpg';
import D3Image from '../../assets/3D.jpg';
import ProslavaImage from '../../assets/Proslava.jpg';
import DefaultImage from '../../assets/popcorn-cinema.jpg';

const HallList = () => {
  const [halls, setHalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHalls = async () => {
      try {
        const response = await fetch('http://localhost:8089/api/halls');
        if (!response.ok) {
          throw new Error('HTTP error! status: ${response.status}');
        }
        const data = await response.json();
        setHalls(data);
        setLoading(false);
      } catch (e) {
        setError(e);
        setLoading(false);
      }
    };

    fetchHalls();
  }, []);

  // Funkcija za izbor slike prema imenu sale
  const getImageForHall = (name) => {
    switch (name) {
      case '4D Sala':
        return D4Image;
      case '3D Sala':
        return D3Image;
      case 'Rođendaonica':
        return ProslavaImage;
      default:
        return DefaultImage;
    }
  };

  if (loading) {
    return <div>Učitavanje sala...</div>;
  }

  if (error) {
    return <div>Došlo je do greške pri učitavanju sala: {error.message}</div>;
  }

  return (
    <div className="hall-list-container">
      <h2>Dostupne Sale</h2>
      <div className="hall-list">
        {halls.map(hall => (
          <HallCard key={hall.id} hall={hall} image={getImageForHall(hall.name)} />
        ))}
      </div>
    </div>
  );
};

export default HallList;