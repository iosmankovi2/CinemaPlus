import React from 'react';
import './PaymentResult.css';
import { Link } from 'react-router-dom';
import { FaTimesCircle } from 'react-icons/fa';

const Failed = () => {
  return (
    <div className="result-container failed">
      <FaTimesCircle className="icon" />
      <h2>Payment Failed</h2>
      <p>Something went wrong. Please try again or contact support.</p>
      <Link to="/" className="back-home">Back to Home</Link>
    </div>
  );
};

export default Failed;
