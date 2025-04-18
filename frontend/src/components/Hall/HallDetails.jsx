import React from 'react';
import { useParams } from 'react-router-dom';
import SeatGrid from './SeatGrid';

const HallDetails = () => {
  const { hallId } = useParams();

  return (
    <div>
      <SeatGrid hallId={hallId} />
    </div>
  );
};

export default HallDetails;