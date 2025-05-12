import React from 'react';
import { useParams, useLocation } from 'react-router-dom';
import SeatGrid from './SeatGrid';

const HallDetails = () => {
  const { hallId } = useParams();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const projectionId = params.get("projectionId");

  return (
    <div>
      <h2>Select Your Seats</h2>
      <SeatGrid hallId={hallId} projectionId={projectionId} /> {/* projectionId je sada prop */}
    </div>
  );
};

export default HallDetails;