import React, { useState, useEffect } from 'react';
import HallCard from './HallCard';
import './HallList.css';

import D4Image from '../../assets/4D.jpg';
import D3Image from '../../assets/3D.jpg';
import ProslavaImage from '../../assets/Proslava.jpg';


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


  const getImageForHall = (name) => {
    switch (name) {
      case '4D Hall':
        return D4Image;
      case '3D Hall':
        return D3Image;
      case 'Birthday party venue':
        return ProslavaImage;

    }
  };

  if (loading) {
    return <div>Loading halls...</div>;
  }

  if (error) {
    return <div>An error occurred while loading halls: {error.message}</div>;
  }

  return (
    <div className="hall-list-container">
      <h2>Available Halls</h2>
      <div className="hall-list">
        {halls.map(hall => (
          <HallCard key={hall.id} hall={hall} image={getImageForHall(hall.name)} />
        ))}
      </div>
    </div>
  );
};

export default HallList;