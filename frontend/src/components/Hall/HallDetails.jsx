import React from 'react';
import { useParams } from 'react-router-dom';
import SeatGrid from './SeatGrid';

const HallDetails = () => {
  const { hallId } = useParams();

  return (
    <div>
      <h2>Select Seats for Hall</h2>
      <SeatGrid hallId={hallId} />
    </div>
  );
};

export default HallDetails;